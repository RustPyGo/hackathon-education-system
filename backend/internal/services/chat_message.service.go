package services

import (
	"fmt"

	"github.com/RustPyGo/hackathon-education-system/backend/internal/models"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/repositories"
)

type ChatMessageCreateRequest struct {
	ProjectID string `json:"project_id"`
	UserID    string `json:"user_id"`
	Message   string `json:"message"`
}

type ChatMessageCreateResult struct {
	UserMessage *models.ChatMessage `json:"user_message"`
	AIResponse  *models.ChatMessage `json:"ai_response"`
}

type IChatMessageService interface {
	CreateChatMessage(request *ChatMessageCreateRequest) (*ChatMessageCreateResult, error)
	GetChatMessageByID(id string) (*models.ChatMessage, error)
	GetChatMessagesByProjectID(projectID string) ([]models.ChatMessage, error)
	GetChatMessagesByProjectIDAndUserID(projectID, userID string) ([]models.ChatMessage, error)
	UpdateChatMessage(chatMessage *models.ChatMessage) error
	DeleteChatMessage(id string) error
}

type ChatMessageService struct {
	chatMessageRepo repositories.IChatMessageRepository
	documentRepo    repositories.IDocumentRepository
	aiService       IAIService
}

func NewChatMessageService(chatMessageRepo repositories.IChatMessageRepository, documentRepo repositories.IDocumentRepository) IChatMessageService {
	return &ChatMessageService{
		chatMessageRepo: chatMessageRepo,
		documentRepo:    documentRepo,
		aiService:       NewAIService(),
	}
}

func (cms *ChatMessageService) CreateChatMessage(request *ChatMessageCreateRequest) (*ChatMessageCreateResult, error) {
	// 1. Get latest 5 messages for context
	latestMessages, err := cms.chatMessageRepo.GetLatestMessagesByProjectIDAndUserID(request.ProjectID, request.UserID, 5)
	if err != nil {
		return nil, fmt.Errorf("failed to get latest messages: %w", err)
	}

	// 2. Get documents for the project
	documents, err := cms.documentRepo.GetByProjectID(request.ProjectID)
	if err != nil {
		return nil, fmt.Errorf("failed to get project documents: %w", err)
	}

	// 3. Convert documents to FileInfo format
	var files []FileInfo
	for _, doc := range documents {
		files = append(files, FileInfo{
			FileName: doc.FileName,
			FileURL:  doc.S3URL,
		})
	}

	// 4. Convert latest messages to ChatHistory format (reverse order to get chronological)
	var historyChat []ChatHistory
	for i := len(latestMessages) - 1; i >= 0; i-- {
		msg := latestMessages[i]
		historyChat = append(historyChat, ChatHistory{
			Message: msg.Message,
			Sender:  msg.Sender,
		})
	}

	// 5. Create user message
	userMessage := &models.ChatMessage{
		ProjectID: request.ProjectID,
		UserID:    request.UserID,
		Message:   request.Message,
		Sender:    "user",
	}

	// 6. Save user message to database
	if err := cms.chatMessageRepo.Create(userMessage); err != nil {
		return nil, fmt.Errorf("failed to save user message: %w", err)
	}

	// 7. Call AI API with context
	aiRequest := &AIChatRequest{
		Message:     request.Message,
		ProjectID:   request.ProjectID,
		Files:       files,
		HistoryChat: historyChat,
	}

	aiResponse, err := cms.aiService.GenerateChatResponse(aiRequest)
	if err != nil {
		return nil, fmt.Errorf("failed to generate AI response: %w", err)
	}

	// 8. Create AI response message
	aiMessage := &models.ChatMessage{
		ProjectID: request.ProjectID,
		UserID:    request.UserID,
		Message:   aiResponse.Message,
		Sender:    "bot", // Mark as AI response
	}

	// 9. Save AI response to database
	if err := cms.chatMessageRepo.Create(aiMessage); err != nil {
		return nil, fmt.Errorf("failed to save AI response: %w", err)
	}

	return &ChatMessageCreateResult{
		UserMessage: userMessage,
		AIResponse:  aiMessage,
	}, nil
}

func (cms *ChatMessageService) GetChatMessageByID(id string) (*models.ChatMessage, error) {
	return cms.chatMessageRepo.GetByID(id)
}

func (cms *ChatMessageService) GetChatMessagesByProjectID(projectID string) ([]models.ChatMessage, error) {
	return cms.chatMessageRepo.GetByProjectID(projectID)
}

func (cms *ChatMessageService) GetChatMessagesByProjectIDAndUserID(projectID, userID string) ([]models.ChatMessage, error) {
	return cms.chatMessageRepo.GetByProjectIDAndUserID(projectID, userID)
}

func (cms *ChatMessageService) UpdateChatMessage(chatMessage *models.ChatMessage) error {
	return cms.chatMessageRepo.Update(chatMessage)
}

func (cms *ChatMessageService) DeleteChatMessage(id string) error {
	return cms.chatMessageRepo.Delete(id)
}

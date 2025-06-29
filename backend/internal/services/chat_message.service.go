package services

import (
	"fmt"

	"github.com/RustPyGo/hackathon-education-system/backend/internal/models"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/repositories"
)

type ChatMessageCreateResult struct {
	UserMessage *models.ChatMessage `json:"user_message"`
	AIResponse  *models.ChatMessage `json:"ai_response"`
}

type IChatMessageService interface {
	CreateChatMessage(chatMessage *models.ChatMessage) (*ChatMessageCreateResult, error)
	GetChatMessageByID(id string) (*models.ChatMessage, error)
	GetChatMessagesByProjectID(projectID string) ([]models.ChatMessage, error)
	GetChatMessagesByProjectIDAndUserID(projectID, userID string) ([]models.ChatMessage, error)
	UpdateChatMessage(chatMessage *models.ChatMessage) error
	DeleteChatMessage(id string) error
}

type ChatMessageService struct {
	chatMessageRepo repositories.IChatMessageRepository
	aiService       IAIService
}

func NewChatMessageService(chatMessageRepo repositories.IChatMessageRepository) IChatMessageService {
	return &ChatMessageService{
		chatMessageRepo: chatMessageRepo,
		aiService:       NewAIService(),
	}
}

func (cms *ChatMessageService) CreateChatMessage(chatMessage *models.ChatMessage) (*ChatMessageCreateResult, error) {
	// 1. Save user message to database
	if err := cms.chatMessageRepo.Create(chatMessage); err != nil {
		return nil, fmt.Errorf("failed to save user message: %w", err)
	}

	// 2. Call AI API to generate response
	aiRequest := &AIChatRequest{
		Message:   chatMessage.Message,
		ProjectID: chatMessage.ProjectID,
	}

	aiResponse, err := cms.aiService.GenerateChatResponse(aiRequest)
	if err != nil {
		return nil, fmt.Errorf("failed to generate AI response: %w", err)
	}

	// 3. Create AI response message
	aiMessage := &models.ChatMessage{
		ProjectID: chatMessage.ProjectID,
		Message:   aiResponse.Message,
		Sender:    "bot", // Mark as AI response
	}

	// 4. Save AI response to database
	if err := cms.chatMessageRepo.Create(aiMessage); err != nil {
		return nil, fmt.Errorf("failed to save AI response: %w", err)
	}

	return &ChatMessageCreateResult{
		UserMessage: chatMessage,
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

package controllers

import (
	"net/http"

	"github.com/RustPyGo/hackathon-education-system/backend/internal/models"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/services"
	"github.com/RustPyGo/hackathon-education-system/backend/pkg/response"
	"github.com/gin-gonic/gin"
)

type ChatMessageController struct {
	chatMessageService services.IChatMessageService
}

func NewChatMessageController(chatMessageService services.IChatMessageService) *ChatMessageController {
	return &ChatMessageController{
		chatMessageService: chatMessageService,
	}
}

// CreateChatMessage godoc
// @Summary Create a new chat message
// @Description Create a new chat message and get AI response with context from project documents and chat history
// @Tags chat-messages
// @Accept json
// @Produce json
// @Param request body services.ChatMessageCreateRequest true "Chat message request"
// @Success 201 {object} response.Response{data=services.ChatMessageCreateResult}
// @Failure 400 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /chat-message/ [post]
func (cmc *ChatMessageController) CreateChatMessage(c *gin.Context) {
	var request services.ChatMessageCreateRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		response.ErrorResponse(c, http.StatusBadRequest, "Invalid request body: "+err.Error())
		return
	}

	// Validate required fields
	if request.ProjectID == "" {
		response.ErrorResponse(c, http.StatusBadRequest, "Project ID is required")
		return
	}

	if request.UserID == "" {
		response.ErrorResponse(c, http.StatusBadRequest, "User ID is required")
		return
	}

	if request.Message == "" {
		response.ErrorResponse(c, http.StatusBadRequest, "Message is required")
		return
	}

	// Create chat message with AI response
	result, err := cmc.chatMessageService.CreateChatMessage(&request)
	if err != nil {
		response.ErrorResponse(c, http.StatusInternalServerError, "Failed to create chat message: "+err.Error())
		return
	}

	response.SuccessResponse(c, http.StatusCreated, result)
}

// GetChatMessageByID godoc
// @Summary Get chat message by ID
// @Description Get detailed information of a chat message by its ID
// @Tags chat-messages
// @Accept json
// @Produce json
// @Param id path string true "Chat Message ID"
// @Success 200 {object} response.Response{data=models.ChatMessage}
// @Failure 404 {object} response.Response
// @Router /chat-message/{id} [get]
func (cmc *ChatMessageController) GetChatMessageByID(c *gin.Context) {
	id := c.Param("id")

	chatMessage, err := cmc.chatMessageService.GetChatMessageByID(id)
	if err != nil {
		response.ErrorResponse(c, http.StatusNotFound, "Chat message not found")
		return
	}

	response.SuccessResponse(c, http.StatusOK, chatMessage)
}

// GetChatMessagesByProjectID godoc
// @Summary Get chat messages by project ID
// @Description Get list of chat messages for a specific project
// @Tags chat-messages
// @Accept json
// @Produce json
// @Param projectId path string true "Project ID"
// @Success 200 {object} response.Response{data=[]models.ChatMessage}
// @Failure 500 {object} response.Response
// @Router /chat-message/project/{projectId} [get]
func (cmc *ChatMessageController) GetChatMessagesByProjectID(c *gin.Context) {
	projectID := c.Param("projectId")

	chatMessages, err := cmc.chatMessageService.GetChatMessagesByProjectID(projectID)
	if err != nil {
		response.ErrorResponse(c, http.StatusInternalServerError, "Failed to get chat messages")
		return
	}

	response.SuccessResponse(c, http.StatusOK, chatMessages)
}

// GetChatMessagesByProjectAndUserID godoc
// @Summary Get chat messages by project ID and user ID
// @Description Get list of chat messages for a specific project and user
// @Tags chat-messages
// @Accept json
// @Produce json
// @Param projectId path string true "Project ID"
// @Param userId path string true "User ID"
// @Success 200 {object} response.Response{data=[]models.ChatMessage}
// @Failure 500 {object} response.Response
// @Router /chat-message/project/{projectId}/user/{userId} [get]
func (cmc *ChatMessageController) GetChatMessagesByProjectAndUserID(c *gin.Context) {
	projectID := c.Param("projectId")
	userID := c.Param("userId")

	chatMessages, err := cmc.chatMessageService.GetChatMessagesByProjectIDAndUserID(projectID, userID)
	if err != nil {
		response.ErrorResponse(c, http.StatusInternalServerError, "Failed to get chat messages")
		return
	}

	response.SuccessResponse(c, http.StatusOK, chatMessages)
}

// UpdateChatMessage godoc
// @Summary Update chat message
// @Description Update chat message information
// @Tags chat-messages
// @Accept json
// @Produce json
// @Param id path string true "Chat Message ID"
// @Param message body models.ChatMessage true "Chat message information"
// @Success 200 {object} response.Response{data=models.ChatMessage}
// @Failure 400 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /chat-message/{id} [put]
func (cmc *ChatMessageController) UpdateChatMessage(c *gin.Context) {
	id := c.Param("id")

	var chatMessage models.ChatMessage
	if err := c.ShouldBindJSON(&chatMessage); err != nil {
		response.ErrorResponse(c, http.StatusBadRequest, "Invalid request body")
		return
	}

	chatMessage.ID = id
	if err := cmc.chatMessageService.UpdateChatMessage(&chatMessage); err != nil {
		response.ErrorResponse(c, http.StatusInternalServerError, "Failed to update chat message")
		return
	}

	response.SuccessResponse(c, http.StatusOK, chatMessage)
}

// DeleteChatMessage godoc
// @Summary Delete chat message
// @Description Delete a chat message by ID
// @Tags chat-messages
// @Accept json
// @Produce json
// @Param id path string true "Chat Message ID"
// @Success 200 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /chat-message/{id} [delete]
func (cmc *ChatMessageController) DeleteChatMessage(c *gin.Context) {
	id := c.Param("id")

	if err := cmc.chatMessageService.DeleteChatMessage(id); err != nil {
		response.ErrorResponse(c, http.StatusInternalServerError, "Failed to delete chat message")
		return
	}

	response.SuccessResponse(c, http.StatusOK, "Chat message deleted successfully")
}

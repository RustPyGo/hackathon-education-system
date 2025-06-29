package chat_message

import (
	"github.com/RustPyGo/hackathon-education-system/backend/internal/controllers"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/repositories"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type ChatMessageRouter struct {
}

func (cmr *ChatMessageRouter) InitChatMessageRouter(Router *gin.RouterGroup) {
	chatMessageRepo := repositories.NewChatMessageRepository()
	documentRepo := repositories.NewDocumentRepository()
	chatMessageService := services.NewChatMessageService(chatMessageRepo, documentRepo)
	chatMessageController := controllers.NewChatMessageController(chatMessageService)

	chatMessagePublicRouter := Router.Group("/chat-message")
	{
		chatMessagePublicRouter.POST("/", chatMessageController.CreateChatMessage)
		chatMessagePublicRouter.GET("/:id", chatMessageController.GetChatMessageByID)
		chatMessagePublicRouter.GET("/project/:projectId", chatMessageController.GetChatMessagesByProjectID)
		chatMessagePublicRouter.GET("/project/:projectId/user/:userId", chatMessageController.GetChatMessagesByProjectAndUserID)
		chatMessagePublicRouter.PUT("/:id", chatMessageController.UpdateChatMessage)
		chatMessagePublicRouter.DELETE("/:id", chatMessageController.DeleteChatMessage)
	}
}

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
	chatMessageService := services.NewChatMessageService(chatMessageRepo)
	chatMessageController := controllers.NewChatMessageController(chatMessageService)

	chatMessagePublicRouter := Router.Group("/chat-message")
	{
		chatMessagePublicRouter.POST("/", chatMessageController.CreateChatMessage)
		chatMessagePublicRouter.GET("/:id", chatMessageController.GetChatMessageByID)
		chatMessagePublicRouter.GET("/project/:projectId", chatMessageController.GetChatMessagesByProjectID)
		chatMessagePublicRouter.PUT("/:id", chatMessageController.UpdateChatMessage)
		chatMessagePublicRouter.DELETE("/:id", chatMessageController.DeleteChatMessage)
	}
}

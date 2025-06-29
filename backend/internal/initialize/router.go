package initialize

import (
	"net/http"

	_ "github.com/RustPyGo/hackathon-education-system/backend/docs"
	"github.com/RustPyGo/hackathon-education-system/backend/global"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/routers"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func InitRouter() *gin.Engine {
	var r *gin.Engine
	if global.Config.Server.Mode == "dev" {
		gin.SetMode(gin.DebugMode)
		gin.ForceConsoleColor()
		r = gin.Default()
	} else {
		gin.SetMode(gin.ReleaseMode)
		r = gin.New()
	}

	// Test route for Swagger
	r.GET("/swagger-test", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Swagger test route works",
		})
	})

	// Initialize all router groups
	userRouter := routers.RouterGroupApp.User
	projectRouter := routers.RouterGroupApp.Project
	questionRouter := routers.RouterGroupApp.Question
	answerRouter := routers.RouterGroupApp.Answer
	responseRouter := routers.RouterGroupApp.Response
	chatMessageRouter := routers.RouterGroupApp.ChatMessage
	documentRouter := routers.RouterGroupApp.Document

	MainGroup := r.Group("/api/v1")
	{
		MainGroup.GET("/CheckStatus", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"status":  "ok",
				"message": "Server is running",
			})
		})
	}
	{
		// Initialize all routers
		userRouter.InitUserRouter(MainGroup)
		projectRouter.InitProjectRouter(MainGroup)
		questionRouter.InitQuestionRouter(MainGroup)
		answerRouter.InitAnswerRouter(MainGroup)
		responseRouter.InitResponseRouter(MainGroup)
		chatMessageRouter.InitChatMessageRouter(MainGroup)
		documentRouter.InitDocumentRouter(MainGroup)
	}

	// Swagger documentation route
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	return r
}

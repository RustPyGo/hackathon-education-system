package question

import (
	"github.com/RustPyGo/hackathon-education-system/backend/internal/controllers"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/repositories"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type QuestionRouter struct {
}

func (qr *QuestionRouter) InitQuestionRouter(Router *gin.RouterGroup) {
	questionRepo := repositories.NewQuestionRepository()
	questionChoiceRepo := repositories.NewQuestionChoiceRepository()
	questionService := services.NewQuestionService(questionRepo, questionChoiceRepo)
	questionController := controllers.NewQuestionController(questionService)

	questionPublicRouter := Router.Group("/question")
	{
		questionPublicRouter.POST("/", questionController.CreateQuestion)
		questionPublicRouter.GET("/:id", questionController.GetQuestionByID)
		questionPublicRouter.GET("/project/:projectId", questionController.GetQuestionsByProjectID)
		questionPublicRouter.PUT("/:id", questionController.UpdateQuestion)
		questionPublicRouter.DELETE("/:id", questionController.DeleteQuestion)
	}
}

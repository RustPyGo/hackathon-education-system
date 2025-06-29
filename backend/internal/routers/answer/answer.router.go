package answer

import (
	"github.com/RustPyGo/hackathon-education-system/backend/internal/controllers"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/repositories"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type AnswerRouter struct {
}

func (ar *AnswerRouter) InitAnswerRouter(Router *gin.RouterGroup) {
	answerRepo := repositories.NewAnswerRepository()
	answerService := services.NewAnswerService(answerRepo)
	answerController := controllers.NewAnswerController(answerService)

	answerPublicRouter := Router.Group("/answer")
	{
		answerPublicRouter.POST("/", answerController.CreateAnswer)
		answerPublicRouter.GET("/:id", answerController.GetAnswerByID)
		answerPublicRouter.GET("/question/:questionId", answerController.GetAnswersByQuestionID)
		answerPublicRouter.PUT("/:id", answerController.UpdateAnswer)
		answerPublicRouter.DELETE("/:id", answerController.DeleteAnswer)
	}
}

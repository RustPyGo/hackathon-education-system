package response

import (
	"github.com/RustPyGo/hackathon-education-system/backend/internal/controllers"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/repositories"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type ResponseRouter struct {
}

func (rr *ResponseRouter) InitResponseRouter(Router *gin.RouterGroup) {
	responseRepo := repositories.NewResponseRepository()
	answerRepo := repositories.NewAnswerRepository()
	responseService := services.NewResponseService(responseRepo, answerRepo)
	responseController := controllers.NewResponseController(responseService)

	responsePublicRouter := Router.Group("/response")
	{
		responsePublicRouter.POST("/submit", responseController.SubmitExam)
		responsePublicRouter.GET("/", responseController.GetAllResponses)
		responsePublicRouter.GET("/:id", responseController.GetResponseByID)
		responsePublicRouter.GET("/project/:projectId", responseController.GetResponsesByProjectID)
		responsePublicRouter.GET("/user/:userId", responseController.GetResponsesByUserID)
		responsePublicRouter.GET("/sorted/score", responseController.GetAllResponsesSortedByScore)
		responsePublicRouter.GET("/project/:projectId/sorted/score", responseController.GetResponsesByProjectIDSortedByScore)
		responsePublicRouter.GET("/user/:userId/sorted/score", responseController.GetResponsesByUserIDSortedByScore)
		responsePublicRouter.PUT("/:id", responseController.UpdateResponse)
		responsePublicRouter.DELETE("/:id", responseController.DeleteResponse)
	}
}

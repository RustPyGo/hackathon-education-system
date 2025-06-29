package project

import (
	"github.com/RustPyGo/hackathon-education-system/backend/internal/controllers"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/repositories"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type ProjectRouter struct {
}

func (pr *ProjectRouter) InitProjectRouter(Router *gin.RouterGroup) {
	projectRepo := repositories.NewProjectRepository()
	documentRepo := repositories.NewDocumentRepository()
	questionRepo := repositories.NewQuestionRepository()
	questionChoiceRepo := repositories.NewQuestionChoiceRepository()
	answerRepo := repositories.NewAnswerRepository()
	projectService := services.NewProjectService(projectRepo, documentRepo, questionRepo, questionChoiceRepo, answerRepo)
	projectController := controllers.NewProjectController(projectService)

	projectPublicRouter := Router.Group("/project")
	{
		projectPublicRouter.POST("/", projectController.CreateProject)
		projectPublicRouter.GET("/", projectController.GetAllProjects)
		projectPublicRouter.GET("/:id", projectController.GetProjectByID)
		projectPublicRouter.GET("/account/:accountId", projectController.GetProjectsByAccountID)
		projectPublicRouter.PUT("/:id", projectController.UpdateProject)
		projectPublicRouter.DELETE("/:id", projectController.DeleteProject)
	}
}

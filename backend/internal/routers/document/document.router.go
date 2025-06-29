package document

import (
	"github.com/RustPyGo/hackathon-education-system/backend/internal/controllers"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/repositories"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type DocumentRouter struct {
}

func (dr *DocumentRouter) InitDocumentRouter(Router *gin.RouterGroup) {
	documentRepo := repositories.NewDocumentRepository()
	documentService := services.NewDocumentService(documentRepo)
	documentController := controllers.NewDocumentController(documentService)

	documentPublicRouter := Router.Group("/document")
	{
		documentPublicRouter.POST("/upload", documentController.UploadDocument)
		documentPublicRouter.GET("/:id", documentController.GetDocumentByID)
		documentPublicRouter.GET("/", documentController.GetAllDocuments)
		documentPublicRouter.GET("/project/:projectId", documentController.GetDocumentsByProjectID)
		documentPublicRouter.PUT("/:id", documentController.UpdateDocument)
		documentPublicRouter.DELETE("/:id", documentController.DeleteDocument)
	}
}

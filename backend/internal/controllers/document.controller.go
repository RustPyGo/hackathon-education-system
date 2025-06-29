package controllers

import (
	"net/http"

	"github.com/RustPyGo/hackathon-education-system/backend/internal/models"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/services"
	"github.com/RustPyGo/hackathon-education-system/backend/pkg/response"
	"github.com/gin-gonic/gin"
)

type DocumentController struct {
	documentService services.IDocumentService
}

func NewDocumentController(documentService services.IDocumentService) *DocumentController {
	return &DocumentController{
		documentService: documentService,
	}
}

// UploadDocument godoc
// @Summary Upload document
// @Description Upload a document file
// @Tags documents
// @Accept multipart/form-data
// @Produce json
// @Param file formData file true "Document file to upload"
// @Success 201 {object} response.Response{data=models.Document}
// @Failure 400 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /document/upload [post]
func (dc *DocumentController) UploadDocument(c *gin.Context) {
	// ... existing code ...
}

// GetDocumentByID godoc
// @Summary Get document by ID
// @Description Get detailed information of a document by its ID
// @Tags documents
// @Accept json
// @Produce json
// @Param id path string true "Document ID"
// @Success 200 {object} response.Response{data=models.Document}
// @Failure 404 {object} response.Response
// @Router /document/{id} [get]
func (dc *DocumentController) GetDocumentByID(c *gin.Context) {
	id := c.Param("id")

	document, err := dc.documentService.GetDocumentByID(id)
	if err != nil {
		response.ErrorResponse(c, http.StatusNotFound, "Document not found")
		return
	}

	response.SuccessResponse(c, http.StatusOK, document)
}

// GetAllDocuments godoc
// @Summary Get all documents
// @Description Get list of all documents
// @Tags documents
// @Accept json
// @Produce json
// @Success 200 {object} response.Response{data=[]models.Document}
// @Failure 500 {object} response.Response
// @Router /document/ [get]
func (dc *DocumentController) GetAllDocuments(c *gin.Context) {
	// ... existing code ...
}

// GetDocumentsByProjectID godoc
// @Summary Get documents by project ID
// @Description Get list of documents for a specific project
// @Tags documents
// @Accept json
// @Produce json
// @Param projectId path string true "Project ID"
// @Success 200 {object} response.Response{data=[]models.Document}
// @Failure 500 {object} response.Response
// @Router /document/project/{projectId} [get]
func (dc *DocumentController) GetDocumentsByProjectID(c *gin.Context) {
	projectID := c.Param("projectId")

	documents, err := dc.documentService.GetDocumentsByProjectID(projectID)
	if err != nil {
		response.ErrorResponse(c, http.StatusInternalServerError, "Failed to get documents")
		return
	}

	response.SuccessResponse(c, http.StatusOK, documents)
}

// UpdateDocument godoc
// @Summary Update document
// @Description Update document information
// @Tags documents
// @Accept json
// @Produce json
// @Param id path string true "Document ID"
// @Param document body models.Document true "Document information"
// @Success 200 {object} response.Response{data=models.Document}
// @Failure 400 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /document/{id} [put]
func (dc *DocumentController) UpdateDocument(c *gin.Context) {
	id := c.Param("id")

	var document models.Document
	if err := c.ShouldBindJSON(&document); err != nil {
		response.ErrorResponse(c, http.StatusBadRequest, "Invalid request body")
		return
	}

	document.ID = id
	if err := dc.documentService.UpdateDocument(&document); err != nil {
		response.ErrorResponse(c, http.StatusInternalServerError, "Failed to update document")
		return
	}

	response.SuccessResponse(c, http.StatusOK, document)
}

// DeleteDocument godoc
// @Summary Delete document
// @Description Delete a document by ID
// @Tags documents
// @Accept json
// @Produce json
// @Param id path string true "Document ID"
// @Success 200 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /document/{id} [delete]
func (dc *DocumentController) DeleteDocument(c *gin.Context) {
	id := c.Param("id")

	if err := dc.documentService.DeleteDocument(id); err != nil {
		response.ErrorResponse(c, http.StatusInternalServerError, "Failed to delete document")
		return
	}

	response.SuccessResponse(c, http.StatusOK, "Document deleted successfully")
}

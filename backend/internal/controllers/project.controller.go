package controllers

import (
	"net/http"
	"strconv"

	"github.com/RustPyGo/hackathon-education-system/backend/internal/models"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/services"
	"github.com/RustPyGo/hackathon-education-system/backend/pkg/response"
	"github.com/gin-gonic/gin"
)

type ProjectController struct {
	projectService services.IProjectService
}

func NewProjectController(projectService services.IProjectService) *ProjectController {
	return &ProjectController{
		projectService: projectService,
	}
}

func (pc *ProjectController) CreateProject(c *gin.Context) {
	// Get the PDF file from form data
	pdfFile, err := c.FormFile("pdf")
	if err != nil {
		response.ErrorResponse(c, http.StatusBadRequest, "PDF file is required")
		return
	}

	// Validate file type
	if pdfFile.Header.Get("Content-Type") != "application/pdf" {
		response.ErrorResponse(c, http.StatusBadRequest, "Only PDF files are allowed")
		return
	}

	// Get other form data
	accountID := c.PostForm("account_id")
	if accountID == "" {
		response.ErrorResponse(c, http.StatusBadRequest, "Account ID is required")
		return
	}

	examDurationStr := c.PostForm("exam_duration")
	if examDurationStr == "" {
		response.ErrorResponse(c, http.StatusBadRequest, "Exam duration is required")
		return
	}

	examDuration, err := strconv.Atoi(examDurationStr)
	if err != nil {
		response.ErrorResponse(c, http.StatusBadRequest, "Exam duration must be a valid number")
		return
	}

	// Create project object
	project := &models.Project{
		AccountID:    accountID,
		ExamDuration: examDuration,
	}

	// Create project with PDF processing
	extractedText, err := pc.projectService.CreateProject(project, pdfFile)
	if err != nil {
		response.ErrorResponse(c, http.StatusInternalServerError, "Failed to create project: "+err.Error())
		return
	}

	// Return project info and extracted text
	response.SuccessResponse(c, http.StatusCreated, gin.H{
		"project":        project,
		"extracted_text": extractedText,
	})
}

func (pc *ProjectController) GetProjectByID(c *gin.Context) {
	id := c.Param("id")

	project, err := pc.projectService.GetProjectByID(id)
	if err != nil {
		response.ErrorResponse(c, http.StatusNotFound, "Project not found")
		return
	}

	response.SuccessResponse(c, http.StatusOK, project)
}

func (pc *ProjectController) GetAllProjects(c *gin.Context) {
	projects, err := pc.projectService.GetAllProjects()
	if err != nil {
		response.ErrorResponse(c, http.StatusInternalServerError, "Failed to get projects")
		return
	}

	response.SuccessResponse(c, http.StatusOK, projects)
}

func (pc *ProjectController) GetProjectsByAccountID(c *gin.Context) {
	accountID := c.Param("accountId")

	projects, err := pc.projectService.GetProjectsByAccountID(accountID)
	if err != nil {
		response.ErrorResponse(c, http.StatusInternalServerError, "Failed to get projects")
		return
	}

	response.SuccessResponse(c, http.StatusOK, projects)
}

func (pc *ProjectController) UpdateProject(c *gin.Context) {
	id := c.Param("id")

	var project models.Project
	if err := c.ShouldBindJSON(&project); err != nil {
		response.ErrorResponse(c, http.StatusBadRequest, "Invalid request body")
		return
	}

	project.ID = id
	if err := pc.projectService.UpdateProject(&project); err != nil {
		response.ErrorResponse(c, http.StatusInternalServerError, "Failed to update project")
		return
	}

	response.SuccessResponse(c, http.StatusOK, project)
}

func (pc *ProjectController) DeleteProject(c *gin.Context) {
	id := c.Param("id")

	if err := pc.projectService.DeleteProject(id); err != nil {
		response.ErrorResponse(c, http.StatusInternalServerError, "Failed to delete project")
		return
	}

	response.SuccessResponse(c, http.StatusOK, "Project deleted successfully")
}

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
	// Get form data
	userID := c.PostForm("user_id")
	if userID == "" {
		response.ErrorResponse(c, http.StatusBadRequest, "User ID is required")
		return
	}

	examDurationStr := c.PostForm("exam_duration")
	if examDurationStr == "" {
		response.ErrorResponse(c, http.StatusBadRequest, "Exam duration is required")
		return
	}

	name := c.PostForm("name")
	if name == "" {
		response.ErrorResponse(c, http.StatusBadRequest, "Name is required")
		return
	}

	totalQuestionsStr := c.PostForm("total_questions")
	if totalQuestionsStr == "" {
		response.ErrorResponse(c, http.StatusBadRequest, "Total questions is required")
		return
	}

	examDuration, err := strconv.Atoi(examDurationStr)
	if err != nil {
		response.ErrorResponse(c, http.StatusBadRequest, "Exam duration must be a valid number")
		return
	}

	totalQuestions, err := strconv.Atoi(totalQuestionsStr)
	if err != nil {
		response.ErrorResponse(c, http.StatusBadRequest, "Total questions must be a valid number")
		return
	}

	// Create project object
	project := &models.Project{
		UserID:       userID,
		ExamDuration: examDuration,
		Name:         name,
	}

	// Check if single file or multiple files
	form, err := c.MultipartForm()
	if err != nil {
		response.ErrorResponse(c, http.StatusBadRequest, "Failed to parse form data")
		return
	}

	files := form.File["pdf"]
	if len(files) == 0 {
		response.ErrorResponse(c, http.StatusBadRequest, "At least one PDF file is required")
		return
	}

	// Validate all files are PDFs
	for _, file := range files {
		if file.Header.Get("Content-Type") != "application/pdf" {
			response.ErrorResponse(c, http.StatusBadRequest, "Only PDF files are allowed")
			return
		}
	}

	var result *services.ProjectCreateResult

	if len(files) == 1 {
		// Single file upload
		result, err = pc.projectService.CreateProject(project, files[0], totalQuestions)
		if err != nil {
			response.ErrorResponse(c, http.StatusInternalServerError, "Failed to create project: "+err.Error())
			return
		}
	} else {
		// Multiple files upload
		result, err = pc.projectService.CreateProjectWithMultiplePDFs(project, files, totalQuestions)
		if err != nil {
			response.ErrorResponse(c, http.StatusInternalServerError, "Failed to create project: "+err.Error())
			return
		}
	}

	// Return project info, file URLs, questions, and summary
	response.SuccessResponse(c, http.StatusCreated, result)
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

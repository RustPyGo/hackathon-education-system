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

// CreateProject godoc
// @Summary Create a new project with PDF upload and AI processing
// @Description Create a new project by uploading PDF file(s), processing with AI to generate questions and summary
// @Tags projects
// @Accept multipart/form-data
// @Produce json
// @Param pdf formData file true "PDF file(s) to upload"
// @Param user_id formData string true "User ID"
// @Param exam_duration formData integer true "Exam duration in minutes"
// @Param name formData string true "Project name"
// @Param total_questions formData integer true "Number of questions to generate"
// @Success 201 {object} response.Response{data=services.ProjectCreateResult}
// @Failure 400 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /project/ [post]
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

// GetProjectByID godoc
// @Summary Get project by ID
// @Description Get detailed information of a project by its ID
// @Tags projects
// @Accept json
// @Produce json
// @Param id path string true "Project ID"
// @Success 200 {object} response.Response{data=models.Project}
// @Failure 404 {object} response.Response
// @Router /project/{id} [get]
func (pc *ProjectController) GetProjectByID(c *gin.Context) {
	id := c.Param("id")

	project, err := pc.projectService.GetProjectByID(id)
	if err != nil {
		response.ErrorResponse(c, http.StatusNotFound, "Project not found")
		return
	}

	response.SuccessResponse(c, http.StatusOK, project)
}

// GetAllProjects godoc
// @Summary Get all projects
// @Description Get list of all projects
// @Tags projects
// @Accept json
// @Produce json
// @Success 200 {object} response.Response{data=[]models.Project}
// @Failure 500 {object} response.Response
// @Router /project/ [get]
func (pc *ProjectController) GetAllProjects(c *gin.Context) {
	projects, err := pc.projectService.GetAllProjects()
	if err != nil {
		response.ErrorResponse(c, http.StatusInternalServerError, "Failed to get projects")
		return
	}

	response.SuccessResponse(c, http.StatusOK, projects)
}

// GetProjectsByAccountID godoc
// @Summary Get projects by account ID
// @Description Get list of projects for a specific account
// @Tags projects
// @Accept json
// @Produce json
// @Param accountId path string true "Account ID"
// @Success 200 {object} response.Response{data=[]models.Project}
// @Failure 500 {object} response.Response
// @Router /project/account/{accountId} [get]
func (pc *ProjectController) GetProjectsByAccountID(c *gin.Context) {
	accountID := c.Param("accountId")

	projects, err := pc.projectService.GetProjectsByAccountID(accountID)
	if err != nil {
		response.ErrorResponse(c, http.StatusInternalServerError, "Failed to get projects")
		return
	}

	response.SuccessResponse(c, http.StatusOK, projects)
}

// UpdateProject godoc
// @Summary Update project
// @Description Update project information
// @Tags projects
// @Accept json
// @Produce json
// @Param id path string true "Project ID"
// @Param project body models.Project true "Project information"
// @Success 200 {object} response.Response{data=models.Project}
// @Failure 400 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /project/{id} [put]
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

// DeleteProject godoc
// @Summary Delete project
// @Description Delete a project by ID
// @Tags projects
// @Accept json
// @Produce json
// @Param id path string true "Project ID"
// @Success 200 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /project/{id} [delete]
func (pc *ProjectController) DeleteProject(c *gin.Context) {
	id := c.Param("id")

	if err := pc.projectService.DeleteProject(id); err != nil {
		response.ErrorResponse(c, http.StatusInternalServerError, "Failed to delete project")
		return
	}

	response.SuccessResponse(c, http.StatusOK, "Project deleted successfully")
}

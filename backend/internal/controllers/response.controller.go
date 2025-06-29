package controllers

import (
	"net/http"

	"github.com/RustPyGo/hackathon-education-system/backend/internal/services"
	"github.com/RustPyGo/hackathon-education-system/backend/pkg/response"
	"github.com/gin-gonic/gin"
)

type ResponseController struct {
	responseService services.IResponseService
}

func NewResponseController(responseService services.IResponseService) *ResponseController {
	return &ResponseController{
		responseService: responseService,
	}
}

// SubmitExam godoc
// @Summary Submit exam
// @Description Submit an exam with answers and get results
// @Tags responses
// @Accept json
// @Produce json
// @Param request body services.SubmitExamRequest true "Exam submission request"
// @Success 201 {object} response.Response{data=models.Response}
// @Failure 400 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /response/submit [post]
func (rc *ResponseController) SubmitExam(c *gin.Context) {
	var request services.SubmitExamRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		response.ErrorResponse(c, http.StatusBadRequest, "Invalid request body: "+err.Error())
		return
	}

	// Validate required fields
	if request.ProjectID == "" {
		response.ErrorResponse(c, http.StatusBadRequest, "Project ID is required")
		return
	}

	if request.UserID == "" {
		response.ErrorResponse(c, http.StatusBadRequest, "User ID is required")
		return
	}

	if request.Score < 0 {
		response.ErrorResponse(c, http.StatusBadRequest, "Score must be non-negative")
		return
	}

	if request.TimeTaken < 0 {
		response.ErrorResponse(c, http.StatusBadRequest, "Time taken must be non-negative")
		return
	}

	if len(request.Answers) == 0 {
		response.ErrorResponse(c, http.StatusBadRequest, "At least one answer is required")
		return
	}

	// Submit exam
	result, err := rc.responseService.SubmitExam(&request)
	if err != nil {
		response.ErrorResponse(c, http.StatusInternalServerError, "Failed to submit exam: "+err.Error())
		return
	}

	response.SuccessResponse(c, http.StatusCreated, result)
}

// GetResponseByID godoc
// @Summary Get response by ID
// @Description Get detailed information of a response by its ID, including answers
// @Tags responses
// @Accept json
// @Produce json
// @Param id path string true "Response ID"
// @Success 200 {object} response.Response{data=models.Response}
// @Failure 400 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /response/{id} [get]
func (rc *ResponseController) GetResponseByID(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		response.ErrorResponse(c, http.StatusBadRequest, "Response ID is required")
		return
	}

	result, err := rc.responseService.GetResponseByID(id)
	if err != nil {
		response.ErrorResponse(c, http.StatusNotFound, "Response not found: "+err.Error())
		return
	}

	response.SuccessResponse(c, http.StatusOK, result)
}

// GetAllResponses godoc
// @Summary Get all responses
// @Description Get list of all responses
// @Tags responses
// @Accept json
// @Produce json
// @Success 200 {object} response.Response{data=[]models.Response}
// @Failure 500 {object} response.Response
// @Router /response/ [get]
func (rc *ResponseController) GetAllResponses(c *gin.Context) {
	responses, err := rc.responseService.GetAllResponses()
	if err != nil {
		response.ErrorResponse(c, http.StatusInternalServerError, "Failed to get responses: "+err.Error())
		return
	}

	response.SuccessResponse(c, http.StatusOK, responses)
}

// GetResponsesByProjectID godoc
// @Summary Get responses by project ID
// @Description Get list of responses for a specific project
// @Tags responses
// @Accept json
// @Produce json
// @Param projectId path string true "Project ID"
// @Success 200 {object} response.Response{data=[]models.Response}
// @Failure 400 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /response/project/{projectId} [get]
func (rc *ResponseController) GetResponsesByProjectID(c *gin.Context) {
	projectID := c.Param("projectId")
	if projectID == "" {
		response.ErrorResponse(c, http.StatusBadRequest, "Project ID is required")
		return
	}

	responses, err := rc.responseService.GetResponsesByProjectID(projectID)
	if err != nil {
		response.ErrorResponse(c, http.StatusInternalServerError, "Failed to get responses: "+err.Error())
		return
	}

	response.SuccessResponse(c, http.StatusOK, responses)
}

// GetResponsesByUserID godoc
// @Summary Get responses by user ID
// @Description Get list of responses for a specific user
// @Tags responses
// @Accept json
// @Produce json
// @Param userId path string true "User ID"
// @Success 200 {object} response.Response{data=[]models.Response}
// @Failure 400 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /response/user/{userId} [get]
func (rc *ResponseController) GetResponsesByUserID(c *gin.Context) {
	userID := c.Param("userId")
	if userID == "" {
		response.ErrorResponse(c, http.StatusBadRequest, "User ID is required")
		return
	}

	responses, err := rc.responseService.GetResponsesByUserID(userID)
	if err != nil {
		response.ErrorResponse(c, http.StatusInternalServerError, "Failed to get responses: "+err.Error())
		return
	}

	response.SuccessResponse(c, http.StatusOK, responses)
}

// UpdateResponse godoc
// @Summary Update response
// @Description Update response information
// @Tags responses
// @Accept json
// @Produce json
// @Param id path string true "Response ID"
// @Param request body services.SubmitExamRequest true "Response update request"
// @Success 200 {object} response.Response{data=models.Response}
// @Failure 400 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /response/{id} [put]
func (rc *ResponseController) UpdateResponse(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		response.ErrorResponse(c, http.StatusBadRequest, "Response ID is required")
		return
	}

	var request services.SubmitExamRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		response.ErrorResponse(c, http.StatusBadRequest, "Invalid request body: "+err.Error())
		return
	}

	// Get existing response
	existingResponse, err := rc.responseService.GetResponseByID(id)
	if err != nil {
		response.ErrorResponse(c, http.StatusNotFound, "Response not found")
		return
	}

	// Update fields
	existingResponse.ProjectID = request.ProjectID
	existingResponse.UserID = request.UserID
	existingResponse.Score = request.Score
	existingResponse.TimeTaken = request.TimeTaken

	if err := rc.responseService.UpdateResponse(existingResponse); err != nil {
		response.ErrorResponse(c, http.StatusInternalServerError, "Failed to update response: "+err.Error())
		return
	}

	response.SuccessResponse(c, http.StatusOK, existingResponse)
}

// DeleteResponse godoc
// @Summary Delete response
// @Description Delete a response by ID
// @Tags responses
// @Accept json
// @Produce json
// @Param id path string true "Response ID"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /response/{id} [delete]
func (rc *ResponseController) DeleteResponse(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		response.ErrorResponse(c, http.StatusBadRequest, "Response ID is required")
		return
	}

	if err := rc.responseService.DeleteResponse(id); err != nil {
		response.ErrorResponse(c, http.StatusInternalServerError, "Failed to delete response: "+err.Error())
		return
	}

	response.SuccessResponse(c, http.StatusOK, "Response deleted successfully")
}

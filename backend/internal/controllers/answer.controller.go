package controllers

import (
	"net/http"

	"github.com/RustPyGo/hackathon-education-system/backend/internal/models"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/services"
	"github.com/RustPyGo/hackathon-education-system/backend/pkg/response"
	"github.com/gin-gonic/gin"
)

type AnswerController struct {
	answerService services.IAnswerService
}

func NewAnswerController(answerService services.IAnswerService) *AnswerController {
	return &AnswerController{
		answerService: answerService,
	}
}

// CreateAnswer godoc
// @Summary Create a new answer
// @Description Create a new answer for a question
// @Tags answers
// @Accept json
// @Produce json
// @Param answer body models.Answer true "Answer information"
// @Success 201 {object} response.Response{data=models.Answer}
// @Failure 400 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /answer/ [post]
func (ac *AnswerController) CreateAnswer(c *gin.Context) {
	var answer models.Answer
	if err := c.ShouldBindJSON(&answer); err != nil {
		response.ErrorResponse(c, http.StatusBadRequest, "Invalid request body")
		return
	}

	if err := ac.answerService.CreateAnswer(&answer); err != nil {
		response.ErrorResponse(c, http.StatusInternalServerError, "Failed to create answer")
		return
	}

	response.SuccessResponse(c, http.StatusCreated, answer)
}

// GetAnswerByID godoc
// @Summary Get answer by ID
// @Description Get detailed information of an answer by its ID
// @Tags answers
// @Accept json
// @Produce json
// @Param id path string true "Answer ID"
// @Success 200 {object} response.Response{data=models.Answer}
// @Failure 404 {object} response.Response
// @Router /answer/{id} [get]
func (ac *AnswerController) GetAnswerByID(c *gin.Context) {
	id := c.Param("id")

	answer, err := ac.answerService.GetAnswerByID(id)
	if err != nil {
		response.ErrorResponse(c, http.StatusNotFound, "Answer not found")
		return
	}

	response.SuccessResponse(c, http.StatusOK, answer)
}

// GetAnswersByQuestionID godoc
// @Summary Get answers by question ID
// @Description Get list of answers for a specific question
// @Tags answers
// @Accept json
// @Produce json
// @Param questionId path string true "Question ID"
// @Success 200 {object} response.Response{data=[]models.Answer}
// @Failure 500 {object} response.Response
// @Router /answer/question/{questionId} [get]
func (ac *AnswerController) GetAnswersByQuestionID(c *gin.Context) {
	questionID := c.Param("questionId")

	answers, err := ac.answerService.GetAnswersByQuestionID(questionID)
	if err != nil {
		response.ErrorResponse(c, http.StatusInternalServerError, "Failed to get answers")
		return
	}

	response.SuccessResponse(c, http.StatusOK, answers)
}

// UpdateAnswer godoc
// @Summary Update answer
// @Description Update answer information
// @Tags answers
// @Accept json
// @Produce json
// @Param id path string true "Answer ID"
// @Param answer body models.Answer true "Answer information"
// @Success 200 {object} response.Response{data=models.Answer}
// @Failure 400 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /answer/{id} [put]
func (ac *AnswerController) UpdateAnswer(c *gin.Context) {
	id := c.Param("id")

	var answer models.Answer
	if err := c.ShouldBindJSON(&answer); err != nil {
		response.ErrorResponse(c, http.StatusBadRequest, "Invalid request body")
		return
	}

	answer.ID = id
	if err := ac.answerService.UpdateAnswer(&answer); err != nil {
		response.ErrorResponse(c, http.StatusInternalServerError, "Failed to update answer")
		return
	}

	response.SuccessResponse(c, http.StatusOK, answer)
}

// DeleteAnswer godoc
// @Summary Delete answer
// @Description Delete an answer by ID
// @Tags answers
// @Accept json
// @Produce json
// @Param id path string true "Answer ID"
// @Success 200 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /answer/{id} [delete]
func (ac *AnswerController) DeleteAnswer(c *gin.Context) {
	id := c.Param("id")

	if err := ac.answerService.DeleteAnswer(id); err != nil {
		response.ErrorResponse(c, http.StatusInternalServerError, "Failed to delete answer")
		return
	}

	response.SuccessResponse(c, http.StatusOK, "Answer deleted successfully")
}

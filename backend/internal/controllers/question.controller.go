package controllers

import (
	"net/http"

	"github.com/RustPyGo/hackathon-education-system/backend/internal/models"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/services"
	"github.com/RustPyGo/hackathon-education-system/backend/pkg/response"
	"github.com/gin-gonic/gin"
)

type CreateQuestionRequest struct {
	ProjectID string                        `json:"project_id"`
	Questions []services.CreateQuestionData `json:"questions"`
}

type CreateQuestionData struct {
	Question    string                     `json:"question"`
	Type        string                     `json:"type"`
	Difficulty  string                     `json:"difficulty"`
	Explanation string                     `json:"explanation"`
	Choices     []CreateQuestionChoiceData `json:"choices"`
}

type CreateQuestionChoiceData struct {
	Content     string `json:"content"`
	IsCorrect   bool   `json:"is_correct"`
	Explanation string `json:"explanation"`
}

type QuestionController struct {
	questionService services.IQuestionService
}

func NewQuestionController(questionService services.IQuestionService) *QuestionController {
	return &QuestionController{
		questionService: questionService,
	}
}

// CreateQuestion godoc
// @Summary Create multiple questions with choices
// @Description Create multiple questions for a project, including choices for multiple choice questions
// @Tags questions
// @Accept json
// @Produce json
// @Param request body CreateQuestionRequest true "Question creation request"
// @Success 201 {object} response.Response{data=[]models.Question}
// @Failure 400 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /question/ [post]
func (qc *QuestionController) CreateQuestion(c *gin.Context) {
	var request CreateQuestionRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		response.ErrorResponse(c, http.StatusBadRequest, "Invalid request body: "+err.Error())
		return
	}

	// Validate required fields
	if request.ProjectID == "" {
		response.ErrorResponse(c, http.StatusBadRequest, "Project ID is required")
		return
	}

	if len(request.Questions) == 0 {
		response.ErrorResponse(c, http.StatusBadRequest, "At least one question is required")
		return
	}

	// Validate each question
	for i, questionData := range request.Questions {
		if questionData.Question == "" {
			response.ErrorResponse(c, http.StatusBadRequest, "Question content is required for question "+string(rune(i+1)))
			return
		}

		if questionData.Type == "" {
			response.ErrorResponse(c, http.StatusBadRequest, "Type is required for question "+string(rune(i+1)))
			return
		}

		if questionData.Difficulty == "" {
			response.ErrorResponse(c, http.StatusBadRequest, "Difficulty is required for question "+string(rune(i+1)))
			return
		}

		// Validate type values
		validTypes := map[string]bool{
			"multiple_choice": true,
			"true_false":      true,
			"essay":           true,
		}
		if !validTypes[questionData.Type] {
			response.ErrorResponse(c, http.StatusBadRequest, "Type must be one of: multiple_choice, true_false, essay for question "+string(rune(i+1)))
			return
		}

		// Validate difficulty values
		validDifficulties := map[string]bool{
			"easy":   true,
			"medium": true,
			"hard":   true,
		}
		if !validDifficulties[questionData.Difficulty] {
			response.ErrorResponse(c, http.StatusBadRequest, "Difficulty must be one of: easy, medium, hard for question "+string(rune(i+1)))
			return
		}

		// Validate choices for multiple_choice questions
		if questionData.Type == "multiple_choice" {
			if len(questionData.Choices) == 0 {
				response.ErrorResponse(c, http.StatusBadRequest, "Choices are required for multiple_choice questions")
				return
			}

			// Check if at least one choice is correct
			hasCorrectChoice := false
			for _, choice := range questionData.Choices {
				if choice.IsCorrect {
					hasCorrectChoice = true
					break
				}
			}
			if !hasCorrectChoice {
				response.ErrorResponse(c, http.StatusBadRequest, "At least one choice must be correct for question "+string(rune(i+1)))
				return
			}
		}
	}

	// Create questions with choices
	createdQuestions, err := qc.questionService.CreateQuestionsWithChoices(request.ProjectID, request.Questions)
	if err != nil {
		response.ErrorResponse(c, http.StatusInternalServerError, "Failed to create questions: "+err.Error())
		return
	}

	response.SuccessResponse(c, http.StatusCreated, createdQuestions)
}

// GetQuestionByID godoc
// @Summary Get question by ID
// @Description Get detailed information of a question by its ID
// @Tags questions
// @Accept json
// @Produce json
// @Param id path string true "Question ID"
// @Success 200 {object} response.Response{data=models.Question}
// @Failure 404 {object} response.Response
// @Router /question/{id} [get]
func (qc *QuestionController) GetQuestionByID(c *gin.Context) {
	id := c.Param("id")

	question, err := qc.questionService.GetQuestionByID(id)
	if err != nil {
		response.ErrorResponse(c, http.StatusNotFound, "Question not found")
		return
	}

	response.SuccessResponse(c, http.StatusOK, question)
}

// GetQuestionsByProjectID godoc
// @Summary Get questions by project ID
// @Description Get list of all questions for a specific project
// @Tags questions
// @Accept json
// @Produce json
// @Param projectId path string true "Project ID"
// @Success 200 {object} response.Response{data=[]models.Question}
// @Failure 500 {object} response.Response
// @Router /question/project/{projectId} [get]
func (qc *QuestionController) GetQuestionsByProjectID(c *gin.Context) {
	projectID := c.Param("projectId")

	questions, err := qc.questionService.GetQuestionsByProjectID(projectID)
	if err != nil {
		response.ErrorResponse(c, http.StatusInternalServerError, "Failed to get questions")
		return
	}

	response.SuccessResponse(c, http.StatusOK, questions)
}

// UpdateQuestion godoc
// @Summary Update question
// @Description Update question information
// @Tags questions
// @Accept json
// @Produce json
// @Param id path string true "Question ID"
// @Param question body models.Question true "Question information"
// @Success 200 {object} response.Response{data=models.Question}
// @Failure 400 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /question/{id} [put]
func (qc *QuestionController) UpdateQuestion(c *gin.Context) {
	id := c.Param("id")

	var question models.Question
	if err := c.ShouldBindJSON(&question); err != nil {
		response.ErrorResponse(c, http.StatusBadRequest, "Invalid request body")
		return
	}

	question.ID = id
	if err := qc.questionService.UpdateQuestion(&question); err != nil {
		response.ErrorResponse(c, http.StatusInternalServerError, "Failed to update question")
		return
	}

	response.SuccessResponse(c, http.StatusOK, question)
}

// DeleteQuestion godoc
// @Summary Delete question
// @Description Delete a question by ID
// @Tags questions
// @Accept json
// @Produce json
// @Param id path string true "Question ID"
// @Success 200 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /question/{id} [delete]
func (qc *QuestionController) DeleteQuestion(c *gin.Context) {
	id := c.Param("id")

	if err := qc.questionService.DeleteQuestion(id); err != nil {
		response.ErrorResponse(c, http.StatusInternalServerError, "Failed to delete question")
		return
	}

	response.SuccessResponse(c, http.StatusOK, "Question deleted successfully")
}

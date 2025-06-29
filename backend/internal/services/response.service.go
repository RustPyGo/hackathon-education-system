package services

import (
	"fmt"

	"github.com/RustPyGo/hackathon-education-system/backend/internal/models"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/repositories"
)

type SubmitExamRequest struct {
	ProjectID string         `json:"project_id"`
	UserID    string         `json:"user_id"`
	Score     int            `json:"score"`
	TimeTaken int            `json:"time_taken"`
	Answers   []SubmitAnswer `json:"answers"`
}

type SubmitAnswer struct {
	QuestionID string `json:"question_id"`
	ChoiceID   string `json:"choice_id"`
}

type IResponseService interface {
	SubmitExam(request *SubmitExamRequest) (*models.Response, error)
	GetResponseByID(id string) (*models.Response, error)
	GetAllResponses() ([]models.Response, error)
	GetResponsesByProjectID(projectID string) ([]models.Response, error)
	GetResponsesByUserID(userID string) ([]models.Response, error)
	GetAllResponsesSortedByScore() ([]models.Response, error)
	GetResponsesByProjectIDSortedByScore(projectID string) ([]models.Response, error)
	GetResponsesByUserIDSortedByScore(userID string) ([]models.Response, error)
	UpdateResponse(response *models.Response) error
	DeleteResponse(id string) error
}

type ResponseService struct {
	responseRepo repositories.IResponseRepository
	answerRepo   repositories.IAnswerRepository
}

func NewResponseService(responseRepo repositories.IResponseRepository, answerRepo repositories.IAnswerRepository) IResponseService {
	return &ResponseService{
		responseRepo: responseRepo,
		answerRepo:   answerRepo,
	}
}

func (rs *ResponseService) SubmitExam(request *SubmitExamRequest) (*models.Response, error) {
	// 1. Create response record
	response := &models.Response{
		ProjectID: request.ProjectID,
		UserID:    request.UserID,
		Score:     request.Score,
		TimeTaken: request.TimeTaken,
	}

	if err := rs.responseRepo.Create(response); err != nil {
		return nil, fmt.Errorf("failed to create response: %w", err)
	}

	// 2. Create answer records for each submitted answer
	for _, answerData := range request.Answers {
		answer := &models.Answer{
			ResponseID: response.ID,
			QuestionID: answerData.QuestionID,
			ChoiceID:   answerData.ChoiceID,
		}

		if err := rs.answerRepo.Create(answer); err != nil {
			return nil, fmt.Errorf("failed to create answer: %w", err)
		}
	}

	return response, nil
}

func (rs *ResponseService) GetResponseByID(id string) (*models.Response, error) {
	response, err := rs.responseRepo.GetByID(id)
	if err != nil {
		return nil, fmt.Errorf("failed to get response: %w", err)
	}

	// Get answers for this response
	answers, err := rs.answerRepo.GetByResponseID(id)
	if err != nil {
		return nil, fmt.Errorf("failed to get answers: %w", err)
	}

	response.Answers = answers
	return response, nil
}

func (rs *ResponseService) GetAllResponses() ([]models.Response, error) {
	return rs.responseRepo.GetAll()
}

func (rs *ResponseService) GetResponsesByProjectID(projectID string) ([]models.Response, error) {
	return rs.responseRepo.GetByProjectID(projectID)
}

func (rs *ResponseService) GetResponsesByUserID(userID string) ([]models.Response, error) {
	return rs.responseRepo.GetByUserID(userID)
}

func (rs *ResponseService) GetAllResponsesSortedByScore() ([]models.Response, error) {
	return rs.responseRepo.GetAllSortedByScore()
}

func (rs *ResponseService) GetResponsesByProjectIDSortedByScore(projectID string) ([]models.Response, error) {
	return rs.responseRepo.GetByProjectIDSortedByScore(projectID)
}

func (rs *ResponseService) GetResponsesByUserIDSortedByScore(userID string) ([]models.Response, error) {
	return rs.responseRepo.GetByUserIDSortedByScore(userID)
}

func (rs *ResponseService) UpdateResponse(response *models.Response) error {
	return rs.responseRepo.Update(response)
}

func (rs *ResponseService) DeleteResponse(id string) error {
	return rs.responseRepo.Delete(id)
}

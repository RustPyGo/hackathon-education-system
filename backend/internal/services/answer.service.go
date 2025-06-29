package services

import (
	"github.com/RustPyGo/hackathon-education-system/backend/internal/models"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/repositories"
)

type IAnswerService interface {
	CreateAnswer(answer *models.Answer) error
	GetAnswerByID(id string) (*models.Answer, error)
	GetAnswersByQuestionID(questionID string) ([]models.Answer, error)
	UpdateAnswer(answer *models.Answer) error
	DeleteAnswer(id string) error
}

type AnswerService struct {
	answerRepo repositories.IAnswerRepository
}

func NewAnswerService(answerRepo repositories.IAnswerRepository) IAnswerService {
	return &AnswerService{
		answerRepo: answerRepo,
	}
}

func (as *AnswerService) CreateAnswer(answer *models.Answer) error {
	return as.answerRepo.Create(answer)
}

func (as *AnswerService) GetAnswerByID(id string) (*models.Answer, error) {
	return as.answerRepo.GetByID(id)
}

func (as *AnswerService) GetAnswersByQuestionID(questionID string) ([]models.Answer, error) {
	return as.answerRepo.GetByQuestionID(questionID)
}

func (as *AnswerService) UpdateAnswer(answer *models.Answer) error {
	return as.answerRepo.Update(answer)
}

func (as *AnswerService) DeleteAnswer(id string) error {
	return as.answerRepo.Delete(id)
}

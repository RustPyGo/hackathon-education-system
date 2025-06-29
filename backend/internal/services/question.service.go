package services

import (
	"github.com/RustPyGo/hackathon-education-system/backend/internal/models"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/repositories"
)

type IQuestionService interface {
	CreateQuestion(question *models.Question) error
	GetQuestionByID(id string) (*models.Question, error)
	GetQuestionsByPackID(packID string) ([]models.Question, error)
	UpdateQuestion(question *models.Question) error
	DeleteQuestion(id string) error
}

type QuestionService struct {
	questionRepo repositories.IQuestionRepository
}

func NewQuestionService(questionRepo repositories.IQuestionRepository) IQuestionService {
	return &QuestionService{
		questionRepo: questionRepo,
	}
}

func (qs *QuestionService) CreateQuestion(question *models.Question) error {
	return qs.questionRepo.Create(question)
}

func (qs *QuestionService) GetQuestionByID(id string) (*models.Question, error) {
	return qs.questionRepo.GetByID(id)
}

func (qs *QuestionService) GetQuestionsByPackID(packID string) ([]models.Question, error) {
	return qs.questionRepo.GetByPackID(packID)
}

func (qs *QuestionService) UpdateQuestion(question *models.Question) error {
	return qs.questionRepo.Update(question)
}

func (qs *QuestionService) DeleteQuestion(id string) error {
	return qs.questionRepo.Delete(id)
}

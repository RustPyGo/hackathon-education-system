package repositories

import (
	"github.com/RustPyGo/hackathon-education-system/backend/global"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/models"
	"gorm.io/gorm"
)

type IQuestionChoiceRepository interface {
	Create(questionChoice *models.QuestionChoice) error
	GetByID(id string) (*models.QuestionChoice, error)
	GetByQuestionID(questionID string) ([]models.QuestionChoice, error)
	GetAll() ([]models.QuestionChoice, error)
	Update(questionChoice *models.QuestionChoice) error
	Delete(id string) error
}

type QuestionChoiceRepository struct {
	db *gorm.DB
}

func NewQuestionChoiceRepository() IQuestionChoiceRepository {
	return &QuestionChoiceRepository{
		db: global.DB,
	}
}

func (r *QuestionChoiceRepository) Create(questionChoice *models.QuestionChoice) error {
	return r.db.Create(questionChoice).Error
}

func (r *QuestionChoiceRepository) GetByID(id string) (*models.QuestionChoice, error) {
	var questionChoice models.QuestionChoice
	err := r.db.Where("id = ?", id).First(&questionChoice).Error
	if err != nil {
		return nil, err
	}
	return &questionChoice, nil
}

func (r *QuestionChoiceRepository) GetByQuestionID(questionID string) ([]models.QuestionChoice, error) {
	var questionChoices []models.QuestionChoice
	err := r.db.Where("question_id = ?", questionID).Find(&questionChoices).Error
	if err != nil {
		return nil, err
	}
	return questionChoices, nil
}

func (r *QuestionChoiceRepository) GetAll() ([]models.QuestionChoice, error) {
	var questionChoices []models.QuestionChoice
	err := r.db.Find(&questionChoices).Error
	if err != nil {
		return nil, err
	}
	return questionChoices, nil
}

func (r *QuestionChoiceRepository) Update(questionChoice *models.QuestionChoice) error {
	return r.db.Save(questionChoice).Error
}

func (r *QuestionChoiceRepository) Delete(id string) error {
	return r.db.Where("id = ?", id).Delete(&models.QuestionChoice{}).Error
}

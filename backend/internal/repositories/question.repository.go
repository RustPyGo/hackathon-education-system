package repositories

import (
	"github.com/RustPyGo/hackathon-education-system/backend/global"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/models"
	"gorm.io/gorm"
)

type IQuestionRepository interface {
	Create(question *models.Question) error
	GetByID(id string) (*models.Question, error)
	GetByProjectID(projectID string) ([]models.Question, error)
	Update(question *models.Question) error
	Delete(id string) error
}

type questionRepository struct {
	db *gorm.DB
}

func NewQuestionRepository() IQuestionRepository {
	return &questionRepository{
		db: global.DB,
	}
}

func (r *questionRepository) Create(question *models.Question) error {
	return r.db.Create(question).Error
}

func (r *questionRepository) GetByID(id string) (*models.Question, error) {
	var question models.Question
	err := r.db.First(&question, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &question, nil
}

func (r *questionRepository) GetByProjectID(projectID string) ([]models.Question, error) {
	var questions []models.Question
	err := r.db.Where("project_id = ?", projectID).Find(&questions).Error
	return questions, err
}

func (r *questionRepository) Update(question *models.Question) error {
	return r.db.Save(question).Error
}

func (r *questionRepository) Delete(id string) error {
	return r.db.Delete(&models.Question{}, "id = ?", id).Error
}

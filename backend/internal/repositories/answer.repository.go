package repositories

import (
	"github.com/RustPyGo/hackathon-education-system/backend/global"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/models"
	"gorm.io/gorm"
)

type IAnswerRepository interface {
	Create(answer *models.Answer) error
	GetByID(id string) (*models.Answer, error)
	GetByQuestionID(questionID string) ([]models.Answer, error)
	GetByResponseID(responseID string) ([]models.Answer, error)
	Update(answer *models.Answer) error
	Delete(id string) error
}

type answerRepository struct {
	db *gorm.DB
}

func NewAnswerRepository() IAnswerRepository {
	return &answerRepository{
		db: global.DB,
	}
}

func (r *answerRepository) Create(answer *models.Answer) error {
	return r.db.Create(answer).Error
}

func (r *answerRepository) GetByID(id string) (*models.Answer, error) {
	var answer models.Answer
	err := r.db.First(&answer, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &answer, nil
}

func (r *answerRepository) GetByQuestionID(questionID string) ([]models.Answer, error) {
	var answers []models.Answer
	err := r.db.Where("question_id = ?", questionID).Find(&answers).Error
	return answers, err
}

func (r *answerRepository) GetByResponseID(responseID string) ([]models.Answer, error) {
	var answers []models.Answer
	err := r.db.Where("response_id = ?", responseID).Find(&answers).Error
	return answers, err
}

func (r *answerRepository) Update(answer *models.Answer) error {
	return r.db.Save(answer).Error
}

func (r *answerRepository) Delete(id string) error {
	return r.db.Delete(&models.Answer{}, "id = ?", id).Error
}

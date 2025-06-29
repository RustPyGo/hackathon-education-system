package repositories

import (
	"github.com/RustPyGo/hackathon-education-system/backend/global"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/models"
	"gorm.io/gorm"
)

type IResponseRepository interface {
	Create(response *models.Response) error
	GetByID(id string) (*models.Response, error)
	GetAll() ([]models.Response, error)
	GetByProjectID(projectID string) ([]models.Response, error)
	GetByUserID(userID string) ([]models.Response, error)
	GetByQuestionID(questionID string) ([]models.Response, error)
	GetAllSortedByScore() ([]models.Response, error)
	GetByProjectIDSortedByScore(projectID string) ([]models.Response, error)
	GetByUserIDSortedByScore(userID string) ([]models.Response, error)
	Update(response *models.Response) error
	Delete(id string) error
}

type responseRepository struct {
	db *gorm.DB
}

func NewResponseRepository() IResponseRepository {
	return &responseRepository{
		db: global.DB,
	}
}

func (r *responseRepository) Create(response *models.Response) error {
	return r.db.Create(response).Error
}

func (r *responseRepository) GetByID(id string) (*models.Response, error) {
	var response models.Response
	err := r.db.First(&response, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &response, nil
}

func (r *responseRepository) GetAll() ([]models.Response, error) {
	var responses []models.Response
	err := r.db.Find(&responses).Error
	return responses, err
}

func (r *responseRepository) GetByProjectID(projectID string) ([]models.Response, error) {
	var responses []models.Response
	err := r.db.Where("project_id = ?", projectID).Find(&responses).Error
	return responses, err
}

func (r *responseRepository) GetByUserID(userID string) ([]models.Response, error) {
	var responses []models.Response
	err := r.db.Where("user_id = ?", userID).Find(&responses).Error
	return responses, err
}

func (r *responseRepository) GetByQuestionID(questionID string) ([]models.Response, error) {
	var responses []models.Response
	err := r.db.Where("question_id = ?", questionID).Find(&responses).Error
	return responses, err
}

func (r *responseRepository) GetAllSortedByScore() ([]models.Response, error) {
	var responses []models.Response
	err := r.db.Order("score DESC, time_taken ASC").Find(&responses).Error
	return responses, err
}

func (r *responseRepository) GetByProjectIDSortedByScore(projectID string) ([]models.Response, error) {
	var responses []models.Response
	err := r.db.Where("project_id = ?", projectID).Order("score DESC, time_taken ASC").Find(&responses).Error
	return responses, err
}

func (r *responseRepository) GetByUserIDSortedByScore(userID string) ([]models.Response, error) {
	var responses []models.Response
	err := r.db.Where("user_id = ?", userID).Order("score DESC, time_taken ASC").Find(&responses).Error
	return responses, err
}

func (r *responseRepository) Update(response *models.Response) error {
	return r.db.Save(response).Error
}

func (r *responseRepository) Delete(id string) error {
	return r.db.Delete(&models.Response{}, "id = ?", id).Error
}

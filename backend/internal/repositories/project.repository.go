package repositories

import (
	"github.com/RustPyGo/hackathon-education-system/backend/global"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/models"
	"gorm.io/gorm"
)

type IProjectRepository interface {
	Create(project *models.Project) error
	GetByID(id string) (*models.Project, error)
	GetAll() ([]models.Project, error)
	GetByAccountID(accountID string) ([]models.Project, error)
	Update(project *models.Project) error
	Delete(id string) error
}

type projectRepository struct {
	db *gorm.DB
}

func NewProjectRepository() IProjectRepository {
	return &projectRepository{
		db: global.DB,
	}
}

func (r *projectRepository) Create(project *models.Project) error {
	return r.db.Create(project).Error
}

func (r *projectRepository) GetByID(id string) (*models.Project, error) {
	var project models.Project
	err := r.db.First(&project, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &project, nil
}

func (r *projectRepository) GetAll() ([]models.Project, error) {
	var projects []models.Project
	err := r.db.Find(&projects).Error
	return projects, err
}

func (r *projectRepository) GetByAccountID(accountID string) ([]models.Project, error) {
	var projects []models.Project
	err := r.db.Where("account_id = ?", accountID).Find(&projects).Error
	return projects, err
}

func (r *projectRepository) Update(project *models.Project) error {
	return r.db.Save(project).Error
}

func (r *projectRepository) Delete(id string) error {
	return r.db.Delete(&models.Project{}, "id = ?", id).Error
}

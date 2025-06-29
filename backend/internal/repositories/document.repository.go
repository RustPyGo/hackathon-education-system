package repositories

import (
	"github.com/RustPyGo/hackathon-education-system/backend/global"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/models"
	"gorm.io/gorm"
)

type IDocumentRepository interface {
	Create(document *models.Document) error
	GetByID(id string) (*models.Document, error)
	GetByProjectID(projectID string) ([]models.Document, error)
	Update(document *models.Document) error
	Delete(id string) error
}

type documentRepository struct {
	db *gorm.DB
}

func NewDocumentRepository() IDocumentRepository {
	return &documentRepository{
		db: global.DB,
	}
}

func (r *documentRepository) Create(document *models.Document) error {
	return r.db.Create(document).Error
}

func (r *documentRepository) GetByID(id string) (*models.Document, error) {
	var document models.Document
	err := r.db.First(&document, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &document, nil
}

func (r *documentRepository) GetByProjectID(projectID string) ([]models.Document, error) {
	var documents []models.Document
	err := r.db.Where("project_id = ?", projectID).Find(&documents).Error
	return documents, err
}

func (r *documentRepository) Update(document *models.Document) error {
	return r.db.Save(document).Error
}

func (r *documentRepository) Delete(id string) error {
	return r.db.Delete(&models.Document{}, "id = ?", id).Error
}

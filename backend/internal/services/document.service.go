package services

import (
	"github.com/RustPyGo/hackathon-education-system/backend/internal/models"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/repositories"
)

type IDocumentService interface {
	CreateDocument(document *models.Document) error
	GetDocumentByID(id string) (*models.Document, error)
	GetDocumentsByProjectID(projectID string) ([]models.Document, error)
	UpdateDocument(document *models.Document) error
	DeleteDocument(id string) error
}

type DocumentService struct {
	documentRepo repositories.IDocumentRepository
}

func NewDocumentService(documentRepo repositories.IDocumentRepository) IDocumentService {
	return &DocumentService{
		documentRepo: documentRepo,
	}
}

func (ds *DocumentService) CreateDocument(document *models.Document) error {
	return ds.documentRepo.Create(document)
}

func (ds *DocumentService) GetDocumentByID(id string) (*models.Document, error) {
	return ds.documentRepo.GetByID(id)
}

func (ds *DocumentService) GetDocumentsByProjectID(projectID string) ([]models.Document, error) {
	return ds.documentRepo.GetByProjectID(projectID)
}

func (ds *DocumentService) UpdateDocument(document *models.Document) error {
	return ds.documentRepo.Update(document)
}

func (ds *DocumentService) DeleteDocument(id string) error {
	return ds.documentRepo.Delete(id)
}

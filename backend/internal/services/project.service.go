package services

import (
	"fmt"
	"mime/multipart"

	"github.com/RustPyGo/hackathon-education-system/backend/internal/models"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/repositories"
)

type IProjectService interface {
	CreateProject(project *models.Project, pdfFile *multipart.FileHeader) (string, error) // Returns extracted text
	GetProjectByID(id string) (*models.Project, error)
	GetAllProjects() ([]models.Project, error)
	GetProjectsByAccountID(accountID string) ([]models.Project, error)
	UpdateProject(project *models.Project) error
	DeleteProject(id string) error
}

type ProjectService struct {
	projectRepo  repositories.IProjectRepository
	documentRepo repositories.IDocumentRepository
	pdfService   IPDFService
	s3Service    IS3Service
}

func NewProjectService(projectRepo repositories.IProjectRepository, documentRepo repositories.IDocumentRepository) IProjectService {
	return &ProjectService{
		projectRepo:  projectRepo,
		documentRepo: documentRepo,
		pdfService:   NewPDFService(),
		s3Service:    NewS3Service(),
	}
}

func (ps *ProjectService) CreateProject(project *models.Project, pdfFile *multipart.FileHeader) (string, error) {
	// 1. Create project in database first to get project ID
	if err := ps.projectRepo.Create(project); err != nil {
		return "", fmt.Errorf("failed to create project: %w", err)
	}

	// 2. Upload PDF to S3
	s3Key, err := ps.s3Service.UploadPDFToS3(pdfFile, project.ID)
	if err != nil {
		return "", fmt.Errorf("failed to upload PDF to S3: %w", err)
	}

	// 3. Create document record in database
	document := &models.Document{
		ProjectID: project.ID,
		AWSKey:    s3Key,
	}
	if err := ps.documentRepo.Create(document); err != nil {
		return "", fmt.Errorf("failed to create document record: %w", err)
	}

	// 4. Extract text from PDF (don't save to database, just return)
	extractedText, err := ps.pdfService.ExtractTextFromPDF(pdfFile)
	if err != nil {
		return "", fmt.Errorf("failed to extract text from PDF: %w", err)
	}

	return extractedText, nil
}

func (ps *ProjectService) GetProjectByID(id string) (*models.Project, error) {
	return ps.projectRepo.GetByID(id)
}

func (ps *ProjectService) GetAllProjects() ([]models.Project, error) {
	return ps.projectRepo.GetAll()
}

func (ps *ProjectService) GetProjectsByAccountID(accountID string) ([]models.Project, error) {
	return ps.projectRepo.GetByAccountID(accountID)
}

func (ps *ProjectService) UpdateProject(project *models.Project) error {
	return ps.projectRepo.Update(project)
}

func (ps *ProjectService) DeleteProject(id string) error {
	return ps.projectRepo.Delete(id)
}

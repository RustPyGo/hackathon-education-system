package services

import (
	"fmt"
	"mime/multipart"

	"github.com/RustPyGo/hackathon-education-system/backend/internal/models"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/repositories"
)

type ProjectCreateResult struct {
	Project   *models.Project `json:"project"`
	FileURLs  []string        `json:"file_urls,omitempty"`
	FileCount int             `json:"file_count,omitempty"`
}

type IProjectService interface {
	CreateProject(project *models.Project, pdfFile *multipart.FileHeader) (*ProjectCreateResult, error)
	CreateProjectWithMultiplePDFs(project *models.Project, pdfFiles []*multipart.FileHeader) (*ProjectCreateResult, error)
	GetProjectByID(id string) (*models.Project, error)
	GetAllProjects() ([]models.Project, error)
	GetProjectsByAccountID(accountID string) ([]models.Project, error)
	UpdateProject(project *models.Project) error
	DeleteProject(id string) error
}

type ProjectService struct {
	projectRepo  repositories.IProjectRepository
	documentRepo repositories.IDocumentRepository
	s3Service    IS3Service
}

func NewProjectService(projectRepo repositories.IProjectRepository, documentRepo repositories.IDocumentRepository) IProjectService {
	return &ProjectService{
		projectRepo:  projectRepo,
		documentRepo: documentRepo,
		s3Service:    NewS3Service(),
	}
}

func (ps *ProjectService) CreateProject(project *models.Project, pdfFile *multipart.FileHeader) (*ProjectCreateResult, error) {
	// 1. Create project in database first to get project ID
	if err := ps.projectRepo.Create(project); err != nil {
		return nil, fmt.Errorf("failed to create project: %w", err)
	}

	// 2. Upload PDF to S3
	uploadResult, err := ps.s3Service.UploadPDFToS3(pdfFile, project.ID)
	if err != nil {
		return nil, fmt.Errorf("failed to upload PDF to S3: %w", err)
	}

	// 3. Create document record in database
	document := &models.Document{
		ProjectID: project.ID,
		AWSKey:    uploadResult.Key,
	}
	if err := ps.documentRepo.Create(document); err != nil {
		return nil, fmt.Errorf("failed to create document record: %w", err)
	}

	return &ProjectCreateResult{
		Project:   project,
		FileURLs:  []string{uploadResult.URL},
		FileCount: 1,
	}, nil
}

func (ps *ProjectService) CreateProjectWithMultiplePDFs(project *models.Project, pdfFiles []*multipart.FileHeader) (*ProjectCreateResult, error) {
	// 1. Create project in database first to get project ID
	if err := ps.projectRepo.Create(project); err != nil {
		return nil, fmt.Errorf("failed to create project: %w", err)
	}

	// 2. Upload multiple PDFs to S3
	uploadResults, err := ps.s3Service.UploadMultiplePDFsToS3(pdfFiles, project.ID)
	if err != nil {
		return nil, fmt.Errorf("failed to upload PDFs to S3: %w", err)
	}

	// 3. Create document records in database
	var fileURLs []string
	for _, uploadResult := range uploadResults {
		document := &models.Document{
			ProjectID: project.ID,
			AWSKey:    uploadResult.Key,
		}
		if err := ps.documentRepo.Create(document); err != nil {
			return nil, fmt.Errorf("failed to create document record: %w", err)
		}
		fileURLs = append(fileURLs, uploadResult.URL)
	}

	return &ProjectCreateResult{
		Project:   project,
		FileURLs:  fileURLs,
		FileCount: len(pdfFiles),
	}, nil
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

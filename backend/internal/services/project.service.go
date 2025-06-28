package services

import (
	"fmt"
	"mime/multipart"

	"github.com/RustPyGo/hackathon-education-system/backend/internal/models"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/repositories"
)

type ProjectCreateResult struct {
	Project        *models.Project `json:"project"`
	ExtractedText  string          `json:"extracted_text,omitempty"`
	ExtractedTexts []string        `json:"extracted_texts,omitempty"`
	FileURLs       []string        `json:"file_urls,omitempty"`
	FileCount      int             `json:"file_count,omitempty"`
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

	// 4. Extract text from PDF (don't save to database, just return)
	extractedText, err := ps.pdfService.ExtractTextFromPDF(pdfFile)
	if err != nil {
		return nil, fmt.Errorf("failed to extract text from PDF: %w", err)
	}

	return &ProjectCreateResult{
		Project:       project,
		ExtractedText: extractedText,
		FileURLs:      []string{uploadResult.URL},
		FileCount:     1,
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

	// 4. Extract text from all PDFs (don't save to database, just return)
	var extractedTexts []string
	for i, pdfFile := range pdfFiles {
		extractedText, err := ps.pdfService.ExtractTextFromPDF(pdfFile)
		if err != nil {
			return nil, fmt.Errorf("failed to extract text from PDF %d (%s): %w", i+1, pdfFile.Filename, err)
		}
		extractedTexts = append(extractedTexts, extractedText)
	}

	return &ProjectCreateResult{
		Project:        project,
		ExtractedTexts: extractedTexts,
		FileURLs:       fileURLs,
		FileCount:      len(pdfFiles),
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

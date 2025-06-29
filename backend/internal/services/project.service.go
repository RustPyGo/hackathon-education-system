package services

import (
	"fmt"
	"mime/multipart"

	"github.com/RustPyGo/hackathon-education-system/backend/internal/models"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/repositories"
)

type FileInfo struct {
	URL      string `json:"url"`
	FileName string `json:"file_name"`
}

type ProjectCreateResult struct {
	Project   *models.Project   `json:"project"`
	Files     []FileInfo        `json:"files,omitempty"`
	FileCount int               `json:"file_count,omitempty"`
	Questions []models.Question `json:"questions,omitempty"`
	Summary   string            `json:"summary,omitempty"`
}

type IProjectService interface {
	CreateProject(project *models.Project, pdfFile *multipart.FileHeader, totalQuestions int) (*ProjectCreateResult, error)
	CreateProjectWithMultiplePDFs(project *models.Project, pdfFiles []*multipart.FileHeader, totalQuestions int) (*ProjectCreateResult, error)
	GetProjectByID(id string) (*models.Project, error)
	GetAllProjects() ([]models.Project, error)
	GetProjectsByAccountID(accountID string) ([]models.Project, error)
	UpdateProject(project *models.Project) error
	DeleteProject(id string) error
}

type ProjectService struct {
	projectRepo        repositories.IProjectRepository
	documentRepo       repositories.IDocumentRepository
	questionRepo       repositories.IQuestionRepository
	questionChoiceRepo repositories.IQuestionChoiceRepository
	answerRepo         repositories.IAnswerRepository
	s3Service          IS3Service
	aiService          IAIService
}

func NewProjectService(projectRepo repositories.IProjectRepository, documentRepo repositories.IDocumentRepository, questionRepo repositories.IQuestionRepository, questionChoiceRepo repositories.IQuestionChoiceRepository, answerRepo repositories.IAnswerRepository) IProjectService {
	return &ProjectService{
		projectRepo:        projectRepo,
		documentRepo:       documentRepo,
		questionRepo:       questionRepo,
		questionChoiceRepo: questionChoiceRepo,
		answerRepo:         answerRepo,
		s3Service:          NewS3Service(),
		aiService:          NewAIService(),
	}
}

func (ps *ProjectService) CreateProject(project *models.Project, pdfFile *multipart.FileHeader, totalQuestions int) (*ProjectCreateResult, error) {
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
		S3URL:     uploadResult.URL,
		FileName:  uploadResult.FileName,
	}
	if err := ps.documentRepo.Create(document); err != nil {
		return nil, fmt.Errorf("failed to create document record: %w", err)
	}

	// 4. Call AI API to generate questions and summary
	aiRequest := &AIQuestionRequest{
		Files: []FileInfo{
			{
				URL:      uploadResult.URL,
				FileName: uploadResult.FileName,
			},
		},
		ProjectID:      project.ID,
		TotalQuestions: totalQuestions,
		Name:           project.Name,
	}

	aiResponse, err := ps.aiService.GenerateQuestionsAndSummary(aiRequest)
	if err != nil {
		return nil, fmt.Errorf("failed to generate questions and summary: %w", err)
	}

	// 5. Save questions and choices to database
	var questions []models.Question
	for _, aiQuestion := range aiResponse.Questions {
		// Create question
		question := &models.Question{
			ProjectID:   project.ID,
			Content:     aiQuestion.Question,
			Type:        aiQuestion.Type,
			Difficulty:  aiQuestion.Difficulty,
			Explanation: aiQuestion.Explanation,
		}

		if err := ps.questionRepo.Create(question); err != nil {
			return nil, fmt.Errorf("failed to create question: %w", err)
		}

		// Create choices for this question
		for _, choiceData := range aiQuestion.Choices {
			choice := &models.QuestionChoice{
				QuestionID:  question.ID,
				Content:     choiceData.Content,
				IsCorrect:   choiceData.IsCorrect,
				Explanation: choiceData.Explanation,
			}
			if err := ps.questionChoiceRepo.Create(choice); err != nil {
				return nil, fmt.Errorf("failed to create question choice: %w", err)
			}
		}

		questions = append(questions, *question)
	}

	// 6. Update project with summary
	project.Summary = aiResponse.Summary
	if err := ps.projectRepo.Update(project); err != nil {
		return nil, fmt.Errorf("failed to update project with summary: %w", err)
	}

	// 7. Prepare file info for response
	files := []FileInfo{
		{
			URL:      uploadResult.URL,
			FileName: uploadResult.FileName,
		},
	}

	return &ProjectCreateResult{
		Project:   project,
		Files:     files,
		FileCount: 1,
		Questions: questions,
		Summary:   aiResponse.Summary,
	}, nil
}

func (ps *ProjectService) CreateProjectWithMultiplePDFs(project *models.Project, pdfFiles []*multipart.FileHeader, totalQuestions int) (*ProjectCreateResult, error) {
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
	var files []FileInfo
	for _, uploadResult := range uploadResults {
		document := &models.Document{
			ProjectID: project.ID,
			S3URL:     uploadResult.URL,
			FileName:  uploadResult.FileName,
		}
		if err := ps.documentRepo.Create(document); err != nil {
			return nil, fmt.Errorf("failed to create document record: %w", err)
		}
		files = append(files, FileInfo{
			URL:      uploadResult.URL,
			FileName: uploadResult.FileName,
		})
	}

	// 4. Call AI API with all file URLs
	aiRequest := &AIQuestionRequest{
		Files:          files, // Send all files to AI
		ProjectID:      project.ID,
		TotalQuestions: totalQuestions,
		Name:           project.Name,
	}

	aiResponse, err := ps.aiService.GenerateQuestionsAndSummary(aiRequest)
	if err != nil {
		return nil, fmt.Errorf("failed to generate questions and summary: %w", err)
	}

	// 5. Save questions and choices to database
	var questions []models.Question
	for _, aiQuestion := range aiResponse.Questions {
		// Create question
		question := &models.Question{
			ProjectID:   project.ID,
			Content:     aiQuestion.Question,
			Type:        aiQuestion.Type,
			Difficulty:  aiQuestion.Difficulty,
			Explanation: aiQuestion.Explanation,
		}

		if err := ps.questionRepo.Create(question); err != nil {
			return nil, fmt.Errorf("failed to create question: %w", err)
		}

		// Create choices for this question
		for _, choiceData := range aiQuestion.Choices {
			choice := &models.QuestionChoice{
				QuestionID:  question.ID,
				Content:     choiceData.Content,
				IsCorrect:   choiceData.IsCorrect,
				Explanation: choiceData.Explanation,
			}
			if err := ps.questionChoiceRepo.Create(choice); err != nil {
				return nil, fmt.Errorf("failed to create question choice: %w", err)
			}
		}

		questions = append(questions, *question)
	}

	// 6. Update project with summary
	project.Summary = aiResponse.Summary
	if err := ps.projectRepo.Update(project); err != nil {
		return nil, fmt.Errorf("failed to update project with summary: %w", err)
	}

	return &ProjectCreateResult{
		Project:   project,
		Files:     files,
		FileCount: len(pdfFiles),
		Questions: questions,
		Summary:   aiResponse.Summary,
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

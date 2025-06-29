package services

import (
	"fmt"
	"mime/multipart"
	"time"

	"github.com/RustPyGo/hackathon-education-system/backend/internal/models"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/repositories"
	"github.com/sirupsen/logrus"
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
	start := time.Now()

	logEntry := logrus.WithFields(logrus.Fields{
		"service":         "ProjectService",
		"operation":       "CreateProject",
		"project_name":    project.Name,
		"user_id":         project.UserID,
		"file_name":       pdfFile.Filename,
		"file_size":       pdfFile.Size,
		"total_questions": totalQuestions,
	})

	logEntry.Info("Starting project creation with single PDF")

	// 1. Create project in database first to get project ID
	if err := ps.projectRepo.Create(project); err != nil {
		logEntry.WithError(err).Error("Failed to create project in database")
		return nil, fmt.Errorf("failed to create project: %w", err)
	}

	logEntry = logEntry.WithField("project_id", project.ID)
	logEntry.Info("Project created in database")

	// 2. Upload PDF to S3
	uploadResult, err := ps.s3Service.UploadPDFToS3(pdfFile, project.ID)
	if err != nil {
		logEntry.WithError(err).Error("Failed to upload PDF to S3")
		return nil, fmt.Errorf("failed to upload PDF to S3: %w", err)
	}

	logEntry.WithField("s3_url", uploadResult.URL).Info("PDF uploaded to S3")

	// 3. Create document record in database
	document := &models.Document{
		ProjectID: project.ID,
		S3URL:     uploadResult.URL,
		FileName:  uploadResult.FileName,
	}
	if err := ps.documentRepo.Create(document); err != nil {
		logEntry.WithError(err).Error("Failed to create document record")
		return nil, fmt.Errorf("failed to create document record: %w", err)
	}

	logEntry.Info("Document record created in database")

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

	logEntry.Info("Calling AI service to generate questions and summary")
	aiResponse, err := ps.aiService.GenerateQuestionsAndSummary(aiRequest)
	if err != nil {
		logEntry.WithError(err).Error("Failed to generate questions and summary from AI")
		return nil, fmt.Errorf("failed to generate questions and summary: %w", err)
	}

	logEntry.WithField("questions_generated", len(aiResponse.Questions)).Info("AI generated questions and summary")

	// 5. Save questions and choices to database
	var questions []models.Question
	for i, aiQuestion := range aiResponse.Questions {
		questionLogEntry := logEntry.WithFields(logrus.Fields{
			"question_index": i + 1,
			"question_type":  aiQuestion.Type,
			"difficulty":     aiQuestion.Difficulty,
		})

		// Create question
		question := &models.Question{
			ProjectID:   project.ID,
			Content:     aiQuestion.Question,
			Type:        aiQuestion.Type,
			Difficulty:  aiQuestion.Difficulty,
			Explanation: aiQuestion.Explanation,
		}

		if err := ps.questionRepo.Create(question); err != nil {
			questionLogEntry.WithError(err).Error("Failed to create question in database")
			return nil, fmt.Errorf("failed to create question: %w", err)
		}

		// Create choices for this question
		for j, choiceData := range aiQuestion.Choices {
			choice := &models.QuestionChoice{
				QuestionID:  question.ID,
				Content:     choiceData.Content,
				IsCorrect:   choiceData.IsCorrect,
				Explanation: choiceData.Explanation,
			}
			if err := ps.questionChoiceRepo.Create(choice); err != nil {
				questionLogEntry.WithFields(logrus.Fields{
					"choice_index": j + 1,
					"is_correct":   choiceData.IsCorrect,
				}).WithError(err).Error("Failed to create question choice")
				return nil, fmt.Errorf("failed to create question choice: %w", err)
			}
		}

		questionLogEntry.WithField("choices_count", len(aiQuestion.Choices)).Info("Question and choices saved to database")
		questions = append(questions, *question)
	}

	// 6. Update project with summary
	project.Summary = aiResponse.Summary
	if err := ps.projectRepo.Update(project); err != nil {
		logEntry.WithError(err).Error("Failed to update project with summary")
		return nil, fmt.Errorf("failed to update project with summary: %w", err)
	}

	logEntry.Info("Project updated with summary")

	// 7. Prepare file info for response
	files := []FileInfo{
		{
			URL:      uploadResult.URL,
			FileName: uploadResult.FileName,
		},
	}

	duration := time.Since(start)

	logEntry.WithFields(logrus.Fields{
		"duration":          duration.String(),
		"questions_created": len(questions),
		"summary_length":    len(aiResponse.Summary),
	}).Info("Project creation completed successfully")

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

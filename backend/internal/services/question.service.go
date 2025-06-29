package services

import (
	"fmt"

	"github.com/RustPyGo/hackathon-education-system/backend/internal/models"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/repositories"
)

type CreateQuestionData struct {
	Question    string                     `json:"question"`
	Type        string                     `json:"type"`
	Difficulty  string                     `json:"difficulty"`
	Explanation string                     `json:"explanation"`
	Choices     []CreateQuestionChoiceData `json:"choices"`
}

type CreateQuestionChoiceData struct {
	Content     string `json:"content"`
	IsCorrect   bool   `json:"is_correct"`
	Explanation string `json:"explanation"`
}

type IQuestionService interface {
	CreateQuestion(question *models.Question) error
	CreateQuestionsWithChoices(projectID string, questionsData []CreateQuestionData) ([]models.Question, error)
	GetQuestionByID(id string) (*models.Question, error)
	GetQuestionsByProjectID(projectID string) ([]models.Question, error)
	UpdateQuestion(question *models.Question) error
	DeleteQuestion(id string) error
}

type QuestionService struct {
	questionRepo       repositories.IQuestionRepository
	questionChoiceRepo repositories.IQuestionChoiceRepository
}

func NewQuestionService(questionRepo repositories.IQuestionRepository, questionChoiceRepo repositories.IQuestionChoiceRepository) IQuestionService {
	return &QuestionService{
		questionRepo:       questionRepo,
		questionChoiceRepo: questionChoiceRepo,
	}
}

func (qs *QuestionService) CreateQuestion(question *models.Question) error {
	return qs.questionRepo.Create(question)
}

func (qs *QuestionService) CreateQuestionsWithChoices(projectID string, questionsData []CreateQuestionData) ([]models.Question, error) {
	var createdQuestions []models.Question

	for _, questionData := range questionsData {
		// Create question
		question := &models.Question{
			ProjectID:   projectID,
			Content:     questionData.Question,
			Type:        questionData.Type,
			Difficulty:  questionData.Difficulty,
			Explanation: questionData.Explanation,
		}

		if err := qs.questionRepo.Create(question); err != nil {
			return nil, fmt.Errorf("failed to create question: %w", err)
		}

		// Create choices for multiple_choice questions
		if questionData.Type == "multiple_choice" {
			for _, choiceData := range questionData.Choices {
				choice := &models.QuestionChoice{
					QuestionID:  question.ID,
					Content:     choiceData.Content,
					IsCorrect:   choiceData.IsCorrect,
					Explanation: choiceData.Explanation,
				}

				if err := qs.questionChoiceRepo.Create(choice); err != nil {
					return nil, fmt.Errorf("failed to create question choice: %w", err)
				}
			}
		}

		createdQuestions = append(createdQuestions, *question)
	}

	return createdQuestions, nil
}

func (qs *QuestionService) GetQuestionByID(id string) (*models.Question, error) {
	return qs.questionRepo.GetByID(id)
}

func (qs *QuestionService) GetQuestionsByProjectID(projectID string) ([]models.Question, error) {
	return qs.questionRepo.GetByProjectID(projectID)
}

func (qs *QuestionService) UpdateQuestion(question *models.Question) error {
	return qs.questionRepo.Update(question)
}

func (qs *QuestionService) DeleteQuestion(id string) error {
	return qs.questionRepo.Delete(id)
}

package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/RustPyGo/hackathon-education-system/backend/global"
	"github.com/sirupsen/logrus"
)

type AIQuestionRequest struct {
	Files          []FileInfo `json:"files"`
	ProjectID      string     `json:"project_id"`
	TotalQuestions int        `json:"total_questions"`
	Name           string     `json:"name"`
}

type AIQuestionResponse struct {
	Questions []AIQuestion `json:"questions"`
	Summary   string       `json:"summary"`
}

type AIQuestion struct {
	Question    string             `json:"question"`
	Type        string             `json:"type"`
	Difficulty  string             `json:"difficulty"`
	Explanation string             `json:"explanation"`
	Choices     []AIQuestionChoice `json:"choices"`
}

type AIQuestionChoice struct {
	Content     string `json:"content"`
	IsCorrect   bool   `json:"is_correct"`
	Explanation string `json:"explanation"`
}

type AIChatRequest struct {
	Message   string `json:"message"`
	ProjectID string `json:"project_id"`
}

type AIChatResponse struct {
	Message string `json:"message"`
}

type IAIService interface {
	GenerateQuestionsAndSummary(request *AIQuestionRequest) (*AIQuestionResponse, error)
	GenerateChatResponse(request *AIChatRequest) (*AIChatResponse, error)
}

type AIService struct {
	apiURL string
	apiKey string
	client *http.Client
}

func NewAIService() IAIService {
	// Load from global config
	apiURL := global.Config.AI.APIURL
	apiKey := global.Config.AI.APIKey

	return &AIService{
		apiURL: apiURL,
		apiKey: apiKey,
		client: &http.Client{
			Timeout: 60 * time.Second, // 60 seconds timeout
		},
	}
}

func (ai *AIService) GenerateQuestionsAndSummary(request *AIQuestionRequest) (*AIQuestionResponse, error) {
	start := time.Now()

	logEntry := logrus.WithFields(logrus.Fields{
		"service":         "AIService",
		"operation":       "GenerateQuestionsAndSummary",
		"project_id":      request.ProjectID,
		"project_name":    request.Name,
		"total_questions": request.TotalQuestions,
		"file_count":      len(request.Files),
		"api_url":         ai.apiURL + "/api/generate-questions-sync",
	})

	logEntry.Info("Starting AI question generation request")

	// Prepare request body
	requestBody, err := json.Marshal(request)
	if err != nil {
		logEntry.WithError(err).Error("Failed to marshal AI request")
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	// Create HTTP request
	req, err := http.NewRequest("POST", ai.apiURL+"/api/generate-questions-sync", bytes.NewBuffer(requestBody))
	if err != nil {
		logEntry.WithError(err).Error("Failed to create HTTP request")
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	// Set headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+ai.apiKey)

	// Make the request
	logEntry.Info("Making HTTP request to AI API")
	resp, err := ai.client.Do(req)
	if err != nil {
		logEntry.WithError(err).Error("Failed to make HTTP request to AI API")
		return nil, fmt.Errorf("failed to make request: %w", err)
	}
	defer resp.Body.Close()

	// Read response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		logEntry.WithError(err).Error("Failed to read AI API response body")
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	// Check response status
	if resp.StatusCode != http.StatusOK {
		logEntry.WithFields(logrus.Fields{
			"status_code": resp.StatusCode,
			"response":    string(body),
		}).Error("AI API returned error status")
		return nil, fmt.Errorf("AI API returned status %d: %s", resp.StatusCode, string(body))
	}

	// Parse response
	var aiResponse AIQuestionResponse
	if err := json.Unmarshal(body, &aiResponse); err != nil {
		logEntry.WithError(err).WithField("response_body", string(body)).Error("Failed to unmarshal AI response")
		return nil, fmt.Errorf("failed to unmarshal response: %w", err)
	}

	duration := time.Since(start)

	logEntry.WithFields(logrus.Fields{
		"duration":            duration.String(),
		"questions_generated": len(aiResponse.Questions),
		"summary_length":      len(aiResponse.Summary),
		"status_code":         resp.StatusCode,
	}).Info("AI question generation completed successfully")

	return &aiResponse, nil
}

func (ai *AIService) GenerateChatResponse(request *AIChatRequest) (*AIChatResponse, error) {
	start := time.Now()

	logEntry := logrus.WithFields(logrus.Fields{
		"service":        "AIService",
		"operation":      "GenerateChatResponse",
		"project_id":     request.ProjectID,
		"message_length": len(request.Message),
		"api_url":        ai.apiURL + "/chat",
	})

	logEntry.Info("Starting AI chat response generation")

	// Prepare request body
	requestBody, err := json.Marshal(request)
	if err != nil {
		logEntry.WithError(err).Error("Failed to marshal chat request")
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	// Create HTTP request
	req, err := http.NewRequest("POST", ai.apiURL+"/chat", bytes.NewBuffer(requestBody))
	if err != nil {
		logEntry.WithError(err).Error("Failed to create HTTP request for chat")
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	// Set headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+ai.apiKey)

	// Make the request
	logEntry.Info("Making HTTP request to AI chat API")
	resp, err := ai.client.Do(req)
	if err != nil {
		logEntry.WithError(err).Error("Failed to make HTTP request to AI chat API")
		return nil, fmt.Errorf("failed to make request: %w", err)
	}
	defer resp.Body.Close()

	// Read response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		logEntry.WithError(err).Error("Failed to read AI chat response body")
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	// Check response status
	if resp.StatusCode != http.StatusOK {
		logEntry.WithFields(logrus.Fields{
			"status_code": resp.StatusCode,
			"response":    string(body),
		}).Error("AI chat API returned error status")
		return nil, fmt.Errorf("AI API returned status %d: %s", resp.StatusCode, string(body))
	}

	// Parse response
	var aiResponse AIChatResponse
	if err := json.Unmarshal(body, &aiResponse); err != nil {
		logEntry.WithError(err).WithField("response_body", string(body)).Error("Failed to unmarshal AI chat response")
		return nil, fmt.Errorf("failed to unmarshal response: %w", err)
	}

	duration := time.Since(start)

	logEntry.WithFields(logrus.Fields{
		"duration":        duration.String(),
		"response_length": len(aiResponse.Message),
		"status_code":     resp.StatusCode,
	}).Info("AI chat response generated successfully")

	return &aiResponse, nil
}

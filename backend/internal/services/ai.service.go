package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
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
	// TODO: Load from config
	apiURL := "https://e2e5-118-69-69-187.ngrok-free.app" // Change to your AI API base URL
	apiKey := "1234567890"                                // Change to your API key

	return &AIService{
		apiURL: apiURL,
		apiKey: apiKey,
		client: &http.Client{
			Timeout: 60 * time.Second, // 60 seconds timeout
		},
	}
}

func (ai *AIService) GenerateQuestionsAndSummary(request *AIQuestionRequest) (*AIQuestionResponse, error) {
	// Prepare request body
	requestBody, err := json.Marshal(request)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	// Create HTTP request
	req, err := http.NewRequest("POST", ai.apiURL+"/api/generate-questions-sync", bytes.NewBuffer(requestBody))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	// Set headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+ai.apiKey)

	// Make the request
	resp, err := ai.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to make request: %w", err)
	}
	defer resp.Body.Close()

	// Read response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	// Check response status
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("AI API returned status %d: %s", resp.StatusCode, string(body))
	}

	// Parse response
	var aiResponse AIQuestionResponse
	if err := json.Unmarshal(body, &aiResponse); err != nil {
		return nil, fmt.Errorf("failed to unmarshal response: %w", err)
	}

	return &aiResponse, nil
}

func (ai *AIService) GenerateChatResponse(request *AIChatRequest) (*AIChatResponse, error) {
	// Prepare request body
	requestBody, err := json.Marshal(request)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	// Create HTTP request
	req, err := http.NewRequest("POST", ai.apiURL+"/chat", bytes.NewBuffer(requestBody))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	// Set headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+ai.apiKey)

	// Make the request
	resp, err := ai.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to make request: %w", err)
	}
	defer resp.Body.Close()

	// Read response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	// Check response status
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("AI API returned status %d: %s", resp.StatusCode, string(body))
	}

	// Parse response
	var aiResponse AIChatResponse
	if err := json.Unmarshal(body, &aiResponse); err != nil {
		return nil, fmt.Errorf("failed to unmarshal response: %w", err)
	}

	return &aiResponse, nil
}

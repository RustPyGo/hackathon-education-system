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
	URL            string `json:"url"`
	ProjectID      string `json:"project_id"`
	TotalQuestions int    `json:"total_questions"`
	Name           string `json:"name"`
}

type AIQuestionResponse struct {
	Questions []AIQuestion `json:"questions"`
	Summary   string       `json:"summary"`
}

type AIQuestion struct {
	Question        string   `json:"question"`
	AnswerCorrect   string   `json:"answer_correct"`
	DifficultyLevel int      `json:"difficulty_level"`
	Answers         []string `json:"answers"`
}

type IAIService interface {
	GenerateQuestionsAndSummary(request *AIQuestionRequest) (*AIQuestionResponse, error)
}

type AIService struct {
	apiURL string
	apiKey string
	client *http.Client
}

func NewAIService() IAIService {
	// TODO: Load from config
	apiURL := "https://your-ai-api.com/generate-questions" // Change to your AI API endpoint
	apiKey := "your-api-key"                               // Change to your API key

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
	req, err := http.NewRequest("POST", ai.apiURL, bytes.NewBuffer(requestBody))
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

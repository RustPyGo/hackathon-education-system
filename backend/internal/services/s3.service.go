package services

import (
	"fmt"
	"mime/multipart"
	"path/filepath"
	"strings"
	"time"

	"github.com/RustPyGo/hackathon-education-system/backend/global"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/google/uuid"
)

type FileUploadResult struct {
	Key      string `json:"key"`
	URL      string `json:"url"`
	FileName string `json:"file_name"`
}

type IS3Service interface {
	UploadPDFToS3(file *multipart.FileHeader, projectID string) (*FileUploadResult, error)
	UploadMultiplePDFsToS3(files []*multipart.FileHeader, projectID string) ([]*FileUploadResult, error)
}

type S3Service struct {
	s3Client *s3.S3
	bucket   string
	endpoint string
}

func NewS3Service() IS3Service {
	// Load AWS config from global config
	awsConfig := global.Config.AWS

	// Create AWS config with custom endpoint if provided
	awsS3Config := &aws.Config{
		Region:      aws.String(awsConfig.Region),
		Credentials: credentials.NewStaticCredentials(awsConfig.AccessKey, awsConfig.SecretKey, ""),
	}

	// Add custom endpoint if provided
	if awsConfig.Endpoint != "" {
		awsS3Config.Endpoint = aws.String(awsConfig.Endpoint)
		awsS3Config.S3ForcePathStyle = aws.Bool(true) // Required for custom endpoints
	}

	sess, err := session.NewSession(awsS3Config)
	if err != nil {
		panic(fmt.Sprintf("Failed to create AWS session: %v", err))
	}

	return &S3Service{
		s3Client: s3.New(sess),
		bucket:   awsConfig.Bucket,
		endpoint: awsConfig.Endpoint,
	}
}

func (s *S3Service) generateUniqueFileName(originalName string, projectID string) string {
	// Get file extension
	extension := filepath.Ext(originalName)

	// Get base name without extension
	baseName := strings.TrimSuffix(originalName, extension)

	// Clean the base name (remove special characters, spaces, etc.)
	cleanBaseName := s.cleanFileName(baseName)

	// Generate timestamp
	timestamp := time.Now().Format("20060102_150405")

	// Generate UUID (first 8 characters)
	uuidStr := uuid.New().String()[:8]

	// Create unique file name: cleanName_timestamp_uuid_projectID.extension
	uniqueName := fmt.Sprintf("%s_%s_%s_%s%s", cleanBaseName, timestamp, uuidStr, projectID, extension)

	return uniqueName
}

func (s *S3Service) cleanFileName(fileName string) string {
	// Replace spaces with underscores
	cleaned := strings.ReplaceAll(fileName, " ", "_")

	// Remove special characters except alphanumeric, dots, hyphens, and underscores
	var result strings.Builder
	for _, char := range cleaned {
		if (char >= 'a' && char <= 'z') ||
			(char >= 'A' && char <= 'Z') ||
			(char >= '0' && char <= '9') ||
			char == '.' || char == '-' || char == '_' {
			result.WriteRune(char)
		}
	}

	// Convert to lowercase
	return strings.ToLower(result.String())
}

func (s *S3Service) generateFileURL(key string) string {
	if s.endpoint != "" {
		// Custom endpoint (path-style)
		return fmt.Sprintf("%s/%s/%s", s.endpoint, s.bucket, key)
	}
	// AWS S3 standard
	return fmt.Sprintf("https://%s.s3.%s.amazonaws.com/%s", s.bucket, global.Config.AWS.Region, key)
}

func (s *S3Service) UploadPDFToS3(file *multipart.FileHeader, projectID string) (*FileUploadResult, error) {
	// Open the uploaded file
	src, err := file.Open()
	if err != nil {
		return nil, fmt.Errorf("failed to open file: %w", err)
	}
	defer src.Close()

	// Generate unique file name
	uniqueFileName := s.generateUniqueFileName(file.Filename, projectID)

	// Generate S3 key with unique file name
	key := fmt.Sprintf("pdfs/%s/%s", projectID, uniqueFileName)

	// Upload to S3 with public read access
	_, err = s.s3Client.PutObject(&s3.PutObjectInput{
		Bucket:      aws.String(s.bucket),
		Key:         aws.String(key),
		Body:        src,
		ContentType: aws.String("application/pdf"),
		ACL:         aws.String("public-read"), // Make file publicly accessible
	})
	if err != nil {
		return nil, fmt.Errorf("failed to upload to S3: %w", err)
	}

	// Generate file URL
	url := s.generateFileURL(key)

	return &FileUploadResult{
		Key:      key,
		URL:      url,
		FileName: file.Filename, // Keep original file name for display
	}, nil
}

func (s *S3Service) UploadMultiplePDFsToS3(files []*multipart.FileHeader, projectID string) ([]*FileUploadResult, error) {
	var results []*FileUploadResult
	var errors []string

	for i, file := range files {
		result, err := s.UploadPDFToS3(file, projectID)
		if err != nil {
			errors = append(errors, fmt.Sprintf("File %d (%s): %v", i+1, file.Filename, err))
			continue
		}
		results = append(results, result)
	}

	// If there were any errors, return them along with successful uploads
	if len(errors) > 0 {
		return results, fmt.Errorf("some files failed to upload: %v", errors)
	}

	return results, nil
}

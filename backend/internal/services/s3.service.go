package services

import (
	"fmt"
	"mime/multipart"
	"path/filepath"
	"time"

	"github.com/RustPyGo/hackathon-education-system/backend/global"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

type FileUploadResult struct {
	Key string `json:"key"`
	URL string `json:"url"`
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

	// Generate unique key for S3
	timestamp := time.Now().Unix()
	extension := filepath.Ext(file.Filename)
	key := fmt.Sprintf("pdfs/%s/%d%s", projectID, timestamp, extension)

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
		Key: key,
		URL: url,
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

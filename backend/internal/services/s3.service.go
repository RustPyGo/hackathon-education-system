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

type IS3Service interface {
	UploadPDFToS3(file *multipart.FileHeader, projectID string) (string, error)
}

type S3Service struct {
	s3Client *s3.S3
	bucket   string
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
	}
}

func (s *S3Service) UploadPDFToS3(file *multipart.FileHeader, projectID string) (string, error) {
	// Open the uploaded file
	src, err := file.Open()
	if err != nil {
		return "", fmt.Errorf("failed to open file: %w", err)
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
		return "", fmt.Errorf("failed to upload to S3: %w", err)
	}

	return key, nil
}

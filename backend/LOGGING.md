# Logging System Documentation

## Overview

The backend now includes comprehensive logging for all API requests and service operations. This helps with debugging, monitoring, and understanding system behavior.

## Logging Components

### 1. Middleware Logging

#### Request Logger (`middleware.RequestLogger`)

- **Purpose**: Logs detailed information about incoming API requests
- **Information logged**:
  - HTTP method and path
  - Query parameters
  - Client IP and User Agent
  - Request headers (excluding sensitive ones like Authorization)
  - Request body for POST/PUT/PATCH requests (truncated if too long)
  - Response status and duration
  - Response body for errors or small responses

#### Error Logger (`middleware.ErrorLogger`)

- **Purpose**: Specifically logs errors that occur during request processing
- **Information logged**:
  - Error message and type
  - Request method and path
  - Client IP

#### Standard Logger (`middleware.Logger`)

- **Purpose**: Basic request logging with structured format
- **Information logged**:
  - Timestamp, method, path, status code
  - Latency, client IP, user agent
  - Error messages

### 2. Service Logging

#### S3 Service Logging

- **File upload operations**: Tracks file uploads with unique naming
- **Information logged**:
  - File name, size, and project ID
  - S3 key and URL generation
  - Upload duration and success/failure
  - Multiple file upload statistics

#### Project Service Logging

- **Project creation**: Tracks the entire project creation process
- **Information logged**:
  - Project details (name, user ID, file info)
  - Database operations (create, update)
  - S3 upload operations
  - AI service calls
  - Question and choice creation
  - Overall process duration

#### AI Service Logging

- **AI API calls**: Tracks external AI service interactions
- **Information logged**:
  - Request details (project ID, file count, question count)
  - API URL and response status
  - Request/response duration
  - Generated content statistics (questions, summary length)

## Log Format

All logs use structured logging with JSON-like fields:

```json
{
  "level": "INFO",
  "time": "2024-12-29T14:30:52.123+07:00",
  "service": "ProjectService",
  "operation": "CreateProject",
  "project_name": "Test Project",
  "user_id": "user-123",
  "file_name": "document.pdf",
  "file_size": 1024000,
  "duration": "2.5s",
  "questions_created": 10,
  "summary_length": 500
}
```

## Log Levels

- **INFO**: Normal operations, successful requests
- **WARN**: Non-critical issues, partial failures
- **ERROR**: Critical errors, failed operations
- **DEBUG**: Detailed debugging information (in development mode)

## Testing Logging

Use the provided test script to verify logging functionality:

```bash
./test_logging.sh
```

This script will:

1. Test server status endpoint
2. Test project creation with file upload
3. Test chat message creation
4. Test question batch creation

## Configuration

Logging configuration is handled in `internal/initialize/logger.go`:

- **Development mode**: Detailed logging with colors
- **Production mode**: Structured logging without colors
- **Log level**: Configurable via environment variables

## Benefits

1. **Debugging**: Easy to trace issues through the system
2. **Monitoring**: Track performance and usage patterns
3. **Audit Trail**: Complete record of all operations
4. **Performance Analysis**: Duration tracking for optimization
5. **Security**: Log suspicious activities and errors

## Example Log Output

```
{"level":"INFO","time":"2024-12-29T14:30:52.123+07:00","service":"ProjectService","operation":"CreateProject","project_name":"Test Project","user_id":"user-123","file_name":"document.pdf","file_size":1024000,"project_id":"uuid-here","msg":"Project created in database"}

{"level":"INFO","time":"2024-12-29T14:30:53.456+07:00","service":"S3Service","operation":"UploadPDFToS3","file_name":"document.pdf","file_size":1024000,"project_id":"uuid-here","unique_file_name":"document_20241229_143052_a1b2c3d4_uuid-here.pdf","s3_key":"pdfs/uuid-here/document_20241229_143052_a1b2c3d4_uuid-here.pdf","url":"https://bucket.s3.region.amazonaws.com/pdfs/uuid-here/document_20241229_143052_a1b2c3d4_uuid-here.pdf","duration":"1.333s","msg":"PDF uploaded successfully to S3"}

{"level":"INFO","time":"2024-12-29T14:30:55.789+07:00","service":"AIService","operation":"GenerateQuestionsAndSummary","project_id":"uuid-here","project_name":"Test Project","total_questions":10,"file_count":1,"api_url":"https://ai-api.com/api/generate-questions-sync","duration":"2.333s","questions_generated":10,"summary_length":500,"status_code":200,"msg":"AI question generation completed successfully"}
```

## Best Practices

1. **Don't log sensitive data**: Passwords, tokens, personal information
2. **Use structured logging**: Consistent field names and formats
3. **Include context**: Always log relevant IDs and metadata
4. **Monitor log volume**: Avoid excessive logging in production
5. **Rotate logs**: Implement log rotation to manage disk space

# Swagger API Documentation

This directory contains the auto-generated Swagger documentation for the Education System API.

## Accessing the Documentation

Once the server is running, you can access the Swagger UI at:

```
http://localhost:3000/swagger/index.html
```

## Generating Documentation

To regenerate the Swagger documentation after making changes to the API:

```bash
# Using make command
make swagger

# Or directly using swag
swag init -g cmd/server/main.go -o docs
```

## API Endpoints

The API is organized into the following categories:

### Users

- `POST /api/v1/user/` - Create a new user
- `GET /api/v1/user/{id}` - Get user by ID
- `GET /api/v1/user/` - Get all users
- `PUT /api/v1/user/{id}` - Update user
- `DELETE /api/v1/user/{id}` - Delete user

### Projects

- `POST /api/v1/project/` - Create a new project with PDF upload
- `GET /api/v1/project/{id}` - Get project by ID
- `GET /api/v1/project/` - Get all projects
- `GET /api/v1/project/account/{accountId}` - Get projects by account ID
- `PUT /api/v1/project/{id}` - Update project
- `DELETE /api/v1/project/{id}` - Delete project

### Questions

- `POST /api/v1/question/` - Create multiple questions with choices
- `GET /api/v1/question/{id}` - Get question by ID
- `GET /api/v1/question/project/{projectId}` - Get questions by project ID
- `PUT /api/v1/question/{id}` - Update question
- `DELETE /api/v1/question/{id}` - Delete question

### Answers

- `POST /api/v1/answer/` - Create a new answer
- `GET /api/v1/answer/{id}` - Get answer by ID
- `GET /api/v1/answer/question/{questionId}` - Get answers by question ID
- `PUT /api/v1/answer/{id}` - Update answer
- `DELETE /api/v1/answer/{id}` - Delete answer

### Responses

- `POST /api/v1/response/submit` - Submit exam
- `GET /api/v1/response/{id}` - Get response by ID
- `GET /api/v1/response/` - Get all responses
- `GET /api/v1/response/project/{projectId}` - Get responses by project ID
- `GET /api/v1/response/user/{userId}` - Get responses by user ID
- `PUT /api/v1/response/{id}` - Update response
- `DELETE /api/v1/response/{id}` - Delete response

### Chat Messages

- `POST /api/v1/chat-message/` - Create a new chat message
- `GET /api/v1/chat-message/{id}` - Get chat message by ID
- `GET /api/v1/chat-message/project/{projectId}` - Get chat messages by project ID
- `PUT /api/v1/chat-message/{id}` - Update chat message
- `DELETE /api/v1/chat-message/{id}` - Delete chat message

### Documents

- `POST /api/v1/document/upload` - Upload document
- `GET /api/v1/document/{id}` - Get document by ID
- `GET /api/v1/document/` - Get all documents
- `GET /api/v1/document/project/{projectId}` - Get documents by project ID
- `PUT /api/v1/document/{id}` - Update document
- `DELETE /api/v1/document/{id}` - Delete document

## Response Format

All API responses follow a standard format:

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    // Response data here
  }
}
```

## Error Handling

Errors are returned with appropriate HTTP status codes and error messages:

```json
{
  "code": 400,
  "message": "Error description",
  "data": null
}
```

## Authentication

Some endpoints may require authentication. When authentication is required, include the Authorization header:

```
Authorization: Bearer <your-token>
```

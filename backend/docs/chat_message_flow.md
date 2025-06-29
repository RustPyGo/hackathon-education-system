# Chat Message Flow with AI Integration

## Overview

The chat message system has been updated to provide context-aware AI responses by including project documents and chat history. When a user sends a message, the system:

1. Retrieves the latest 5 messages for context
2. Fetches project documents
3. Sends all context to AI API
4. Returns both user message and AI response

## API Endpoint

### Create Chat Message

**Endpoint:** `POST /api/v1/chat-message/`

**Request Body:**

```json
{
  "project_id": "uuid",
  "user_id": "uuid",
  "message": "Hello, can you help me understand this project?"
}
```

**Response:**

```json
{
  "code": 201,
  "message": "Success",
  "data": {
    "user_message": {
      "id": "uuid",
      "project_id": "uuid",
      "user_id": "uuid",
      "message": "Hello, can you help me understand this project?",
      "sender": "user",
      "created_at": "2024-01-01T10:00:00Z",
      "updated_at": "2024-01-01T10:00:00Z"
    },
    "ai_response": {
      "id": "uuid",
      "project_id": "uuid",
      "user_id": "uuid",
      "message": "I'd be happy to help you understand this project! Based on the documents...",
      "sender": "bot",
      "created_at": "2024-01-01T10:00:01Z",
      "updated_at": "2024-01-01T10:00:01Z"
    }
  }
}
```

## Data Flow

### 1. Context Gathering

The system collects context from multiple sources:

#### Project Documents

```json
{
  "files": [
    {
      "file_name": "document1.pdf",
      "url": "https://s3.amazonaws.com/bucket/document1.pdf"
    },
    {
      "file_name": "document2.pdf",
      "url": "https://s3.amazonaws.com/bucket/document2.pdf"
    }
  ]
}
```

#### Chat History (Last 5 Messages)

```json
{
  "history_chat": [
    {
      "message": "What is this project about?",
      "sender": "user"
    },
    {
      "message": "This project covers machine learning fundamentals...",
      "sender": "bot"
    },
    {
      "message": "Can you explain neural networks?",
      "sender": "user"
    },
    {
      "message": "Neural networks are computational models...",
      "sender": "bot"
    }
  ]
}
```

### 2. AI API Request

The complete request sent to AI API:

```json
{
  "message": "Hello, can you help me understand this project?",
  "project_id": "uuid",
  "files": [
    {
      "file_name": "document1.pdf",
      "url": "https://s3.amazonaws.com/bucket/document1.pdf"
    }
  ],
  "history_chat": [
    {
      "message": "What is this project about?",
      "sender": "user"
    },
    {
      "message": "This project covers machine learning fundamentals...",
      "sender": "bot"
    }
  ]
}
```

### 3. Database Operations

1. **Save User Message:** Store the user's message in the database
2. **Call AI API:** Send context to AI service
3. **Save AI Response:** Store the AI's response in the database
4. **Return Both:** Return both messages to the client

## Implementation Details

### Service Layer Changes

- **ChatMessageService:** Updated to gather context and call AI
- **Document Repository:** Used to fetch project documents
- **Chat Message Repository:** Enhanced with method to get latest messages

### New Repository Method

```go
func (r *chatMessageRepository) GetLatestMessagesByProjectIDAndUserID(projectID, userID string, limit int) ([]models.ChatMessage, error) {
    var chatMessages []models.ChatMessage
    err := r.db.Where("project_id = ? AND user_id = ?", projectID, userID).
        Order("created_at DESC").
        Limit(limit).
        Find(&chatMessages).Error
    return chatMessages, err
}
```

### AI Service Integration

The AI service now receives:

- Current user message
- Project documents (files)
- Chat history (last 5 messages)
- Project ID for context

## Use Cases

1. **Contextual Responses:** AI can reference previous conversations
2. **Document-Aware:** AI has access to project documents
3. **Conversation Continuity:** Maintains conversation flow
4. **Project-Specific:** Responses are tailored to the specific project

## Testing

Use the provided test script:

```bash
./test_chat_message.sh
```

This script tests:

- Creating chat messages
- Retrieving chat messages by project
- Retrieving chat messages by project and user
- Verifying AI integration

## Error Handling

- **Missing Project ID:** Returns 400 Bad Request
- **Missing User ID:** Returns 400 Bad Request
- **Missing Message:** Returns 400 Bad Request
- **AI Service Error:** Returns 500 Internal Server Error
- **Database Error:** Returns 500 Internal Server Error

## Performance Considerations

- **Message Limit:** Only last 5 messages are sent to AI to limit context size
- **Document Loading:** All project documents are loaded (consider pagination for large projects)
- **Caching:** Consider caching document URLs and chat history for better performance

# Router Structure Documentation

## Overview

Cấu trúc router đã được cập nhật theo pattern chuẩn với các file `enter.go` và `route.go` trong folder `initialize`.

## Directory Structure

```
backend/internal/routers/
├── enter.go                    # Main router group entry
├── user/
│   ├── enter.go               # User router group
│   └── user.router.go         # User routes
├── project/
│   ├── enter.go               # Project router group
│   └── project.router.go      # Project routes
├── question_pack/
│   ├── enter.go               # QuestionPack router group
│   └── question_pack.router.go # QuestionPack routes
├── question/
│   ├── enter.go               # Question router group
│   └── question.router.go     # Question routes
├── answer/
│   ├── enter.go               # Answer router group
│   └── answer.router.go       # Answer routes
├── response/
│   ├── enter.go               # Response router group
│   └── response.router.go     # Response routes
├── flash_card/
│   ├── enter.go               # FlashCard router group
│   └── flash_card.router.go   # FlashCard routes
├── chat_message/
│   ├── enter.go               # ChatMessage router group
│   └── chat_message.router.go # ChatMessage routes
└── document/
    ├── enter.go               # Document router group
    └── document.router.go     # Document routes
```

## File Descriptions

### 1. Main Router Entry (`internal/routers/enter.go`)

```go
type RouterGroup struct {
    User         user.UserRouterGroup
    Project      project.ProjectRouterGroup
    QuestionPack question_pack.QuestionPackRouterGroup
    Question     question.QuestionRouterGroup
    Answer       answer.AnswerRouterGroup
    Response     response.ResponseRouterGroup
    FlashCard    flash_card.FlashCardRouterGroup
    ChatMessage  chat_message.ChatMessageRouterGroup
    Document     document.DocumentRouterGroup
}
```

### 2. Individual Router Groups

Mỗi router có file `enter.go` riêng:

```go
// Example: project/enter.go
package project

type ProjectRouterGroup struct {
    ProjectRouter
}
```

### 3. Router Implementation

Mỗi router có file `.router.go` riêng với method `Init*Router`:

```go
// Example: project/project.router.go
func (pr *ProjectRouter) InitProjectRouter(Router *gin.RouterGroup) {
    // Route definitions
}
```

### 4. Initialize Router (`internal/initialize/router.go`)

File này khởi tạo tất cả routers:

```go
func InitRouter() *gin.Engine {
    // Initialize router groups
    userRouter := routers.RouterGroupApp.User
    projectRouter := routers.RouterGroupApp.Project
    // ... other routers

    MainGroup := r.Group("/api/v1")
    {
        // Initialize all routers
        userRouter.InitUserRouter(MainGroup)
        projectRouter.InitProjectRouter(MainGroup)
        // ... other routers
    }
}
```

## API Endpoints

### Base URL: `/api/v1`

#### User APIs

- `POST /api/v1/user/` - Create user
- `GET /api/v1/user/` - Get all users
- `GET /api/v1/user/:id` - Get user by ID
- `PUT /api/v1/user/:id` - Update user
- `DELETE /api/v1/user/:id` - Delete user

#### Project APIs

- `POST /api/v1/project/` - Create project with PDF upload
- `GET /api/v1/project/` - Get all projects
- `GET /api/v1/project/:id` - Get project by ID
- `GET /api/v1/project/account/:accountId` - Get projects by account ID
- `PUT /api/v1/project/:id` - Update project
- `DELETE /api/v1/project/:id` - Delete project

#### QuestionPack APIs

- `POST /api/v1/question-pack/` - Create question pack
- `GET /api/v1/question-pack/:id` - Get question pack by ID
- `GET /api/v1/question-pack/project/:projectId` - Get question packs by project ID
- `PUT /api/v1/question-pack/:id` - Update question pack
- `DELETE /api/v1/question-pack/:id` - Delete question pack

#### Question APIs

- `POST /api/v1/question/` - Create question
- `GET /api/v1/question/:id` - Get question by ID
- `GET /api/v1/question/pack/:packId` - Get questions by pack ID
- `PUT /api/v1/question/:id` - Update question
- `DELETE /api/v1/question/:id` - Delete question

#### Answer APIs

- `POST /api/v1/answer/` - Create answer
- `GET /api/v1/answer/:id` - Get answer by ID
- `GET /api/v1/answer/question/:questionId` - Get answers by question ID
- `PUT /api/v1/answer/:id` - Update answer
- `DELETE /api/v1/answer/:id` - Delete answer

#### Response APIs

- `POST /api/v1/response/` - Create response
- `GET /api/v1/response/:id` - Get response by ID
- `GET /api/v1/response/question/:questionId` - Get responses by question ID
- `PUT /api/v1/response/:id` - Update response
- `DELETE /api/v1/response/:id` - Delete response

#### FlashCard APIs

- `POST /api/v1/flash-card/` - Create flash card
- `GET /api/v1/flash-card/:id` - Get flash card by ID
- `GET /api/v1/flash-card/project/:projectId` - Get flash cards by project ID
- `PUT /api/v1/flash-card/:id` - Update flash card
- `DELETE /api/v1/flash-card/:id` - Delete flash card

#### ChatMessage APIs

- `POST /api/v1/chat-message/` - Create chat message
- `GET /api/v1/chat-message/:id` - Get chat message by ID
- `GET /api/v1/chat-message/project/:projectId` - Get chat messages by project ID
- `PUT /api/v1/chat-message/:id` - Update chat message
- `DELETE /api/v1/chat-message/:id` - Delete chat message

#### Document APIs

- `POST /api/v1/document/` - Create document
- `GET /api/v1/document/:id` - Get document by ID
- `GET /api/v1/document/project/:projectId` - Get documents by project ID
- `PUT /api/v1/document/:id` - Update document
- `DELETE /api/v1/document/:id` - Delete document

## Benefits of This Structure

1. **Modularity**: Mỗi router được tách biệt và có thể maintain độc lập
2. **Scalability**: Dễ dàng thêm router mới
3. **Consistency**: Tất cả routers follow cùng pattern
4. **Clean Architecture**: Tách biệt rõ ràng giữa routing và business logic
5. **Dependency Injection**: Sử dụng DI pattern cho services và repositories

## Adding New Router

Để thêm router mới:

1. Tạo folder mới trong `internal/routers/`
2. Tạo `enter.go` với router group struct
3. Tạo `.router.go` với route definitions
4. Thêm vào `internal/routers/enter.go`
5. Thêm vào `internal/initialize/router.go`

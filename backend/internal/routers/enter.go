package routers

import (
	"github.com/RustPyGo/hackathon-education-system/backend/internal/routers/answer"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/routers/chat_message"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/routers/document"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/routers/project"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/routers/question"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/routers/response"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/routers/user"
)

type RouterGroup struct {
	User        user.UserRouterGroup
	Project     project.ProjectRouterGroup
	Question    question.QuestionRouterGroup
	Answer      answer.AnswerRouterGroup
	Response    response.ResponseRouterGroup
	ChatMessage chat_message.ChatMessageRouterGroup
	Document    document.DocumentRouterGroup
}

var RouterGroupApp = new(RouterGroup)

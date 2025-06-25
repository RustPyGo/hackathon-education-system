package routers

import "github.com/fpt-ai-innovation-hackathon/education-system/backend/internal/routers/user"

type RouterGroup struct {
	User user.UserRouterGroup
}

var RouterGroupApp = new(RouterGroup)

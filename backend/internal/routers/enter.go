package routers

import "github.com/RustPyGo/hackathon-education-system/backend/internal/routers/user"

type RouterGroup struct {
	User user.UserRouterGroup
}

var RouterGroupApp = new(RouterGroup)

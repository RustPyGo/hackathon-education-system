package user

import (
	"github.com/fpt-ai-innovation-hackathon/education-system/backend/internal/controllers"
	"github.com/fpt-ai-innovation-hackathon/education-system/backend/internal/repositories"
	"github.com/fpt-ai-innovation-hackathon/education-system/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type UserRouter struct {
}

func (pr *UserRouter) InitUserRouter(Router *gin.RouterGroup) {

	ur := repositories.NewUserRepository()
	us := services.NewUserService(ur)
	uc := controllers.NewUserController(us)

	userPublicRouter := Router.Group("/user")
	{
		userPublicRouter.POST("/register", uc.Register)
	}
}

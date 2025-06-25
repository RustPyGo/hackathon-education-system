package controllers

import (
	"github.com/fpt-ai-innovation-hackathon/education-system/backend/internal/services"
	"github.com/fpt-ai-innovation-hackathon/education-system/backend/pkg/response"
	"github.com/gin-gonic/gin"
)

type UserController struct {
	userService services.IUserService
}

func NewUserController(userService services.IUserService) *UserController {
	return &UserController{
		userService: userService,
	}
}

func (uc *UserController) Register(c *gin.Context) {
	resp := uc.userService.Register()
	response.SuccessResponse(c, 20001, resp)
}

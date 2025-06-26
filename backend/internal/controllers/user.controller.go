package controllers

import (
	"strconv"

	"github.com/fpt-ai-innovation-hackathon/education-system/backend/internal/models"
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

type RegisterRequest struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

func (uc *UserController) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ErrorResponse(c, response.ErrorCodeParamInvalid)
		return
	}

	user := &models.User{
		Name:     req.Name,
		Email:    req.Email,
		Password: req.Password,
		Role:     "user",
	}

	code, err := uc.userService.Register(user)
	if err != nil {
		response.ErrorResponse(c, code)
		return
	}

	response.SuccessResponse(c, code, gin.H{
		"user": gin.H{
			"id":    user.ID,
			"name":  user.Name,
			"email": user.Email,
			"role":  user.Role,
		},
	})
}

func (uc *UserController) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ErrorResponse(c, response.ErrorCodeParamInvalid)
		return
	}

	user, code, err := uc.userService.ValidatePassword(req.Email, req.Password)
	if err != nil {
		response.ErrorResponse(c, code)
		return
	}

	response.SuccessResponse(c, code, gin.H{
		"user": gin.H{
			"id":    user.ID,
			"name":  user.Name,
			"email": user.Email,
			"role":  user.Role,
		},
	})
}

func (uc *UserController) GetProfile(c *gin.Context) {
	// TODO: Get user ID from JWT token
	userIDStr := c.Query("user_id")
	if userIDStr == "" {
		response.ErrorResponse(c, response.ErrorCodeParamInvalid)
		return
	}

	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		response.ErrorResponse(c, response.ErrorCodeParamInvalid)
		return
	}

	user, code, err := uc.userService.GetByID(uint(userID))
	if err != nil {
		response.ErrorResponse(c, code)
		return
	}

	response.SuccessResponse(c, code, gin.H{
		"user": gin.H{
			"id":    user.ID,
			"name":  user.Name,
			"email": user.Email,
			"role":  user.Role,
		},
	})
}

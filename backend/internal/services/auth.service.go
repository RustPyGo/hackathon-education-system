package services

import (
	"github.com/fpt-ai-innovation-hackathon/education-system/backend/internal/repositories"
)

type IAuthService interface {
	SendOTP(email string) bool
	VerifyOTP(email, otp string) bool
}

type AuthService struct {
	userRepo    repositories.IUserRepository
	userService IUserService
}

func NewAuthService() IAuthService {
	return &AuthService{}
}

func (as *AuthService) SendOTP(email string) bool {

	return true
}

func (as *AuthService) VerifyOTP(email, otp string) bool {
	return true
}

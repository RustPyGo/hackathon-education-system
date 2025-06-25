package services

import (
	"github.com/fpt-ai-innovation-hackathon/education-system/backend/internal/repositories"
	"github.com/fpt-ai-innovation-hackathon/education-system/backend/pkg/response"
)

type IUserService interface {
	Register() int
}

type UserService struct {
	userRepo repositories.IUserRepository
}

func NewUserService(userRepo repositories.IUserRepository) IUserService {
	return &UserService{
		userRepo: userRepo,
	}
}

func (us *UserService) Register() int {
	// Check user exists
	if us.userRepo.GetUserByEmail("") {
		return response.ErrorCodeUserExists
	}
	return response.ErrorCodeSuccess
}

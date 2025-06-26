package services

import (
	"errors"
	"time"

	"github.com/fpt-ai-innovation-hackathon/education-system/backend/internal/models"
	"github.com/fpt-ai-innovation-hackathon/education-system/backend/internal/repositories"
	"github.com/fpt-ai-innovation-hackathon/education-system/backend/pkg/response"
	"golang.org/x/crypto/bcrypt"
)

type IUserService interface {
	Register(userData *models.User) (int, error)
	GetByID(id uint) (*models.User, int, error)
	GetByEmail(email string) (*models.User, int, error)
	Update(user *models.User) (int, error)
	Delete(id uint) (int, error)
	ValidatePassword(email, password string) (*models.User, int, error)
}

type UserService struct {
	userRepo repositories.IUserRepository
}

func NewUserService(userRepo repositories.IUserRepository) IUserService {
	return &UserService{
		userRepo: userRepo,
	}
}

func (us *UserService) Register(userData *models.User) (int, error) {
	// Check if user exists
	existingUser, _ := us.userRepo.GetByEmail(userData.Email)
	if existingUser != nil {
		return response.ErrorCodeUserExists, errors.New("user already exists")
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(userData.Password), bcrypt.DefaultCost)
	if err != nil {
		return response.ErrorCodeParamInvalid, err
	}
	userData.Password = string(hashedPassword)

	// Set default role if not provided
	if userData.Role == "" {
		userData.Role = "user"
	}

	// Create user
	err = us.userRepo.Create(userData)
	if err != nil {
		return response.ErrorCodeParamInvalid, err
	}

	return response.ErrorCodeSuccess, nil
}

func (us *UserService) GetByID(id uint) (*models.User, int, error) {
	user, err := us.userRepo.GetByID(id)
	if err != nil {
		return nil, response.ErrorCodeParamInvalid, err
	}
	return user, response.ErrorCodeSuccess, nil
}

func (us *UserService) GetByEmail(email string) (*models.User, int, error) {
	user, err := us.userRepo.GetByEmail(email)
	if err != nil {
		return nil, response.ErrorCodeParamInvalid, err
	}
	return user, response.ErrorCodeSuccess, nil
}

func (us *UserService) Update(user *models.User) (int, error) {
	err := us.userRepo.Update(user)
	if err != nil {
		return response.ErrorCodeParamInvalid, err
	}
	return response.ErrorCodeSuccess, nil
}

func (us *UserService) Delete(id uint) (int, error) {
	err := us.userRepo.Delete(id)
	if err != nil {
		return response.ErrorCodeParamInvalid, err
	}
	return response.ErrorCodeSuccess, nil
}

func (us *UserService) ValidatePassword(email, password string) (*models.User, int, error) {
	user, err := us.userRepo.GetByEmail(email)
	if err != nil {
		return nil, response.ErrorCodeParamInvalid, errors.New("invalid credentials")
	}

	// Compare password
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return nil, response.ErrorCodeParamInvalid, errors.New("invalid credentials")
	}

	// Update last login time
	now := time.Now()
	user.LastLoginAt = &now
	us.userRepo.Update(user)

	return user, response.ErrorCodeSuccess, nil
}

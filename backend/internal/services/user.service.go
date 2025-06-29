package services

import (
	"github.com/RustPyGo/hackathon-education-system/backend/internal/models"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/repositories"
)

type IUserService interface {
	CreateUser(user *models.User) error
	GetUserByID(id uint) (*models.User, error)
	GetUserByEmail(email string) (*models.User, error)
	GetAllUsers() ([]models.User, error)
	UpdateUser(user *models.User) error
	DeleteUser(id uint) error
	CheckUserExists(email string) bool
}

type UserService struct {
	userRepo repositories.IUserRepository
}

func NewUserService(userRepo repositories.IUserRepository) IUserService {
	return &UserService{
		userRepo: userRepo,
	}
}

func (us *UserService) CreateUser(user *models.User) error {
	return us.userRepo.Create(user)
}

func (us *UserService) GetUserByID(id uint) (*models.User, error) {
	return us.userRepo.GetByID(id)
}

func (us *UserService) GetUserByEmail(email string) (*models.User, error) {
	return us.userRepo.GetByEmail(email)
}

func (us *UserService) GetAllUsers() ([]models.User, error) {
	return us.userRepo.GetAll()
}

func (us *UserService) UpdateUser(user *models.User) error {
	return us.userRepo.Update(user)
}

func (us *UserService) DeleteUser(id uint) error {
	return us.userRepo.Delete(id)
}

func (us *UserService) CheckUserExists(email string) bool {
	_, err := us.userRepo.GetByEmail(email)
	return err == nil
}

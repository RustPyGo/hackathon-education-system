package repositories

import (
	"github.com/fpt-ai-innovation-hackathon/education-system/backend/global"
	"github.com/fpt-ai-innovation-hackathon/education-system/backend/internal/models"
)

type IUserRepository interface {
	Create(user *models.User) error
	GetByID(id uint) (*models.User, error)
	GetByEmail(email string) (*models.User, error)
	Update(user *models.User) error
	Delete(id uint) error
	List(offset, limit int) ([]models.User, error)
}

type userRepository struct{}

func NewUserRepository() IUserRepository {
	return &userRepository{}
}

func (r *userRepository) Create(user *models.User) error {
	return global.DB.Create(user).Error
}

func (r *userRepository) GetByID(id uint) (*models.User, error) {
	var user models.User
	err := global.DB.First(&user, id).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) GetByEmail(email string) (*models.User, error) {
	var user models.User
	err := global.DB.Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) Update(user *models.User) error {
	return global.DB.Save(user).Error
}

func (r *userRepository) Delete(id uint) error {
	return global.DB.Delete(&models.User{}, id).Error
}

func (r *userRepository) List(offset, limit int) ([]models.User, error) {
	var users []models.User
	err := global.DB.Offset(offset).Limit(limit).Find(&users).Error
	return users, err
}

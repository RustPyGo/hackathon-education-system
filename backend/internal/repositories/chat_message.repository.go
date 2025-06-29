package repositories

import (
	"github.com/RustPyGo/hackathon-education-system/backend/global"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/models"
	"gorm.io/gorm"
)

type IChatMessageRepository interface {
	Create(chatMessage *models.ChatMessage) error
	GetByID(id string) (*models.ChatMessage, error)
	GetByProjectID(projectID string) ([]models.ChatMessage, error)
	Update(chatMessage *models.ChatMessage) error
	GetByProjectIDAndUserID(projectID, userID string) ([]models.ChatMessage, error)
	GetLatestMessagesByProjectIDAndUserID(projectID, userID string, limit int) ([]models.ChatMessage, error)
	Delete(id string) error
}

type chatMessageRepository struct {
	db *gorm.DB
}

func NewChatMessageRepository() IChatMessageRepository {
	return &chatMessageRepository{
		db: global.DB,
	}
}

func (r *chatMessageRepository) GetByProjectIDAndUserID(projectID, userID string) ([]models.ChatMessage, error) {
	var chatMessages []models.ChatMessage
	err := r.db.Where("project_id = ? AND user_id = ?", projectID, userID).Find(&chatMessages).Error
	return chatMessages, err
}

func (r *chatMessageRepository) GetLatestMessagesByProjectIDAndUserID(projectID, userID string, limit int) ([]models.ChatMessage, error) {
	var chatMessages []models.ChatMessage
	err := r.db.Where("project_id = ? AND user_id = ?", projectID, userID).
		Order("created_at DESC").
		Limit(limit).
		Find(&chatMessages).Error
	return chatMessages, err
}

func (r *chatMessageRepository) Create(chatMessage *models.ChatMessage) error {
	return r.db.Create(chatMessage).Error
}

func (r *chatMessageRepository) GetByID(id string) (*models.ChatMessage, error) {
	var chatMessage models.ChatMessage
	err := r.db.First(&chatMessage, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &chatMessage, nil
}

func (r *chatMessageRepository) GetByProjectID(projectID string) ([]models.ChatMessage, error) {
	var chatMessages []models.ChatMessage
	err := r.db.Where("project_id = ?", projectID).Find(&chatMessages).Error
	return chatMessages, err
}

func (r *chatMessageRepository) Update(chatMessage *models.ChatMessage) error {
	return r.db.Save(chatMessage).Error
}

func (r *chatMessageRepository) Delete(id string) error {
	return r.db.Delete(&models.ChatMessage{}, "id = ?", id).Error
}

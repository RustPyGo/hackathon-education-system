package models

import (
	"time"

	"gorm.io/gorm"
)

type ChatMessage struct {
	ID        string         `json:"id" gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
	ProjectID string         `json:"project_id" gorm:"type:uuid;not null"`
	UserID    string         `json:"user_id" gorm:"type:text;not null"`
	Sender    string         `json:"sender" gorm:"type:varchar(10);not null;check:sender IN ('bot', 'user')"`
	Message   string         `json:"message" gorm:"type:text;not null"`
	CreatedAt time.Time      `json:"created_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	// Relationships (removed Project to avoid circular reference)
}

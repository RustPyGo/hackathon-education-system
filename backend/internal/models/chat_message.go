package models

import (
	"time"

	"gorm.io/gorm"
)

type ChatMessage struct {
	ID        string         `json:"id" gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
	ProjectID string         `json:"project_id" gorm:"type:uuid;not null"`
	Role      string         `json:"role" gorm:"type:varchar(10);not null;check:role IN ('bot', 'user')"`
	Content   string         `json:"content" gorm:"type:text;not null"`
	CreatedAt time.Time      `json:"created_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	// Relationships
	Project Project `json:"project,omitempty" gorm:"foreignKey:ProjectID"`
}

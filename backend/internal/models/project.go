package models

import (
	"time"

	"gorm.io/gorm"
)

type Project struct {
	ID           string         `json:"id" gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
	UserID       string         `json:"user_id" gorm:"type:text;not null"`
	Summary      string         `json:"summary" gorm:"type:text"`
	ExamDuration int            `json:"exam_duration" gorm:"type:int;not null"`
	Name         string         `json:"name" gorm:"type:text;not null"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `json:"-" gorm:"index"`
	// Relationships
	Questions    []Question    `json:"questions,omitempty" gorm:"foreignKey:ProjectID"`
	ChatMessages []ChatMessage `json:"chat_messages,omitempty" gorm:"foreignKey:ProjectID"`
	Documents    []Document    `json:"documents,omitempty" gorm:"foreignKey:ProjectID"`
}

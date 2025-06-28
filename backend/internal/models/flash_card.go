package models

import (
	"time"

	"gorm.io/gorm"
)

type FlashCard struct {
	ID        string         `json:"id" gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
	ProjectID string         `json:"project_id" gorm:"type:uuid;not null"`
	Question  string         `json:"question" gorm:"type:text;not null"`
	Answer    string         `json:"answer" gorm:"type:text;not null"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	// Relationships
	Project Project `json:"project,omitempty" gorm:"foreignKey:ProjectID"`
}

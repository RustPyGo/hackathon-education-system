package models

import (
	"time"

	"gorm.io/gorm"
)

type QuestionPack struct {
	ID        string         `json:"id" gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
	ProjectID string         `json:"project_id" gorm:"type:uuid;not null"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	// Relationships
	Project   Project    `json:"project,omitempty" gorm:"foreignKey:ProjectID"`
	Questions []Question `json:"questions,omitempty" gorm:"foreignKey:PackID"`
	Responses []Response `json:"responses,omitempty" gorm:"foreignKey:PackID"`
}

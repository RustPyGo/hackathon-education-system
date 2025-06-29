package models

import (
	"time"

	"gorm.io/gorm"
)

type Response struct {
	ID        string         `json:"id" gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
	ProjectID string         `json:"project_id" gorm:"type:uuid;not null"`
	UserID    string         `json:"user_id" gorm:"type:text;not null"`
	Score     int            `json:"score" gorm:"type:int;not null"`
	TimeTaken int            `json:"time_taken" gorm:"type:int;not null"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	// Relationships
	Project Project  `json:"project,omitempty" gorm:"foreignKey:ProjectID"`
	Answers []Answer `json:"answers,omitempty" gorm:"foreignKey:ResponseID"`
}

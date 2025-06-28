package models

import (
	"time"

	"gorm.io/gorm"
)

type Answer struct {
	ID         string         `json:"id" gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
	ResponseID string         `json:"response_id" gorm:"type:uuid;not null"`
	QuestionID string         `json:"question_id" gorm:"type:uuid;not null"`
	Answer     string         `json:"answer" gorm:"type:text;not null"`
	TimeSpent  int            `json:"time_spent" gorm:"not null"` // in seconds
	Analytics  *string        `json:"analytics" gorm:"type:text"` // JSON data for additional analytics
	CreatedAt  time.Time      `json:"created_at"`
	DeletedAt  gorm.DeletedAt `json:"-" gorm:"index"`

	// Relationships
	Response Response `json:"response,omitempty" gorm:"foreignKey:ResponseID"`
	Question Question `json:"question,omitempty" gorm:"foreignKey:QuestionID"`
}

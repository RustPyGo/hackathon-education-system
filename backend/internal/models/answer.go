package models

import (
	"time"

	"gorm.io/gorm"
)

type Answer struct {
	ID         string         `json:"id" gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
	ResponseID string         `json:"response_id" gorm:"type:uuid;not null"`
	QuestionID string         `json:"question_id" gorm:"type:uuid;not null"`
	ChoiceID   string         `json:"choice_id" gorm:"type:uuid;not null"`
	CreatedAt  time.Time      `json:"created_at"`
	DeletedAt  gorm.DeletedAt `json:"-" gorm:"index"`

	// Relationships
	Response Response       `json:"response,omitempty" gorm:"foreignKey:ResponseID"`
	Question Question       `json:"question,omitempty" gorm:"foreignKey:QuestionID"`
	Choice   QuestionChoice `json:"choice,omitempty" gorm:"foreignKey:ChoiceID"`
}

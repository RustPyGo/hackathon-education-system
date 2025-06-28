package models

import (
	"time"

	"gorm.io/gorm"
)

type Question struct {
	ID              string         `json:"id" gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
	PackID          string         `json:"pack_id" gorm:"type:uuid;not null"`
	Question        string         `json:"question" gorm:"type:text;not null"`
	CorrectAnswer   string         `json:"correct_answer" gorm:"type:text;not null"`
	Answers         []string       `json:"answers" gorm:"type:text[];not null"`
	DifficultyLevel int            `json:"difficulty_level" gorm:"not null;check:difficulty_level >= 1 AND difficulty_level <= 5"`
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
	DeletedAt       gorm.DeletedAt `json:"-" gorm:"index"`

	// Relationships
	Pack        QuestionPack `json:"pack,omitempty" gorm:"foreignKey:PackID"`
	UserAnswers []Answer     `json:"user_answers,omitempty" gorm:"foreignKey:QuestionID"`
}

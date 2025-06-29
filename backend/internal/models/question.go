package models

import (
	"time"

	"gorm.io/gorm"
)

type Question struct {
	ID              string         `json:"id" gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
	ProjectID       string         `json:"project_id" gorm:"type:uuid;not null"`
	Question        string         `json:"question" gorm:"type:text;not null"`
	AnswerCorrect   string         `json:"answer_correct" gorm:"type:text;not null"`
	DifficultyLevel int            `json:"difficulty_level" gorm:"not null;check:difficulty_level >= 1 AND difficulty_level <= 5"`
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
	DeletedAt       gorm.DeletedAt `json:"-" gorm:"index"`

	// Relationships
	Project Project  `json:"project,omitempty" gorm:"foreignKey:ProjectID"`
	Answers []Answer `json:"answers,omitempty" gorm:"foreignKey:QuestionID"`
}

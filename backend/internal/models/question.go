package models

import (
	"time"

	"gorm.io/gorm"
)

type Question struct {
	ID          string         `json:"id" gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
	ProjectID   string         `json:"project_id" gorm:"type:uuid;not null"`
	Content     string         `json:"content" gorm:"type:text;not null"`
	Type        string         `json:"type" gorm:"type:varchar(20);not null;check:type IN ('multiple_choice', 'true_false', 'essay')"`
	Difficulty  string         `json:"difficulty" gorm:"type:varchar(20);not null;check:difficulty IN ('easy', 'medium', 'hard')"`
	Explanation string         `json:"explanation" gorm:"type:text"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`

	// Relationships
	Project Project          `json:"project,omitempty" gorm:"foreignKey:ProjectID"`
	Choices []QuestionChoice `json:"choices,omitempty" gorm:"foreignKey:QuestionID"`
	Answers []Answer         `json:"answers,omitempty" gorm:"foreignKey:QuestionID"`
}

package models

import (
	"time"

	"gorm.io/gorm"
)

type QuestionChoice struct {
	ID          string         `json:"id" gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
	QuestionID  string         `json:"question_id" gorm:"type:uuid;not null"`
	Content     string         `json:"content" gorm:"type:text;not null"`
	IsCorrect   bool           `json:"is_correct" gorm:"type:boolean;not null;default:false"`
	Explanation string         `json:"explanation" gorm:"type:text"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}

package models

import (
	"time"

	"gorm.io/gorm"
)

type Response struct {
	ID        string         `json:"id" gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
	PackID    string         `json:"pack_id" gorm:"type:uuid;not null"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	// Relationships
	Pack    QuestionPack `json:"pack,omitempty" gorm:"foreignKey:PackID"`
	Answers []Answer     `json:"answers,omitempty" gorm:"foreignKey:ResponseID"`
}

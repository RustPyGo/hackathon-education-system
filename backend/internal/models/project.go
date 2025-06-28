package models

import (
	"time"

	"gorm.io/gorm"
)

type Project struct {
	ID        string         `json:"id" gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
	AccountID string         `json:"account_id" gorm:"type:text;not null"`
	Overview  string         `json:"overview" gorm:"type:text"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	// Relationships
	QuestionPacks []QuestionPack `json:"question_packs,omitempty" gorm:"foreignKey:ProjectID"`
	FlashCards    []FlashCard    `json:"flash_cards,omitempty" gorm:"foreignKey:ProjectID"`
	ChatMessages  []ChatMessage  `json:"chat_messages,omitempty" gorm:"foreignKey:ProjectID"`
	Documents     []Document     `json:"documents,omitempty" gorm:"foreignKey:ProjectID"`
}

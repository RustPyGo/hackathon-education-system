package models

import (
	"time"

	"gorm.io/gorm"
)

type Document struct {
	ID        string         `json:"id" gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
	ProjectID string         `json:"project_id" gorm:"type:uuid;not null"`
	AWSKey    string         `json:"aws_key" gorm:"type:text;not null"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

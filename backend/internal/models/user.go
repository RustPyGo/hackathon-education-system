package models

import (
	"time"
)

type User struct {
	BaseModel
	Name            string     `json:"name" gorm:"size:255;not null"`
	Email           string     `json:"email" gorm:"size:255;uniqueIndex;not null"`
	Password        string     `json:"-" gorm:"size:255;not null"`
	Avatar          string     `json:"avatar" gorm:"size:500"`
	Role            string     `json:"role" gorm:"size:50;default:'user'"`
	IsEmailVerified bool       `json:"is_email_verified" gorm:"default:false"`
	LastLoginAt     *time.Time `json:"last_login_at"`
}

func (User) TableName() string {
	return "users"
}

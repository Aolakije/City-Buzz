package models

import (
	"time"

	"github.com/google/uuid"
)

// User represents a user in the system
type User struct {
	ID            uuid.UUID  `json:"id" db:"id"`
	Email         *string    `json:"email,omitempty" db:"email"`
	Phone         *string    `json:"phone,omitempty" db:"phone"`
	Username      string     `json:"username" db:"username"`
	PasswordHash  string     `json:"-" db:"password_hash"` // Never send to client
	FirstName     string     `json:"first_name" db:"first_name"`
	LastName      string     `json:"last_name" db:"last_name"`
	Gender        *string    `json:"gender,omitempty" db:"gender"`
	DateOfBirth   time.Time  `json:"date_of_birth" db:"date_of_birth"`
	Bio           *string    `json:"bio,omitempty" db:"bio"`
	AvatarURL     *string    `json:"avatar_url,omitempty" db:"avatar_url"`
	Language      string     `json:"language" db:"language"`
	ConfirmMethod *string    `json:"confirm_method,omitempty" db:"confirm_method"`
	CreatedAt     time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt     time.Time  `json:"updated_at" db:"updated_at"`
	LastLogin     *time.Time `json:"last_login,omitempty" db:"last_login"`
	IsActive      bool       `json:"is_active" db:"is_active"`
	EmailVerified bool       `json:"email_verified" db:"email_verified"`
	PhoneVerified bool       `json:"phone_verified" db:"phone_verified"`
}

// RegisterRequest represents user registration input
type RegisterRequest struct {
	Email         *string `json:"email" validate:"omitempty,email"`
	Phone         *string `json:"phone" validate:"omitempty"`
	Username      string  `json:"username" validate:"required,min=3,max=20"`
	Password      string  `json:"password" validate:"required,min=8"`
	FirstName     string  `json:"first_name" validate:"required,min=1,max=100"`
	LastName      string  `json:"last_name" validate:"required,min=1,max=100"`
	Gender        *string `json:"gender" validate:"omitempty,oneof=male female other"`
	DateOfBirth   string  `json:"date_of_birth" validate:"required"`
	ConfirmMethod *string `json:"confirm_method" validate:"omitempty,oneof=email phone"`
}

// LoginRequest represents user login input
type LoginRequest struct {
	Identifier string `json:"identifier" validate:"required"` // Email, phone, or username
	Password   string `json:"password" validate:"required"`
}

// UserResponse is the safe user data sent to client
type UserResponse struct {
	ID          uuid.UUID  `json:"id"`
	Email       *string    `json:"email,omitempty"`
	Phone       *string    `json:"phone,omitempty"`
	Username    string     `json:"username"`
	FirstName   string     `json:"first_name"`
	LastName    string     `json:"last_name"`
	Gender      *string    `json:"gender,omitempty"`
	DateOfBirth time.Time  `json:"date_of_birth"`
	Bio         *string    `json:"bio,omitempty"`
	AvatarURL   *string    `json:"avatar_url,omitempty"`
	Language    string     `json:"language"`
	CreatedAt   time.Time  `json:"created_at"`
	LastLogin   *time.Time `json:"last_login,omitempty"`
}

// ToResponse converts User to UserResponse (removes sensitive data)
func (u *User) ToResponse() *UserResponse {
	return &UserResponse{
		ID:          u.ID,
		Email:       u.Email,
		Phone:       u.Phone,
		Username:    u.Username,
		FirstName:   u.FirstName,
		LastName:    u.LastName,
		Gender:      u.Gender,
		DateOfBirth: u.DateOfBirth,
		Bio:         u.Bio,
		AvatarURL:   u.AvatarURL,
		Language:    u.Language,
		CreatedAt:   u.CreatedAt,
		LastLogin:   u.LastLogin,
	}
}

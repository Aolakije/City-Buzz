package models

import (
	"time"

	"github.com/google/uuid"
)

// Post represents a user post
type Post struct {
	ID            uuid.UUID `json:"id" db:"id"`
	UserID        uuid.UUID `json:"user_id" db:"user_id"`
	Content       string    `json:"content" db:"content"`
	LikesCount    int       `json:"likes_count" db:"likes_count"`
	CommentsCount int       `json:"comments_count" db:"comments_count"`
	CreatedAt     time.Time `json:"created_at" db:"created_at"`
	UpdatedAt     time.Time `json:"updated_at" db:"updated_at"`
	IsDeleted     bool      `json:"is_deleted" db:"is_deleted"`

	// Joined fields (not in DB)
	Author   *UserResponse `json:"author,omitempty" db:"-"`
	IsLiked  bool          `json:"is_liked" db:"-"`
	Comments []Comment     `json:"comments,omitempty" db:"-"`
}

// Comment represents a comment on a post
type Comment struct {
	ID         uuid.UUID `json:"id" db:"id"`
	PostID     uuid.UUID `json:"post_id" db:"post_id"`
	UserID     uuid.UUID `json:"user_id" db:"user_id"`
	Content    string    `json:"content" db:"content"`
	LikesCount int       `json:"likes_count" db:"likes_count"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
	UpdatedAt  time.Time `json:"updated_at" db:"updated_at"`
	IsDeleted  bool      `json:"is_deleted" db:"is_deleted"`

	// Joined fields
	Author  *UserResponse `json:"author,omitempty" db:"-"`
	IsLiked bool          `json:"is_liked" db:"-"`
}

// CreatePostRequest represents post creation input
type CreatePostRequest struct {
	Content string `json:"content" validate:"required,min=1,max=5000"`
}

// UpdatePostRequest represents post update input
type UpdatePostRequest struct {
	Content string `json:"content" validate:"required,min=1,max=5000"`
}

// CreateCommentRequest represents comment creation input
type CreateCommentRequest struct {
	Content string `json:"content" validate:"required,min=1,max=2000"`
}

// FeedQuery represents feed query parameters
type FeedQuery struct {
	Page  int `query:"page" validate:"min=1"`
	Limit int `query:"limit" validate:"min=1,max=50"`
}

// PostResponse represents a post with author info
type PostResponse struct {
	ID            uuid.UUID     `json:"id"`
	Content       string        `json:"content"`
	LikesCount    int           `json:"likes_count"`
	CommentsCount int           `json:"comments_count"`
	CreatedAt     time.Time     `json:"created_at"`
	UpdatedAt     time.Time     `json:"updated_at"`
	Author        *UserResponse `json:"author"`
	IsLiked       bool          `json:"is_liked"`
}

// CommentResponse represents a comment with author info
type CommentResponse struct {
	ID         uuid.UUID     `json:"id"`
	PostID     uuid.UUID     `json:"post_id"`
	Content    string        `json:"content"`
	LikesCount int           `json:"likes_count"`
	CreatedAt  time.Time     `json:"created_at"`
	Author     *UserResponse `json:"author"`
	IsLiked    bool          `json:"is_liked"`
}

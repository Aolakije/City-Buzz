package models

import (
	"time"

	"github.com/google/uuid"
)

// SavedArticle represents a user's saved news article
type SavedArticle struct {
	ID            uuid.UUID `json:"id" db:"id"`
	UserID        uuid.UUID `json:"user_id" db:"user_id"`
	ArticleURL    string    `json:"article_url" db:"article_url"`
	ArticleTitle  string    `json:"article_title" db:"article_title"`
	ArticleImage  string    `json:"article_image" db:"article_image"`
	ArticleSource string    `json:"article_source" db:"article_source"`
	SavedAt       time.Time `json:"saved_at" db:"saved_at"`
}

// NewsAPIResponse represents the response from NewsAPI
type NewsAPIResponse struct {
	Status       string    `json:"status"`
	TotalResults int       `json:"totalResults"`
	Articles     []Article `json:"articles"`
}

// Article represents a news article from the API
type Article struct {
	Source struct {
		ID   *string `json:"id"`
		Name string  `json:"name"`
	} `json:"source"`
	Author      *string   `json:"author"`
	Title       string    `json:"title"`
	Description *string   `json:"description"`
	URL         string    `json:"url"`
	URLToImage  *string   `json:"urlToImage"`
	PublishedAt time.Time `json:"publishedAt"`
	Content     *string   `json:"content"`
}

// SaveArticleRequest represents the request to save an article
type SaveArticleRequest struct {
	ArticleURL    string `json:"article_url" validate:"required,url"`
	ArticleTitle  string `json:"article_title" validate:"required"`
	ArticleImage  string `json:"article_image" validate:"required,url"`
	ArticleSource string `json:"article_source" validate:"required"`
}

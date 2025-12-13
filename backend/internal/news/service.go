package news

import (
	"context"
	"fmt"
	"time"

	"github.com/Aolakije/City-Buzz/internal/models"
	"github.com/Aolakije/City-Buzz/internal/news/adapters"
	"github.com/Aolakije/City-Buzz/pkg/config"
	"github.com/google/uuid"
)

// Service defines the business logic for news operations
type Service interface {
	GetTopHeadlines(ctx context.Context, category, country string, page, pageSize int) (*models.NewsAPIResponse, error)
	SearchNews(ctx context.Context, query, language, sortBy string, page, pageSize int) (*models.NewsAPIResponse, error)
	GetRouenNews(ctx context.Context, category, language string, page, pageSize int) (*models.NewsAPIResponse, error)
	GetNormandyNews(ctx context.Context, category, language string, page, pageSize int) (*models.NewsAPIResponse, error)
	GetFranceNews(ctx context.Context, category, language string, page, pageSize int) (*models.NewsAPIResponse, error)
	GetCityNews(ctx context.Context, city, category, language string, page, pageSize int) (*models.NewsAPIResponse, error)
	SaveArticle(ctx context.Context, userID uuid.UUID, req *models.SaveArticleRequest) (*models.SavedArticle, error)
	GetSavedArticles(ctx context.Context, userID uuid.UUID) ([]models.SavedArticle, error)
	DeleteSavedArticle(ctx context.Context, userID uuid.UUID, articleURL string) error
}

type service struct {
	repo     Repository
	provider adapters.NewsProvider // Uses adapters.NewsProvider now!
}

// NewService creates a new news service with the configured provider
func NewService(repo Repository, cfg *config.Config) (Service, error) {
	// Use the factory to create the appropriate provider
	provider, err := adapters.NewNewsProvider(cfg)
	if err != nil {
		return nil, fmt.Errorf("failed to create news provider: %w", err)
	}

	return &service{
		repo:     repo,
		provider: provider, // Now we use the provider interface!
	}, nil
}

// GetTopHeadlines fetches top headlines by category and country
// Now delegates to the provider instead of making direct API calls
func (s *service) GetTopHeadlines(ctx context.Context, category, country string, page, pageSize int) (*models.NewsAPIResponse, error) {
	return s.provider.GetTopHeadlines(ctx, category, country, page, pageSize)
}

// SearchNews searches for news articles
// Now delegates to the provider instead of making direct API calls
func (s *service) SearchNews(ctx context.Context, query, language, sortBy string, page, pageSize int) (*models.NewsAPIResponse, error) {
	return s.provider.SearchNews(ctx, query, language, sortBy, page, pageSize)
}

// GetRouenNews fetches Rouen news filtered by category
// Business logic stays in service, API calls delegated to provider
func (s *service) GetRouenNews(ctx context.Context, category, language string, page, pageSize int) (*models.NewsAPIResponse, error) {
	query := "Rouen"

	// Add category to query if specified and not general/all
	if category != "" && category != "general" {
		query = fmt.Sprintf("Rouen %s", category)
	}

	return s.provider.SearchNews(ctx, query, language, "publishedAt", page, pageSize)
}

// GetNormandyNews fetches Normandy region news filtered by category
// Business logic stays in service, API calls delegated to provider
func (s *service) GetNormandyNews(ctx context.Context, category, language string, page, pageSize int) (*models.NewsAPIResponse, error) {
	query := "Normandie OR Normandy"

	if category != "" && category != "general" {
		query = fmt.Sprintf("(Normandie OR Normandy) %s", category)
	}

	return s.provider.SearchNews(ctx, query, language, "publishedAt", page, pageSize)
}

// GetFranceNews fetches French national news by category
// Business logic stays in service, API calls delegated to provider
func (s *service) GetFranceNews(ctx context.Context, category, language string, page, pageSize int) (*models.NewsAPIResponse, error) {
	query := "France"

	if category != "" && category != "general" && category != "all" {
		query = fmt.Sprintf("France %s", category)
	}

	return s.provider.SearchNews(ctx, query, language, "publishedAt", page, pageSize)
}

// GetCityNews fetches news for any French city filtered by category
// Business logic stays in service, API calls delegated to provider
func (s *service) GetCityNews(ctx context.Context, city, category, language string, page, pageSize int) (*models.NewsAPIResponse, error) {
	query := city

	if category != "" && category != "general" {
		query = fmt.Sprintf("%s %s", city, category)
	}

	return s.provider.SearchNews(ctx, query, language, "publishedAt", page, pageSize)
}

// SaveArticle saves a news article for a user
// No changes - doesn't use news provider
func (s *service) SaveArticle(ctx context.Context, userID uuid.UUID, req *models.SaveArticleRequest) (*models.SavedArticle, error) {
	article := &models.SavedArticle{
		ID:            uuid.New(),
		UserID:        userID,
		ArticleURL:    req.ArticleURL,
		ArticleTitle:  req.ArticleTitle,
		ArticleImage:  req.ArticleImage,
		ArticleSource: req.ArticleSource,
		SavedAt:       time.Now(),
	}

	if err := s.repo.SaveArticle(ctx, article); err != nil {
		return nil, fmt.Errorf("failed to save article: %w", err)
	}

	return article, nil
}

// GetSavedArticles retrieves all saved articles for a user
// No changes - doesn't use news provider
func (s *service) GetSavedArticles(ctx context.Context, userID uuid.UUID) ([]models.SavedArticle, error) {
	articles, err := s.repo.GetSavedArticles(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get saved articles: %w", err)
	}
	return articles, nil
}

// DeleteSavedArticle removes a saved article
// No changes - doesn't use news provider
func (s *service) DeleteSavedArticle(ctx context.Context, userID uuid.UUID, articleURL string) error {
	if err := s.repo.DeleteSavedArticle(ctx, userID, articleURL); err != nil {
		return fmt.Errorf("failed to delete saved article: %w", err)
	}
	return nil
}

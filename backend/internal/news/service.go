package news

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"time"

	"github.com/Aolakije/City-Buzz/internal/models"
	"github.com/Aolakije/City-Buzz/pkg/config"
	"github.com/google/uuid"
)

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
	repo       Repository
	cfg        *config.Config
	httpClient *http.Client
	apiKey     string
}

func NewService(repo Repository, cfg *config.Config) Service {
	return &service{
		repo: repo,
		cfg:  cfg,
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
		apiKey: cfg.NewsAPI.APIKey,
	}
}

// GetTopHeadlines fetches top headlines by category and country
func (s *service) GetTopHeadlines(ctx context.Context, category, country string, page, pageSize int) (*models.NewsAPIResponse, error) {
	validCategories := map[string]bool{
		"business": true, "entertainment": true, "general": true,
		"health": true, "science": true, "sports": true, "technology": true,
	}

	if category != "" && !validCategories[category] {
		category = "general"
	}

	if country == "" {
		country = "fr"
	}

	if pageSize > 20 || pageSize < 1 {
		pageSize = 10
	}

	baseURL := "https://newsapi.org/v2/top-headlines"
	params := url.Values{}
	params.Add("apiKey", s.apiKey)

	if category != "" {
		params.Add("category", category)
	}

	params.Add("country", country)
	params.Add("page", strconv.Itoa(page))
	params.Add("pageSize", strconv.Itoa(pageSize))

	fullURL := fmt.Sprintf("%s?%s", baseURL, params.Encode())

	req, err := http.NewRequestWithContext(ctx, "GET", fullURL, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch news: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("newsapi returned status %d: %s", resp.StatusCode, string(body))
	}

	var newsResp models.NewsAPIResponse
	if err := json.NewDecoder(resp.Body).Decode(&newsResp); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	return &newsResp, nil
}

// SearchNews searches for news articles
func (s *service) SearchNews(ctx context.Context, query, language, sortBy string, page, pageSize int) (*models.NewsAPIResponse, error) {
	if query == "" {
		return nil, fmt.Errorf("search query is required")
	}

	if language == "" {
		language = "fr"
	}

	if pageSize > 20 || pageSize < 1 {
		pageSize = 10
	}

	validSortBy := map[string]bool{
		"relevancy": true, "popularity": true, "publishedAt": true,
	}
	if !validSortBy[sortBy] {
		sortBy = "publishedAt"
	}

	baseURL := "https://newsapi.org/v2/everything"
	params := url.Values{}
	params.Add("apiKey", s.apiKey)
	params.Add("q", query)
	params.Add("language", language)
	params.Add("sortBy", sortBy)
	params.Add("page", strconv.Itoa(page))
	params.Add("pageSize", strconv.Itoa(pageSize))

	fullURL := fmt.Sprintf("%s?%s", baseURL, params.Encode())

	req, err := http.NewRequestWithContext(ctx, "GET", fullURL, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to search news: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("newsapi returned status %d: %s", resp.StatusCode, string(body))
	}

	var newsResp models.NewsAPIResponse
	if err := json.NewDecoder(resp.Body).Decode(&newsResp); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	return &newsResp, nil
}

// GetRouenNews fetches Rouen news filtered by category
func (s *service) GetRouenNews(ctx context.Context, category, language string, page, pageSize int) (*models.NewsAPIResponse, error) {
	query := "Rouen"

	// Add category to query if specified
	if category != "" && category != "general" {
		query = fmt.Sprintf("Rouen %s", category)
	}

	return s.SearchNews(ctx, query, language, "publishedAt", page, pageSize)
}

// GetNormandyNews fetches Normandy region news filtered by category
func (s *service) GetNormandyNews(ctx context.Context, category, language string, page, pageSize int) (*models.NewsAPIResponse, error) {
	query := "Normandie OR Normandy"

	if category != "" && category != "general" {
		query = fmt.Sprintf("(Normandie OR Normandy) %s", category)
	}

	return s.SearchNews(ctx, query, language, "publishedAt", page, pageSize)
}

// GetFranceNews fetches French national news by category
func (s *service) GetFranceNews(ctx context.Context, category, language string, page, pageSize int) (*models.NewsAPIResponse, error) {
	if category == "" || category == "general" {
		return s.GetTopHeadlines(ctx, "", "fr", page, pageSize)
	}

	return s.GetTopHeadlines(ctx, category, "fr", page, pageSize)
}

// GetCityNews fetches news for any French city filtered by category
func (s *service) GetCityNews(ctx context.Context, city, category, language string, page, pageSize int) (*models.NewsAPIResponse, error) {
	query := city

	if category != "" && category != "general" {
		query = fmt.Sprintf("%s %s", city, category)
	}

	return s.SearchNews(ctx, query, language, "publishedAt", page, pageSize)
}

// SaveArticle saves a news article for a user
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
func (s *service) GetSavedArticles(ctx context.Context, userID uuid.UUID) ([]models.SavedArticle, error) {
	articles, err := s.repo.GetSavedArticles(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get saved articles: %w", err)
	}
	return articles, nil
}

// DeleteSavedArticle removes a saved article
func (s *service) DeleteSavedArticle(ctx context.Context, userID uuid.UUID, articleURL string) error {
	if err := s.repo.DeleteSavedArticle(ctx, userID, articleURL); err != nil {
		return fmt.Errorf("failed to delete saved article: %w", err)
	}
	return nil
}

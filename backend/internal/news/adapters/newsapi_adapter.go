package adapters

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
)

// NewsProvider is the interface that all news API providers must implement
// This allows us to easily switch between NewsAPI, NewsData, Google News, etc.
type NewsProvider interface {
	// GetTopHeadlines fetches top headlines by category and country
	GetTopHeadlines(ctx context.Context, category, country string, page, pageSize int) (*models.NewsAPIResponse, error)

	// SearchNews searches for news articles with a query
	SearchNews(ctx context.Context, query, language, sortBy string, page, pageSize int) (*models.NewsAPIResponse, error)
}

// NewsAPIAdapter implements the NewsProvider interface for NewsAPI.org
type NewsAPIAdapter struct {
	apiKey     string
	httpClient *http.Client
	baseURL    string
}

// NewNewsAPIAdapter creates a new NewsAPI adapter
func NewNewsAPIAdapter(apiKey string) *NewsAPIAdapter {
	return &NewsAPIAdapter{
		apiKey:  apiKey,
		baseURL: "https://newsapi.org/v2",
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

// GetTopHeadlines fetches top headlines from NewsAPI.org
func (a *NewsAPIAdapter) GetTopHeadlines(ctx context.Context, category, country string, page, pageSize int) (*models.NewsAPIResponse, error) {
	// Validate category
	validCategories := map[string]bool{
		"business": true, "entertainment": true, "general": true,
		"health": true, "science": true, "sports": true, "technology": true,
	}

	if category == "" || !validCategories[category] {
		category = "general"
	}

	if country == "" {
		country = "fr"
	}

	if pageSize > 20 || pageSize < 1 {
		pageSize = 10
	}

	// Build URL
	endpoint := fmt.Sprintf("%s/top-headlines", a.baseURL)
	params := url.Values{}
	params.Add("apiKey", a.apiKey)
	params.Add("category", category)
	params.Add("country", country)
	params.Add("page", strconv.Itoa(page))
	params.Add("pageSize", strconv.Itoa(pageSize))

	fullURL := fmt.Sprintf("%s?%s", endpoint, params.Encode())

	// Make request
	req, err := http.NewRequestWithContext(ctx, "GET", fullURL, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	resp, err := a.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch news: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("newsapi returned status %d: %s", resp.StatusCode, string(body))
	}

	// Decode response
	var newsResp models.NewsAPIResponse
	if err := json.NewDecoder(resp.Body).Decode(&newsResp); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	return &newsResp, nil
}

// SearchNews searches for news articles on NewsAPI.org
func (a *NewsAPIAdapter) SearchNews(ctx context.Context, query, language, sortBy string, page, pageSize int) (*models.NewsAPIResponse, error) {
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

	// Build URL
	endpoint := fmt.Sprintf("%s/everything", a.baseURL)
	params := url.Values{}
	params.Add("apiKey", a.apiKey)
	params.Add("q", query)
	params.Add("language", language)
	params.Add("sortBy", sortBy)
	params.Add("page", strconv.Itoa(page))
	params.Add("pageSize", strconv.Itoa(pageSize))

	fullURL := fmt.Sprintf("%s?%s", endpoint, params.Encode())

	// Make request
	req, err := http.NewRequestWithContext(ctx, "GET", fullURL, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	resp, err := a.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to search news: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("newsapi returned status %d: %s", resp.StatusCode, string(body))
	}

	// Decode response
	var newsResp models.NewsAPIResponse
	if err := json.NewDecoder(resp.Body).Decode(&newsResp); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	return &newsResp, nil
}

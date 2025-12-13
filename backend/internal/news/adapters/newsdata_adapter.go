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

// NewsDataAdapter implements the NewsProvider interface for NewsData.io
type NewsDataAdapter struct {
	apiKey     string
	httpClient *http.Client
	baseURL    string
}

// NewsDataResponse represents the response from NewsData.io API
type NewsDataResponse struct {
	Status       string            `json:"status"`
	TotalResults int               `json:"totalResults"`
	Results      []NewsDataArticle `json:"results"`
	NextPage     string            `json:"nextPage"`
}

// NewsDataArticle represents an article from NewsData.io
type NewsDataArticle struct {
	Title       string   `json:"title"`
	Link        string   `json:"link"`
	Description *string  `json:"description"`
	PubDate     string   `json:"pubDate"`
	ImageURL    *string  `json:"image_url"`
	SourceID    string   `json:"source_id"`
	SourceName  string   `json:"source_name"`
	Category    []string `json:"category"`
	Language    string   `json:"language"`
	Country     []string `json:"country"`
	Creator     []string `json:"creator"`
}

// NewNewsDataAdapter creates a new NewsData.io adapter
func NewNewsDataAdapter(apiKey string) *NewsDataAdapter {
	return &NewsDataAdapter{
		apiKey:  apiKey,
		baseURL: "https://newsdata.io/api/1",
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

// GetTopHeadlines fetches top headlines from NewsData.io
func (a *NewsDataAdapter) GetTopHeadlines(ctx context.Context, category, country string, page, pageSize int) (*models.NewsAPIResponse, error) {
	// NewsData.io uses the same endpoint for everything
	// We'll construct a query that simulates "top headlines"
	
	// Validate category
	validCategories := map[string]bool{
		"business": true, "entertainment": true, "general": true,
		"health": true, "science": true, "sports": true, "technology": true,
		"top": true, // NewsData.io specific
	}

	if category == "" || !validCategories[category] {
		category = "top"
	}

	if country == "" {
		country = "fr"
	}

	// NewsData.io free tier: max 10 results
	if pageSize > 10 {
		pageSize = 10
	}
	if pageSize < 1 {
		pageSize = 10
	}

	// Build URL
	endpoint := fmt.Sprintf("%s/latest", a.baseURL)
	params := url.Values{}
	params.Add("apikey", a.apiKey) // Note: "apikey" not "apiKey"
	params.Add("country", country)
	params.Add("language", "fr") // NewsData.io requires language
	
	if category != "" && category != "general" {
		params.Add("category", category)
	}
	
	params.Add("size", strconv.Itoa(pageSize))

	// NewsData.io uses nextPage token for pagination, not page numbers
	// For now, we'll handle basic pagination
	if page > 1 {
		// Note: For production, you'd need to store and use the nextPage token
		fmt.Printf("Warning: NewsData.io pagination with page numbers not fully supported\n")
	}

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
		return nil, fmt.Errorf("newsdata.io returned status %d: %s", resp.StatusCode, string(body))
	}

	// Decode NewsData.io response
	var newsDataResp NewsDataResponse
	if err := json.NewDecoder(resp.Body).Decode(&newsDataResp); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	// Transform NewsData.io response to our standard format
	return a.transformResponse(&newsDataResp), nil
}

// SearchNews searches for news articles on NewsData.io
func (a *NewsDataAdapter) SearchNews(ctx context.Context, query, language, sortBy string, page, pageSize int) (*models.NewsAPIResponse, error) {
	if query == "" {
		return nil, fmt.Errorf("search query is required")
	}

	if language == "" {
		language = "fr"
	}

	// NewsData.io free tier: max 10 results
	if pageSize > 10 {
		pageSize = 10
	}
	if pageSize < 1 {
		pageSize = 10
	}

	// Build URL
	endpoint := fmt.Sprintf("%s/latest", a.baseURL)
	params := url.Values{}
	params.Add("apikey", a.apiKey)
	params.Add("q", query)
	params.Add("language", language)
	params.Add("size", strconv.Itoa(pageSize))

	// Note: NewsData.io doesn't have sortBy like NewsAPI
	// It always returns results sorted by publishedAt (newest first)
	if sortBy != "publishedAt" && sortBy != "" {
		fmt.Printf("Warning: NewsData.io only supports publishedAt sorting\n")
	}

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
		return nil, fmt.Errorf("newsdata.io returned status %d: %s", resp.StatusCode, string(body))
	}

	// Decode NewsData.io response
	var newsDataResp NewsDataResponse
	if err := json.NewDecoder(resp.Body).Decode(&newsDataResp); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	// Transform to our standard format
	return a.transformResponse(&newsDataResp), nil
}

// transformResponse converts NewsData.io response to our standard NewsAPIResponse format
func (a *NewsDataAdapter) transformResponse(newsDataResp *NewsDataResponse) *models.NewsAPIResponse {
	articles := make([]models.Article, 0, len(newsDataResp.Results))

	for _, ndArticle := range newsDataResp.Results {
		// Parse the date
		publishedAt, _ := time.Parse("2006-01-02 15:04:05", ndArticle.PubDate)

		// Get author (first creator if available)
		var author *string
		if len(ndArticle.Creator) > 0 {
			author = &ndArticle.Creator[0]
		}

		// Transform to our Article model
		article := models.Article{
			Source: struct {
				ID   *string `json:"id"`
				Name string  `json:"name"`
			}{
				ID:   &ndArticle.SourceID,
				Name: ndArticle.SourceName,
			},
			Author:      author,
			Title:       ndArticle.Title,
			Description: ndArticle.Description,
			URL:         ndArticle.Link,
			URLToImage:  ndArticle.ImageURL,
			PublishedAt: publishedAt,
			Content:     ndArticle.Description, // NewsData.io doesn't provide full content in free tier
		}

		articles = append(articles, article)
	}

	return &models.NewsAPIResponse{
		Status:       newsDataResp.Status,
		TotalResults: newsDataResp.TotalResults,
		Articles:     articles,
	}
}
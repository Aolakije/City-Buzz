package adapters

import (
	"fmt"
	"strings"

	"github.com/Aolakije/City-Buzz/pkg/config"
)

// ProviderType represents the type of news provider
type ProviderType string

const (
	ProviderNewsAPI  ProviderType = "newsapi"
	ProviderNewsData ProviderType = "newsdata"
	// Add more providers here as you integrate them:
	// ProviderGoogleNews ProviderType = "google"
	// ProviderBingNews   ProviderType = "bing"
)

// NewNewsProvider creates a news provider based on the configuration
// This is the factory that decides which adapter to use
func NewNewsProvider(cfg *config.Config) (NewsProvider, error) {
	// Determine which provider to use
	providerType := strings.ToLower(cfg.NewsAPI.Provider)

	// Default to newsapi if not specified
	if providerType == "" {
		providerType = string(ProviderNewsAPI)
		fmt.Println("No NEWS_PROVIDER specified, defaulting to 'newsapi'")
	}

	switch ProviderType(providerType) {
	case ProviderNewsAPI:
		if cfg.NewsAPI.APIKey == "" {
			return nil, fmt.Errorf("NEWS_API_KEY is required for NewsAPI provider")
		}
		fmt.Printf("Using NewsAPI.org provider (API Key: %s...)\n", cfg.NewsAPI.APIKey[:10])
		return NewNewsAPIAdapter(cfg.NewsAPI.APIKey), nil

	case ProviderNewsData:
		if cfg.NewsAPI.NewsDataKey == "" {
			return nil, fmt.Errorf("NEWSDATA_API_KEY is required for NewsData provider")
		}
		fmt.Printf("Using NewsData.io provider (API Key: %s...)\n", cfg.NewsAPI.NewsDataKey[:10])
		return NewNewsDataAdapter(cfg.NewsAPI.NewsDataKey), nil

	// Future providers can be added here:
	// case ProviderGoogleNews:
	//     return NewGoogleNewsAdapter(cfg.NewsAPI.GoogleAPIKey), nil

	default:
		return nil, fmt.Errorf("unknown news provider: %s (valid options: newsapi, newsdata)", providerType)
	}
}

// GetAvailableProviders returns a list of all supported providers
func GetAvailableProviders() []string {
	return []string{
		string(ProviderNewsAPI),
		string(ProviderNewsData),
		// Add more as you implement them
	}
}

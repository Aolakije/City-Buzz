package config

import (
	"fmt"
	"os"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	Server     ServerConfig
	Database   DatabaseConfig
	Redis      RedisConfig
	JWT        JWTConfig
	CORS       CORSConfig
	Cookie     CookieConfig
	NewsAPI    NewsAPI
	OpenAgenda OpenAgendaConfig
}

type ServerConfig struct {
	Port string
	Env  string
}

type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
	SSLMode  string
}

type RedisConfig struct {
	Host     string
	Port     string
	Password string
}

type JWTConfig struct {
	Secret string
	Expiry time.Duration
}

type CORSConfig struct {
	AllowedOrigins []string
	FrontendURL    string
}

type CookieConfig struct {
	Domain string
	Secure bool
}

// NewsAPI configuration - supports multiple providers
type NewsAPI struct {
	Provider    string // "newsapi" or "newsdata"
	APIKey      string // For NewsAPI.org
	NewsDataKey string // For NewsData.io

}

// OpenAgendaConfig for fetching events from OpenAgenda
type OpenAgendaConfig struct {
	APIKey    string
	AgendaUID string
	BaseURL   string
}

func Load() (*Config, error) {
	godotenv.Load()

	// Parse JWT expiry
	jwtExpiry, err := time.ParseDuration(getEnv("JWT_EXPIRY", "15m"))
	if err != nil {
		return nil, fmt.Errorf("invalid JWT_EXPIRY format: %w", err)
	}

	config := &Config{
		Server: ServerConfig{
			Port: getEnv("PORT", "8080"),
			Env:  getEnv("ENV", "development"),
		},
		Database: DatabaseConfig{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnv("DB_PORT", "5432"),
			User:     getEnv("DB_USER", "postgres"),
			Password: getEnv("DB_PASSWORD", "postgres"),
			DBName:   getEnv("DB_NAME", "City-Buzz"),
			SSLMode:  getEnv("DB_SSLMODE", "disable"),
		},
		Redis: RedisConfig{
			Host:     getEnv("REDIS_HOST", "localhost"),
			Port:     getEnv("REDIS_PORT", "6379"),
			Password: getEnv("REDIS_PASSWORD", ""),
		},
		JWT: JWTConfig{
			Secret: getEnv("JWT_SECRET", "change-me-in-production"),
			Expiry: jwtExpiry,
		},
		CORS: CORSConfig{
			AllowedOrigins: []string{getEnv("FRONTEND_URL", "http://localhost:5173")},
			FrontendURL:    getEnv("FRONTEND_URL", "http://localhost:5173"),
		},
		Cookie: CookieConfig{
			Domain: getEnv("COOKIE_DOMAIN", "localhost"),
			Secure: getEnv("COOKIE_SECURE", "false") == "true",
		},
		NewsAPI: NewsAPI{
			Provider:    getEnv("NEWS_PROVIDER", "newsapi"),
			APIKey:      getEnv("NEWS_API_KEY", ""),     // NewsAPI.org key
			NewsDataKey: getEnv("NEWSDATA_API_KEY", ""), // NewsData.io key
		},
		OpenAgenda: OpenAgendaConfig{
			APIKey:    getEnv("OPENAGENDA_API_KEY", ""),
			AgendaUID: getEnv("OPENAGENDA_AGENDA_UID", ""),
			BaseURL:   getEnv("OPENAGENDA_BASE_URL", "https://api.openagenda.com/v2"), // Default OpenAgenda API
		},
	}

	return config, nil
}

func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

func (c *Config) GetDSN() string {
	return fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		c.Database.Host,
		c.Database.Port,
		c.Database.User,
		c.Database.Password,
		c.Database.DBName,
		c.Database.SSLMode,
	)
}

func (c *Config) GetRedisAddr() string {
	return fmt.Sprintf("%s:%s", c.Redis.Host, c.Redis.Port)
}

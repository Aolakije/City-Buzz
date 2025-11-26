package database

import (
	"context"
	"fmt"
	"log"

	"github.com/Aolakije/City-Buzz/pkg/config"
	"github.com/redis/go-redis/v9"
)

func NewRedisClient(cfg *config.Config) (*redis.Client, error) {
	client := redis.NewClient(&redis.Options{
		Addr:     cfg.GetRedisAddr(),
		Password: cfg.Redis.Password,
		DB:       0,
	})

	// Test connection
	ctx := context.Background()
	if err := client.Ping(ctx).Err(); err != nil {
		return nil, fmt.Errorf("unable to connect to Redis: %w", err)
	}

	log.Println("Connected to Redis")
	return client, nil
}

func CloseRedis(client *redis.Client) {
	if client != nil {
		client.Close()
		log.Println("Redis connection closed")
	}
}

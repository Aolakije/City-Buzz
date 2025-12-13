package news

import (
	"context"
	"errors"

	"github.com/Aolakije/City-Buzz/internal/models"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository interface {
	SaveArticle(ctx context.Context, article *models.SavedArticle) error
	GetSavedArticles(ctx context.Context, userID uuid.UUID) ([]models.SavedArticle, error)
	DeleteSavedArticle(ctx context.Context, userID uuid.UUID, articleURL string) error
	IsArticleSaved(ctx context.Context, userID uuid.UUID, articleURL string) (bool, error)
}

type repository struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) Repository {
	return &repository{db: db}
}

func (r *repository) SaveArticle(ctx context.Context, article *models.SavedArticle) error {
	query := `
        INSERT INTO saved_articles (id, user_id, article_url, article_title, article_image, article_source, saved_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (user_id, article_url) DO NOTHING
        RETURNING id
    `

	err := r.db.QueryRow(
		ctx,
		query,
		article.ID,
		article.UserID,
		article.ArticleURL,
		article.ArticleTitle,
		article.ArticleImage,
		article.ArticleSource,
		article.SavedAt,
	).Scan(&article.ID)

	if err != nil {
		if err == pgx.ErrNoRows {
			// Article already exists (conflict), this is not an error
			return nil
		}
		return err
	}

	return nil
}

func (r *repository) GetSavedArticles(ctx context.Context, userID uuid.UUID) ([]models.SavedArticle, error) {
	query := `
        SELECT id, user_id, article_url, article_title, article_image, article_source, saved_at
        FROM saved_articles
        WHERE user_id = $1
        ORDER BY saved_at DESC
    `

	rows, err := r.db.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	articles := []models.SavedArticle{}
	for rows.Next() {
		var article models.SavedArticle
		err := rows.Scan(
			&article.ID,
			&article.UserID,
			&article.ArticleURL,
			&article.ArticleTitle,
			&article.ArticleImage,
			&article.ArticleSource,
			&article.SavedAt,
		)
		if err != nil {
			return nil, err
		}
		articles = append(articles, article)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return articles, nil
}

func (r *repository) DeleteSavedArticle(ctx context.Context, userID uuid.UUID, articleURL string) error {
	query := `
        DELETE FROM saved_articles
        WHERE user_id = $1 AND article_url = $2
    `

	result, err := r.db.Exec(ctx, query, userID, articleURL)
	if err != nil {
		return err
	}

	rows := result.RowsAffected()
	if rows == 0 {
		return errors.New("article not found")
	}

	return nil
}

func (r *repository) IsArticleSaved(ctx context.Context, userID uuid.UUID, articleURL string) (bool, error) {
	query := `
        SELECT EXISTS(
            SELECT 1 FROM saved_articles
            WHERE user_id = $1 AND article_url = $2
        )
    `

	var exists bool
	err := r.db.QueryRow(ctx, query, userID, articleURL).Scan(&exists)
	return exists, err
}

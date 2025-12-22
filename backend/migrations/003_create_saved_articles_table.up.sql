-- Create saved_articles table
CREATE TABLE IF NOT EXISTS saved_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    article_url TEXT NOT NULL,
    article_title TEXT NOT NULL,
    article_image TEXT NOT NULL,
    article_source TEXT NOT NULL,
    saved_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, article_url)
);

-- Create indexes for faster queries
CREATE INDEX idx_saved_articles_user_id ON saved_articles(user_id);
CREATE INDEX idx_saved_articles_saved_at ON saved_articles(saved_at DESC);
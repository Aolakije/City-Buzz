-- Drop saved_articles table and indexes
DROP INDEX IF EXISTS idx_saved_articles_saved_at;
DROP INDEX IF EXISTS idx_saved_articles_user_id;
DROP TABLE IF EXISTS saved_articles;
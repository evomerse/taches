-- Add daily_frequency column to chore_tasks
ALTER TABLE chore_tasks ADD COLUMN IF NOT EXISTS daily_frequency integer NOT NULL DEFAULT 1;

-- Set feed-dogs to run twice per day
UPDATE chore_tasks SET daily_frequency = 2 WHERE id = 'feed-dogs';

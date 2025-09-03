-- Ajoute une fréquence quotidienne aux tâches
ALTER TABLE chore_tasks ADD COLUMN IF NOT EXISTS daily_frequency integer DEFAULT 1;

-- Nourrir les chiens : deux fois par jour
UPDATE chore_tasks SET daily_frequency = 2 WHERE id = 'feed-dogs';

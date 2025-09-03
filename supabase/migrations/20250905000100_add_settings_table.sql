-- Table de paramètres (pour le code d'effacement, etc.)
CREATE TABLE IF NOT EXISTS settings (
  key text PRIMARY KEY,
  value text NOT NULL
);

INSERT INTO settings (key, value)
VALUES ('history_delete_code', 'CHANGE_ME')
ON CONFLICT (key) DO NOTHING;

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read settings"
  ON settings FOR SELECT
  TO authenticated
  USING (true);

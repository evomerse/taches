/*
  # Schéma pour le gestionnaire de corvées familiales

  1. Nouvelles Tables
    - `family_members` - Membres de la famille avec statut primaire/secondaire
    - `chore_tasks` - Définition des tâches ménagères
    - `task_assignments` - Assignations quotidiennes des tâches
    - `balance_counters` - Compteurs d'équilibrage pour chaque membre

  2. Sécurité
    - RLS activé sur toutes les tables
    - Politiques pour permettre la lecture/écriture aux utilisateurs authentifiés

  3. Fonctionnalités
    - Rotation automatique des tâches
    - Suivi des remplacements et aides
    - Historique complet des assignations
*/

-- Table des membres de la famille
CREATE TABLE IF NOT EXISTS family_members (
  id text PRIMARY KEY,
  name text NOT NULL,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Table des tâches ménagères
CREATE TABLE IF NOT EXISTS chore_tasks (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'clipboard',
  created_at timestamptz DEFAULT now()
);

-- Table des assignations de tâches
CREATE TABLE IF NOT EXISTS task_assignments (
  id text PRIMARY KEY,
  task_id text NOT NULL REFERENCES chore_tasks(id),
  assigned_to text NOT NULL REFERENCES family_members(id),
  date date NOT NULL,
  completed boolean DEFAULT false,
  completed_by text REFERENCES family_members(id),
  completed_at timestamptz,
  was_reassigned boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Table des compteurs d'équilibrage
CREATE TABLE IF NOT EXISTS balance_counters (
  member_id text PRIMARY KEY REFERENCES family_members(id),
  help_count integer DEFAULT 0,
  missed_count integer DEFAULT 0,
  net_balance integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Activer RLS sur toutes les tables
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE chore_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE balance_counters ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour permettre l'accès aux utilisateurs authentifiés
CREATE POLICY "Allow authenticated users to read family_members"
  ON family_members
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to manage family_members"
  ON family_members
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read chore_tasks"
  ON chore_tasks
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to manage chore_tasks"
  ON chore_tasks
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read task_assignments"
  ON task_assignments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to manage task_assignments"
  ON task_assignments
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read balance_counters"
  ON balance_counters
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to manage balance_counters"
  ON balance_counters
  FOR ALL
  TO authenticated
  USING (true);

-- Insérer les données initiales
INSERT INTO family_members (id, name, is_primary) VALUES
  ('nathan', 'Nathan', true),
  ('anna', 'Anna', true),
  ('aaron', 'Aaron', true),
  ('maman', 'Maman', false),
  ('papa', 'Papa', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO chore_tasks (id, name, description, icon) VALUES
  ('feed-dogs', 'Nourrir les chiens', 'Donner à manger aux chiens', 'dog'),
  ('clean-rabbit-cage', 'Nettoyer cage lapin', 'Nettoyer la cage du lapin', 'rabbit'),
  ('sweep-veranda', 'Nettoyer véranda', 'Balayer ou passer l''aspirateur dans la véranda', 'broom'),
  ('brush-dogs', 'Brosser les chiens', 'Brosser les chiens', 'brush')
ON CONFLICT (id) DO NOTHING;

-- Initialiser les compteurs d'équilibrage
INSERT INTO balance_counters (member_id, help_count, missed_count, net_balance) 
SELECT id, 0, 0, 0 FROM family_members
ON CONFLICT (member_id) DO NOTHING;
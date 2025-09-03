-- Ajoute le membre spécial "Personne" et initialise son compteur d'équilibrage

INSERT INTO family_members (id, name, is_primary)
VALUES ('none', 'Personne', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO balance_counters (member_id, help_count, missed_count, net_balance)
VALUES ('none', 0, 0, 0)
ON CONFLICT (member_id) DO NOTHING;


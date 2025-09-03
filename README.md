# taches

## Initialisation de la base Supabase

Avant le déploiement, il est nécessaire d'initialiser la base de données avec
les membres de la famille et les tâches par défaut. Assurez-vous que la variable
`VITE_SUPABASE_URL` est définie puis exécutez :

```bash
SUPABASE_SERVICE_ROLE_KEY=\<votre-cle\> npm run seed
```

Le script `scripts/seedSupabase.ts` insérera les entrées de `src/data/initialData.ts`
dans les tables `family_members` et `chore_tasks`.

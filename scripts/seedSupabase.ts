/* eslint-env node */

import { createClient } from '@supabase/supabase-js';
import { familyMembers, choreTasks } from '../src/data/initialData';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function seed() {
  const { error: membersError } = await supabase
    .from('family_members')
    .insert(
      familyMembers.map(({ id, name, isPrimary }) => ({
        id,
        name,
        is_primary: isPrimary,
      })),
    );

  if (membersError) {
    throw membersError;
  }

    const { error: tasksError } = await supabase
      .from('chore_tasks')
      .insert(
        choreTasks.map(({ id, name, description, icon, dailyFrequency }) => ({
          id,
          name,
          description,
          icon,
          daily_frequency: dailyFrequency || 1,
        })),
      );

  if (tasksError) {
    throw tasksError;
  }

  console.log('Database seeded successfully');
}

seed().catch((err) => {
  console.error('Error seeding database:', err);
  process.exit(1);
});

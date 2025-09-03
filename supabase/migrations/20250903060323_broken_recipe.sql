/*
  # Add completed_by_email column to task_assignments

  1. Schema Changes
    - Add `completed_by_email` column to `task_assignments` table
    - This will store the email of the user who validated the task completion

  2. Purpose
    - Track who actually validated the task completion in the system
    - Provide accountability and audit trail for task validations
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'task_assignments' AND column_name = 'completed_by_email'
  ) THEN
    ALTER TABLE task_assignments ADD COLUMN completed_by_email text;
  END IF;
END $$;
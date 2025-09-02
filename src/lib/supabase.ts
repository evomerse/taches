import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour TypeScript
export type Database = {
  public: {
    Tables: {
      family_members: {
        Row: {
          id: string;
          name: string;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          is_primary?: boolean;
          created_at?: string;
        };
      };
      chore_tasks: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          description: string;
          icon?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          icon?: string;
          created_at?: string;
        };
      };
      task_assignments: {
        Row: {
          id: string;
          task_id: string;
          assigned_to: string;
          date: string;
          completed: boolean;
          completed_by: string | null;
          completed_at: string | null;
          was_reassigned: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          task_id: string;
          assigned_to: string;
          date: string;
          completed?: boolean;
          completed_by?: string | null;
          completed_at?: string | null;
          was_reassigned?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          task_id?: string;
          assigned_to?: string;
          date?: string;
          completed?: boolean;
          completed_by?: string | null;
          completed_at?: string | null;
          was_reassigned?: boolean;
          created_at?: string;
        };
      };
      balance_counters: {
        Row: {
          member_id: string;
          help_count: number;
          missed_count: number;
          net_balance: number;
          updated_at: string;
        };
        Insert: {
          member_id: string;
          help_count?: number;
          missed_count?: number;
          net_balance?: number;
          updated_at?: string;
        };
        Update: {
          member_id?: string;
          help_count?: number;
          missed_count?: number;
          net_balance?: number;
          updated_at?: string;
        };
      };
    };
  };
};
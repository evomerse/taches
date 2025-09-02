export interface FamilyMember {
  id: string;
  name: string;
  isPrimary: boolean; // true for Nathan, Anna, Aaron
}

export interface ChoreTask {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface TaskAssignment {
  id: string;
  taskId: string;
  assignedTo: string;
  date: string;
  completed: boolean;
  completedBy?: string;
  completedAt?: string;
  wasReassigned: boolean;
}

export interface BalanceCounter {
  memberId: string;
  helpCount: number; // +1 when helping others
  missedCount: number; // +1 when others help them
  netBalance: number; // helpCount - missedCount
}

// Types Supabase
export type SupabaseFamilyMember = {
  id: string;
  name: string;
  is_primary: boolean;
  created_at: string;
};

export type SupabaseChoreTask = {
  id: string;
  name: string;
  description: string;
  icon: string;
  created_at: string;
};

export type SupabaseTaskAssignment = {
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

export type SupabaseBalanceCounter = {
  member_id: string;
  help_count: number;
  missed_count: number;
  net_balance: number;
  updated_at: string;
};
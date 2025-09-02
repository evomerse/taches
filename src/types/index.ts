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
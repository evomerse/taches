import React from 'react';
import { Calendar, CheckCircle, Users, Clock, Trophy } from 'lucide-react';
import { TaskAssignment, BalanceCounter, FamilyMember, ChoreTask } from '../types';

interface DashboardProps {
  todayAssignments: TaskAssignment[];
  balanceCounters: BalanceCounter[];
  familyMembers: FamilyMember[];
  choreTasks: ChoreTask[];
  assignments: TaskAssignment[];
}

export const Dashboard: React.FC<DashboardProps> = ({
  todayAssignments,
  balanceCounters,
  familyMembers,
  choreTasks,
  assignments
}) => {
  const completedToday = todayAssignments.filter(a => a.completed).length;
  const nextAssignment = todayAssignments.find(a => !a.completed);

  const nextTaskName = nextAssignment
    ? choreTasks.find(t => t.id === nextAssignment.taskId)?.name
    : undefined;

  const nextAssignee = nextAssignment
    ? familyMembers.find(m => m.id === nextAssignment.assignedTo)?.name
    : undefined;

  const topBalance = [...balanceCounters].sort((a, b) => b.netBalance - a.netBalance)[0];
  const topBalanceName = topBalance
    ? familyMembers.find(m => m.id === topBalance.memberId)?.name
    : undefined;

  const totalCompleted = assignments.filter(a => a.completed).length;

  return (
    <div className="bg-white rounded-xl shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Calendar className="w-6 h-6 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Tableau de bord</h2>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <p className="text-sm text-gray-600">Tâches terminées</p>
            <p className="text-lg font-medium text-gray-900">
              {completedToday}/{todayAssignments.length}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Users className="w-6 h-6 text-blue-600" />
          <div>
            <p className="text-sm text-gray-600">Membres</p>
            <p className="text-lg font-medium text-gray-900">{familyMembers.length}</p>
          </div>
        </div>

        {nextAssignment && (
          <div className="flex items-center space-x-3">
            <Clock className="w-6 h-6 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Prochaine tâche</p>
              <p className="text-lg font-medium text-gray-900">
                {nextTaskName} - {nextAssignee}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-3 md:col-span-3">
          <Trophy className="w-6 h-6 text-yellow-600" />
          <div>
            <p className="text-sm text-gray-600">Aide la plus en avance</p>
            <p className="text-lg font-medium text-gray-900">
              {topBalanceName ? `${topBalanceName} (${topBalance.netBalance})` : 'Aucun'}
            </p>
            <p className="text-xs text-gray-500">
              Total: {totalCompleted}/{assignments.length} complétées
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


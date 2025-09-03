import React from 'react';
import { Calendar, TrendingUp, Users } from 'lucide-react';
import { TaskAssignment, BalanceCounter, FamilyMember } from '../types';

interface DashboardProps {
  todayAssignments: TaskAssignment[];
  balanceCounters: BalanceCounter[];
  familyMembers: FamilyMember[];
}

export const Dashboard: React.FC<DashboardProps> = ({
  todayAssignments,
  balanceCounters,
  familyMembers
}) => {
  const completedToday = todayAssignments.filter(a => a.completed).length;
  const totalToday = todayAssignments.length;
  const completionRate = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

  const getMemberName = (id: string) => familyMembers.find(m => m.id === id)?.name || '';

  const topHelper = balanceCounters
    .filter(c => c.netBalance > 0)
    .sort((a, b) => b.netBalance - a.netBalance)[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Tâches du jour</h3>
            <p className="text-sm text-gray-600">Progression quotidienne</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">
            {completedToday}/{totalToday}
          </span>
          <div className="text-right">
            <span className="text-sm text-gray-600">Terminées</span>
            <div className={`text-lg font-semibold ${
              completionRate === 100 ? 'text-green-600' : 'text-blue-600'
            }`}>
              {Math.round(completionRate)}%
            </div>
          </div>
        </div>
        <div className="mt-3 bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              completionRate === 100 ? 'bg-green-500' : 'bg-blue-500'
            }`}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Équipe active</h3>
            <p className="text-sm text-gray-600">Membres de la famille</p>
          </div>
        </div>
        <div className="space-y-2">
          {familyMembers.filter(m => m.isPrimary).map(member => {
            const balance = balanceCounters.find(c => c.memberId === member.id);
            return (
              <div key={member.id} className="flex items-center justify-between">
                <span className="text-sm font-medium">{member.name}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  !balance || balance.netBalance === 0 
                    ? 'bg-gray-100 text-gray-600'
                    : balance.netBalance > 0 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                }`}>
                  {balance ? (balance.netBalance > 0 ? `+${balance.netBalance}` : balance.netBalance) : '0'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
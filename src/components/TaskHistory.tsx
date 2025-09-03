import React, { useEffect, useState } from 'react';
import { Clock, User, Award } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { TaskAssignment, ChoreTask, FamilyMember } from '../types';

interface TaskHistoryProps {
  history: TaskAssignment[];
  tasks: ChoreTask[];
  familyMembers: FamilyMember[];
  refreshData: () => Promise<void>;
}

export const TaskHistory: React.FC<TaskHistoryProps> = ({
  history,
  tasks,
  familyMembers,
  refreshData
}) => {
  const getMemberName = (id: string) => familyMembers.find(m => m.id === id)?.name || '';
  const getTaskName = (id: string) => tasks.find(t => t.id === id)?.name || '';

  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserEmail(user?.email ?? null);
    });
  }, []);

  const isAuthorized = userEmail === import.meta.env.VITE_ADMIN_EMAIL;

  const handleClearHistory = async () => {
    const code = window.prompt("Entrez le code secret pour effacer l'historique");
    if (!code) return;

    const { data: setting } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'clear_history_code')
      .single();
    const expectedCode = (setting as { value?: string } | null)?.value || import.meta.env.VITE_CLEAR_HISTORY_CODE;

    if (code !== expectedCode) {
      window.alert('Code invalide');
      return;
    }

    const { error } = await supabase.from('task_assignments').delete().neq('id', '');
    if (error) {
      window.alert("Erreur lors de l'effacement de l'historique");
      return;
    }

    await refreshData();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Clock className="w-6 h-6 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Historique des tâches</h2>
        </div>
        {isAuthorized && (
          <button
            onClick={handleClearHistory}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Effacer l'historique
          </button>
        )}
      </div>
      
      <div className="p-6">
        {history.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Aucune tâche dans l'historique</p>
        ) : (
          <div className="space-y-4">
            {history.map(assignment => {
              const isHelped = assignment.completedBy && assignment.completedBy !== assignment.assignedTo;
              
              return (
                <div
                  key={assignment.id}
                  className={`border rounded-lg p-4 transition-all duration-200 ${
                    assignment.completed 
                      ? isHelped 
                        ? 'border-orange-200 bg-orange-50'
                        : 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        assignment.completed 
                          ? isHelped ? 'bg-orange-500' : 'bg-green-500'
                          : 'bg-gray-400'
                      }`} />
                      <div>
                        <span className="font-medium text-gray-900">
                          {getTaskName(assignment.taskId)}
                        </span>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span>{formatDate(assignment.date)}</span>
                          {assignment.completed && assignment.completedAt && (
                            <span>à {formatTime(assignment.completedAt)}</span>
                          )}
                        </div>
                        {assignment.completed && assignment.completedByEmail && (
                          <span className="text-xs text-blue-600">
                            Validé par: {assignment.completedByEmail}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium">
                          {getMemberName(assignment.assignedTo)}
                        </span>
                      </div>
                      {isHelped && (
                        <div className="flex items-center space-x-2 mt-1">
                          <Award className="w-4 h-4 text-orange-500" />
                          <span className="text-sm text-orange-700">
                            Aidé par {getMemberName(assignment.completedBy!)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
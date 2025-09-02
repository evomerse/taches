import React, { useState, useEffect } from 'react';
import { AuthWrapper } from './components/AuthWrapper';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { TaskCard } from './components/TaskCard';
import { TaskHistory } from './components/TaskHistory';
import { BalancePanel } from './components/BalancePanel';
import { useSupabaseChores } from './hooks/useSupabaseChores';

function App() {
  const [currentView, setCurrentView] = useState<'today' | 'history' | 'balance'>('today');
  const {
    assignments,
    balanceCounters,
    familyMembers,
    choreTasks,
    loading,
    error,
    generateTodayAssignments,
    completeTask,
    reassignTask,
    getTodayAssignments,
    getRecentHistory
  } = useSupabaseChores();

  // Generate today's assignments on load
  useEffect(() => {
    if (familyMembers.length > 0 && choreTasks.length > 0) {
      generateTodayAssignments();
    }
  }, [familyMembers, choreTasks]);

  const todayAssignments = getTodayAssignments();
  const recentHistory = getRecentHistory();

  if (loading) {
    return (
      <AuthWrapper>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des données...</p>
          </div>
        </div>
      </AuthWrapper>
    );
  }

  if (error) {
    return (
      <AuthWrapper>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Recharger la page
              </button>
            </div>
          </div>
        </div>
      </AuthWrapper>
    );
  }
  const renderCurrentView = () => {
    switch (currentView) {
      case 'today':
        return (
          <div className="space-y-6">
            <Dashboard
              todayAssignments={todayAssignments}
              balanceCounters={balanceCounters}
              familyMembers={familyMembers}
            />
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tâches d'aujourd'hui</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {todayAssignments.map(assignment => {
                  const task = choreTasks.find(t => t.id === assignment.taskId);
                  if (!task) return null;
                  
                  return (
                    <TaskCard
                      key={assignment.id}
                      assignment={assignment}
                      task={task}
                      familyMembers={familyMembers}
                      onComplete={completeTask}
                      onReassign={reassignTask}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'history':
        return (
          <TaskHistory
            history={recentHistory}
            tasks={choreTasks}
            familyMembers={familyMembers}
          />
        );

      case 'balance':
        return (
          <BalancePanel
            balanceCounters={balanceCounters}
            familyMembers={familyMembers}
          />
        );

      default:
        return null;
    }
  };

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gray-50">
        <Header currentView={currentView} onViewChange={setCurrentView} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {renderCurrentView()}
        </main>

        {todayAssignments.length > 0 && currentView === 'today' && (
          <div className="fixed bottom-6 right-6">
            <div className="bg-white rounded-full shadow-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-700">
                  {todayAssignments.filter(a => a.completed).length}/{todayAssignments.length} terminées
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthWrapper>
  );
}

export default App;
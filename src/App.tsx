import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { TaskCard } from './components/TaskCard';
import { TaskHistory } from './components/TaskHistory';
import { BalancePanel } from './components/BalancePanel';
import { useChoreManager } from './hooks/useChoreManager';

function App() {
  const [currentView, setCurrentView] = useState<'today' | 'history' | 'balance'>('today');
  const {
    assignments,
    balanceCounters,
    familyMembers,
    choreTasks,
    generateTodayAssignments,
    completeTask,
    reassignTask,
    getTodayAssignments,
    getRecentHistory
  } = useChoreManager();

  // Generate today's assignments on load
  useEffect(() => {
    generateTodayAssignments();
  }, []);

  const todayAssignments = getTodayAssignments();
  const recentHistory = getRecentHistory();

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
  );
}

export default App;
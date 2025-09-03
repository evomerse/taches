import React, { useState } from 'react';
import { Check, RotateCcw, User } from 'lucide-react';
import { TaskAssignment, ChoreTask, FamilyMember } from '../types';

interface TaskCardProps {
  assignment: TaskAssignment;
  task: ChoreTask;
  familyMembers: FamilyMember[];
  onComplete: (assignmentId: string, completedBy?: string) => void;
  onReassign: (assignmentId: string, newAssignee: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  assignment,
  task,
  familyMembers,
  onComplete,
  onReassign
}) => {
  const [showReassignMenu, setShowReassignMenu] = useState(false);
  const [showCompleteMenu, setShowCompleteMenu] = useState(false);

  const assignedMember = familyMembers.find(m => m.id === assignment.assignedTo);
  const completedMember = assignment.completedBy 
    ? familyMembers.find(m => m.id === assignment.completedBy)
    : null;

  const getTaskIcon = (iconName: string) => {
    switch (iconName) {
      case 'dog':
        return '🐕';
      case 'rabbit':
        return '🐰';
      case 'broom':
        return '🧹';
      case 'brush':
        return '🪮';
      default:
        return '📋';
    }
  };

  const handleComplete = (completedBy?: string) => {
    onComplete(assignment.id, completedBy);
    setShowCompleteMenu(false);
  };

    const handleReassign = (newAssignee: string) => {
      onReassign(assignment.id, newAssignee);
      setShowReassignMenu(false);
    };

    const isOverdue =
      !assignment.completed &&
      new Date(assignment.date) < new Date(new Date().toISOString().split('T')[0]);

    return (
      <div
        className={`relative z-10 bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg ${
          assignment.completed
            ? 'bg-green-50 border-l-4 border-green-500'
            : isOverdue
              ? 'bg-yellow-50 border-l-4 border-yellow-500'
              : 'hover:scale-105'
        }`}
      >
        {isOverdue && !assignment.completed && (
          <span className="absolute top-2 right-2 text-xs text-yellow-700">En retard</span>
        )}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getTaskIcon(task.icon)}</span>
          <div>
            <h3 className="font-semibold text-gray-900">{task.name}</h3>
            <p className="text-sm text-gray-600">{task.description}</p>
          </div>
        </div>
        {assignment.wasReassigned && (
          <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
            Réassignée
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-500" />
          <span className={`font-medium ${assignment.completed ? 'text-green-700' : 'text-blue-700'}`}>
            {assignment.completed && completedMember
              ? `Terminée par ${completedMember.name}`
              : `Assignée à ${assignedMember?.name}`
            }
          </span>
        </div>

        {!assignment.completed && (
          <div className="flex space-x-2">
            <div className="relative">
              <button
                onClick={() => setShowReassignMenu(!showReassignMenu)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Réassigner"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              
              {showReassignMenu && (
                <div className="absolute right-0 top-12 bg-white border rounded-lg shadow-lg py-1 z-50 min-w-32">
                  {familyMembers
                    .filter(m => m.id !== assignment.assignedTo)
                    .map(member => (
                      <button
                        key={member.id}
                        onClick={() => handleReassign(member.id)}
                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                      >
                        {member.name}
                      </button>
                    ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowCompleteMenu(!showCompleteMenu)}
                className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                title="Marquer comme terminée"
              >
                <Check className="w-4 h-4" />
              </button>

              {showCompleteMenu && (
                <div className="absolute right-0 top-12 bg-white border rounded-lg shadow-lg py-1 z-50 min-w-40">
                  <button
                    onClick={() => handleComplete()}
                    className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                  >
                    Par {assignedMember?.name}
                  </button>
                  {familyMembers
                    .filter(m => m.id !== assignment.assignedTo)
                    .map(member => (
                      <button
                        key={member.id}
                        onClick={() => handleComplete(member.id)}
                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                      >
                        {member.id === 'none'
                          ? member.name
                          : `Par ${member.name} (aide)`}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {assignment.completed && (
          <div className="flex items-center space-x-2 text-green-600">
            <Check className="w-5 h-5" />
            <span className="text-sm font-medium">Terminée</span>
          </div>
        )}
      </div>
    </div>
  );
};
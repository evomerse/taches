import { useState, useEffect } from 'react';
import { TaskAssignment, BalanceCounter } from '../types';
import { familyMembers, choreTasks } from '../data/initialData';

export const useChoreManager = () => {
  const [assignments, setAssignments] = useState<TaskAssignment[]>([]);
  const [balanceCounters, setBalanceCounters] = useState<BalanceCounter[]>([]);

  // Initialize data from localStorage or create default
  useEffect(() => {
    const savedAssignments = localStorage.getItem('chore-assignments');
    const savedCounters = localStorage.getItem('balance-counters');
    
    if (savedAssignments) {
      setAssignments(JSON.parse(savedAssignments));
    }
    
    if (savedCounters) {
      setBalanceCounters(JSON.parse(savedCounters));
    } else {
      // Initialize balance counters for all family members
      const initialCounters = familyMembers.map(member => ({
        memberId: member.id,
        helpCount: 0,
        missedCount: 0,
        netBalance: 0
      }));
      setBalanceCounters(initialCounters);
      localStorage.setItem('balance-counters', JSON.stringify(initialCounters));
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('chore-assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('balance-counters', JSON.stringify(balanceCounters));
  }, [balanceCounters]);

  const getNextAssignee = (taskId: string): string => {
    const primaryMembers = familyMembers.filter(m => m.isPrimary);
    const lastAssignment = assignments
      .filter(a => a.taskId === taskId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    if (!lastAssignment) {
      return primaryMembers[0].id; // Start with Nathan
    }

    const currentIndex = primaryMembers.findIndex(m => m.id === lastAssignment.assignedTo);
    const nextIndex = (currentIndex + 1) % primaryMembers.length;
    return primaryMembers[nextIndex].id;
  };

  const generateTodayAssignments = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayAssignments = assignments.filter(a => a.date === today);

    if (todayAssignments.length === 0) {
      // Generate new assignments for today
      const newAssignments = choreTasks.map(task => ({
        id: `${task.id}-${today}`,
        taskId: task.id,
        assignedTo: getNextAssignee(task.id),
        date: today,
        completed: false,
        wasReassigned: false
      }));

      setAssignments(prev => [...prev, ...newAssignments]);
      return newAssignments;
    }

    return todayAssignments;
  };

  const completeTask = (assignmentId: string, completedBy?: string) => {
    setAssignments(prev => prev.map(assignment => {
      if (assignment.id === assignmentId) {
        const wasHelped = completedBy && completedBy !== assignment.assignedTo;
        
        if (wasHelped) {
          // Update balance counters
          updateBalanceCounters(assignment.assignedTo, completedBy);
        }

        return {
          ...assignment,
          completed: true,
          completedBy: completedBy || assignment.assignedTo,
          completedAt: new Date().toISOString(),
          wasReassigned: wasHelped || assignment.wasReassigned
        };
      }
      return assignment;
    }));
  };

  const reassignTask = (assignmentId: string, newAssignee: string) => {
    setAssignments(prev => prev.map(assignment => {
      if (assignment.id === assignmentId) {
        return {
          ...assignment,
          assignedTo: newAssignee,
          wasReassigned: true
        };
      }
      return assignment;
    }));
  };

  const updateBalanceCounters = (originalAssignee: string, helper: string) => {
    setBalanceCounters(prev => prev.map(counter => {
      if (counter.memberId === helper) {
        const newHelpCount = counter.helpCount + 1;
        return {
          ...counter,
          helpCount: newHelpCount,
          netBalance: newHelpCount - counter.missedCount
        };
      }
      if (counter.memberId === originalAssignee) {
        const newMissedCount = counter.missedCount + 1;
        return {
          ...counter,
          missedCount: newMissedCount,
          netBalance: counter.helpCount - newMissedCount
        };
      }
      return counter;
    }));
  };

  const getTodayAssignments = () => {
    const today = new Date().toISOString().split('T')[0];
    return assignments.filter(a => a.date === today);
  };

  const getRecentHistory = (days: number = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return assignments
      .filter(a => new Date(a.date) >= cutoffDate)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  return {
    assignments,
    balanceCounters,
    familyMembers,
    choreTasks,
    generateTodayAssignments,
    completeTask,
    reassignTask,
    getTodayAssignments,
    getRecentHistory
  };
};
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { TaskAssignment, BalanceCounter, FamilyMember, ChoreTask } from '../types';

export const useSupabaseChores = () => {
  const [assignments, setAssignments] = useState<TaskAssignment[]>([]);
  const [balanceCounters, setBalanceCounters] = useState<BalanceCounter[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [choreTasks, setChoreTasks] = useState<ChoreTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les données initiales
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Charger les membres de la famille
      const { data: members, error: membersError } = await supabase
        .from('family_members')
        .select('*')
        .order('is_primary', { ascending: false });

      if (membersError) throw membersError;

      // Charger les tâches
      const { data: tasks, error: tasksError } = await supabase
        .from('chore_tasks')
        .select('*');

      if (tasksError) throw tasksError;

      // Charger les assignations
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('task_assignments')
        .select('*')
        .order('date', { ascending: false });

      if (assignmentsError) throw assignmentsError;

      // Charger les compteurs d'équilibrage
      const { data: counters, error: countersError } = await supabase
        .from('balance_counters')
        .select('*');

      if (countersError) throw countersError;

      // Convertir les données au format attendu
      setFamilyMembers(members.map(m => ({
        id: m.id,
        name: m.name,
        isPrimary: m.is_primary
      })));

      setChoreTasks(tasks.map(t => ({
        id: t.id,
        name: t.name,
        description: t.description,
        icon: t.icon
      })));

      setAssignments(assignmentsData.map(a => ({
        id: a.id,
        taskId: a.task_id,
        assignedTo: a.assigned_to,
        date: a.date,
        completed: a.completed,
        completedBy: a.completed_by || undefined,
        completedAt: a.completed_at || undefined,
        wasReassigned: a.was_reassigned
      })));

      setBalanceCounters(counters.map(c => ({
        memberId: c.member_id,
        helpCount: c.help_count,
        missedCount: c.missed_count,
        netBalance: c.net_balance
      })));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const getNextAssignee = async (taskId: string): Promise<string> => {
    const primaryMembers = familyMembers.filter(m => m.isPrimary);
    
    const { data: lastAssignment } = await supabase
      .from('task_assignments')
      .select('*')
      .eq('task_id', taskId)
      .order('date', { ascending: false })
      .limit(1)
      .single();

    if (!lastAssignment) {
      return primaryMembers[0]?.id || 'nathan';
    }

    const currentIndex = primaryMembers.findIndex(m => m.id === lastAssignment.assigned_to);
    const nextIndex = (currentIndex + 1) % primaryMembers.length;
    return primaryMembers[nextIndex]?.id || 'nathan';
  };

  const generateTodayAssignments = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    // Vérifier si les assignations d'aujourd'hui existent déjà
    const { data: existingAssignments } = await supabase
      .from('task_assignments')
      .select('*')
      .eq('date', today);

    if (existingAssignments && existingAssignments.length > 0) {
      return;
    }

    // Générer de nouvelles assignations
    const newAssignments = [];
    for (const task of choreTasks) {
      const assignee = await getNextAssignee(task.id);
      const assignment = {
        id: `${task.id}-${today}`,
        task_id: task.id,
        assigned_to: assignee,
        date: today,
        completed: false,
        was_reassigned: false
      };
      newAssignments.push(assignment);
    }

    if (newAssignments.length > 0) {
      const { error } = await supabase
        .from('task_assignments')
        .insert(newAssignments);

      if (error) {
        setError(error.message);
      } else {
        // Recharger les données
        loadInitialData();
      }
    }
  };

  const completeTask = async (assignmentId: string, completedBy?: string) => {
    try {
      const assignment = assignments.find(a => a.id === assignmentId);
      if (!assignment) return;

      const wasHelped = completedBy && completedBy !== assignment.assignedTo;
      
      // Mettre à jour l'assignation
      const { error: updateError } = await supabase
        .from('task_assignments')
        .update({
          completed: true,
          completed_by: completedBy || assignment.assignedTo,
          completed_at: new Date().toISOString(),
          was_reassigned: wasHelped || assignment.wasReassigned
        })
        .eq('id', assignmentId);

      if (updateError) throw updateError;

      // Mettre à jour les compteurs si quelqu'un a aidé
      if (wasHelped) {
        await updateBalanceCounters(assignment.assignedTo, completedBy);
      }

      // Recharger les données
      loadInitialData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la completion');
    }
  };

  const reassignTask = async (assignmentId: string, newAssignee: string) => {
    try {
      const { error } = await supabase
        .from('task_assignments')
        .update({
          assigned_to: newAssignee,
          was_reassigned: true
        })
        .eq('id', assignmentId);

      if (error) throw error;

      // Recharger les données
      loadInitialData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la réassignation');
    }
  };

  const updateBalanceCounters = async (originalAssignee: string, helper: string) => {
    try {
      // Mettre à jour le compteur de l'aidant (+1 aide)
      const { data: helperCounter } = await supabase
        .from('balance_counters')
        .select('*')
        .eq('member_id', helper)
        .single();

      if (helperCounter) {
        const newHelpCount = helperCounter.help_count + 1;
        await supabase
          .from('balance_counters')
          .update({
            help_count: newHelpCount,
            net_balance: newHelpCount - helperCounter.missed_count,
            updated_at: new Date().toISOString()
          })
          .eq('member_id', helper);
      }

      // Mettre à jour le compteur de la personne aidée (+1 manqué)
      const { data: originalCounter } = await supabase
        .from('balance_counters')
        .select('*')
        .eq('member_id', originalAssignee)
        .single();

      if (originalCounter) {
        const newMissedCount = originalCounter.missed_count + 1;
        await supabase
          .from('balance_counters')
          .update({
            missed_count: newMissedCount,
            net_balance: originalCounter.help_count - newMissedCount,
            updated_at: new Date().toISOString()
          })
          .eq('member_id', originalAssignee);
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour des compteurs:', err);
    }
  };

  const getTodayAssignments = () => {
    const today = new Date().toISOString().split('T')[0];
    return assignments.filter(a => a.date === today);
  };

  const getRecentHistory = (days: number = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffString = cutoffDate.toISOString().split('T')[0];
    
    return assignments
      .filter(a => a.date >= cutoffString)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  return {
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
    getRecentHistory,
    refreshData: loadInitialData
  };
};
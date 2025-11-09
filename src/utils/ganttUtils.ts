import type { Task, TaskGroup } from '../types';
import { differenceInDays } from 'date-fns';

/**
 * Calculate the critical path through a set of tasks
 * Returns an array of task IDs that are on the critical path
 */
export function calculateCriticalPath(tasks: Task[]): Set<string> {
  const criticalPath = new Set<string>();

  // Build a map of task IDs to tasks for quick lookup
  const taskMap = new Map(tasks.map(task => [task.id, task]));

  // Calculate earliest start/finish times (forward pass)
  const earliestStart = new Map<string, Date>();
  const earliestFinish = new Map<string, Date>();

  const calculateEarliest = (task: Task): void => {
    if (earliestStart.has(task.id)) return;

    let maxPredecessorFinish = task.startDate;

    if (task.dependencies && task.dependencies.length > 0) {
      for (const depId of task.dependencies) {
        const depTask = taskMap.get(depId);
        if (depTask) {
          calculateEarliest(depTask);
          const depFinish = earliestFinish.get(depId);
          if (depFinish && depFinish > maxPredecessorFinish) {
            maxPredecessorFinish = depFinish;
          }
        }
      }
    }

    earliestStart.set(task.id, maxPredecessorFinish);
    earliestFinish.set(task.id, task.endDate);
  };

  tasks.forEach(calculateEarliest);

  // Find project end date
  const projectEnd = Array.from(earliestFinish.values()).reduce(
    (max, date) => (date > max ? date : max),
    new Date(0)
  );

  // Calculate latest start/finish times (backward pass)
  const latestStart = new Map<string, Date>();
  const latestFinish = new Map<string, Date>();

  const calculateLatest = (task: Task): void => {
    if (latestFinish.has(task.id)) return;

    // Find all tasks that depend on this one
    const successors = tasks.filter(t =>
      t.dependencies?.includes(task.id)
    );

    let minSuccessorStart = projectEnd;

    if (successors.length > 0) {
      for (const successor of successors) {
        calculateLatest(successor);
        const succStart = latestStart.get(successor.id);
        if (succStart && succStart < minSuccessorStart) {
          minSuccessorStart = succStart;
        }
      }
    }

    const duration = differenceInDays(task.endDate, task.startDate);
    latestFinish.set(task.id, minSuccessorStart);
    latestStart.set(task.id, new Date(minSuccessorStart.getTime() - duration * 24 * 60 * 60 * 1000));
  };

  tasks.forEach(calculateLatest);

  // Tasks with zero slack are on the critical path
  tasks.forEach(task => {
    const es = earliestStart.get(task.id);
    const ls = latestStart.get(task.id);

    if (es && ls && Math.abs(es.getTime() - ls.getTime()) < 1000 * 60 * 60 * 12) {
      // Less than 12 hours difference (accounting for time precision)
      criticalPath.add(task.id);
    }
  });

  return criticalPath;
}

/**
 * Group tasks by a specified criterion
 */
export function groupTasks(
  tasks: Task[],
  groupBy: 'none' | 'assignee' | 'priority' | 'status',
  collapsedGroups: Set<string> = new Set()
): TaskGroup[] {
  if (groupBy === 'none') {
    return [
      {
        key: 'all',
        label: 'All Tasks',
        tasks,
        isCollapsed: false,
      },
    ];
  }

  const groups = new Map<string, Task[]>();

  tasks.forEach(task => {
    let key: string;

    switch (groupBy) {
      case 'assignee':
        key = task.assignee || 'unassigned';
        break;
      case 'priority':
        key = task.priority || 'none';
        break;
      case 'status':
        key = task.status || 'none';
        break;
      default:
        key = 'all';
    }

    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(task);
  });

  // Convert to TaskGroup array and sort
  const taskGroups: TaskGroup[] = Array.from(groups.entries()).map(([key, groupTasks]) => ({
    key,
    label: key.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    tasks: groupTasks,
    isCollapsed: collapsedGroups.has(key),
    color: getGroupColor(groupBy, key),
  }));

  // Sort groups
  return taskGroups.sort((a, b) => {
    if (groupBy === 'priority') {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3, none: 4 };
      return priorityOrder[a.key as keyof typeof priorityOrder] - priorityOrder[b.key as keyof typeof priorityOrder];
    }
    return a.label.localeCompare(b.label);
  });
}

/**
 * Get color for a group based on groupBy type and key
 */
function getGroupColor(groupBy: string, key: string): string {
  if (groupBy === 'priority') {
    const colors: Record<string, string> = {
      critical: '#ef4444',
      high: '#f59e0b',
      medium: '#eab308',
      low: '#22c55e',
      none: '#6b7280',
    };
    return colors[key] || '#6b7280';
  }

  if (groupBy === 'status') {
    const colors: Record<string, string> = {
      'not-started': '#6b7280',
      'in-progress': '#3b82f6',
      completed: '#22c55e',
      'on-hold': '#a855f7',
      none: '#6b7280',
    };
    return colors[key] || '#6b7280';
  }

  // For assignee, generate a color based on the name
  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];
  const hash = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

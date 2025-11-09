import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, Clock, Users, AlertTriangle, CheckCircle, Circle, Pause } from 'lucide-react';
import type { Task } from '../../types';
import { differenceInDays } from 'date-fns';

interface StatsDashboardProps {
  tasks: Task[];
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ tasks }) => {
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const notStarted = tasks.filter(t => t.status === 'not-started').length;
    const onHold = tasks.filter(t => t.status === 'on-hold').length;

    const milestones = tasks.filter(t => t.isMilestone).length;

    const criticalTasks = tasks.filter(t => t.priority === 'critical').length;
    const highPriorityTasks = tasks.filter(t => t.priority === 'high').length;

    const assignees = new Set(tasks.map(t => t.assignee).filter(Boolean)).size;

    const avgProgress = total > 0
      ? Math.round(tasks.reduce((sum, t) => sum + t.progress, 0) / total)
      : 0;

    const totalDuration = tasks.reduce((sum, t) => {
      return sum + differenceInDays(t.endDate, t.startDate) + 1;
    }, 0);

    const overdueTasks = tasks.filter(t => {
      return t.status !== 'completed' && new Date(t.endDate) < new Date();
    }).length;

    return {
      total,
      completed,
      inProgress,
      notStarted,
      onHold,
      milestones,
      criticalTasks,
      highPriorityTasks,
      assignees,
      avgProgress,
      totalDuration,
      overdueTasks,
    };
  }, [tasks]);

  const completionRate = stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Tasks */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <BarChart3 size={32} className="opacity-80" />
          <div className="text-3xl font-bold">{stats.total}</div>
        </div>
        <div className="text-sm opacity-90 font-medium">Total Tasks</div>
        <div className="text-xs opacity-70 mt-1">{stats.milestones} milestones</div>
      </div>

      {/* Completion Rate */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <CheckCircle size={32} className="opacity-80" />
          <div className="text-3xl font-bold">{completionRate}%</div>
        </div>
        <div className="text-sm opacity-90 font-medium">Completion Rate</div>
        <div className="text-xs opacity-70 mt-1">{stats.completed} of {stats.total} completed</div>
      </div>

      {/* Average Progress */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <TrendingUp size={32} className="opacity-80" />
          <div className="text-3xl font-bold">{stats.avgProgress}%</div>
        </div>
        <div className="text-sm opacity-90 font-medium">Average Progress</div>
        <div className="text-xs opacity-70 mt-1">{stats.inProgress} in progress</div>
      </div>

      {/* Active Team */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <Users size={32} className="opacity-80" />
          <div className="text-3xl font-bold">{stats.assignees}</div>
        </div>
        <div className="text-sm opacity-90 font-medium">Team Members</div>
        <div className="text-xs opacity-70 mt-1">Active assignees</div>
      </div>

      {/* Status Breakdown */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 lg:col-span-2">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Status Breakdown</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Circle size={16} className="text-gray-500" />
              <span className="text-sm text-gray-700">Not Started</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gray-500 h-2 rounded-full"
                  style={{ width: `${stats.total > 0 ? (stats.notStarted / stats.total) * 100 : 0}%` }}
                />
              </div>
              <span className="text-sm font-bold text-gray-900 w-8 text-right">{stats.notStarted}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-500" />
              <span className="text-sm text-gray-700">In Progress</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0}%` }}
                />
              </div>
              <span className="text-sm font-bold text-gray-900 w-8 text-right">{stats.inProgress}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              <span className="text-sm text-gray-700">Completed</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                />
              </div>
              <span className="text-sm font-bold text-gray-900 w-8 text-right">{stats.completed}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pause size={16} className="text-purple-500" />
              <span className="text-sm text-gray-700">On Hold</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${stats.total > 0 ? (stats.onHold / stats.total) * 100 : 0}%` }}
                />
              </div>
              <span className="text-sm font-bold text-gray-900 w-8 text-right">{stats.onHold}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Priority & Alerts */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 lg:col-span-2">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Priority & Alerts</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={20} className="text-red-600" />
              <span className="text-sm font-semibold text-red-900">Critical</span>
            </div>
            <div className="text-3xl font-bold text-red-600">{stats.criticalTasks}</div>
          </div>

          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={20} className="text-orange-600" />
              <span className="text-sm font-semibold text-orange-900">High Priority</span>
            </div>
            <div className="text-3xl font-bold text-orange-600">{stats.highPriorityTasks}</div>
          </div>

          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={20} className="text-amber-600" />
              <span className="text-sm font-semibold text-amber-900">Overdue</span>
            </div>
            <div className="text-3xl font-bold text-amber-600">{stats.overdueTasks}</div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={20} className="text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">Total Days</span>
            </div>
            <div className="text-3xl font-bold text-blue-600">{stats.totalDuration}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { X, Calendar, User, AlertCircle, Activity, FileText, TrendingUp, Copy, Edit2 } from 'lucide-react';
import type { Task } from '../../types';
import { formatDate } from '../../utils/dateUtils';
import { differenceInDays } from 'date-fns';

interface TaskDetailsPanelProps {
  task: Task;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDuplicate: (task: Task) => void;
}

export const TaskDetailsPanel: React.FC<TaskDetailsPanelProps> = ({
  task,
  onClose,
  onEdit,
  onDuplicate,
}) => {
  const duration = differenceInDays(task.endDate, task.startDate) + 1;

  const priorityColors: Record<string, string> = {
    low: 'bg-green-100 text-green-800 border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    high: 'bg-orange-100 text-orange-800 border-orange-300',
    critical: 'bg-red-100 text-red-800 border-red-300',
  };

  const statusColors: Record<string, string> = {
    'not-started': 'bg-gray-100 text-gray-800 border-gray-300',
    'in-progress': 'bg-blue-100 text-blue-800 border-blue-300',
    completed: 'bg-green-100 text-green-800 border-green-300',
    'on-hold': 'bg-purple-100 text-purple-800 border-purple-300',
  };

  const formatPriority = (priority?: string) => {
    if (!priority) return 'Not Set';
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  const formatStatus = (status?: string) => {
    if (!status) return 'Not Set';
    return status
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl border-l border-gray-200 overflow-y-auto z-50">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 z-10">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-bold pr-8">Task Details</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            title="Close panel"
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          {task.isMilestone && <span className="text-2xl">🏁</span>}
          <h3 className="text-lg font-medium">{task.title}</h3>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex gap-2">
        <button
          onClick={() => onEdit(task)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-1"
        >
          <Edit2 size={16} />
          Edit
        </button>
        <button
          onClick={() => onDuplicate(task)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex-1"
        >
          <Copy size={16} />
          Duplicate
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Description */}
        {task.description && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText size={18} className="text-gray-600" />
              <h4 className="font-semibold text-gray-900">Description</h4>
            </div>
            <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
              {task.description}
            </p>
          </div>
        )}

        {/* Timeline */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={18} className="text-gray-600" />
            <h4 className="font-semibold text-gray-900">Timeline</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Start Date</span>
              <span className="font-medium text-gray-900">
                {formatDate(task.startDate, 'MMM dd, yyyy')}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-gray-600">End Date</span>
              <span className="font-medium text-gray-900">
                {formatDate(task.endDate, 'MMM dd, yyyy')}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Duration</span>
              <span className="font-medium text-gray-900">
                {duration} day{duration !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={18} className="text-gray-600" />
            <h4 className="font-semibold text-gray-900">Progress</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Completion</span>
              <span className="font-bold text-blue-600">{task.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Assignment */}
        {task.assignee && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <User size={18} className="text-gray-600" />
              <h4 className="font-semibold text-gray-900">Assignee</h4>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                {task.assignee.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium text-gray-900">{task.assignee}</span>
            </div>
          </div>
        )}

        {/* Priority */}
        {task.priority && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={18} className="text-gray-600" />
              <h4 className="font-semibold text-gray-900">Priority</h4>
            </div>
            <span
              className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold border ${
                priorityColors[task.priority] || 'bg-gray-100 text-gray-800'
              }`}
            >
              {formatPriority(task.priority)}
            </span>
          </div>
        )}

        {/* Status */}
        {task.status && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Activity size={18} className="text-gray-600" />
              <h4 className="font-semibold text-gray-900">Status</h4>
            </div>
            <span
              className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold border ${
                statusColors[task.status] || 'bg-gray-100 text-gray-800'
              }`}
            >
              {formatStatus(task.status)}
            </span>
          </div>
        )}

        {/* Dependencies */}
        {task.dependencies && task.dependencies.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText size={18} className="text-gray-600" />
              <h4 className="font-semibold text-gray-900">Dependencies</h4>
            </div>
            <div className="space-y-1">
              {task.dependencies.map((depId) => (
                <div
                  key={depId}
                  className="text-sm p-2 bg-blue-50 text-blue-700 rounded border border-blue-200"
                >
                  Task ID: {depId}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Color */}
        {task.color && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-gray-900">Color</h4>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg border-2 border-gray-300 shadow-sm"
                style={{ backgroundColor: task.color }}
              />
              <span className="text-sm font-mono text-gray-600">{task.color}</span>
            </div>
          </div>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-gray-900">Tags</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {task.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="pt-4 border-t border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">Metadata</h4>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Task ID</span>
              <span className="font-mono">{task.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Type</span>
              <span>{task.isMilestone ? 'Milestone' : 'Task'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

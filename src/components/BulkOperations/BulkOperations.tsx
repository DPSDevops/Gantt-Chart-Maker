import React from 'react';
import { CheckSquare, Trash2, Copy, User, AlertCircle, Activity } from 'lucide-react';
import type { Task } from '../../types';

interface BulkOperationsProps {
  selectedTasks: Set<string>;
  tasks: Task[];
  onClearSelection: () => void;
  onDeleteSelected: () => void;
  onDuplicateSelected: () => void;
  onBulkUpdatePriority: (priority: 'low' | 'medium' | 'high' | 'critical') => void;
  onBulkUpdateStatus: (status: 'not-started' | 'in-progress' | 'completed' | 'on-hold') => void;
  onBulkUpdateAssignee: (assignee: string) => void;
}

export const BulkOperations: React.FC<BulkOperationsProps> = ({
  selectedTasks,
  tasks,
  onClearSelection,
  onDeleteSelected,
  onDuplicateSelected,
  onBulkUpdatePriority,
  onBulkUpdateStatus,
  onBulkUpdateAssignee,
}) => {
  const [showPriorityMenu, setShowPriorityMenu] = React.useState(false);
  const [showStatusMenu, setShowStatusMenu] = React.useState(false);
  const [showAssigneeMenu, setShowAssigneeMenu] = React.useState(false);
  const [newAssignee, setNewAssignee] = React.useState('');

  if (selectedTasks.size === 0) return null;

  // Get unique assignees from all tasks
  const uniqueAssignees = Array.from(
    new Set(tasks.map(t => t.assignee).filter(Boolean))
  ) as string[];

  const handleAssigneeSubmit = () => {
    if (newAssignee.trim()) {
      onBulkUpdateAssignee(newAssignee.trim());
      setNewAssignee('');
      setShowAssigneeMenu(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl z-40 border-t-4 border-blue-700">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Selection Info */}
          <div className="flex items-center gap-3">
            <CheckSquare size={24} />
            <div>
              <div className="font-bold text-lg">
                {selectedTasks.size} task{selectedTasks.size !== 1 ? 's' : ''} selected
              </div>
              <button
                onClick={onClearSelection}
                className="text-sm text-blue-100 hover:text-white underline"
              >
                Clear selection
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Delete */}
            <button
              onClick={onDeleteSelected}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium"
            >
              <Trash2 size={18} />
              Delete
            </button>

            {/* Duplicate */}
            <button
              onClick={onDuplicateSelected}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-medium"
            >
              <Copy size={18} />
              Duplicate
            </button>

            {/* Set Priority */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowPriorityMenu(!showPriorityMenu);
                  setShowStatusMenu(false);
                  setShowAssigneeMenu(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-medium"
              >
                <AlertCircle size={18} />
                Set Priority
              </button>

              {showPriorityMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowPriorityMenu(false)}
                  />
                  <div className="absolute bottom-full mb-2 right-0 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-20 overflow-hidden">
                    {(['low', 'medium', 'high', 'critical'] as const).map(priority => (
                      <button
                        key={priority}
                        onClick={() => {
                          onBulkUpdatePriority(priority);
                          setShowPriorityMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Set Status */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowStatusMenu(!showStatusMenu);
                  setShowPriorityMenu(false);
                  setShowAssigneeMenu(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-medium"
              >
                <Activity size={18} />
                Set Status
              </button>

              {showStatusMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowStatusMenu(false)}
                  />
                  <div className="absolute bottom-full mb-2 right-0 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-20 overflow-hidden">
                    {(['not-started', 'in-progress', 'completed', 'on-hold'] as const).map(status => (
                      <button
                        key={status}
                        onClick={() => {
                          onBulkUpdateStatus(status);
                          setShowStatusMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        {status
                          .split('-')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ')}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Assign To */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowAssigneeMenu(!showAssigneeMenu);
                  setShowPriorityMenu(false);
                  setShowStatusMenu(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-medium"
              >
                <User size={18} />
                Assign To
              </button>

              {showAssigneeMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowAssigneeMenu(false)}
                  />
                  <div className="absolute bottom-full mb-2 right-0 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-20 p-3">
                    <div className="mb-3">
                      <input
                        type="text"
                        value={newAssignee}
                        onChange={(e) => setNewAssignee(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAssigneeSubmit()}
                        placeholder="Enter assignee name..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleAssigneeSubmit}
                        className="w-full mt-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Assign
                      </button>
                    </div>

                    {uniqueAssignees.length > 0 && (
                      <>
                        <div className="text-xs text-gray-500 mb-2 border-t border-gray-200 pt-2">
                          Recent assignees:
                        </div>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {uniqueAssignees.map(assignee => (
                            <button
                              key={assignee}
                              onClick={() => {
                                onBulkUpdateAssignee(assignee);
                                setShowAssigneeMenu(false);
                              }}
                              className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors text-sm"
                            >
                              {assignee}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

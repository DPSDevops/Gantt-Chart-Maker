import React from 'react';
import { Filter } from 'lucide-react';

interface FilterPanelProps {
  priorities: ('low' | 'medium' | 'high' | 'critical')[];
  statuses: ('not-started' | 'in-progress' | 'completed' | 'on-hold')[];
  onPriorityToggle: (priority: 'low' | 'medium' | 'high' | 'critical') => void;
  onStatusToggle: (status: 'not-started' | 'in-progress' | 'completed' | 'on-hold') => void;
  onClearFilters: () => void;
  activeCount: number;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  priorities,
  statuses,
  onPriorityToggle,
  onStatusToggle,
  onClearFilters,
  activeCount,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const priorityOptions = [
    { value: 'low' as const, label: 'Low', color: 'bg-green-100 text-green-800' },
    { value: 'medium' as const, label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high' as const, label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'critical' as const, label: 'Critical', color: 'bg-red-100 text-red-800' },
  ];

  const statusOptions = [
    { value: 'not-started' as const, label: 'Not Started', color: 'bg-gray-100 text-gray-800' },
    { value: 'in-progress' as const, label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
    { value: 'completed' as const, label: 'Completed', color: 'bg-green-100 text-green-800' },
    { value: 'on-hold' as const, label: 'On Hold', color: 'bg-purple-100 text-purple-800' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
      >
        <Filter size={18} />
        <span className="font-medium">Filters</span>
        {activeCount > 0 && (
          <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
            {activeCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-20 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Filter Tasks</h3>
              {activeCount > 0 && (
                <button
                  onClick={() => {
                    onClearFilters();
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Priority Filters */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Priority
              </label>
              <div className="space-y-2">
                {priorityOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={priorities.includes(option.value)}
                      onChange={() => onPriorityToggle(option.value)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className={`px-2 py-1 rounded text-xs font-medium ${option.color}`}>
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status Filters */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <div className="space-y-2">
                {statusOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={statuses.includes(option.value)}
                      onChange={() => onStatusToggle(option.value)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className={`px-2 py-1 rounded text-xs font-medium ${option.color}`}>
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

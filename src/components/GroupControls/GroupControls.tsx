import React from 'react';
import { Layers, User, AlertCircle, Activity } from 'lucide-react';
import type { ViewOptions } from '../../types';

interface GroupControlsProps {
  viewOptions: ViewOptions;
  onViewOptionsChange: (options: ViewOptions) => void;
}

export const GroupControls: React.FC<GroupControlsProps> = ({
  viewOptions,
  onViewOptionsChange,
}) => {
  const groupByOptions = [
    { value: 'none' as const, label: 'No Grouping', icon: Layers },
    { value: 'assignee' as const, label: 'By Assignee', icon: User },
    { value: 'priority' as const, label: 'By Priority', icon: AlertCircle },
    { value: 'status' as const, label: 'By Status', icon: Activity },
  ];

  const handleGroupByChange = (groupBy: 'none' | 'assignee' | 'priority' | 'status') => {
    onViewOptionsChange({
      ...viewOptions,
      groupBy,
    });
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700">Group:</span>
      <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg p-1 shadow-sm">
        {groupByOptions.map((option) => {
          const Icon = option.icon;
          const isActive = (viewOptions.groupBy || 'none') === option.value;

          return (
            <button
              key={option.value}
              onClick={() => handleGroupByChange(option.value)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'bg-transparent text-gray-700 hover:bg-gray-100'
              }`}
              title={option.label}
            >
              <Icon size={16} />
              <span className="hidden md:inline">{option.label.replace('By ', '')}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

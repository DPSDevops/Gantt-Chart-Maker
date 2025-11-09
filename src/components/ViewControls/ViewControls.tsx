import React from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { useGanttStore } from '../../store/useGanttStore';

export const ViewControls: React.FC = () => {
  const { viewOptions, setViewOptions } = useGanttStore();

  const handleZoomIn = () => {
    if (viewOptions.zoom < 2) {
      setViewOptions({ zoom: Math.min(2, viewOptions.zoom + 0.25) });
    }
  };

  const handleZoomOut = () => {
    if (viewOptions.zoom > 0.5) {
      setViewOptions({ zoom: Math.max(0.5, viewOptions.zoom - 0.25) });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg shadow-md border border-gray-200">
      {/* Zoom Controls */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-700">Zoom:</span>
        <button
          onClick={handleZoomOut}
          disabled={viewOptions.zoom <= 0.5}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Zoom Out"
        >
          <ZoomOut size={18} />
        </button>
        <span className="text-sm font-medium text-gray-600 w-12 text-center">
          {Math.round(viewOptions.zoom * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          disabled={viewOptions.zoom >= 2}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Zoom In"
        >
          <ZoomIn size={18} />
        </button>
      </div>

      {/* Divider */}
      <div className="h-6 w-px bg-gray-300" />

      {/* Toggle Options */}
      <div className="flex flex-wrap gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={viewOptions.showWeekends}
            onChange={(e) =>
              setViewOptions({ showWeekends: e.target.checked })
            }
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Weekends</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={viewOptions.showToday}
            onChange={(e) => setViewOptions({ showToday: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Today Line</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={viewOptions.showProgress}
            onChange={(e) => setViewOptions({ showProgress: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Progress</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={viewOptions.showMilestones}
            onChange={(e) => setViewOptions({ showMilestones: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Milestones</span>
        </label>
      </div>
    </div>
  );
};

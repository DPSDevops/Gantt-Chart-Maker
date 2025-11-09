import React from 'react';
import { ZoomIn, ZoomOut, Maximize2, Calendar } from 'lucide-react';
import type { ViewOptions } from '../../types';

interface ZoomControlsProps {
  viewOptions: ViewOptions;
  onViewOptionsChange: (options: ViewOptions) => void;
  onScrollToToday: () => void;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  viewOptions,
  onViewOptionsChange,
  onScrollToToday,
}) => {
  const handleZoomIn = () => {
    onViewOptionsChange({
      ...viewOptions,
      zoom: Math.min(2, viewOptions.zoom + 0.25),
    });
  };

  const handleZoomOut = () => {
    onViewOptionsChange({
      ...viewOptions,
      zoom: Math.max(0.5, viewOptions.zoom - 0.25),
    });
  };

  const handleResetZoom = () => {
    onViewOptionsChange({
      ...viewOptions,
      zoom: 1,
    });
  };

  const handleTimeScaleChange = (timeScale: 'day' | 'week' | 'month') => {
    onViewOptionsChange({
      ...viewOptions,
      timeScale,
    });
  };

  return (
    <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-2 shadow-sm">
      {/* Time Scale Selector */}
      <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
        <button
          onClick={() => handleTimeScaleChange('day')}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            viewOptions.timeScale === 'day'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          title="Day view"
        >
          Day
        </button>
        <button
          onClick={() => handleTimeScaleChange('week')}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            viewOptions.timeScale === 'week'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          title="Week view"
        >
          Week
        </button>
        <button
          onClick={() => handleTimeScaleChange('month')}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            viewOptions.timeScale === 'month'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          title="Month view"
        >
          Month
        </button>
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
        <button
          onClick={handleZoomOut}
          disabled={viewOptions.zoom <= 0.5}
          className="p-2 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Zoom out"
        >
          <ZoomOut size={18} />
        </button>
        <span className="text-sm font-medium text-gray-700 min-w-[60px] text-center">
          {Math.round(viewOptions.zoom * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          disabled={viewOptions.zoom >= 2}
          className="p-2 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Zoom in"
        >
          <ZoomIn size={18} />
        </button>
        <button
          onClick={handleResetZoom}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Reset zoom (100%)"
        >
          <Maximize2 size={18} />
        </button>
      </div>

      {/* Go to Today */}
      <button
        onClick={onScrollToToday}
        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
        title="Scroll to today"
      >
        <Calendar size={18} />
        <span>Today</span>
      </button>
    </div>
  );
};

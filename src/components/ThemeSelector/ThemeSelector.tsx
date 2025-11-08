import React from 'react';
import { Palette } from 'lucide-react';
import { useGanttStore } from '../../store/useGanttStore';
import { themes } from '../../themes';
import type { ThemeType } from '../../types';

export const ThemeSelector: React.FC = () => {
  const { selectedTheme, setTheme } = useGanttStore();

  return (
    <div className="flex items-center gap-3">
      <Palette size={20} className="text-gray-600" />
      <select
        value={selectedTheme}
        onChange={(e) => setTheme(e.target.value as ThemeType)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
      >
        {Object.entries(themes).map(([key, theme]) => (
          <option key={key} value={key}>
            {theme.name}
          </option>
        ))}
      </select>
    </div>
  );
};

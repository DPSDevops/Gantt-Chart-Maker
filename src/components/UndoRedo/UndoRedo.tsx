import React, { useEffect } from 'react';
import { Undo2, Redo2 } from 'lucide-react';
import { useGanttStore } from '../../store/useGanttStore';

export const UndoRedo: React.FC = () => {
  const { undo, redo, canUndo, canRedo } = useGanttStore();

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo()) undo();
      } else if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === 'y' || (e.key === 'z' && e.shiftKey))
      ) {
        e.preventDefault();
        if (canRedo()) redo();
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [undo, redo, canUndo, canRedo]);

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg shadow-md p-1">
      <button
        onClick={undo}
        disabled={!canUndo()}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        title="Undo (Ctrl+Z)"
      >
        <Undo2 size={18} />
      </button>
      <button
        onClick={redo}
        disabled={!canRedo()}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        title="Redo (Ctrl+Y)"
      >
        <Redo2 size={18} />
      </button>
    </div>
  );
};

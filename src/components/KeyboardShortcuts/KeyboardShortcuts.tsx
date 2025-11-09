import React from 'react';
import { X, Command, Keyboard } from 'lucide-react';

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Ctrl + Z', mac: '⌘ + Z', action: 'Undo last action' },
    { key: 'Ctrl + Y', mac: '⌘ + Y', action: 'Redo last action' },
    { key: 'Ctrl + Shift + Z', mac: '⌘ + Shift + Z', action: 'Redo (alternative)' },
    { key: 'Ctrl + F', mac: '⌘ + F', action: 'Focus search bar' },
    { key: 'Ctrl + P', mac: '⌘ + P', action: 'Print chart' },
    { key: 'Escape', mac: 'Esc', action: 'Close dialogs/Clear selection' },
    { key: '?', mac: '?', action: 'Show keyboard shortcuts' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Keyboard size={24} className="text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-3">
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-gray-700 font-medium">
                  {shortcut.action}
                </span>
                <div className="flex items-center gap-2">
                  <kbd className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-mono shadow-sm">
                    {shortcut.key}
                  </kbd>
                  <span className="text-gray-400">or</span>
                  <kbd className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-mono shadow-sm">
                    {shortcut.mac}
                  </kbd>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <Command size={20} className="text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Pro Tip:</p>
                <p>Press <kbd className="px-2 py-0.5 bg-white border border-blue-300 rounded text-xs font-mono">?</kbd> anytime to view this shortcuts panel!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

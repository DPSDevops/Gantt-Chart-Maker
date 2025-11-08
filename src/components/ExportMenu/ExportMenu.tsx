import React, { useState } from 'react';
import { Download, FileImage, FileText, FileJson, FileSpreadsheet } from 'lucide-react';
import { useGanttStore } from '../../store/useGanttStore';
import {
  exportToPNG,
  exportToPDF,
  exportToJSON,
  exportToCSV,
} from '../../utils/exportUtils';

export const ExportMenu: React.FC = () => {
  const { tasks } = useGanttStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'png' | 'pdf' | 'json' | 'csv') => {
    setIsExporting(true);
    try {
      switch (format) {
        case 'png':
          await exportToPNG('gantt-chart-container');
          break;
        case 'pdf':
          await exportToPDF('gantt-chart-container');
          break;
        case 'json':
          exportToJSON(tasks);
          break;
        case 'csv':
          exportToCSV(tasks);
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={tasks.length === 0}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        <Download size={20} />
        Export
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
            <div className="p-2 space-y-1">
              <button
                onClick={() => handleExport('png')}
                disabled={isExporting}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors text-left"
              >
                <FileImage size={20} className="text-blue-600" />
                <span className="font-medium">Export as PNG</span>
              </button>

              <button
                onClick={() => handleExport('pdf')}
                disabled={isExporting}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors text-left"
              >
                <FileText size={20} className="text-red-600" />
                <span className="font-medium">Export as PDF</span>
              </button>

              <button
                onClick={() => handleExport('json')}
                disabled={isExporting}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors text-left"
              >
                <FileJson size={20} className="text-purple-600" />
                <span className="font-medium">Export as JSON</span>
              </button>

              <button
                onClick={() => handleExport('csv')}
                disabled={isExporting}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors text-left"
              >
                <FileSpreadsheet size={20} className="text-green-600" />
                <span className="font-medium">Export as CSV</span>
              </button>
            </div>

            {isExporting && (
              <div className="border-t p-3 text-center text-sm text-gray-600">
                Exporting...
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

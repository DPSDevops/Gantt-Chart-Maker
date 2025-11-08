import React, { useState } from 'react';
import {
  BarChart3,
  List,
  Upload,
  Trash2,
  Download,
  BookTemplate,
} from 'lucide-react';
import { GanttChart } from './components/GanttChart/GanttChart';
import { TaskForm } from './components/TaskForm/TaskForm';
import { TaskList } from './components/TaskList/TaskList';
import { ThemeSelector } from './components/ThemeSelector/ThemeSelector';
import { ExportMenu } from './components/ExportMenu/ExportMenu';
import { ViewControls } from './components/ViewControls/ViewControls';
import { useGanttStore } from './store/useGanttStore';
import { sampleTasks, projectTemplates } from './utils/sampleData';
import { importFromJSON } from './utils/exportUtils';

type ViewMode = 'chart' | 'list';

function App() {
  const { tasks, setTasks, clearAllTasks } = useGanttStore();
  const [viewMode, setViewMode] = useState<ViewMode>('chart');
  const [showTemplates, setShowTemplates] = useState(false);

  const handleLoadSample = () => {
    if (
      tasks.length === 0 ||
      confirm('This will replace all current tasks. Continue?')
    ) {
      setTasks(sampleTasks);
    }
  };

  const handleLoadTemplate = (templateKey: keyof typeof projectTemplates) => {
    if (
      tasks.length === 0 ||
      confirm('This will replace all current tasks. Continue?')
    ) {
      setTasks(projectTemplates[templateKey].tasks);
      setShowTemplates(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedTasks = await importFromJSON(file);
      if (
        tasks.length === 0 ||
        confirm('This will replace all current tasks. Continue?')
      ) {
        setTasks(importedTasks);
      }
    } catch (error) {
      alert('Failed to import file. Please check the file format.');
    }
    event.target.value = '';
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to delete all tasks? This cannot be undone.')) {
      clearAllTasks();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <BarChart3 size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  GanttMaster
                </h1>
                <p className="text-sm text-gray-600">
                  Beautiful Gantt Chart Maker
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <ThemeSelector />
              <ExportMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="mb-6 space-y-4">
          {/* Primary Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <TaskForm />

            <div className="relative">
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md"
              >
                <BookTemplate size={20} />
                Templates
              </button>

              {showTemplates && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowTemplates(false)}
                  />
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                    <div className="p-2 space-y-1">
                      {Object.entries(projectTemplates).map(([key, template]) => (
                        <button
                          key={key}
                          onClick={() =>
                            handleLoadTemplate(
                              key as keyof typeof projectTemplates
                            )
                          }
                          className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <div className="font-medium">{template.name}</div>
                          <div className="text-sm text-gray-500">
                            {template.tasks.length} tasks
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <label className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md cursor-pointer">
              <Upload size={20} />
              Import JSON
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>

            {tasks.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
              >
                <Trash2 size={20} />
                Clear All
              </button>
            )}

            {tasks.length === 0 && (
              <button
                onClick={handleLoadSample}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-md"
              >
                <Download size={20} />
                Load Sample
              </button>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-white rounded-lg shadow-md p-1 w-fit">
            <button
              onClick={() => setViewMode('chart')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                viewMode === 'chart'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart3 size={18} />
              Chart View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <List size={18} />
              List View
            </button>
          </div>

          {/* View Controls */}
          {viewMode === 'chart' && tasks.length > 0 && <ViewControls />}
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {viewMode === 'chart' ? <GanttChart /> : <TaskList />}
        </div>

        {/* Stats Footer */}
        {tasks.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-sm text-gray-600">Total Tasks</div>
              <div className="text-2xl font-bold text-gray-900">
                {tasks.length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-sm text-gray-600">Completed</div>
              <div className="text-2xl font-bold text-green-600">
                {tasks.filter((t) => t.progress === 100).length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-sm text-gray-600">In Progress</div>
              <div className="text-2xl font-bold text-blue-600">
                {tasks.filter((t) => t.progress > 0 && t.progress < 100).length}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-gray-600 text-sm">
        <p>
          Built with React, TypeScript, and Tailwind CSS
        </p>
        <p className="mt-1">
          Create beautiful Gantt charts with ease
        </p>
      </footer>
    </div>
  );
}

export default App;

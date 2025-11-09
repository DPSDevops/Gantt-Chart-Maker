import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  BarChart3,
  List,
  Upload,
  Trash2,
  Download,
  BookTemplate,
  Keyboard,
  BarChart2,
} from 'lucide-react';
import { GanttChart } from './components/GanttChart/GanttChart';
import type { GanttChartRef } from './components/GanttChart/GanttChart';
import { TaskForm } from './components/TaskForm/TaskForm';
import { TaskList } from './components/TaskList/TaskList';
import { ThemeSelector } from './components/ThemeSelector/ThemeSelector';
import { ExportMenu } from './components/ExportMenu/ExportMenu';
import { ViewControls } from './components/ViewControls/ViewControls';
import { ZoomControls } from './components/ZoomControls/ZoomControls';
import { GroupControls } from './components/GroupControls/GroupControls';
import { UndoRedo } from './components/UndoRedo/UndoRedo';
import { SearchBar } from './components/SearchBar/SearchBar';
import { KeyboardShortcuts } from './components/KeyboardShortcuts/KeyboardShortcuts';
import { FilterPanel } from './components/FilterPanel/FilterPanel';
import { TaskDetailsPanel } from './components/TaskDetailsPanel/TaskDetailsPanel';
import { BulkOperations } from './components/BulkOperations/BulkOperations';
import { StatsDashboard } from './components/StatsDashboard/StatsDashboard';
import { useGanttStore } from './store/useGanttStore';
import { sampleTasks, projectTemplates } from './utils/sampleData';
import { importFromJSON } from './utils/exportUtils';
import type { Task } from './types';

type ViewMode = 'chart' | 'list' | 'stats';

function App() {
  const {
    tasks,
    setTasks,
    clearAllTasks,
    viewOptions,
    setViewOptions,
    selectedTask,
    setSelectedTask,
    duplicateTask,
    deleteTasks,
    duplicateTasks,
    bulkUpdateTasks,
  } = useGanttStore();

  const ganttChartRef = useRef<GanttChartRef>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('chart');
  const [showTemplates, setShowTemplates] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [filterPriorities, setFilterPriorities] = useState<('low' | 'medium' | 'high' | 'critical')[]>([]);
  const [filterStatuses, setFilterStatuses] = useState<('not-started' | 'in-progress' | 'completed' | 'on-hold')[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [editingTask, setEditingTask] = useState<Task | null>(null);

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
      setSelectedTasks(new Set());
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowKeyboardShortcuts(true);
      }
      if (e.key === 'Escape') {
        setShowKeyboardShortcuts(false);
        setSelectedTask(null);
        setSelectedTasks(new Set());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedTask]);

  // Filter tasks based on search query, priority, and status
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.assignee?.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query) ||
          task.priority?.toLowerCase().includes(query) ||
          task.status?.toLowerCase().includes(query)
      );
    }

    // Priority filter
    if (filterPriorities.length > 0) {
      filtered = filtered.filter(
        (task) => task.priority && filterPriorities.includes(task.priority)
      );
    }

    // Status filter
    if (filterStatuses.length > 0) {
      filtered = filtered.filter(
        (task) => task.status && filterStatuses.includes(task.status)
      );
    }

    return filtered;
  }, [tasks, searchQuery, filterPriorities, filterStatuses]);

  const handlePriorityToggle = (priority: 'low' | 'medium' | 'high' | 'critical') => {
    setFilterPriorities((prev) =>
      prev.includes(priority)
        ? prev.filter((p) => p !== priority)
        : [...prev, priority]
    );
  };

  const handleStatusToggle = (status: 'not-started' | 'in-progress' | 'completed' | 'on-hold') => {
    setFilterStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleClearFilters = () => {
    setFilterPriorities([]);
    setFilterStatuses([]);
  };

  const handleScrollToToday = () => {
    ganttChartRef.current?.scrollToToday();
  };

  // Bulk operations handlers
  const handleClearSelection = () => {
    setSelectedTasks(new Set());
  };

  const handleDeleteSelected = () => {
    if (confirm(`Delete ${selectedTasks.size} selected tasks?`)) {
      deleteTasks(Array.from(selectedTasks));
      setSelectedTasks(new Set());
    }
  };

  const handleDuplicateSelected = () => {
    duplicateTasks(Array.from(selectedTasks));
    setSelectedTasks(new Set());
  };

  const handleBulkUpdatePriority = (priority: 'low' | 'medium' | 'high' | 'critical') => {
    bulkUpdateTasks(Array.from(selectedTasks), { priority });
  };

  const handleBulkUpdateStatus = (status: 'not-started' | 'in-progress' | 'completed' | 'on-hold') => {
    bulkUpdateTasks(Array.from(selectedTasks), { status });
  };

  const handleBulkUpdateAssignee = (assignee: string) => {
    bulkUpdateTasks(Array.from(selectedTasks), { assignee });
  };

  // Task details panel handlers
  const selectedTaskData = tasks.find(t => t.id === selectedTask);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setSelectedTask(null);
  };

  const handleDuplicateTask = (task: Task) => {
    duplicateTask(task.id);
    setSelectedTask(null);
  };

  const activeFilterCount = filterPriorities.length + filterStatuses.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200 no-print">
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
              <button
                onClick={() => setShowKeyboardShortcuts(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Keyboard Shortcuts (?)"
              >
                <Keyboard size={20} />
              </button>
              <UndoRedo />
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
          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <div className="flex items-center gap-3">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search tasks by title, assignee, or priority..."
              />
              <FilterPanel
                priorities={filterPriorities}
                statuses={filterStatuses}
                onPriorityToggle={handlePriorityToggle}
                onStatusToggle={handleStatusToggle}
                onClearFilters={handleClearFilters}
                activeCount={activeFilterCount}
              />
            </div>
            <div className="text-sm text-gray-600">
              {(searchQuery || activeFilterCount > 0) &&
                `${filteredTasks.length} of ${tasks.length} tasks`}
            </div>
          </div>

          {/* Primary Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <TaskForm editingTask={editingTask} onClose={() => setEditingTask(null)} />

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
            <button
              onClick={() => setViewMode('stats')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                viewMode === 'stats'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart2 size={18} />
              Statistics
            </button>
          </div>

          {/* View Controls */}
          {viewMode === 'chart' && tasks.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <ZoomControls
                  viewOptions={viewOptions}
                  onViewOptionsChange={setViewOptions}
                  onScrollToToday={handleScrollToToday}
                />
                <GroupControls
                  viewOptions={viewOptions}
                  onViewOptionsChange={setViewOptions}
                />
              </div>
              <ViewControls />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-6 page-break-avoid">
          {viewMode === 'chart' ? (
            <GanttChart ref={ganttChartRef} />
          ) : viewMode === 'list' ? (
            <TaskList />
          ) : (
            <StatsDashboard tasks={tasks} />
          )}
        </div>

        {/* Stats Footer */}
        {viewMode !== 'stats' && tasks.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 no-print">
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
      <footer className="mt-12 py-6 text-center text-gray-600 text-sm no-print">
        <p>
          Built with React, TypeScript, and Tailwind CSS
        </p>
        <p className="mt-1">
          Create beautiful Gantt charts with ease
        </p>
      </footer>

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcuts
        isOpen={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />

      {/* Task Details Panel */}
      {selectedTaskData && (
        <TaskDetailsPanel
          task={selectedTaskData}
          onClose={() => setSelectedTask(null)}
          onEdit={handleEditTask}
          onDuplicate={handleDuplicateTask}
        />
      )}

      {/* Bulk Operations Bar */}
      <BulkOperations
        selectedTasks={selectedTasks}
        tasks={tasks}
        onClearSelection={handleClearSelection}
        onDeleteSelected={handleDeleteSelected}
        onDuplicateSelected={handleDuplicateSelected}
        onBulkUpdatePriority={handleBulkUpdatePriority}
        onBulkUpdateStatus={handleBulkUpdateStatus}
        onBulkUpdateAssignee={handleBulkUpdateAssignee}
      />
    </div>
  );
}

export default App;

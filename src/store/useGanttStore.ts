import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task, ThemeType, ViewOptions } from '../types';

interface GanttStore {
  tasks: Task[];
  selectedTheme: ThemeType;
  viewOptions: ViewOptions;
  selectedTask: string | null;
  history: Task[][];
  historyIndex: number;

  // Actions
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setTasks: (tasks: Task[]) => void;
  setTheme: (theme: ThemeType) => void;
  setViewOptions: (options: Partial<ViewOptions>) => void;
  setSelectedTask: (id: string | null) => void;
  clearAllTasks: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

const defaultViewOptions: ViewOptions = {
  zoom: 1,
  showWeekends: true,
  showToday: true,
  showDependencies: true,
  showProgress: true,
  showMilestones: true,
  showCriticalPath: false,
  timeScale: 'day',
};

const addToHistory = (state: GanttStore): Partial<GanttStore> => {
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push(JSON.parse(JSON.stringify(state.tasks)));
  return {
    history: newHistory.slice(-50), // Keep last 50 states
    historyIndex: Math.min(newHistory.length - 1, 49),
  };
};

export const useGanttStore = create<GanttStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      selectedTheme: 'professional',
      viewOptions: defaultViewOptions,
      selectedTask: null,
      history: [[]],
      historyIndex: 0,

      addTask: (task) =>
        set((state) => {
          const newTasks = [...state.tasks, task];
          return {
            tasks: newTasks,
            ...addToHistory(state),
          };
        }),

      updateTask: (id, updates) =>
        set((state) => {
          const newTasks = state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          );
          return {
            tasks: newTasks,
            ...addToHistory(state),
          };
        }),

      deleteTask: (id) =>
        set((state) => {
          const newTasks = state.tasks.filter((task) => task.id !== id);
          return {
            tasks: newTasks,
            selectedTask: state.selectedTask === id ? null : state.selectedTask,
            ...addToHistory(state),
          };
        }),

      setTasks: (tasks) =>
        set((state) => ({
          tasks,
          ...addToHistory(state),
        })),

      setTheme: (theme) => set({ selectedTheme: theme }),

      setViewOptions: (options) =>
        set((state) => ({
          viewOptions: { ...state.viewOptions, ...options },
        })),

      setSelectedTask: (id) => set({ selectedTask: id }),

      clearAllTasks: () =>
        set((state) => ({
          tasks: [],
          selectedTask: null,
          ...addToHistory(state),
        })),

      undo: () =>
        set((state) => {
          if (state.historyIndex > 0) {
            const newIndex = state.historyIndex - 1;
            return {
              tasks: JSON.parse(JSON.stringify(state.history[newIndex])),
              historyIndex: newIndex,
            };
          }
          return state;
        }),

      redo: () =>
        set((state) => {
          if (state.historyIndex < state.history.length - 1) {
            const newIndex = state.historyIndex + 1;
            return {
              tasks: JSON.parse(JSON.stringify(state.history[newIndex])),
              historyIndex: newIndex,
            };
          }
          return state;
        }),

      canUndo: () => get().historyIndex > 0,
      canRedo: () => get().historyIndex < get().history.length - 1,
    }),
    {
      name: 'gantt-storage',
      version: 1,
      // Custom serialization to handle Date objects
      partialize: (state) => ({
        tasks: state.tasks,
        selectedTheme: state.selectedTheme,
        viewOptions: state.viewOptions,
      }),
    }
  )
);

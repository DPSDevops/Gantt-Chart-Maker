import { create } from 'zustand';
import type { Task, ThemeType, ViewOptions } from '../types';

interface GanttStore {
  tasks: Task[];
  selectedTheme: ThemeType;
  viewOptions: ViewOptions;
  selectedTask: string | null;

  // Actions
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setTasks: (tasks: Task[]) => void;
  setTheme: (theme: ThemeType) => void;
  setViewOptions: (options: Partial<ViewOptions>) => void;
  setSelectedTask: (id: string | null) => void;
  clearAllTasks: () => void;
}

const defaultViewOptions: ViewOptions = {
  zoom: 1,
  showWeekends: true,
  showToday: true,
  showDependencies: true,
  showProgress: true,
  timeScale: 'day',
};

export const useGanttStore = create<GanttStore>((set) => ({
  tasks: [],
  selectedTheme: 'professional',
  viewOptions: defaultViewOptions,
  selectedTask: null,

  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),

  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      ),
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
      selectedTask: state.selectedTask === id ? null : state.selectedTask,
    })),

  setTasks: (tasks) => set({ tasks }),

  setTheme: (theme) => set({ selectedTheme: theme }),

  setViewOptions: (options) =>
    set((state) => ({
      viewOptions: { ...state.viewOptions, ...options },
    })),

  setSelectedTask: (id) => set({ selectedTask: id }),

  clearAllTasks: () => set({ tasks: [], selectedTask: null }),
}));

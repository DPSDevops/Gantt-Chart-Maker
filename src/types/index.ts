export interface Task {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  progress: number; // 0-100
  assignee?: string;
  dependencies?: string[]; // Array of task IDs
  color?: string;
  description?: string;
  isMilestone?: boolean; // Milestones are single-day markers
  priority?: 'low' | 'medium' | 'high' | 'critical';
  tags?: string[];
}

export interface GanttData {
  tasks: Task[];
  projectStart?: Date;
  projectEnd?: Date;
}

export type ThemeType = 'professional' | 'modern' | 'colorful' | 'dark' | 'minimal';

export interface Theme {
  name: string;
  colors: {
    background: string;
    taskBar: string;
    taskBarComplete: string;
    taskBarText: string;
    gridLine: string;
    todayLine: string;
    weekend: string;
    header: string;
    headerText: string;
    text: string;
    border: string;
    dependency: string;
  };
}

export type ExportFormat = 'png' | 'pdf' | 'json' | 'csv' | 'svg';

export interface ExportOptions {
  format: ExportFormat;
  filename?: string;
  includeHeader?: boolean;
  scale?: number;
}

export interface ViewOptions {
  zoom: number; // 0.5 to 2
  showWeekends: boolean;
  showToday: boolean;
  showDependencies: boolean;
  showProgress: boolean;
  showMilestones: boolean;
  showCriticalPath: boolean;
  timeScale: 'day' | 'week' | 'month';
}

import {
  format,
  addDays,
  differenceInDays,
  startOfDay,
  endOfDay,
  isWeekend,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from 'date-fns';

export const formatDate = (date: Date, formatString = 'MMM dd, yyyy'): string => {
  return format(date, formatString);
};

export const getDaysBetween = (start: Date, end: Date): number => {
  return differenceInDays(endOfDay(end), startOfDay(start));
};

export const getDateRange = (start: Date, end: Date): Date[] => {
  return eachDayOfInterval({ start: startOfDay(start), end: endOfDay(end) });
};

export const isDateWeekend = (date: Date): boolean => {
  return isWeekend(date);
};

export const getProjectDateRange = (
  tasks: Array<{ startDate: Date; endDate: Date }>
): { start: Date; end: Date } => {
  if (tasks.length === 0) {
    const today = new Date();
    return {
      start: startOfDay(today),
      end: endOfDay(addDays(today, 30)),
    };
  }

  const allDates = tasks.flatMap((task) => [task.startDate, task.endDate]);
  const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
  const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));

  // Add padding
  return {
    start: startOfDay(addDays(minDate, -3)),
    end: endOfDay(addDays(maxDate, 3)),
  };
};

export const getWeekRange = (date: Date): { start: Date; end: Date } => {
  return {
    start: startOfWeek(date),
    end: endOfWeek(date),
  };
};

export const getMonthRange = (date: Date): { start: Date; end: Date } => {
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  };
};

export const calculatePosition = (
  taskDate: Date,
  projectStart: Date,
  dayWidth: number
): number => {
  const daysDiff = getDaysBetween(projectStart, taskDate);
  return daysDiff * dayWidth;
};

export const calculateWidth = (
  startDate: Date,
  endDate: Date,
  dayWidth: number
): number => {
  const days = getDaysBetween(startDate, endDate) + 1; // +1 to include both start and end day
  return days * dayWidth;
};

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { Task } from '../types';
import { formatDate } from './dateUtils';

export const exportToPNG = async (
  elementId: string,
  filename = 'gantt-chart.png',
  scale = 2
): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  const canvas = await html2canvas(element, {
    scale,
    backgroundColor: '#ffffff',
    logging: false,
  });

  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

export const exportToPDF = async (
  elementId: string,
  filename = 'gantt-chart.pdf',
  scale = 2
): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  const canvas = await html2canvas(element, {
    scale,
    backgroundColor: '#ffffff',
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
    unit: 'px',
    format: [canvas.width, canvas.height],
  });

  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
  pdf.save(filename);
};

export const exportToJSON = (tasks: Task[], filename = 'gantt-data.json'): void => {
  const dataStr = JSON.stringify(tasks, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportToCSV = (tasks: Task[], filename = 'gantt-data.csv'): void => {
  const headers = [
    'ID',
    'Title',
    'Start Date',
    'End Date',
    'Progress (%)',
    'Assignee',
    'Dependencies',
    'Description',
  ];

  const rows = tasks.map((task) => [
    task.id,
    task.title,
    formatDate(task.startDate),
    formatDate(task.endDate),
    task.progress.toString(),
    task.assignee || '',
    task.dependencies?.join(';') || '',
    task.description || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportToSVG = async (
  elementId: string,
  filename = 'gantt-chart.svg'
): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  // Clone the element to avoid modifying the original
  const clone = element.cloneNode(true) as HTMLElement;
  const svgElements = clone.querySelectorAll('svg');

  if (svgElements.length === 0) {
    throw new Error('No SVG elements found');
  }

  // Get all SVG content and combine
  let svgContent = '';
  svgElements.forEach((svg) => {
    svgContent += svg.outerHTML;
  });

  // Create a wrapper SVG
  const width = element.offsetWidth;
  const height = element.offsetHeight;
  const wrappedSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  ${svgContent}
</svg>`;

  const blob = new Blob([wrappedSVG], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
};

export const importFromJSON = (file: File): Promise<Task[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const tasks = JSON.parse(e.target?.result as string);
        // Convert date strings back to Date objects
        const parsedTasks = tasks.map((task: any) => ({
          ...task,
          startDate: new Date(task.startDate),
          endDate: new Date(task.endDate),
        }));
        resolve(parsedTasks);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

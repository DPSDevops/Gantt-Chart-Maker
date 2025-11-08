# GanttMaster - Beautiful Gantt Chart Maker

Create stunning, interactive Gantt charts with ease. GanttMaster is a modern web application built with React, TypeScript, and Tailwind CSS that makes project planning and timeline visualization simple and beautiful.

![GanttMaster](https://img.shields.io/badge/Status-Production%20Ready-green)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## Features

### Core Functionality
- **Interactive Gantt Chart Visualization** - Beautiful SVG-based chart rendering
- **Task Management** - Add, edit, and delete tasks with ease
- **Task Dependencies** - Define relationships between tasks
- **Progress Tracking** - Visual progress bars for each task
- **Assignee Management** - Assign team members to tasks

### Customization
- **5 Beautiful Themes** - Professional, Modern, Colorful, Dark, and Minimal
- **Flexible View Options** - Toggle weekends, progress bars, and today line
- **Zoom Controls** - Adjust timeline scale from 50% to 200%
- **Custom Colors** - Choose custom colors for each task

### Data Management
- **Multiple Templates** - Quick start with Software Development, Marketing, or Construction templates
- **Import/Export** - Save and load your charts in JSON format
- **Export Options** - Download as PNG, PDF, JSON, or CSV
- **Sample Data** - Pre-loaded example to get started quickly

### User Experience
- **Dual View Modes** - Switch between Chart view and List view
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Interactive Tooltips** - Hover for detailed task information
- **Real-time Stats** - Track total, completed, and in-progress tasks

## Screenshots

### Chart View
The main Gantt chart displays tasks on a timeline with progress indicators, dependencies, and customizable colors.

### List View
View all tasks in a table format with detailed information and quick edit/delete actions.

### Multiple Themes
Choose from 5 carefully designed themes to match your preference or brand.

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/DPSDevops/Gantt-Chart-Maker.git
cd Gantt-Chart-Maker
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Usage Guide

### Creating Your First Task

1. Click the **"Add Task"** button
2. Fill in the task details:
   - Task title (required)
   - Start and end dates (required)
   - Progress (0-100%)
   - Assignee name
   - Task color
   - Description
   - Dependencies (select from existing tasks)
3. Click **"Create Task"**

### Using Templates

1. Click the **"Templates"** button
2. Choose from:
   - **Software Development** - 7 tasks covering planning to deployment
   - **Marketing Campaign** - 5 tasks for campaign execution
   - **Construction Project** - 5 tasks from site prep to finishing
3. The template will load with pre-configured tasks

### Customizing the View

**Zoom Controls:**
- Use + and - buttons to zoom in/out (50% to 200%)

**Toggle Options:**
- **Weekends** - Highlight weekend columns
- **Today Line** - Show current date indicator
- **Progress** - Display progress bars on tasks

**Themes:**
- Select from the theme dropdown to change the entire color scheme

### Exporting Your Chart

1. Click the **"Export"** button
2. Choose your format:
   - **PNG** - High-quality image (2x resolution)
   - **PDF** - Printable PDF document
   - **JSON** - Data file (can be re-imported)
   - **CSV** - Spreadsheet-compatible format

### Importing Data

1. Click **"Import JSON"**
2. Select a previously exported JSON file
3. Your tasks will be loaded

## Technology Stack

- **Framework:** React 18
- **Language:** TypeScript 5
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS 3
- **State Management:** Zustand
- **Date Handling:** date-fns
- **Icons:** Lucide React
- **Export:** html2canvas, jsPDF

## Project Structure

```
src/
├── components/          # React components
│   ├── GanttChart/     # Main chart visualization
│   ├── TaskForm/       # Task creation/editing
│   ├── TaskList/       # List view of tasks
│   ├── ThemeSelector/  # Theme switching
│   ├── ExportMenu/     # Export functionality
│   └── ViewControls/   # Zoom and view options
├── store/              # Zustand state management
├── types/              # TypeScript type definitions
├── themes/             # Theme configurations
├── utils/              # Utility functions
│   ├── dateUtils.ts   # Date calculations
│   ├── exportUtils.ts # Export/import logic
│   └── sampleData.ts  # Templates and examples
└── App.tsx            # Main application component
```

## API Reference

### Task Interface

```typescript
interface Task {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  progress: number; // 0-100
  assignee?: string;
  dependencies?: string[]; // Array of task IDs
  color?: string;
  description?: string;
}
```

### Available Themes

- `professional` - Blue corporate theme
- `modern` - Purple contemporary theme
- `colorful` - Vibrant multi-color theme
- `dark` - Dark mode theme
- `minimal` - Clean black and white theme

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Future Enhancements

- [ ] Drag-and-drop task rescheduling
- [ ] Critical path highlighting
- [ ] Resource allocation view
- [ ] Collaboration features
- [ ] Cloud sync
- [ ] More export formats (Excel, SVG)
- [ ] Milestone markers
- [ ] Task notes and attachments
- [ ] Undo/redo functionality
- [ ] Keyboard shortcuts

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with love using React and TypeScript
- Inspired by modern project management tools
- Icons by Lucide
- Color palettes from Tailwind CSS

## Support

For support, please open an issue on GitHub or contact the development team.

---

**Made with ❤️ for project managers and teams everywhere**

import React, { useMemo, useRef, useState } from 'react';
import { useGanttStore } from '../../store/useGanttStore';
import { themes } from '../../themes';
import {
  formatDate,
  getProjectDateRange,
  getDateRange,
  calculatePosition,
  calculateWidth,
  isDateWeekend,
} from '../../utils/dateUtils';

const ROW_HEIGHT = 50;
const TASK_HEIGHT = 32;
const HEADER_HEIGHT = 80;
const SIDEBAR_WIDTH = 250;
const DAY_WIDTH_BASE = 40;

export const GanttChart: React.FC = () => {
  const { tasks, selectedTheme, viewOptions, selectedTask, setSelectedTask } =
    useGanttStore();
  const theme = themes[selectedTheme];
  const chartRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    content: string;
  } | null>(null);

  const dayWidth = DAY_WIDTH_BASE * viewOptions.zoom;

  const { projectStart, dateRange, totalDays } = useMemo(() => {
    const range = getProjectDateRange(tasks);
    const dates = getDateRange(range.start, range.end);
    return {
      projectStart: range.start,
      dateRange: dates,
      totalDays: dates.length,
    };
  }, [tasks]);

  const chartWidth = totalDays * dayWidth;
  const chartHeight = tasks.length * ROW_HEIGHT + HEADER_HEIGHT;

  const handleTaskClick = (taskId: string) => {
    setSelectedTask(selectedTask === taskId ? null : taskId);
  };

  const handleTaskHover = (
    e: React.MouseEvent,
    taskTitle: string,
    taskDates: string
  ) => {
    setTooltip({
      x: e.clientX,
      y: e.clientY,
      content: `${taskTitle}\n${taskDates}`,
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <p className="text-xl font-semibold mb-2">No tasks yet</p>
          <p className="text-sm">Add tasks to see your Gantt chart</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        id="gantt-chart-container"
        ref={chartRef}
        className="overflow-auto border rounded-lg shadow-lg scrollbar-hide"
        style={{
          maxHeight: '600px',
          backgroundColor: theme.colors.background,
        }}
      >
        <div
          style={{
            width: SIDEBAR_WIDTH + chartWidth,
            height: chartHeight,
            position: 'relative',
          }}
        >
          {/* Header */}
          <div
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 20,
              height: HEADER_HEIGHT,
            }}
          >
            {/* Task Header */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: SIDEBAR_WIDTH,
                height: HEADER_HEIGHT,
                backgroundColor: theme.colors.header,
                borderRight: `2px solid ${theme.colors.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                color: theme.colors.headerText,
                zIndex: 21,
              }}
            >
              Tasks
            </div>

            {/* Timeline Header */}
            <div
              style={{
                position: 'absolute',
                left: SIDEBAR_WIDTH,
                top: 0,
                width: chartWidth,
                height: HEADER_HEIGHT,
                backgroundColor: theme.colors.header,
              }}
            >
              <svg width={chartWidth} height={HEADER_HEIGHT}>
                {dateRange.map((date, index) => {
                  const x = index * dayWidth;
                  const isWeekend = isDateWeekend(date);
                  const isFirst = date.getDate() === 1;

                  return (
                    <g key={index}>
                      {/* Weekend background */}
                      {viewOptions.showWeekends && isWeekend && (
                        <rect
                          x={x}
                          y={0}
                          width={dayWidth}
                          height={HEADER_HEIGHT}
                          fill={theme.colors.weekend}
                          opacity={0.3}
                        />
                      )}

                      {/* Month label */}
                      {isFirst && (
                        <text
                          x={x + 5}
                          y={20}
                          fill={theme.colors.headerText}
                          fontSize="14"
                          fontWeight="bold"
                        >
                          {formatDate(date, 'MMM yyyy')}
                        </text>
                      )}

                      {/* Day label */}
                      <text
                        x={x + dayWidth / 2}
                        y={50}
                        fill={theme.colors.headerText}
                        fontSize="12"
                        textAnchor="middle"
                      >
                        {formatDate(date, 'dd')}
                      </text>

                      {/* Day name */}
                      <text
                        x={x + dayWidth / 2}
                        y={68}
                        fill={theme.colors.headerText}
                        fontSize="10"
                        textAnchor="middle"
                        opacity={0.7}
                      >
                        {formatDate(date, 'EEE')}
                      </text>

                      {/* Grid line */}
                      <line
                        x1={x}
                        y1={0}
                        x2={x}
                        y2={HEADER_HEIGHT}
                        stroke={theme.colors.gridLine}
                        strokeWidth="1"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Tasks */}
          {tasks.map((task, taskIndex) => {
            const y = taskIndex * ROW_HEIGHT + HEADER_HEIGHT;
            const taskX = calculatePosition(task.startDate, projectStart, dayWidth);
            const taskWidth = calculateWidth(task.startDate, task.endDate, dayWidth);
            const isSelected = selectedTask === task.id;

            return (
              <div key={task.id} style={{ position: 'absolute', top: y, width: '100%' }}>
                {/* Task Name Sidebar */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: SIDEBAR_WIDTH,
                    height: ROW_HEIGHT,
                    backgroundColor: theme.colors.background,
                    borderRight: `2px solid ${theme.colors.border}`,
                    borderBottom: `1px solid ${theme.colors.gridLine}`,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 12px',
                    zIndex: 10,
                  }}
                >
                  <div className="truncate" title={task.title}>
                    <div
                      style={{
                        fontWeight: isSelected ? 'bold' : 'normal',
                        color: theme.colors.text,
                        fontSize: '14px',
                      }}
                    >
                      {task.title}
                    </div>
                    {task.assignee && (
                      <div
                        style={{
                          fontSize: '11px',
                          color: theme.colors.text,
                          opacity: 0.6,
                        }}
                      >
                        {task.assignee}
                      </div>
                    )}
                  </div>
                </div>

                {/* Chart Area */}
                <div
                  style={{
                    position: 'absolute',
                    left: SIDEBAR_WIDTH,
                    top: 0,
                    width: chartWidth,
                    height: ROW_HEIGHT,
                  }}
                >
                  <svg width={chartWidth} height={ROW_HEIGHT}>
                    {/* Grid and weekend backgrounds */}
                    {dateRange.map((date, index) => {
                      const x = index * dayWidth;
                      const isWeekend = isDateWeekend(date);

                      return (
                        <g key={index}>
                          {viewOptions.showWeekends && isWeekend && (
                            <rect
                              x={x}
                              y={0}
                              width={dayWidth}
                              height={ROW_HEIGHT}
                              fill={theme.colors.weekend}
                              opacity={0.2}
                            />
                          )}
                          <line
                            x1={x}
                            y1={0}
                            x2={x}
                            y2={ROW_HEIGHT}
                            stroke={theme.colors.gridLine}
                            strokeWidth="1"
                          />
                        </g>
                      );
                    })}

                    {/* Task Bar */}
                    <g>
                      {/* Background bar */}
                      <rect
                        x={taskX}
                        y={(ROW_HEIGHT - TASK_HEIGHT) / 2}
                        width={taskWidth}
                        height={TASK_HEIGHT}
                        fill={task.color || theme.colors.taskBar}
                        rx={4}
                        opacity={0.3}
                        stroke={isSelected ? '#000' : 'none'}
                        strokeWidth={isSelected ? 2 : 0}
                      />

                      {/* Progress bar */}
                      {viewOptions.showProgress && task.progress > 0 && (
                        <rect
                          x={taskX}
                          y={(ROW_HEIGHT - TASK_HEIGHT) / 2}
                          width={taskWidth * (task.progress / 100)}
                          height={TASK_HEIGHT}
                          fill={task.color || theme.colors.taskBarComplete}
                          rx={4}
                          stroke={isSelected ? '#000' : 'none'}
                          strokeWidth={isSelected ? 2 : 0}
                        />
                      )}

                      {/* Clickable overlay */}
                      <rect
                        x={taskX}
                        y={(ROW_HEIGHT - TASK_HEIGHT) / 2}
                        width={taskWidth}
                        height={TASK_HEIGHT}
                        fill="transparent"
                        rx={4}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleTaskClick(task.id)}
                        onMouseEnter={(e) =>
                          handleTaskHover(
                            e,
                            task.title,
                            `${formatDate(task.startDate)} - ${formatDate(task.endDate)}`
                          )
                        }
                        onMouseLeave={handleMouseLeave}
                      />

                      {/* Progress text */}
                      {viewOptions.showProgress && taskWidth > 50 && (
                        <text
                          x={taskX + taskWidth / 2}
                          y={ROW_HEIGHT / 2 + 5}
                          fill={theme.colors.taskBarText}
                          fontSize="12"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {task.progress}%
                        </text>
                      )}
                    </g>

                    {/* Horizontal row line */}
                    <line
                      x1={0}
                      y1={ROW_HEIGHT}
                      x2={chartWidth}
                      y2={ROW_HEIGHT}
                      stroke={theme.colors.gridLine}
                      strokeWidth="1"
                    />
                  </svg>
                </div>
              </div>
            );
          })}

          {/* Today line */}
          {viewOptions.showToday && (
            <div
              style={{
                position: 'absolute',
                left:
                  SIDEBAR_WIDTH +
                  calculatePosition(new Date(), projectStart, dayWidth),
                top: 0,
                width: 2,
                height: chartHeight,
                backgroundColor: theme.colors.todayLine,
                zIndex: 5,
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: HEADER_HEIGHT - 20,
                  left: 5,
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: theme.colors.todayLine,
                  whiteSpace: 'nowrap',
                }}
              >
                Today
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x + 10,
            top: tooltip.y + 10,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            zIndex: 1000,
            pointerEvents: 'none',
            whiteSpace: 'pre-line',
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

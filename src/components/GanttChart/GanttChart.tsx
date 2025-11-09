import React, { useMemo, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
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
import { calculateCriticalPath, groupTasks } from '../../utils/ganttUtils';
import type { TaskGroup } from '../../types';

const ROW_HEIGHT = 50;
const TASK_HEIGHT = 32;
const HEADER_HEIGHT = 80;
const GROUP_HEADER_HEIGHT = 40;
const SIDEBAR_WIDTH = 250;
const DAY_WIDTH_BASE = 40;
const WEEK_WIDTH_BASE = 80;
const MONTH_WIDTH_BASE = 120;

export interface GanttChartRef {
  scrollToToday: () => void;
}

export const GanttChart = forwardRef<GanttChartRef>((_, ref) => {
  const { tasks, selectedTheme, viewOptions, selectedTask, setSelectedTask } =
    useGanttStore();
  const theme = themes[selectedTheme];
  const chartRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    content: string;
  } | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  // Calculate critical path
  const criticalPath = useMemo(() => {
    if (viewOptions.showCriticalPath) {
      return calculateCriticalPath(tasks);
    }
    return new Set<string>();
  }, [tasks, viewOptions.showCriticalPath]);

  // Group tasks
  const taskGroups: TaskGroup[] = useMemo(() => {
    return groupTasks(tasks, viewOptions.groupBy || 'none', collapsedGroups);
  }, [tasks, viewOptions.groupBy, collapsedGroups]);

  // Calculate day width based on time scale
  const baseDayWidth = useMemo(() => {
    switch (viewOptions.timeScale) {
      case 'week':
        return WEEK_WIDTH_BASE / 7;
      case 'month':
        return MONTH_WIDTH_BASE / 30;
      default:
        return DAY_WIDTH_BASE;
    }
  }, [viewOptions.timeScale]);

  const dayWidth = baseDayWidth * viewOptions.zoom;

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

  // Calculate total visible tasks (accounting for collapsed groups)
  const visibleTasks = useMemo(() => {
    return taskGroups.reduce((acc, group) => {
      if (!group.isCollapsed) {
        return acc + group.tasks.length;
      }
      return acc;
    }, 0);
  }, [taskGroups]);

  const chartHeight =
    (viewOptions.groupBy && viewOptions.groupBy !== 'none'
      ? taskGroups.length * GROUP_HEADER_HEIGHT + visibleTasks * ROW_HEIGHT
      : tasks.length * ROW_HEIGHT) + HEADER_HEIGHT;

  // Expose scrollToToday method
  useImperativeHandle(ref, () => ({
    scrollToToday: () => {
      if (chartRef.current) {
        const todayX = calculatePosition(new Date(), projectStart, dayWidth);
        chartRef.current.scrollTo({
          left: todayX + SIDEBAR_WIDTH - chartRef.current.clientWidth / 2,
          behavior: 'smooth',
        });
      }
    },
  }));

  const handleTaskClick = (taskId: string) => {
    setSelectedTask(selectedTask === taskId ? null : taskId);
  };

  const handleTaskHover = (
    e: React.MouseEvent,
    taskTitle: string,
    taskDates: string,
    assignee?: string,
    progress?: number
  ) => {
    const details = [
      taskTitle,
      taskDates,
      assignee && `Assignee: ${assignee}`,
      progress !== undefined && `Progress: ${progress}%`,
    ]
      .filter(Boolean)
      .join('\n');

    setTooltip({
      x: e.clientX,
      y: e.clientY,
      content: details,
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  const toggleGroupCollapse = (groupKey: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupKey)) {
        next.delete(groupKey);
      } else {
        next.add(groupKey);
      }
      return next;
    });
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

  // Render task rows with grouping support
  let currentY = HEADER_HEIGHT;
  const taskRows: React.ReactElement[] = [];

  taskGroups.forEach((group) => {
    // Render group header if grouping is enabled
    if (viewOptions.groupBy && viewOptions.groupBy !== 'none') {
      const groupHeaderY = currentY;
      taskRows.push(
        <div
          key={`group-${group.key}`}
          style={{ position: 'absolute', top: groupHeaderY, width: '100%' }}
        >
          {/* Group Header Sidebar */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: SIDEBAR_WIDTH,
              height: GROUP_HEADER_HEIGHT,
              backgroundColor: group.color || theme.colors.header,
              borderRight: `2px solid ${theme.colors.border}`,
              borderBottom: `2px solid ${theme.colors.border}`,
              display: 'flex',
              alignItems: 'center',
              padding: '0 12px',
              zIndex: 10,
              cursor: 'pointer',
              opacity: 0.9,
            }}
            onClick={() => toggleGroupCollapse(group.key)}
          >
            {group.isCollapsed ? (
              <ChevronRight size={20} color="white" />
            ) : (
              <ChevronDown size={20} color="white" />
            )}
            <div className="ml-2 truncate flex-1">
              <div
                style={{
                  fontWeight: 'bold',
                  color: 'white',
                  fontSize: '14px',
                }}
              >
                {group.label}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: 'white',
                  opacity: 0.8,
                }}
              >
                {group.tasks.length} task{group.tasks.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Group Header Chart Area */}
          <div
            style={{
              position: 'absolute',
              left: SIDEBAR_WIDTH,
              top: 0,
              width: chartWidth,
              height: GROUP_HEADER_HEIGHT,
              backgroundColor: group.color || theme.colors.header,
              borderBottom: `2px solid ${theme.colors.border}`,
              opacity: 0.3,
            }}
          />
        </div>
      );
      currentY += GROUP_HEADER_HEIGHT;
    }

    // Render tasks in group
    if (!group.isCollapsed) {
      group.tasks.forEach((task) => {
        const y = currentY;
        const taskX = calculatePosition(task.startDate, projectStart, dayWidth);
        const taskWidth = calculateWidth(task.startDate, task.endDate, dayWidth);
        const isSelected = selectedTask === task.id;
        const isCritical = criticalPath.has(task.id);

        taskRows.push(
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
                  {isCritical && '⚡ '}
                  {task.title}
                  {task.isMilestone && ' 🏁'}
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

                {/* Task Bar or Milestone */}
                <g>
                  {task.isMilestone && viewOptions.showMilestones ? (
                    /* Milestone Diamond */
                    <>
                      <polygon
                        points={`${taskX + 16},${ROW_HEIGHT / 2 - 16} ${taskX + 32},${ROW_HEIGHT / 2} ${taskX + 16},${ROW_HEIGHT / 2 + 16} ${taskX},${ROW_HEIGHT / 2}`}
                        fill={
                          isCritical ? '#ef4444' : task.color || theme.colors.taskBar
                        }
                        stroke={isSelected ? '#000' : isCritical ? '#dc2626' : theme.colors.border}
                        strokeWidth={isSelected ? 3 : isCritical ? 3 : 2}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleTaskClick(task.id)}
                        onMouseEnter={(e) =>
                          handleTaskHover(
                            e,
                            `🏁 ${task.title}`,
                            formatDate(task.startDate),
                            task.assignee,
                            task.progress
                          )
                        }
                        onMouseLeave={handleMouseLeave}
                      />
                    </>
                  ) : (
                    /* Regular Task Bar */
                    <>
                      {/* Background bar */}
                      <rect
                        x={taskX}
                        y={(ROW_HEIGHT - TASK_HEIGHT) / 2}
                        width={taskWidth}
                        height={TASK_HEIGHT}
                        fill={
                          isCritical ? '#fecaca' : task.color || theme.colors.taskBar
                        }
                        rx={4}
                        opacity={0.3}
                        stroke={isSelected ? '#000' : isCritical ? '#dc2626' : 'none'}
                        strokeWidth={isSelected ? 2 : isCritical ? 2 : 0}
                      />

                      {/* Progress bar */}
                      {viewOptions.showProgress && task.progress > 0 && (
                        <rect
                          x={taskX}
                          y={(ROW_HEIGHT - TASK_HEIGHT) / 2}
                          width={taskWidth * (task.progress / 100)}
                          height={TASK_HEIGHT}
                          fill={
                            isCritical
                              ? '#ef4444'
                              : task.color || theme.colors.taskBarComplete
                          }
                          rx={4}
                          stroke={isSelected ? '#000' : isCritical ? '#dc2626' : 'none'}
                          strokeWidth={isSelected ? 2 : isCritical ? 2 : 0}
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
                            `${formatDate(task.startDate)} - ${formatDate(task.endDate)}`,
                            task.assignee,
                            task.progress
                          )
                        }
                        onMouseLeave={handleMouseLeave}
                      />

                      {/* Critical path indicator */}
                      {isCritical && (
                        <text
                          x={taskX - 20}
                          y={ROW_HEIGHT / 2 + 5}
                          fill="#ef4444"
                          fontSize="16"
                          fontWeight="bold"
                        >
                          ⚡
                        </text>
                      )}
                    </>
                  )}

                  {/* Progress text */}
                  {viewOptions.showProgress && taskWidth > 50 && !task.isMilestone && (
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

        currentY += ROW_HEIGHT;
      });
    }
  });

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
                  const isMonday = date.getDay() === 1;

                  // Determine what to show based on time scale
                  const showMonthLabel =
                    (viewOptions.timeScale === 'day' && isFirst) ||
                    (viewOptions.timeScale === 'week' && isFirst) ||
                    (viewOptions.timeScale === 'month' && isFirst);

                  const showDayLabel = viewOptions.timeScale === 'day';
                  const showWeekLabel =
                    viewOptions.timeScale === 'week' && isMonday;

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
                      {showMonthLabel && (
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
                      {showDayLabel && (
                        <>
                          <text
                            x={x + dayWidth / 2}
                            y={50}
                            fill={theme.colors.headerText}
                            fontSize="12"
                            textAnchor="middle"
                          >
                            {formatDate(date, 'dd')}
                          </text>
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
                        </>
                      )}

                      {/* Week label */}
                      {showWeekLabel && (
                        <text
                          x={x + 5}
                          y={50}
                          fill={theme.colors.headerText}
                          fontSize="11"
                        >
                          Week {Math.ceil(date.getDate() / 7)}
                        </text>
                      )}

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

          {/* Task Rows (with grouping) */}
          {taskRows}

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
});

GanttChart.displayName = 'GanttChart';

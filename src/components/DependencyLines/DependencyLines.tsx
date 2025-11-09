import React from 'react';
import type { Task } from '../../types';

interface DependencyLinesProps {
  tasks: Task[];
  getTaskPosition: (taskId: string) => { x: number; y: number; width: number } | null;
  color: string;
}

export const DependencyLines: React.FC<DependencyLinesProps> = ({
  tasks,
  getTaskPosition,
  color,
}) => {
  const lines: Array<{ fromX: number; fromY: number; toX: number; toY: number; taskId: string }> = [];

  // Calculate all dependency lines
  tasks.forEach(task => {
    if (task.dependencies && task.dependencies.length > 0) {
      const toPos = getTaskPosition(task.id);
      if (!toPos) return;

      task.dependencies.forEach(depId => {
        const fromPos = getTaskPosition(depId);
        if (!fromPos) return;

        // Calculate line positions
        // From: end of dependency task (right side, middle)
        // To: start of current task (left side, middle)
        const fromX = fromPos.x + fromPos.width;
        const fromY = fromPos.y;
        const toX = toPos.x;
        const toY = toPos.y;

        lines.push({ fromX, fromY, toX, toY, taskId: task.id });
      });
    }
  });

  if (lines.length === 0) return null;

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 3,
      }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon points="0 0, 10 3, 0 6" fill={color} />
        </marker>
      </defs>

      {lines.map((line, index) => {
        const { fromX, fromY, toX, toY } = line;

        // Calculate control points for curved line
        const midX = (fromX + toX) / 2;

        // Determine line style based on relative positions
        if (toX > fromX) {
          // Forward dependency (normal case)
          // Use a simple curved line
          const path = `M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`;

          return (
            <path
              key={`${line.taskId}-${index}`}
              d={path}
              stroke={color}
              strokeWidth="2"
              fill="none"
              markerEnd="url(#arrowhead)"
              opacity="0.6"
            />
          );
        } else {
          // Backward dependency (task depends on a later task)
          // Use a more complex path that goes around
          const offsetY = 20;
          const path = `M ${fromX} ${fromY}
                       L ${fromX + 15} ${fromY}
                       L ${fromX + 15} ${fromY < toY ? fromY - offsetY : fromY + offsetY}
                       L ${toX - 15} ${fromY < toY ? fromY - offsetY : fromY + offsetY}
                       L ${toX - 15} ${toY}
                       L ${toX} ${toY}`;

          return (
            <path
              key={`${line.taskId}-${index}`}
              d={path}
              stroke={color}
              strokeWidth="2"
              fill="none"
              markerEnd="url(#arrowhead)"
              opacity="0.6"
              strokeDasharray="4 2"
            />
          );
        }
      })}
    </svg>
  );
};

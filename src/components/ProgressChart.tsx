import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { TrendingUp, Award, Calendar } from 'lucide-react';

export const ProgressChart: React.FC = () => {
  const { progressHistory, language } = useGameStore();
  const isEl = language === 'el';
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const data = progressHistory || [];
  const maxXP = Math.max(...data.map((d) => d.xp), 1000);

  // SVG dimensions
  const width = 650;
  const height = 240;
  const paddingX = 45;
  const paddingY = 30;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Calculate coordinates
  const points = data.map((d, i) => {
    const x = paddingX + (i / Math.max(1, data.length - 1)) * chartWidth;
    const y = height - paddingY - (d.xp / maxXP) * chartHeight;
    return { x, y, data: d };
  });

  const linePath = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
    : '';

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-500" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            {isEl ? 'Εβδομαδιαία Εξέλιξη XP & Ασκήσεων' : 'Weekly XP & Exercise Growth'}
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {isEl ? 'Τελευταίες 7 Ημέρες' : 'Last 7 Days'}
        </span>
      </div>

      {/* Responsive SVG Chart */}
      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          <defs>
            <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = height - paddingY - ratio * chartHeight;
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#334155"
                  strokeOpacity="0.2"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="#94a3b8"
                  fontFamily="monospace"
                >
                  {Math.round(ratio * maxXP)}
                </text>
              </g>
            );
          })}

          {/* Fill Area */}
          <path d={areaPath} fill="url(#xpGradient)" />

          {/* Stroke Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#6366f1"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((p, i) => {
            const isHovered = hoveredIdx === i;
            return (
              <g key={i}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 7 : 5}
                  fill="#ffffff"
                  stroke="#6366f1"
                  strokeWidth="3"
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
                <text
                  x={p.x}
                  y={height - 10}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="bold"
                  fill={isHovered ? '#6366f1' : '#64748b'}
                >
                  {isEl ? p.data.dayEl : p.data.day}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredIdx !== null && points[hoveredIdx] && (
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1.5 px-3 rounded-xl shadow-lg border border-slate-700 pointer-events-none flex items-center gap-3 animate-in fade-in zoom-in-95"
          >
            <span className="font-bold text-indigo-300">
              {isEl ? points[hoveredIdx].data.dayEl : points[hoveredIdx].data.day}:
            </span>
            <span>⭐ {points[hoveredIdx].data.xp} XP</span>
            <span>🎯 {points[hoveredIdx].data.exercisesSolved} {isEl ? 'ασκήσεις' : 'solved'}</span>
          </div>
        )}
      </div>
    </div>
  );
};

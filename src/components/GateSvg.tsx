import React from 'react';
import { ComponentType } from '../types';

interface GateSvgProps {
  type: ComponentType;
  width?: number;
  height?: number;
  active?: boolean;
  className?: string;
}

export const GateSvg: React.FC<GateSvgProps> = ({
  type,
  width = 60,
  height = 40,
  active = false,
  className = '',
}) => {
  const strokeColor = active ? '#10b981' : '#64748b';
  const fillColor = active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(241, 245, 249, 0.9)';

  switch (type) {
    case 'AND':
      return (
        <svg width={width} height={height} viewBox="0 0 70 50" className={className}>
          <path
            d="M 10 5 L 35 5 C 50 5 60 15 60 25 C 60 35 50 45 35 45 L 10 45 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'OR':
      return (
        <svg width={width} height={height} viewBox="0 0 70 50" className={className}>
          <path
            d="M 10 5 Q 25 25 10 45 Q 40 45 60 25 Q 40 5 10 5 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'NOT':
      return (
        <svg width={width} height={height} viewBox="0 0 70 50" className={className}>
          <polygon
            points="10,5 50,25 10,45"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="3"
          />
          <circle cx="56" cy="25" r="4" fill="white" stroke={strokeColor} strokeWidth="2.5" />
        </svg>
      );

    case 'BUFFER':
      return (
        <svg width={width} height={height} viewBox="0 0 70 50" className={className}>
          <polygon
            points="10,5 55,25 10,45"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="3"
          />
        </svg>
      );

    case 'NAND':
      return (
        <svg width={width} height={height} viewBox="0 0 75 50" className={className}>
          <path
            d="M 10 5 L 35 5 C 48 5 56 15 56 25 C 56 35 48 45 35 45 L 10 45 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle cx="62" cy="25" r="4" fill="white" stroke={strokeColor} strokeWidth="2.5" />
        </svg>
      );

    case 'NOR':
      return (
        <svg width={width} height={height} viewBox="0 0 75 50" className={className}>
          <path
            d="M 10 5 Q 23 25 10 45 Q 38 45 55 25 Q 38 5 10 5 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle cx="61" cy="25" r="4" fill="white" stroke={strokeColor} strokeWidth="2.5" />
        </svg>
      );

    case 'XOR':
      return (
        <svg width={width} height={height} viewBox="0 0 75 50" className={className}>
          <path
            d="M 5 5 Q 20 25 5 45"
            fill="none"
            stroke={strokeColor}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 13 5 Q 28 25 13 45 Q 43 45 63 25 Q 43 5 13 5 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'XNOR':
      return (
        <svg width={width} height={height} viewBox="0 0 80 50" className={className}>
          <path
            d="M 5 5 Q 20 25 5 45"
            fill="none"
            stroke={strokeColor}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 13 5 Q 28 25 13 45 Q 41 45 58 25 Q 41 5 13 5 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle cx="64" cy="25" r="4" fill="white" stroke={strokeColor} strokeWidth="2.5" />
        </svg>
      );

    case 'LED':
      return (
        <svg width={width} height={height} viewBox="0 0 50 50" className={className}>
          <circle
            cx="25"
            cy="25"
            r="16"
            fill={active ? '#22c55e' : '#e2e8f0'}
            stroke={active ? '#15803d' : '#94a3b8'}
            strokeWidth="2.5"
            filter={active ? 'drop-shadow(0 0 8px #22c55e)' : 'none'}
          />
          <circle cx="21" cy="20" r="4" fill="white" opacity={active ? 0.7 : 0.3} />
        </svg>
      );

    case 'SWITCH':
      return (
        <svg width={width} height={height} viewBox="0 0 60 40" className={className}>
          <rect x="5" y="8" width="50" height="24" rx="12" fill={active ? '#22c55e' : '#cbd5e1'} />
          <circle
            cx={active ? 43 : 17}
            cy="20"
            r="9"
            fill="white"
            stroke={active ? '#15803d' : '#64748b'}
            strokeWidth="2"
            filter="drop-shadow(0 1px 3px rgba(0,0,0,0.2))"
          />
        </svg>
      );

    case 'CLOCK':
      return (
        <svg width={width} height={height} viewBox="0 0 50 50" className={className}>
          <circle cx="25" cy="25" r="18" fill="none" stroke={strokeColor} strokeWidth="2.5" />
          <path d="M 15 25 L 20 25 L 20 18 L 30 18 L 30 32 L 35 32" fill="none" stroke={strokeColor} strokeWidth="2" />
        </svg>
      );

    default:
      return (
        <svg width={width} height={height} viewBox="0 0 50 50">
          <rect x="5" y="5" width="40" height="40" rx="6" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" />
        </svg>
      );
  }
};

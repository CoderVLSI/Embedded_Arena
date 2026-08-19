import React from 'react';
import { CircuitComponent } from '../../types/circuit';
import { getComponentPins } from '../canvas/PinDefinitionRegistry';

interface Props {
  component: CircuitComponent;
  isLit?: boolean;
  onPinClick?: (pinId: string, e: React.MouseEvent) => void;
  selectedPin?: string | null;
}

export const Led: React.FC<Props> = ({ component, isLit, onPinClick, selectedPin }) => {
  const pins = getComponentPins(component.type);
  const color = component.attrs?.color || 'red';

  const getColorHex = (c: string) => {
    switch (c) {
      case 'red': return '#ef4444';
      case 'green': return '#22c55e';
      case 'blue': return '#3b82f6';
      case 'yellow': return '#eab308';
      case 'orange': return '#f97316';
      case 'white': return '#f8fafc';
      default: return '#ef4444';
    }
  };

  const hex = getColorHex(color);

  return (
    <div className="relative select-none pointer-events-auto" style={{ width: 40, height: 60 }}>
      <svg width="40" height="60" viewBox="0 0 40 60" className="overflow-visible">
        {/* Glow effect when lit */}
        {isLit && (
          <circle
            cx="20"
            cy="20"
            r="22"
            fill={hex}
            opacity="0.6"
            className="blur-md animate-pulse"
          />
        )}

        {/* LED Bulb Dome */}
        <path
          d="M 10 24 A 10 10 0 0 1 30 24 L 30 28 A 2 2 0 0 1 28 30 L 12 30 A 2 2 0 0 1 10 28 Z"
          fill={isLit ? hex : `${hex}88`}
          stroke={isLit ? '#ffffff' : hex}
          strokeWidth="1.2"
        />

        {/* Inner Reflector Cup & Die */}
        <path d="M 16 26 L 18 20 L 22 20 L 24 26 Z" fill={isLit ? '#ffffff' : '#475569'} opacity="0.8" />
        <circle cx="20" cy="18" r="1.5" fill={isLit ? '#ffffff' : '#94a3b8'} />

        {/* LED Rim Base */}
        <rect x="8" y="28" width="24" height="4" rx="1" fill={hex} stroke="#334155" strokeWidth="0.8" />

        {/* Pin Legs (Anode with bent knee, Cathode straight) */}
        {pins.map((pin) => {
          const isSelected = selectedPin === `${component.id}:${pin.id}`;
          const isAnode = pin.id === 'A';
          return (
            <g
              key={pin.id}
              className="cursor-pointer group"
              onClick={(e) => onPinClick && onPinClick(pin.id, e)}
            >
              {isAnode ? (
                <path d="M 16 32 L 16 38 L 12 42 L 12 48" stroke="#cbd5e1" strokeWidth="2" fill="none" />
              ) : (
                <path d="M 24 32 L 24 48" stroke="#cbd5e1" strokeWidth="2" fill="none" />
              )}
              <circle
                cx={pin.x}
                cy={pin.y}
                r="3.5"
                fill={isSelected ? '#38bdf8' : '#e2e8f0'}
                stroke={isSelected ? '#0284c7' : '#64748b'}
                strokeWidth="1.5"
              />
              <text x={pin.x} y={pin.y + 10} fill="#94a3b8" fontSize="6" textAnchor="middle" className="font-mono">
                {pin.name.includes('Anode') ? 'A' : 'C'}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

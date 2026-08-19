import React from 'react';
import { CircuitComponent } from '../../types/circuit';
import { getComponentPins } from '../canvas/PinDefinitionRegistry';

interface Props {
  component: CircuitComponent;
  isActive?: boolean;
  onPinClick?: (pinId: string, e: React.MouseEvent) => void;
  selectedPin?: string | null;
}

export const Buzzer: React.FC<Props> = ({ component, isActive, onPinClick, selectedPin }) => {
  const pins = getComponentPins(component.type);

  return (
    <div className="relative select-none pointer-events-auto" style={{ width: 60, height: 60 }}>
      <svg width="60" height="60" viewBox="0 0 60 60" className="overflow-visible drop-shadow-md">
        {/* Sound Waves Animation when active */}
        {isActive && (
          <>
            <circle cx="30" cy="30" r="28" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6" className="animate-ping" />
            <circle cx="30" cy="30" r="22" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.8" />
          </>
        )}

        {/* Outer Black Plastic Ring */}
        <circle cx="30" cy="30" r="24" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
        <circle cx="30" cy="30" r="20" fill="#27272a" />
        <circle cx="30" cy="30" r="14" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />

        {/* Acoustic Center Hole */}
        <circle cx="30" cy="30" r="4" fill="#09090b" stroke="#71717a" strokeWidth="0.8" />
        <circle cx="30" cy="30" r="1.5" fill="#d4d4d8" />

        {/* Polarity Sign (+) */}
        <text x="16" y="24" fill="#ef4444" fontSize="10" fontWeight="bold">+</text>

        {/* Pins */}
        {pins.map((pin) => {
          const isSelected = selectedPin === `${component.id}:${pin.id}`;
          return (
            <g
              key={pin.id}
              className="cursor-pointer group"
              onClick={(e) => onPinClick && onPinClick(pin.id, e)}
            >
              <circle
                cx={pin.x}
                cy={pin.y}
                r="3.5"
                fill={isSelected ? '#38bdf8' : '#e2e8f0'}
                stroke={isSelected ? '#0284c7' : '#52525b'}
                strokeWidth="1.5"
                className="group-hover:scale-125 transition-transform"
              />
              <text x={pin.x} y={pin.y + 11} fill="#a1a1aa" fontSize="6" textAnchor="middle" className="font-mono">
                {pin.name.includes('+') ? '+' : '-'}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

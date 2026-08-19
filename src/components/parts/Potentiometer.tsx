import React, { useState } from 'react';
import { CircuitComponent } from '../../types/circuit';
import { getComponentPins } from '../canvas/PinDefinitionRegistry';

interface Props {
  component: CircuitComponent;
  onUpdateAttrs?: (id: string, attrs: Record<string, any>) => void;
  onPinClick?: (pinId: string, e: React.MouseEvent) => void;
  selectedPin?: string | null;
}

export const Potentiometer: React.FC<Props> = ({
  component,
  onUpdateAttrs,
  onPinClick,
  selectedPin,
}) => {
  const pins = getComponentPins(component.type);
  const value = Number(component.attrs?.value ?? 512); // 0 to 1023
  const [isDragging, setIsDragging] = useState(false);

  // Map 0-1023 value to -135deg to +135deg angle
  const angle = ((value / 1023) * 270) - 135;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    const startY = e.clientY;
    const startVal = value;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = startY - moveEvent.clientY;
      const newVal = Math.max(0, Math.min(1023, Math.round(startVal + deltaY * 4)));
      if (onUpdateAttrs) {
        onUpdateAttrs(component.id, { value: newVal });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="relative select-none pointer-events-auto" style={{ width: 64, height: 74 }}>
      <svg width="64" height="74" viewBox="0 0 64 74" className="drop-shadow-md">
        {/* Blue Potentiometer Base */}
        <rect x="4" y="4" width="56" height="56" rx="4" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />

        {/* Rotary Dial Outer */}
        <circle cx="32" cy="32" r="22" fill="#334155" stroke="#1e293b" strokeWidth="2" />
        <circle cx="32" cy="32" r="18" fill="#1e293b" />

        {/* Rotary Knob with Indicator Slot */}
        <g
          transform={`rotate(${angle} 32 32)`}
          className="cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
        >
          <circle cx="32" cy="32" r="15" fill="#475569" stroke="#64748b" strokeWidth="1" />
          <rect x="30.5" y="18" width="3" height="8" rx="1.5" fill="#f8fafc" />
        </g>

        {/* Value Overlay */}
        <text x="32" y="55" fill="#f8fafc" fontSize="6.5" fontWeight="bold" textAnchor="middle" className="font-mono">
          {value}
        </text>

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
                stroke={isSelected ? '#0284c7' : '#64748b'}
                strokeWidth="1.5"
                className="group-hover:scale-125 transition-transform"
              />
              <text x={pin.x} y={pin.y + 9} fill="#94a3b8" fontSize="5" textAnchor="middle" className="font-mono">
                {pin.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

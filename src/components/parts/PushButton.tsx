import React from 'react';
import { CircuitComponent } from '../../types/circuit';
import { getComponentPins } from '../canvas/PinDefinitionRegistry';

interface Props {
  component: CircuitComponent;
  onUpdateAttrs?: (id: string, attrs: Record<string, any>) => void;
  onPinClick?: (pinId: string, e: React.MouseEvent) => void;
  selectedPin?: string | null;
}

export const PushButton: React.FC<Props> = ({
  component,
  onUpdateAttrs,
  onPinClick,
  selectedPin,
}) => {
  const pins = getComponentPins(component.type);
  const isPressed = !!component.attrs?.state;
  const color = component.attrs?.color || 'red';

  const getBtnColor = (c: string) => {
    switch (c) {
      case 'blue': return '#2563eb';
      case 'green': return '#16a34a';
      case 'yellow': return '#ca8a04';
      default: return '#dc2626';
    }
  };

  return (
    <div className="relative select-none pointer-events-auto" style={{ width: 52, height: 56 }}>
      <svg width="52" height="56" viewBox="0 0 52 56" className="drop-shadow-md">
        {/* Tactile Switch Metal Enclosure */}
        <rect x="6" y="8" width="40" height="40" rx="3" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />
        <rect x="8" y="10" width="36" height="36" rx="2" fill="#475569" />

        {/* 4 Corner Rivets */}
        <circle cx="12" cy="14" r="1.5" fill="#94a3b8" />
        <circle cx="40" cy="14" r="1.5" fill="#94a3b8" />
        <circle cx="12" cy="42" r="1.5" fill="#94a3b8" />
        <circle cx="40" cy="42" r="1.5" fill="#94a3b8" />

        {/* Plunger Button Actuator */}
        <circle
          cx="26"
          cy="28"
          r={isPressed ? 11 : 13}
          fill={getBtnColor(color)}
          stroke="#1e293b"
          strokeWidth="1"
          className="cursor-pointer transition-all active:scale-95"
          onMouseDown={() => onUpdateAttrs && onUpdateAttrs(component.id, { state: true })}
          onMouseUp={() => onUpdateAttrs && onUpdateAttrs(component.id, { state: false })}
          onMouseLeave={() => isPressed && onUpdateAttrs && onUpdateAttrs(component.id, { state: false })}
        />

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
            </g>
          );
        })}
      </svg>
    </div>
  );
};

import React from 'react';
import { CircuitComponent } from '../../types/circuit';
import { getComponentPins } from '../canvas/PinDefinitionRegistry';

interface Props {
  component: CircuitComponent;
  onPinClick?: (pinId: string, e: React.MouseEvent) => void;
  selectedPin?: string | null;
}

export const ServoMotor: React.FC<Props> = ({ component, onPinClick, selectedPin }) => {
  const pins = getComponentPins(component.type);
  const angle = component.attrs?.angle ?? 90; // 0 to 180 deg

  return (
    <div className="relative select-none pointer-events-auto" style={{ width: 80, height: 85 }}>
      <svg width="80" height="85" viewBox="0 0 80 85" className="drop-shadow-lg">
        {/* Blue Translucent Plastic Case (SG90) */}
        <rect x="8" y="15" width="64" height="50" rx="3" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
        <rect x="2" y="32" width="76" height="12" rx="2" fill="#0284c7" stroke="#0369a1" strokeWidth="1" />

        {/* Mounting Ear Holes */}
        <circle cx="5" cy="38" r="2.5" fill="#f8fafc" />
        <circle cx="75" cy="38" r="2.5" fill="#f8fafc" />

        {/* Brand label */}
        <text x="40" y="55" fill="#f8fafc" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
          SG90 Micro
        </text>

        {/* Gear shaft & Rotating White Horn Arm */}
        <g transform={`translate(40, 25) rotate(${angle - 90})`}>
          <path d="M -5 0 L -2 -22 A 4 4 0 0 1 2 -22 L 5 0 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
          <circle cx="0" cy="0" r="8" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
          <circle cx="0" cy="0" r="3" fill="#475569" />
          <circle cx="0" cy="-18" r="1.5" fill="#475569" />
          <circle cx="0" cy="-12" r="1.5" fill="#475569" />
        </g>

        {/* Angle Badge */}
        <text x="40" y="76" fill="#38bdf8" fontSize="7" fontWeight="bold" textAnchor="middle" className="font-mono">
          {angle}°
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
              <text x={pin.x} y={pin.y + 10} fill="#94a3b8" fontSize="5" textAnchor="middle" className="font-mono">
                {pin.name.split(' ')[0]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

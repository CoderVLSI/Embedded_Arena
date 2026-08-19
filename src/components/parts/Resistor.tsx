import React from 'react';
import { CircuitComponent } from '../../types/circuit';
import { getComponentPins } from '../canvas/PinDefinitionRegistry';

interface Props {
  component: CircuitComponent;
  onPinClick?: (pinId: string, e: React.MouseEvent) => void;
  selectedPin?: string | null;
}

export const Resistor: React.FC<Props> = ({ component, onPinClick, selectedPin }) => {
  const pins = getComponentPins(component.type);
  const val = component.attrs?.value || '220';

  return (
    <div className="relative select-none pointer-events-auto" style={{ width: 80, height: 30 }}>
      <svg width="80" height="30" viewBox="0 0 80 30" className="drop-shadow-sm">
        {/* Wire Leads */}
        <line x1="8" y1="15" x2="22" y2="15" stroke="#94a3b8" strokeWidth="2" />
        <line x1="58" y1="15" x2="72" y2="15" stroke="#94a3b8" strokeWidth="2" />

        {/* Resistor Ceramic Body */}
        <rect x="22" y="8" width="36" height="14" rx="4" fill="#e2d4b7" stroke="#b59a6d" strokeWidth="1" />

        {/* Color Bands (e.g. 220 ohm = Red, Red, Brown, Gold) */}
        <rect x="28" y="8" width="3" height="14" fill="#dc2626" />
        <rect x="35" y="8" width="3" height="14" fill="#dc2626" />
        <rect x="42" y="8" width="3" height="14" fill="#854d0e" />
        <rect x="50" y="8" width="3" height="14" fill="#eab308" />

        {/* Resistance Text */}
        <text x="40" y="28" fill="#cbd5e1" fontSize="7" fontWeight="bold" textAnchor="middle" className="font-mono">
          {val}Ω
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
            </g>
          );
        })}
      </svg>
    </div>
  );
};

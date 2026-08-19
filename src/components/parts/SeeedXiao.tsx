import React from 'react';
import { CircuitComponent } from '../../types/circuit';
import { getComponentPins } from '../canvas/PinDefinitionRegistry';

interface Props {
  component: CircuitComponent;
  onPinClick?: (pinId: string, e: React.MouseEvent) => void;
  selectedPin?: string | null;
}

export const SeeedXiao: React.FC<Props> = ({ component, onPinClick, selectedPin }) => {
  const pins = getComponentPins(component.type);

  return (
    <div className="relative select-none pointer-events-auto" style={{ width: 80, height: 135 }}>
      <svg width="80" height="135" viewBox="0 0 80 135" className="drop-shadow-lg">
        {/* Thumb-sized Black PCB */}
        <rect x="4" y="6" width="72" height="122" rx="4" fill="#09090b" stroke="#27272a" strokeWidth="1.5" />

        {/* Ultra-compact Type-C USB Port */}
        <rect x="22" y="1" width="36" height="15" rx="2" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
        <rect x="28" y="4" width="24" height="6" rx="1" fill="#18181b" />

        {/* RF Metal Shield */}
        <rect x="16" y="24" width="48" height="42" rx="2" fill="#9ca3af" stroke="#4b5563" strokeWidth="0.8" />
        <text x="40" y="44" fill="#09090b" fontSize="6.5" fontWeight="extrabold" textAnchor="middle">
          XIAO
        </text>
        <text x="40" y="54" fill="#374151" fontSize="4.5" textAnchor="middle">
          ESP32-C3 / RP2040
        </text>

        {/* User LED */}
        <circle cx="40" cy="76" r="2.5" fill="#eab308" />
        <text x="40" y="70" fill="#fde047" fontSize="4" textAnchor="middle">LED</text>

        {/* Seeed Studio Brand */}
        <text x="40" y="112" fill="#22c55e" fontSize="5" fontWeight="bold" textAnchor="middle">
          Seeed
        </text>

        {/* 14 Solder Pads */}
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
                fill={isSelected ? '#38bdf8' : '#18181b'}
                stroke={isSelected ? '#0284c7' : '#fbbf24'}
                strokeWidth="1.2"
                className="group-hover:scale-125 transition-transform"
              />
              <circle cx={pin.x} cy={pin.y} r="1.2" fill="#000000" />
              <text
                x={pin.x < 40 ? pin.x + 6 : pin.x - 6}
                y={pin.y + 2.5}
                fill="#f8fafc"
                fontSize="4.5"
                fontWeight="bold"
                textAnchor={pin.x < 40 ? 'start' : 'end'}
                className="font-mono pointer-events-none"
              >
                {pin.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

import React from 'react';
import { CircuitComponent } from '../../types/circuit';
import { getComponentPins } from '../canvas/PinDefinitionRegistry';

interface Props {
  component: CircuitComponent;
  onPinClick?: (pinId: string, e: React.MouseEvent) => void;
  selectedPin?: string | null;
}

export const Esp32C3: React.FC<Props> = ({ component, onPinClick, selectedPin }) => {
  const pins = getComponentPins(component.type);

  return (
    <div className="relative select-none pointer-events-auto" style={{ width: 110, height: 215 }}>
      <svg width="110" height="215" viewBox="0 0 110 215" className="drop-shadow-xl">
        {/* Dark PCB */}
        <rect x="5" y="10" width="100" height="195" rx="5" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />

        {/* ESP32-C3 RISC-V RF Module */}
        <rect x="22" y="18" width="66" height="55" rx="3" fill="#9ca3af" stroke="#4b5563" strokeWidth="1" />
        <path d="M 28 24 H 82 M 28 30 H 76" stroke="#ca8a04" strokeWidth="1.2" fill="none" />
        <text x="55" y="50" fill="#111827" fontSize="7.5" fontWeight="extrabold" textAnchor="middle">
          ESP32-C3
        </text>
        <text x="55" y="60" fill="#374151" fontSize="5" textAnchor="middle">
          RISC-V 160MHz
        </text>

        {/* Type-C USB Port */}
        <rect x="38" y="192" width="34" height="16" rx="2" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />

        {/* RGB LED (IO8) */}
        <rect x="51" y="100" width="8" height="8" rx="1" fill="#38bdf8" stroke="#0284c7" />
        <text x="55" y="94" fill="#7dd3fc" fontSize="4.5" textAnchor="middle">RGB (IO8)</text>

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
                r="3.8"
                fill={isSelected ? '#38bdf8' : '#27272a'}
                stroke={isSelected ? '#0284c7' : '#fbbf24'}
                strokeWidth="1.2"
                className="group-hover:scale-125 transition-transform"
              />
              <circle cx={pin.x} cy={pin.y} r="1.5" fill="#000000" />
              <text
                x={pin.x < 55 ? pin.x + 7 : pin.x - 7}
                y={pin.y + 2.5}
                fill="#f8fafc"
                fontSize="5"
                fontWeight="bold"
                textAnchor={pin.x < 55 ? 'start' : 'end'}
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

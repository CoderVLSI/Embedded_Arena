import React from 'react';
import { CircuitComponent } from '../../types/circuit';
import { getComponentPins } from '../canvas/PinDefinitionRegistry';

interface Props {
  component: CircuitComponent;
  onPinClick?: (pinId: string, e: React.MouseEvent) => void;
  selectedPin?: string | null;
}

export const Esp8266NodeMcu: React.FC<Props> = ({ component, onPinClick, selectedPin }) => {
  const pins = getComponentPins(component.type);

  return (
    <div className="relative select-none pointer-events-auto" style={{ width: 100, height: 265 }}>
      <svg width="100" height="265" viewBox="0 0 100 265" className="drop-shadow-lg">
        {/* Black PCB */}
        <rect x="5" y="10" width="90" height="245" rx="5" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />

        {/* ESP-12E Metal RF Shield */}
        <rect x="18" y="18" width="64" height="60" rx="3" fill="#9ca3af" stroke="#4b5563" strokeWidth="1" />
        <path d="M 25 24 H 75 M 25 30 H 70 M 25 36 H 75" stroke="#ca8a04" strokeWidth="1.2" fill="none" />
        <text x="50" y="52" fill="#111827" fontSize="7" fontWeight="bold" textAnchor="middle">
          ESP8266
        </text>
        <text x="50" y="62" fill="#374151" fontSize="5" textAnchor="middle">
          MOD-WiFi
        </text>

        {/* Micro-USB Port */}
        <rect x="34" y="244" width="32" height="16" rx="2" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />

        {/* RST & FLASH buttons */}
        <rect x="16" y="228" width="12" height="10" rx="1" fill="#475569" />
        <text x="22" y="225" fill="#94a3b8" fontSize="4.5" textAnchor="middle">RST</text>

        <rect x="72" y="228" width="12" height="10" rx="1" fill="#475569" />
        <text x="78" y="225" fill="#94a3b8" fontSize="4.5" textAnchor="middle">FLASH</text>

        {/* NodeMCU Title */}
        <text x="50" y="120" fill="#f8fafc" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
          NodeMCU v3
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
                r="3.8"
                fill={isSelected ? '#38bdf8' : '#27272a'}
                stroke={isSelected ? '#0284c7' : '#fbbf24'}
                strokeWidth="1.2"
                className="group-hover:scale-125 transition-transform"
              />
              <circle cx={pin.x} cy={pin.y} r="1.5" fill="#09090b" />
              <text
                x={pin.x < 50 ? pin.x + 7 : pin.x - 7}
                y={pin.y + 2.5}
                fill="#f8fafc"
                fontSize="5"
                fontWeight="bold"
                textAnchor={pin.x < 50 ? 'start' : 'end'}
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

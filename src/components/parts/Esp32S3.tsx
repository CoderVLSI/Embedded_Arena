import React from 'react';
import { CircuitComponent } from '../../types/circuit';
import { getComponentPins } from '../canvas/PinDefinitionRegistry';

interface Props {
  component: CircuitComponent;
  onPinClick?: (pinId: string, e: React.MouseEvent) => void;
  selectedPin?: string | null;
}

export const Esp32S3: React.FC<Props> = ({ component, onPinClick, selectedPin }) => {
  const pins = getComponentPins(component.type);

  return (
    <div className="relative select-none pointer-events-auto" style={{ width: 120, height: 285 }}>
      <svg width="120" height="285" viewBox="0 0 120 285" className="drop-shadow-xl">
        {/* Black PCB */}
        <rect x="5" y="10" width="110" height="265" rx="6" fill="#111827" stroke="#374151" strokeWidth="1.5" />

        {/* ESP32-S3 WROOM-1 RF Shield */}
        <rect x="22" y="18" width="76" height="70" rx="3" fill="#9ca3af" stroke="#4b5563" strokeWidth="1" />
        <path d="M 30 25 H 90 M 30 32 H 80 M 30 39 H 90" stroke="#ca8a04" strokeWidth="1.2" fill="none" />
        <text x="60" y="62" fill="#111827" fontSize="8" fontWeight="extrabold" textAnchor="middle">
          ESP32-S3
        </text>
        <text x="60" y="74" fill="#374151" fontSize="5.5" textAnchor="middle">
          Dual LX7 / AI Vector
        </text>

        {/* Dual USB Type-C Ports (USB & UART) */}
        <rect x="24" y="260" width="28" height="18" rx="2" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
        <text x="38" y="254" fill="#9ca3af" fontSize="4.5" textAnchor="middle">UART</text>

        <rect x="68" y="260" width="28" height="18" rx="2" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
        <text x="82" y="254" fill="#9ca3af" fontSize="4.5" textAnchor="middle">USB</text>

        {/* WS2812 RGB LED (IO48) */}
        <rect x="56" y="150" width="8" height="8" rx="1" fill="#22c55e" stroke="#15803d" />
        <text x="60" y="145" fill="#a7f3d0" fontSize="4" textAnchor="middle">RGB (48)</text>

        {/* RST & BOOT buttons */}
        <rect x="22" y="235" width="12" height="10" rx="1" fill="#374151" />
        <rect x="86" y="235" width="12" height="10" rx="1" fill="#374151" />
        <text x="28" y="230" fill="#9ca3af" fontSize="4.5" textAnchor="middle">RST</text>
        <text x="92" y="230" fill="#9ca3af" fontSize="4.5" textAnchor="middle">BOOT</text>

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
                fill={isSelected ? '#38bdf8' : '#1f2937'}
                stroke={isSelected ? '#0284c7' : '#fbbf24'}
                strokeWidth="1.2"
                className="group-hover:scale-125 transition-transform"
              />
              <circle cx={pin.x} cy={pin.y} r="1.5" fill="#000000" />
              <text
                x={pin.x < 60 ? pin.x + 7 : pin.x - 7}
                y={pin.y + 2.5}
                fill="#f8fafc"
                fontSize="5"
                fontWeight="bold"
                textAnchor={pin.x < 60 ? 'start' : 'end'}
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

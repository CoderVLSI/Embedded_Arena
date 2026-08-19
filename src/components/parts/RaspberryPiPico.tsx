import React from 'react';
import { CircuitComponent } from '../../types/circuit';
import { getComponentPins } from '../canvas/PinDefinitionRegistry';

interface Props {
  component: CircuitComponent;
  onPinClick?: (pinId: string, e: React.MouseEvent) => void;
  selectedPin?: string | null;
}

export const RaspberryPiPico: React.FC<Props> = ({ component, onPinClick, selectedPin }) => {
  const pins = getComponentPins(component.type);

  return (
    <div className="relative select-none pointer-events-auto" style={{ width: 100, height: 290 }}>
      <svg width="100" height="290" viewBox="0 0 100 290" className="drop-shadow-xl">
        <defs>
          <linearGradient id="picoGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#008053" />
            <stop offset="100%" stopColor="#005a3a" />
          </linearGradient>
        </defs>

        {/* Green Pico PCB */}
        <rect x="5" y="10" width="90" height="270" rx="6" fill="url(#picoGreen)" stroke="#00a86b" strokeWidth="1.5" />

        {/* Micro-USB Port Top */}
        <rect x="34" y="2" width="32" height="18" rx="2" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
        <rect x="40" y="6" width="20" height="8" rx="1" fill="#1e293b" />

        {/* RP2040 QFN-56 Chip */}
        <rect x="36" y="120" width="28" height="28" rx="2" fill="#0f172a" stroke="#334155" strokeWidth="1" />
        <circle cx="40" cy="124" r="1.5" fill="#64748b" />
        <text x="50" y="136" fill="#f8fafc" fontSize="5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
          RP2-B2
        </text>
        <text x="50" y="143" fill="#94a3b8" fontSize="4" textAnchor="middle">
          Raspberry Pi
        </text>

        {/* BOOTSEL Button */}
        <rect x="42" y="80" width="16" height="12" rx="1" fill="#cbd5e1" stroke="#475569" strokeWidth="0.8" />
        <circle cx="50" cy="86" r="3" fill="#f8fafc" />
        <text x="50" y="75" fill="#f8fafc" fontSize="4.5" fontWeight="bold" textAnchor="middle">BOOTSEL</text>

        {/* Raspberry Pi Logo & Text */}
        <text x="50" y="50" fill="#ffffff" fontSize="9" fontWeight="extrabold" textAnchor="middle" fontFamily="sans-serif">
          Pico
        </text>
        <text x="50" y="60" fill="#a7f3d0" fontSize="5.5" textAnchor="middle">
          RP2040
        </text>

        {/* 2MB SPI Flash */}
        <rect x="40" y="165" width="20" height="16" rx="1" fill="#0f172a" stroke="#334155" strokeWidth="0.8" />

        {/* Onboard LED (GP25) */}
        <rect x="45" y="32" width="5" height="7" rx="1" fill="#22c55e" stroke="#15803d" />
        <text x="50" y="28" fill="#a7f3d0" fontSize="4.5" textAnchor="middle">LED</text>

        {/* 40 Castellated Solder Pads */}
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
                r="4"
                fill={isSelected ? '#38bdf8' : '#1e293b'}
                stroke={isSelected ? '#0284c7' : '#fbbf24'}
                strokeWidth="1.5"
                className="group-hover:scale-125 transition-transform"
              />
              <circle cx={pin.x} cy={pin.y} r="1.5" fill="#000000" />
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

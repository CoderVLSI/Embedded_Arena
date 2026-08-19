import React from 'react';
import { CircuitComponent } from '../../types/circuit';
import { getComponentPins } from '../canvas/PinDefinitionRegistry';

interface Props {
  component: CircuitComponent;
  onPinClick?: (pinId: string, e: React.MouseEvent) => void;
  selectedPin?: string | null;
}

export const Nrf52840Dk: React.FC<Props> = ({ component, onPinClick, selectedPin }) => {
  const pins = getComponentPins(component.type);

  return (
    <div className="relative select-none pointer-events-auto" style={{ width: 100, height: 230 }}>
      <svg width="100" height="230" viewBox="0 0 100 230" className="drop-shadow-lg">
        {/* Nordic Green PCB */}
        <rect x="5" y="10" width="90" height="210" rx="5" fill="#065f46" stroke="#047857" strokeWidth="1.5" />

        {/* nRF52840 BLE SoC Chip */}
        <rect x="36" y="80" width="28" height="28" rx="2" fill="#0f172a" stroke="#334155" strokeWidth="1" />
        <circle cx="40" cy="84" r="1.5" fill="#64748b" />
        <text x="50" y="94" fill="#f8fafc" fontSize="4.5" fontWeight="bold" textAnchor="middle">
          nRF52840
        </text>
        <text x="50" y="101" fill="#6ee7b7" fontSize="3.5" textAnchor="middle">
          BLE / 802.15.4
        </text>

        {/* 2.4GHz PCB Antenna Trace Top */}
        <rect x="25" y="15" width="50" height="20" rx="2" fill="#047857" stroke="#fbbf24" strokeWidth="1" />
        <path d="M 30 25 H 70 M 30 30 H 65" stroke="#fbbf24" strokeWidth="1" fill="none" />

        {/* Board Title */}
        <text x="50" y="50" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
          Nordic DK
        </text>

        {/* 4 User LEDs */}
        <circle cx="35" cy="140" r="2.5" fill="#22c55e" />
        <circle cx="45" cy="140" r="2.5" fill="#22c55e" />
        <circle cx="55" cy="140" r="2.5" fill="#22c55e" />
        <circle cx="65" cy="140" r="2.5" fill="#22c55e" />
        <text x="50" y="132" fill="#a7f3d0" fontSize="4" textAnchor="middle">LED 1..4</text>

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
                fill={isSelected ? '#38bdf8' : '#064e3b'}
                stroke={isSelected ? '#0284c7' : '#fbbf24'}
                strokeWidth="1.2"
                className="group-hover:scale-125 transition-transform"
              />
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

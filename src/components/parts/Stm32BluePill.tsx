import React from 'react';
import { CircuitComponent } from '../../types/circuit';
import { getComponentPins } from '../canvas/PinDefinitionRegistry';

interface Props {
  component: CircuitComponent;
  onPinClick?: (pinId: string, e: React.MouseEvent) => void;
  selectedPin?: string | null;
}

export const Stm32BluePill: React.FC<Props> = ({ component, onPinClick, selectedPin }) => {
  const pins = getComponentPins(component.type);

  return (
    <div className="relative select-none pointer-events-auto" style={{ width: 100, height: 290 }}>
      <svg width="100" height="290" viewBox="0 0 100 290" className="drop-shadow-xl">
        {/* Blue PCB */}
        <rect x="5" y="10" width="90" height="270" rx="4" fill="#1e3a8a" stroke="#1d4ed8" strokeWidth="1.5" />

        {/* Micro-USB Connector Top */}
        <rect x="34" y="2" width="32" height="18" rx="2" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
        <rect x="40" y="6" width="20" height="8" rx="1" fill="#1e293b" />

        {/* STM32F103C8T6 ARM Cortex-M3 Chip */}
        <rect x="34" y="125" width="32" height="32" rx="2" fill="#0f172a" stroke="#334155" strokeWidth="1" />
        <circle cx="38" cy="129" r="1.5" fill="#64748b" />
        <text x="50" y="140" fill="#f8fafc" fontSize="4.5" fontWeight="bold" textAnchor="middle">
          STM32F103
        </text>
        <text x="50" y="148" fill="#93c5fd" fontSize="3.5" textAnchor="middle">
          ARM 72MHz
        </text>

        {/* 8MHz & 32.768kHz Crystals */}
        <rect x="40" y="80" width="20" height="10" rx="2" fill="#cbd5e1" stroke="#64748b" strokeWidth="0.8" />
        <text x="50" y="87" fill="#334155" fontSize="4" textAnchor="middle">8.000</text>

        {/* BOOT0 & BOOT1 Yellow Jumpers */}
        <rect x="38" y="40" width="10" height="18" rx="1" fill="#eab308" stroke="#ca8a04" strokeWidth="0.8" />
        <rect x="52" y="40" width="10" height="18" rx="1" fill="#eab308" stroke="#ca8a04" strokeWidth="0.8" />
        <text x="43" y="36" fill="#fef08a" fontSize="3.5">B0</text>
        <text x="57" y="36" fill="#fef08a" fontSize="3.5">B1</text>

        {/* Reset Tactile Button */}
        <rect x="42" y="235" width="16" height="12" rx="1" fill="#dc2626" stroke="#991b1b" strokeWidth="0.8" />
        <circle cx="50" cy="241" r="3" fill="#f87171" />
        <text x="50" y="230" fill="#f87171" fontSize="4" textAnchor="middle">RESET</text>

        {/* User LED (PC13) */}
        <rect x="46" y="105" width="8" height="6" rx="1" fill="#22c55e" stroke="#15803d" />
        <text x="50" y="100" fill="#86efac" fontSize="4" textAnchor="middle">PC13</text>

        {/* Board Title */}
        <text x="50" y="180" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
          Blue Pill
        </text>

        {/* Pin Header Holes */}
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
                fill={isSelected ? '#38bdf8' : '#0f172a'}
                stroke={isSelected ? '#0284c7' : '#94a3b8'}
                strokeWidth="1.2"
                className="group-hover:scale-125 transition-transform"
              />
              <circle cx={pin.x} cy={pin.y} r="1.5" fill="#e2e8f0" />
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

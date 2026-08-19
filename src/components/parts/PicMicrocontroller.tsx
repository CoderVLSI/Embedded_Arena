import React from 'react';
import { CircuitComponent } from '../../types/circuit';
import { getComponentPins } from '../canvas/PinDefinitionRegistry';

interface Props {
  component: CircuitComponent;
  onPinClick?: (pinId: string, e: React.MouseEvent) => void;
  selectedPin?: string | null;
}

export const PicMicrocontroller: React.FC<Props> = ({ component, onPinClick, selectedPin }) => {
  const pins = getComponentPins(component.type);

  return (
    <div className="relative select-none pointer-events-auto" style={{ width: 120, height: 305 }}>
      <svg width="120" height="305" viewBox="0 0 120 305" className="drop-shadow-2xl">
        {/* Ceramic / Epoxy Black DIP-40 Package */}
        <rect x="22" y="10" width="76" height="285" rx="3" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />

        {/* Pin 1 Index Notch Top */}
        <path d="M 52 10 A 8 8 0 0 0 68 10 Z" fill="#09090b" stroke="#3f3f46" strokeWidth="1" />
        <circle cx="32" cy="22" r="2.5" fill="#09090b" />

        {/* Microchip Logo & Model Text */}
        <g transform="translate(60, 150) rotate(-90)">
          <text x="0" y="-8" fill="#f8fafc" fontSize="10" fontWeight="extrabold" textAnchor="middle" fontFamily="sans-serif">
            MICROCHIP
          </text>
          <text x="0" y="4" fill="#cbd5e1" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
            PIC16F877A-I/P
          </text>
          <text x="0" y="14" fill="#71717a" fontSize="6" textAnchor="middle" fontFamily="monospace">
            20MHz / FLASH / DIP-40
          </text>
        </g>

        {/* 40 DIP Metal Legs & Solder Pads */}
        {pins.map((pin) => {
          const isSelected = selectedPin === `${component.id}:${pin.id}`;
          const isLeft = pin.x < 60;
          return (
            <g
              key={pin.id}
              className="cursor-pointer group"
              onClick={(e) => onPinClick && onPinClick(pin.id, e)}
            >
              {/* Metal DIP Leg extending from IC to pad */}
              <line
                x1={isLeft ? 22 : 98}
                y1={pin.y}
                x2={pin.x}
                y2={pin.y}
                stroke="#d1d5db"
                strokeWidth="2.5"
              />
              <circle
                cx={pin.x}
                cy={pin.y}
                r="4.5"
                fill={isSelected ? '#38bdf8' : '#e5e7eb'}
                stroke={isSelected ? '#0284c7' : '#9ca3af'}
                strokeWidth="1.5"
                className="group-hover:scale-125 transition-transform"
              />
              <text
                x={isLeft ? pin.x + 8 : pin.x - 8}
                y={pin.y + 2.5}
                fill="#cbd5e1"
                fontSize="5.5"
                fontWeight="bold"
                textAnchor={isLeft ? 'start' : 'end'}
                className="font-mono pointer-events-none group-hover:fill-white"
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

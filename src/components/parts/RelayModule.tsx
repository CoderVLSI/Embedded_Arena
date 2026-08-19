import React from 'react';
import { CircuitComponent } from '../../types/circuit';
import { getComponentPins } from '../canvas/PinDefinitionRegistry';

interface Props {
  component: CircuitComponent;
  onPinClick?: (pinId: string, e: React.MouseEvent) => void;
  selectedPin?: string | null;
}

export const RelayModule: React.FC<Props> = ({ component, onPinClick, selectedPin }) => {
  const pins = getComponentPins(component.type);
  const isActive = !!component.attrs?.state;

  return (
    <div className="relative select-none pointer-events-auto" style={{ width: 125, height: 75 }}>
      <svg width="125" height="75" viewBox="0 0 125 75" className="drop-shadow-lg">
        {/* Red PCB Board */}
        <rect x="5" y="5" width="115" height="65" rx="4" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1.5" />

        {/* Blue Relay Box */}
        <rect x="42" y="12" width="50" height="50" rx="3" fill="#1d4ed8" stroke="#1e40af" strokeWidth="1.5" />
        <text x="67" y="34" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
          Relay
        </text>
        <text x="67" y="44" fill="#93c5fd" fontSize="6" textAnchor="middle" fontFamily="sans-serif">
          10A 250VAC
        </text>

        {/* Screw Terminal Block (Blue/Green on Right) */}
        <rect x="98" y="10" width="20" height="55" rx="2" fill="#0284c7" stroke="#0369a1" strokeWidth="1" />
        <circle cx="108" cy="20" r="3.5" fill="#334155" />
        <circle cx="108" cy="38" r="3.5" fill="#334155" />
        <circle cx="108" cy="56" r="3.5" fill="#334155" />

        {/* Status LED */}
        <circle cx="28" cy="22" r="3" fill="#dc2626" /> {/* Power LED */}
        <circle cx="28" cy="40" r="3" fill={isActive ? '#22c55e' : '#14532d'} /> {/* Relay State LED */}
        {isActive && (
          <circle cx="28" cy="40" r="7" fill="#22c55e" opacity="0.6" className="animate-pulse" />
        )}
        <text x="28" y="50" fill="#fecaca" fontSize="5" textAnchor="middle">IN</text>

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
                r="4"
                fill={isSelected ? '#38bdf8' : '#e2e8f0'}
                stroke={isSelected ? '#0284c7' : '#475569'}
                strokeWidth="1.5"
                className="group-hover:scale-125 transition-transform"
              />
              <circle cx={pin.x} cy={pin.y} r="1.5" fill="#1e293b" />
              <text
                x={pin.x < 30 ? pin.x + 8 : pin.x - 8}
                y={pin.y + 2}
                fill="#ffffff"
                fontSize="5.5"
                fontWeight="bold"
                textAnchor={pin.x < 30 ? 'start' : 'end'}
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

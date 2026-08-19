import React from 'react';
import { CircuitComponent } from '../../types/circuit';
import { getComponentPins } from '../canvas/PinDefinitionRegistry';

interface Props {
  component: CircuitComponent;
  isPin13High?: boolean;
  onPinClick?: (pinId: string, e: React.MouseEvent) => void;
  selectedPin?: string | null;
}

export const ArduinoUno: React.FC<Props> = ({ component, isPin13High, onPinClick, selectedPin }) => {
  const pins = getComponentPins(component.type);

  return (
    <div className="relative select-none pointer-events-auto" style={{ width: 280, height: 240 }}>
      <svg width="280" height="240" viewBox="0 0 280 240" className="drop-shadow-xl">
        <defs>
          <linearGradient id="unoPcb" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00646e" />
            <stop offset="100%" stopColor="#004b53" />
          </linearGradient>
        </defs>

        {/* Arduino Blue/Teal PCB Shape */}
        <polygon
          points="20,10 270,10 270,230 20,230 20,180 5,160 5,80 20,60"
          fill="url(#unoPcb)"
          stroke="#00818f"
          strokeWidth="2"
          rx="6"
        />

        {/* USB Type-B Connector */}
        <rect x="0" y="25" width="45" height="40" rx="3" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
        <rect x="5" y="32" width="30" height="26" rx="2" fill="#334155" />

        {/* DC Barrel Jack */}
        <rect x="0" y="160" width="48" height="50" rx="3" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
        <circle cx="24" cy="185" r="7" fill="#64748b" />
        <circle cx="24" cy="185" r="3" fill="#0f172a" />

        {/* ATmega328P DIP IC */}
        <rect x="130" y="125" width="105" height="35" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="1" />
        <circle cx="136" cy="142" r="3" fill="#334155" />
        <text x="180" y="146" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          ATMEGA328P-PU
        </text>

        {/* Crystal Oscillator 16MHz */}
        <rect x="100" y="100" width="16" height="24" rx="4" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
        <text x="108" y="115" fill="#334155" fontSize="5" textAnchor="middle">16.000</text>

        {/* Reset Button */}
        <rect x="58" y="20" width="16" height="16" rx="2" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
        <circle cx="66" cy="28" r="4" fill="#f87171" />

        {/* Arduino Uno Branding */}
        <text x="180" y="75" fill="#ffffff" fontSize="16" fontWeight="bold" fontFamily="sans-serif">
          ARDUINO
        </text>
        <text x="245" y="85" fill="#e2e8f0" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
          UNO
        </text>

        {/* Pin 13 LED (L) */}
        <rect x="120" y="65" width="6" height="8" rx="1" fill={isPin13High ? '#facc15' : '#713f12'} stroke="#854d0e" />
        {isPin13High && (
          <circle cx="123" cy="69" r="10" fill="#facc15" opacity="0.4" className="animate-pulse" />
        )}
        <text x="123" y="60" fill="#cbd5e1" fontSize="6" textAnchor="middle">L</text>

        {/* ON LED */}
        <rect x="105" y="65" width="6" height="8" rx="1" fill="#22c55e" stroke="#15803d" />
        <text x="108" y="60" fill="#cbd5e1" fontSize="6" textAnchor="middle">ON</text>

        {/* Top Header Strip */}
        <rect x="75" y="6" width="198" height="18" fill="#1e293b" rx="2" />
        {/* Bottom Header Strip */}
        <rect x="95" y="216" width="170" height="18" fill="#1e293b" rx="2" />

        {/* Pins */}
        {pins.map((pin) => {
          const isSelected = selectedPin === `${component.id}:${pin.id}`;
          return (
            <g
              key={pin.id}
              className="cursor-pointer group"
              onClick={(e) => onPinClick && onPinClick(pin.id, e)}
            >
              <rect
                x={pin.x - 4}
                y={pin.y - 4}
                width="8"
                height="8"
                rx="1"
                fill={isSelected ? '#38bdf8' : '#0f172a'}
                stroke={isSelected ? '#0284c7' : '#94a3b8'}
                strokeWidth="1"
                className="group-hover:stroke-cyan-400 group-hover:fill-cyan-900 transition-colors"
              />
              <circle cx={pin.x} cy={pin.y} r="1.5" fill={isSelected ? '#ffffff' : '#e2e8f0'} />

              {/* Pin Label */}
              <text
                x={pin.x}
                y={pin.y < 50 ? pin.y + 14 : pin.y - 8}
                fill="#cbd5e1"
                fontSize="6"
                fontWeight="bold"
                textAnchor="middle"
                className="pointer-events-none group-hover:fill-white font-mono"
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

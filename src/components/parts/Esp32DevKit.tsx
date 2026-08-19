import React from 'react';
import { CircuitComponent } from '../../types/circuit';
import { getComponentPins } from '../canvas/PinDefinitionRegistry';

interface Props {
  component: CircuitComponent;
  isLit?: boolean;
  onPinClick?: (pinId: string, e: React.MouseEvent) => void;
  selectedPin?: string | null;
}

export const Esp32DevKit: React.FC<Props> = ({ component, onPinClick, selectedPin }) => {
  const pins = getComponentPins(component.type);

  return (
    <div className="relative select-none pointer-events-auto" style={{ width: 120, height: 270 }}>
      <svg width="120" height="270" viewBox="0 0 120 270" className="drop-shadow-lg">
        <defs>
          <linearGradient id="pcbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#0d0d0d" />
          </linearGradient>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d1d5db" />
            <stop offset="50%" stopColor="#9ca3af" />
            <stop offset="100%" stopColor="#6b7280" />
          </linearGradient>
          <linearGradient id="goldPin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        {/* PCB Board */}
        <rect x="5" y="10" width="110" height="250" rx="6" fill="url(#pcbGrad)" stroke="#374151" strokeWidth="1.5" />

        {/* ESP32 RF Antenna Traces */}
        <rect x="22" y="18" width="76" height="30" rx="3" fill="#000000" stroke="#b45309" strokeWidth="1.5" />
        <path d="M 30 25 H 90 M 30 32 H 80 M 30 39 H 90" stroke="#d97706" strokeWidth="1.5" fill="none" />

        {/* Metal RF Shield */}
        <rect x="22" y="52" width="76" height="70" rx="4" fill="url(#shieldGrad)" stroke="#4b5563" strokeWidth="1" />
        {/* Espressif Logo & Text */}
        <circle cx="60" cy="78" r="10" fill="#374151" />
        <path d="M 55 78 A 5 5 0 0 1 65 78 A 5 5 0 0 1 55 78" stroke="#e5e7eb" strokeWidth="1.5" fill="none" />
        <text x="60" y="102" fill="#1f2937" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
          ESP32
        </text>
        <text x="60" y="114" fill="#374151" fontSize="6" textAnchor="middle" fontFamily="sans-serif">
          WROOM-32
        </text>

        {/* Micro-USB Port */}
        <rect x="42" y="248" width="36" height="18" rx="2" fill="#9ca3af" stroke="#4b5563" strokeWidth="1" />
        <rect x="47" y="254" width="26" height="8" rx="1" fill="#1f2937" />

        {/* Tactile Buttons (EN and BOOT) */}
        <rect x="18" y="235" width="14" height="12" rx="1" fill="#4b5563" />
        <rect x="21" y="238" width="8" height="6" rx="1" fill="#111827" />
        <text x="25" y="230" fill="#9ca3af" fontSize="5" textAnchor="middle">EN</text>

        <rect x="88" y="235" width="14" height="12" rx="1" fill="#4b5563" />
        <rect x="91" y="238" width="8" height="6" rx="1" fill="#111827" />
        <text x="95" y="230" fill="#9ca3af" fontSize="5" textAnchor="middle">BOOT</text>

        {/* Onboard LEDs */}
        <rect x="36" y="234" width="5" height="7" rx="1" fill="#dc2626" />
        <text x="38" y="230" fill="#9ca3af" fontSize="5" textAnchor="middle">PWR</text>
        <rect x="78" y="234" width="5" height="7" rx="1" fill="#2563eb" />
        <text x="80" y="230" fill="#9ca3af" fontSize="5" textAnchor="middle">D2</text>

        {/* Voltage Regulator & ICs */}
        <rect x="46" y="140" width="28" height="16" rx="1" fill="#111827" stroke="#374151" />
        <rect x="48" y="170" width="24" height="24" rx="2" fill="#111827" stroke="#374151" />
        <circle cx="53" cy="175" r="1.5" fill="#6b7280" />
        <text x="60" y="184" fill="#9ca3af" fontSize="5" textAnchor="middle">CP2102</text>

        {/* Left and Right Pin Headers */}
        {pins.map((pin) => {
          const isSelected = selectedPin === `${component.id}:${pin.id}`;
          return (
            <g
              key={pin.id}
              className="cursor-pointer group"
              onClick={(e) => onPinClick && onPinClick(pin.id, e)}
            >
              {/* Pin hole / solder pad */}
              <circle
                cx={pin.x}
                cy={pin.y}
                r="4.5"
                fill={isSelected ? '#38bdf8' : '#1f2937'}
                stroke={isSelected ? '#0284c7' : 'url(#goldPin)'}
                strokeWidth="1.5"
                className="transition-transform group-hover:scale-125"
              />
              <circle cx={pin.x} cy={pin.y} r="1.8" fill="#000000" />

              {/* Pin Label */}
              <text
                x={pin.x < 60 ? pin.x + 8 : pin.x - 8}
                y={pin.y + 2.5}
                fill="#9ca3af"
                fontSize="6"
                fontWeight="bold"
                textAnchor={pin.x < 60 ? 'start' : 'end'}
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

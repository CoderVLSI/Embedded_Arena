import React, { useState } from 'react';
import { CircuitComponent } from '../../types/circuit';
import { getComponentPins } from '../canvas/PinDefinitionRegistry';
import { Radio } from 'lucide-react';

interface Props {
  component: CircuitComponent;
  onUpdateAttrs?: (id: string, attrs: Record<string, any>) => void;
  onPinClick?: (pinId: string, e: React.MouseEvent) => void;
  selectedPin?: string | null;
}

export const UltrasonicSensor: React.FC<Props> = ({
  component,
  onUpdateAttrs,
  onPinClick,
  selectedPin,
}) => {
  const pins = getComponentPins(component.type);
  const distance = component.attrs?.distance ?? 35; // 2cm to 400cm
  const [showSlider, setShowSlider] = useState(false);

  return (
    <div className="relative select-none pointer-events-auto" style={{ width: 95, height: 75 }}>
      <svg width="95" height="75" viewBox="0 0 95 75" className="drop-shadow-md">
        {/* Blue PCB */}
        <rect x="5" y="10" width="85" height="48" rx="4" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />

        {/* Ultrasonic Transducer Cylinders (Transmitter 'T' & Receiver 'R') */}
        {/* Left Transducer */}
        <circle cx="28" cy="34" r="16" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
        <circle cx="28" cy="34" r="12" fill="#334155" />
        <circle cx="28" cy="34" r="6" fill="#1e293b" />
        <text x="28" y="24" fill="#f8fafc" fontSize="6" fontWeight="bold" textAnchor="middle">T</text>

        {/* Right Transducer */}
        <circle cx="68" cy="34" r="16" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
        <circle cx="68" cy="34" r="12" fill="#334155" />
        <circle cx="68" cy="34" r="6" fill="#1e293b" />
        <text x="68" y="24" fill="#f8fafc" fontSize="6" fontWeight="bold" textAnchor="middle">R</text>

        {/* Model text */}
        <text x="48" y="22" fill="#f8fafc" fontSize="5.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
          HC-SR04
        </text>

        {/* Crystal oscillator */}
        <rect x="44" y="30" width="8" height="14" rx="2" fill="#94a3b8" />

        {/* Pins */}
        {pins.map((pin) => {
          const isSelected = selectedPin === `${component.id}:${pin.id}`;
          return (
            <g
              key={pin.id}
              className="cursor-pointer group"
              onClick={(e) => onPinClick && onPinClick(pin.id, e)}
            >
              <line x1={pin.x} y1="58" x2={pin.x} y2={pin.y} stroke="#cbd5e1" strokeWidth="2" />
              <circle
                cx={pin.x}
                cy={pin.y}
                r="3.5"
                fill={isSelected ? '#38bdf8' : '#e2e8f0'}
                stroke={isSelected ? '#0284c7' : '#64748b'}
                strokeWidth="1.5"
                className="group-hover:scale-125 transition-transform"
              />
              <text x={pin.x} y={pin.y + 9} fill="#94a3b8" fontSize="5" textAnchor="middle" className="font-mono">
                {pin.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Distance button */}
      <button
        onClick={() => setShowSlider(!showSlider)}
        className="absolute top-0 right-1 bg-slate-800 hover:bg-slate-700 text-[9px] text-sky-400 px-1 py-0.5 rounded border border-slate-600 shadow"
        title="Adjust Distance"
      >
        🎯 {distance}cm
      </button>

      {/* Interactive Distance Slider */}
      {showSlider && (
        <div
          className="absolute z-50 -top-24 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-slate-700 rounded-lg p-2.5 shadow-2xl w-44 text-xs text-white backdrop-blur"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center text-[10px] text-slate-300 mb-1">
            <span className="flex items-center gap-1"><Radio size={12} className="text-sky-400" /> Distance</span>
            <span className="font-mono text-sky-300 font-bold">{distance} cm</span>
          </div>
          <input
            type="range"
            min="2"
            max="400"
            step="1"
            value={distance}
            onChange={(e) => onUpdateAttrs && onUpdateAttrs(component.id, { distance: parseInt(e.target.value) })}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
          />
        </div>
      )}
    </div>
  );
};

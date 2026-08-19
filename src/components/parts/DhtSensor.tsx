import React, { useState } from 'react';
import { CircuitComponent } from '../../types/circuit';
import { getComponentPins } from '../canvas/PinDefinitionRegistry';
import { Thermometer, Droplets } from 'lucide-react';

interface Props {
  component: CircuitComponent;
  onUpdateAttrs?: (id: string, attrs: Record<string, any>) => void;
  onPinClick?: (pinId: string, e: React.MouseEvent) => void;
  selectedPin?: string | null;
}

export const DhtSensor: React.FC<Props> = ({
  component,
  onUpdateAttrs,
  onPinClick,
  selectedPin,
}) => {
  const pins = getComponentPins(component.type);
  const [showControls, setShowControls] = useState(false);
  const temp = component.attrs?.temperature ?? 24.0;
  const hum = component.attrs?.humidity ?? 50.0;

  return (
    <div className="relative select-none pointer-events-auto group/dht" style={{ width: 70, height: 100 }}>
      {/* Sensor Body SVG */}
      <svg width="70" height="100" viewBox="0 0 70 100" className="drop-shadow-md">
        <defs>
          <linearGradient id="dhtBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
        </defs>

        {/* White Grid Mesh Case */}
        <rect x="5" y="5" width="60" height="70" rx="5" fill="url(#dhtBody)" stroke="#94a3b8" strokeWidth="1.5" />

        {/* Grille Slots */}
        {[15, 23, 31, 39, 47].map((y) => (
          <g key={y}>
            <rect x="12" y={y} width="10" height="4" rx="1" fill="#64748b" />
            <rect x="26" y={y} width="16" height="4" rx="1" fill="#64748b" />
            <rect x="46" y={y} width="10" height="4" rx="1" fill="#64748b" />
          </g>
        ))}

        {/* Label Label Plate */}
        <rect x="12" y="56" width="46" height="14" rx="2" fill="#334155" />
        <text x="35" y="66" fill="#f8fafc" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
          DHT22
        </text>

        {/* Pins */}
        {pins.map((pin) => {
          const isSelected = selectedPin === `${component.id}:${pin.id}`;
          return (
            <g
              key={pin.id}
              className="cursor-pointer group/pin"
              onClick={(e) => onPinClick && onPinClick(pin.id, e)}
            >
              {/* Metal pin leg */}
              <line x1={pin.x} y1="75" x2={pin.x} y2={pin.y} stroke="#cbd5e1" strokeWidth="2.5" />
              {/* Pin endpoint */}
              <circle
                cx={pin.x}
                cy={pin.y}
                r="3.5"
                fill={isSelected ? '#38bdf8' : '#e2e8f0'}
                stroke={isSelected ? '#0284c7' : '#64748b'}
                strokeWidth="1.5"
              />
              <text x={pin.x} y={pin.y + 10} fill="#94a3b8" fontSize="5" textAnchor="middle" className="font-mono">
                {pin.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Quick Click to adjust sliders popup trigger */}
      <button
        onClick={() => setShowControls(!showControls)}
        className="absolute top-1 right-1 bg-slate-800 hover:bg-slate-700 text-[9px] text-sky-400 px-1 py-0.5 rounded border border-slate-600 shadow transition-all"
        title="Adjust Temperature & Humidity"
      >
        ⚙ {temp}°C
      </button>

      {/* Floating Interactive Controls Slider */}
      {showControls && (
        <div
          className="absolute z-50 -top-32 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-slate-700 rounded-lg p-3 shadow-2xl w-48 text-xs text-white backdrop-blur"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between font-bold text-sky-400 mb-2">
            <span>DHT22 Controls</span>
            <button onClick={() => setShowControls(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex justify-between items-center text-[10px] text-slate-300 mb-0.5">
                <span className="flex items-center gap-1"><Thermometer size={12} className="text-red-400" /> Temperature</span>
                <span className="font-mono text-red-300 font-bold">{temp.toFixed(1)} °C</span>
              </div>
              <input
                type="range"
                min="-40"
                max="80"
                step="0.5"
                value={temp}
                onChange={(e) => onUpdateAttrs && onUpdateAttrs(component.id, { temperature: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center text-[10px] text-slate-300 mb-0.5">
                <span className="flex items-center gap-1"><Droplets size={12} className="text-blue-400" /> Humidity</span>
                <span className="font-mono text-blue-300 font-bold">{hum.toFixed(0)} %</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={hum}
                onChange={(e) => onUpdateAttrs && onUpdateAttrs(component.id, { humidity: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

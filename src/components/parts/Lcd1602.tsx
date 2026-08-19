import React, { useEffect, useState } from 'react';
import { CircuitComponent } from '../../types/circuit';
import { getComponentPins } from '../canvas/PinDefinitionRegistry';
import { i2cBus, LcdState } from '../../engine/i2cBus';

interface Props {
  component: CircuitComponent;
  onPinClick?: (pinId: string, e: React.MouseEvent) => void;
  selectedPin?: string | null;
}

export const Lcd1602: React.FC<Props> = ({ component, onPinClick, selectedPin }) => {
  const pins = getComponentPins(component.type);
  const [lcdState, setLcdState] = useState<LcdState>(i2cBus.getLcdState(component.id));

  useEffect(() => {
    const unsub = i2cBus.subscribe(() => {
      setLcdState({ ...i2cBus.getLcdState(component.id) });
    });
    return unsub;
  }, [component.id]);

  return (
    <div className="relative select-none pointer-events-auto" style={{ width: 220, height: 120 }}>
      <svg width="220" height="120" viewBox="0 0 220 120" className="drop-shadow-xl">
        {/* Dark Blue PCB Backplate */}
        <rect x="5" y="5" width="210" height="100" rx="4" fill="#0f172a" stroke="#1e293b" strokeWidth="1.5" />

        {/* 4 Corner Screws */}
        <circle cx="12" cy="12" r="2.5" fill="#64748b" />
        <circle cx="208" cy="12" r="2.5" fill="#64748b" />
        <circle cx="12" cy="98" r="2.5" fill="#64748b" />
        <circle cx="208" cy="98" r="2.5" fill="#64748b" />

        {/* LCD Bezel / Metal Frame */}
        <rect x="22" y="15" width="176" height="60" rx="3" fill="#334155" stroke="#475569" strokeWidth="1" />

        {/* LCD Screen Display Glass (HD44780 Blue / Yellow-Green Backlight) */}
        <rect
          x="30"
          y="20"
          width="160"
          height="50"
          rx="2"
          fill={lcdState.backlight ? '#0284c7' : '#075985'}
          stroke="#0369a1"
        />

        {/* Dot Matrix Text Characters */}
        <text
          x="38"
          y="42"
          fill="#ffffff"
          fontSize="11"
          fontFamily="monospace"
          letterSpacing="2.5"
          className="font-bold tracking-widest"
        >
          {lcdState.lines[0] || ' '.repeat(16)}
        </text>
        <text
          x="38"
          y="60"
          fill="#ffffff"
          fontSize="11"
          fontFamily="monospace"
          letterSpacing="2.5"
          className="font-bold tracking-widest"
        >
          {lcdState.lines[1] || ' '.repeat(16)}
        </text>

        {/* I2C Adapter Board / Pin Header Label */}
        <rect x="15" y="96" width="70" height="16" rx="2" fill="#1e293b" />

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
                r="3.5"
                fill={isSelected ? '#38bdf8' : '#e2e8f0'}
                stroke={isSelected ? '#0284c7' : '#64748b'}
                strokeWidth="1.5"
                className="group-hover:scale-125 transition-transform"
              />
              <text x={pin.x} y={pin.y - 6} fill="#94a3b8" fontSize="5" textAnchor="middle" className="font-mono">
                {pin.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

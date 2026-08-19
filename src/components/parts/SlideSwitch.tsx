import React from 'react';
import { CircuitComponent } from '../../types/circuit';
import { getComponentPins } from '../canvas/PinDefinitionRegistry';

interface Props {
  component: CircuitComponent;
  onUpdateAttrs?: (id: string, attrs: Record<string, any>) => void;
  onPinClick?: (pinId: string, e: React.MouseEvent) => void;
  selectedPin?: string | null;
}

export const SlideSwitch: React.FC<Props> = ({
  component,
  onUpdateAttrs,
  onPinClick,
  selectedPin,
}) => {
  const pins = getComponentPins(component.type);
  const state = component.attrs?.state ?? 0; // 0 = left, 1 = right

  return (
    <div className="relative select-none pointer-events-auto" style={{ width: 56, height: 42 }}>
      <svg width="56" height="42" viewBox="0 0 56 42" className="drop-shadow-sm">
        {/* Metal Body */}
        <rect x="4" y="6" width="48" height="24" rx="2" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
        <rect x="8" y="10" width="40" height="16" rx="1" fill="#334155" />

        {/* Black Slider Knob */}
        <rect
          x={state === 0 ? 10 : 30}
          y="8"
          width="16"
          height="20"
          rx="2"
          fill="#0f172a"
          stroke="#94a3b8"
          strokeWidth="1"
          className="cursor-pointer transition-all hover:fill-slate-800"
          onClick={() => onUpdateAttrs && onUpdateAttrs(component.id, { state: state === 0 ? 1 : 0 })}
        />

        {/* Pins */}
        {pins.map((pin) => {
          const isSelected = selectedPin === `${component.id}:${pin.id}`;
          return (
            <g
              key={pin.id}
              className="cursor-pointer group"
              onClick={(e) => onPinClick && onPinClick(pin.id, e)}
            >
              <line x1={pin.x} y1="30" x2={pin.x} y2={pin.y} stroke="#cbd5e1" strokeWidth="2" />
              <circle
                cx={pin.x}
                cy={pin.y}
                r="3.5"
                fill={isSelected ? '#38bdf8' : '#e2e8f0'}
                stroke={isSelected ? '#0284c7' : '#64748b'}
                strokeWidth="1.5"
                className="group-hover:scale-125 transition-transform"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

import React from 'react';
import { CircuitComponent, WireConnection } from '../../types/circuit';
import { getComponentPins } from './PinDefinitionRegistry';
import { computeOrthogonalPath, Point } from '../../utils/wireRouting';

interface Props {
  wires: WireConnection[];
  components: CircuitComponent[];
  activeWireStart: { compId: string; pinId: string; pos: Point } | null;
  cursorPos: Point | null;
  selectedWireId: string | null;
  onSelectWire: (wireId: string | null) => void;
  onDeleteWire: (wireId: string) => void;
  wireStyle?: 'orthogonal' | 'curved';
}

export const WireRenderer: React.FC<Props> = ({
  wires,
  components,
  activeWireStart,
  cursorPos,
  selectedWireId,
  onSelectWire,
  wireStyle = 'orthogonal',
}) => {
  const getPinCoordinate = (fullPinId: string): Point | null => {
    const [compId, pinId] = fullPinId.split(':');
    const comp = components.find((c) => c.id === compId);
    if (!comp) return null;

    const pins = getComponentPins(comp.type);
    const pin = pins.find((p) => p.id === pinId);
    if (!pin) return null;

    return {
      x: comp.left + pin.x,
      y: comp.top + pin.y,
    };
  };

  const getWireColorHex = (c: string) => {
    switch (c) {
      case 'red': return '#ef4444';
      case 'black': return '#27272a';
      case 'green': return '#22c55e';
      case 'blue': return '#3b82f6';
      case 'yellow': return '#eab308';
      case 'orange': return '#f97316';
      case 'purple': return '#a855f7';
      case 'white': return '#f8fafc';
      case 'cyan': return '#06b6d4';
      default: return '#22c55e';
    }
  };

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
      {/* Existing Finished Wires */}
      {wires.map((wire) => {
        const start = getPinCoordinate(wire.from);
        const end = getPinCoordinate(wire.to);
        if (!start || !end) return null;

        const isSelected = selectedWireId === wire.id;
        const pathData = computeOrthogonalPath(start, end);
        const colorHex = getWireColorHex(wire.color);

        return (
          <g key={wire.id} className="pointer-events-auto cursor-pointer group">
            {/* Wider transparent hit-area for easy clicking */}
            <path
              d={pathData}
              stroke="transparent"
              strokeWidth="12"
              fill="none"
              onClick={(e) => {
                e.stopPropagation();
                onSelectWire(wire.id);
              }}
            />

            {/* Selection Highlight Glow */}
            {isSelected && (
              <path
                d={pathData}
                stroke="#38bdf8"
                strokeWidth="7"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.8"
                className="animate-pulse"
              />
            )}

            {/* Main Visible Wire Line */}
            <path
              d={pathData}
              stroke={colorHex}
              strokeWidth={isSelected ? '3.5' : '2.5'}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all group-hover:stroke-cyan-300"
              onClick={(e) => {
                e.stopPropagation();
                onSelectWire(wire.id);
              }}
            />

            {/* Wire endpoints dots */}
            <circle cx={start.x} cy={start.y} r="2.5" fill={colorHex} />
            <circle cx={end.x} cy={end.y} r="2.5" fill={colorHex} />
          </g>
        );
      })}

      {/* Wire in progress of being drawn */}
      {activeWireStart && cursorPos && (
        <g>
          <path
            d={computeOrthogonalPath(activeWireStart.pos, cursorPos)}
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeDasharray="4 4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={activeWireStart.pos.x} cy={activeWireStart.pos.y} r="3.5" fill="#38bdf8" />
          <circle cx={cursorPos.x} cy={cursorPos.y} r="3.5" fill="#38bdf8" />
        </g>
      )}
    </svg>
  );
};

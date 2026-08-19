import React, { useState, useRef, useEffect } from 'react';
import { CircuitComponent, WireConnection, ComponentType } from '../../types/circuit';
import { Esp32DevKit } from '../parts/Esp32DevKit';
import { ArduinoUno } from '../parts/ArduinoUno';
import { DhtSensor } from '../parts/DhtSensor';
import { RelayModule } from '../parts/RelayModule';
import { Led } from '../parts/Led';
import { Buzzer } from '../parts/Buzzer';
import { Resistor } from '../parts/Resistor';
import { Potentiometer } from '../parts/Potentiometer';
import { PushButton } from '../parts/PushButton';
import { SlideSwitch } from '../parts/SlideSwitch';
import { Lcd1602 } from '../parts/Lcd1602';
import { ServoMotor } from '../parts/ServoMotor';
import { UltrasonicSensor } from '../parts/UltrasonicSensor';
import { WireRenderer } from './WireRenderer';
import { getComponentPins } from './PinDefinitionRegistry';
import { PinManager } from '../../engine/pinManager';
import { WIRE_COLORS, Point } from '../../utils/wireRouting';
import { ZoomIn, ZoomOut, Maximize, Trash2, Palette } from 'lucide-react';

interface Props {
  components: CircuitComponent[];
  wires: WireConnection[];
  pinManager: PinManager;
  onUpdateComponentPosition: (id: string, left: number, top: number) => void;
  onUpdateComponentAttrs: (id: string, attrs: Record<string, any>) => void;
  onAddWire: (wire: WireConnection) => void;
  onDeleteWire: (wireId: string) => void;
  onDeleteComponent: (id: string) => void;
  onOpenAddPalette?: () => void;
}

export const CircuitCanvas: React.FC<Props> = ({
  components,
  wires,
  pinManager,
  onUpdateComponentPosition,
  onUpdateComponentAttrs,
  onAddWire,
  onDeleteWire,
  onDeleteComponent,
  onOpenAddPalette,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Zoom and Pan
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<Point>({ x: 0, y: 0 });

  // Dragging Component
  const [draggingCompId, setDraggingCompId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 });

  // Wiring State
  const [activeWireStart, setActiveWireStart] = useState<{ compId: string; pinId: string; pos: Point } | null>(null);
  const [cursorPos, setCursorPos] = useState<Point | null>(null);
  const [selectedWireColor, setSelectedWireColor] = useState('green');
  const [selectedWireId, setSelectedWireId] = useState<string | null>(null);
  const [selectedCompId, setSelectedCompId] = useState<string | null>(null);

  // Live simulation states for components
  const [pinStates, setPinStates] = useState(pinManager.getAllPinStates());

  useEffect(() => {
    const unsub = pinManager.subscribe((states) => {
      setPinStates(states);
    });
    return unsub;
  }, [pinManager]);

  // Keyboard shortcut for deleting wire or component
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedWireId) {
          onDeleteWire(selectedWireId);
          setSelectedWireId(null);
        } else if (selectedCompId) {
          onDeleteComponent(selectedCompId);
          setSelectedCompId(null);
        }
      } else if (e.key === 'Escape') {
        setActiveWireStart(null);
        setSelectedWireId(null);
        setSelectedCompId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedWireId, selectedCompId, onDeleteWire, onDeleteComponent]);

  const handleMouseDownCanvas = (e: React.MouseEvent) => {
    if (e.button === 1 || e.altKey || (e.target === containerRef.current)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
    setSelectedWireId(null);
    setSelectedCompId(null);
  };

  const handleMouseMoveCanvas = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const canvasX = (e.clientX - rect.left - pan.x) / zoom;
    const canvasY = (e.clientY - rect.top - pan.y) / zoom;

    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    } else if (draggingCompId) {
      const comp = components.find((c) => c.id === draggingCompId);
      if (comp) {
        const newLeft = Math.round((canvasX - dragOffset.x) / 10) * 10;
        const newTop = Math.round((canvasY - dragOffset.y) / 10) * 10;
        onUpdateComponentPosition(draggingCompId, Math.max(0, newLeft), Math.max(0, newTop));
      }
    } else if (activeWireStart) {
      setCursorPos({ x: canvasX, y: canvasY });
    }
  };

  const handleMouseUpCanvas = () => {
    setIsPanning(false);
    setDraggingCompId(null);
  };

  const handlePinClick = (compId: string, pinId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const comp = components.find((c) => c.id === compId);
    if (!comp) return;

    const pins = getComponentPins(comp.type);
    const pin = pins.find((p) => p.id === pinId);
    if (!pin) return;

    const pinPos: Point = {
      x: comp.left + pin.x,
      y: comp.top + pin.y,
    };

    if (!activeWireStart) {
      // Start new wire
      setActiveWireStart({ compId, pinId, pos: pinPos });
      setCursorPos(pinPos);
    } else {
      // Complete wire
      if (activeWireStart.compId === compId && activeWireStart.pinId === pinId) {
        setActiveWireStart(null);
        return;
      }

      const newWire: WireConnection = {
        id: `wire_${Math.random().toString(36).substring(2, 9)}`,
        from: `${activeWireStart.compId}:${activeWireStart.pinId}`,
        to: `${compId}:${pinId}`,
        color: selectedWireColor,
      };

      onAddWire(newWire);
      setActiveWireStart(null);
    }
  };

  const renderComponent = (comp: CircuitComponent) => {
    const isSelected = selectedCompId === comp.id;

    const handleCompMouseDown = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!containerRef.current) return;
      setSelectedCompId(comp.id);
      setSelectedWireId(null);

      const rect = containerRef.current.getBoundingClientRect();
      const canvasX = (e.clientX - rect.left - pan.x) / zoom;
      const canvasY = (e.clientY - rect.top - pan.y) / zoom;

      setDraggingCompId(comp.id);
      setDragOffset({
        x: canvasX - comp.left,
        y: canvasY - comp.top,
      });
    };

    let innerElement: React.ReactNode = null;

    switch (comp.type) {
      case 'wokwi-esp32-devkit-v1':
        innerElement = (
          <Esp32DevKit
            component={comp}
            onPinClick={(p, e) => handlePinClick(comp.id, p, e)}
            selectedPin={activeWireStart ? `${activeWireStart.compId}:${activeWireStart.pinId}` : null}
          />
        );
        break;
      case 'wokwi-arduino-uno': {
        const pin13 = pinStates.get(`${comp.id}:13`);
        const isPin13High = pin13?.value === 1 || (pin13?.value ?? 0) > 0;
        innerElement = (
          <ArduinoUno
            component={comp}
            isPin13High={isPin13High}
            onPinClick={(p, e) => handlePinClick(comp.id, p, e)}
            selectedPin={activeWireStart ? `${activeWireStart.compId}:${activeWireStart.pinId}` : null}
          />
        );
        break;
      }
      case 'wokwi-dht22':
        innerElement = (
          <DhtSensor
            component={comp}
            onUpdateAttrs={onUpdateComponentAttrs}
            onPinClick={(p, e) => handlePinClick(comp.id, p, e)}
            selectedPin={activeWireStart ? `${activeWireStart.compId}:${activeWireStart.pinId}` : null}
          />
        );
        break;
      case 'wokwi-relay-module':
        innerElement = (
          <RelayModule
            component={comp}
            onPinClick={(p, e) => handlePinClick(comp.id, p, e)}
            selectedPin={activeWireStart ? `${activeWireStart.compId}:${activeWireStart.pinId}` : null}
          />
        );
        break;
      case 'wokwi-led': {
        const { lit } = pinManager.isLedLit(comp.id);
        innerElement = (
          <Led
            component={comp}
            isLit={lit}
            onPinClick={(p, e) => handlePinClick(comp.id, p, e)}
            selectedPin={activeWireStart ? `${activeWireStart.compId}:${activeWireStart.pinId}` : null}
          />
        );
        break;
      }
      case 'wokwi-buzzer': {
        const p1 = pinStates.get(`${comp.id}:1`);
        const isBuzzerActive = (p1?.frequency ?? 0) > 0 || (p1?.value ?? 0) > 0;
        innerElement = (
          <Buzzer
            component={comp}
            isActive={isBuzzerActive}
            onPinClick={(p, e) => handlePinClick(comp.id, p, e)}
            selectedPin={activeWireStart ? `${activeWireStart.compId}:${activeWireStart.pinId}` : null}
          />
        );
        break;
      }
      case 'wokwi-resistor':
        innerElement = (
          <Resistor
            component={comp}
            onPinClick={(p, e) => handlePinClick(comp.id, p, e)}
            selectedPin={activeWireStart ? `${activeWireStart.compId}:${activeWireStart.pinId}` : null}
          />
        );
        break;
      case 'wokwi-potentiometer':
        innerElement = (
          <Potentiometer
            component={comp}
            onUpdateAttrs={onUpdateComponentAttrs}
            onPinClick={(p, e) => handlePinClick(comp.id, p, e)}
            selectedPin={activeWireStart ? `${activeWireStart.compId}:${activeWireStart.pinId}` : null}
          />
        );
        break;
      case 'wokwi-pushbutton':
        innerElement = (
          <PushButton
            component={comp}
            onUpdateAttrs={onUpdateComponentAttrs}
            onPinClick={(p, e) => handlePinClick(comp.id, p, e)}
            selectedPin={activeWireStart ? `${activeWireStart.compId}:${activeWireStart.pinId}` : null}
          />
        );
        break;
      case 'wokwi-slide-switch':
        innerElement = (
          <SlideSwitch
            component={comp}
            onUpdateAttrs={onUpdateComponentAttrs}
            onPinClick={(p, e) => handlePinClick(comp.id, p, e)}
            selectedPin={activeWireStart ? `${activeWireStart.compId}:${activeWireStart.pinId}` : null}
          />
        );
        break;
      case 'wokwi-lcd1602':
        innerElement = (
          <Lcd1602
            component={comp}
            onPinClick={(p, e) => handlePinClick(comp.id, p, e)}
            selectedPin={activeWireStart ? `${activeWireStart.compId}:${activeWireStart.pinId}` : null}
          />
        );
        break;
      case 'wokwi-servo':
        innerElement = (
          <ServoMotor
            component={comp}
            onPinClick={(p, e) => handlePinClick(comp.id, p, e)}
            selectedPin={activeWireStart ? `${activeWireStart.compId}:${activeWireStart.pinId}` : null}
          />
        );
        break;
      case 'wokwi-hc-sr04':
        innerElement = (
          <UltrasonicSensor
            component={comp}
            onUpdateAttrs={onUpdateComponentAttrs}
            onPinClick={(p, e) => handlePinClick(comp.id, p, e)}
            selectedPin={activeWireStart ? `${activeWireStart.compId}:${activeWireStart.pinId}` : null}
          />
        );
        break;
      default:
        return null;
    }

    return (
      <div
        key={comp.id}
        className={`absolute cursor-move transition-shadow ${
          isSelected ? 'ring-2 ring-sky-400 ring-offset-2 ring-offset-slate-900 rounded-lg' : ''
        }`}
        style={{
          left: comp.left,
          top: comp.top,
          transform: `rotate(${comp.rotate || 0}deg)`,
        }}
        onMouseDown={handleCompMouseDown}
      >
        {innerElement}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-[#1b1c20] overflow-hidden canvas-grid select-none cursor-crosshair"
      onMouseDown={handleMouseDownCanvas}
      onMouseMove={handleMouseMoveCanvas}
      onMouseUp={handleMouseUpCanvas}
    >
      {/* Zoom / Pan Container */}
      <div
        className="absolute inset-0 origin-top-left"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        }}
      >
        {/* Render Components */}
        {components.map(renderComponent)}

        {/* Render Wires */}
        <WireRenderer
          wires={wires}
          components={components}
          activeWireStart={activeWireStart}
          cursorPos={cursorPos}
          selectedWireId={selectedWireId}
          onSelectWire={setSelectedWireId}
          onDeleteWire={onDeleteWire}
        />
      </div>

      {/* Top Left Simulation Canvas Toolbar */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <button
          onClick={onOpenAddPalette}
          className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg transition hover:scale-105 active:scale-95"
        >
          <span className="text-base leading-none font-bold">+</span> Add Part
        </button>

        {activeWireStart && (
          <div className="bg-sky-950/90 border border-sky-500 text-sky-200 text-xs px-3 py-1 rounded-lg flex items-center gap-2 shadow-lg backdrop-blur animate-pulse">
            <span>Click any target pin to connect wire (or Esc to cancel)</span>
          </div>
        )}
      </div>

      {/* Wire Color Picker Toolbar & Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 rounded-xl p-1.5 shadow-2xl backdrop-blur">
        <div className="flex items-center gap-1 px-2 border-r border-slate-700">
          <Palette size={14} className="text-slate-400" />
          <span className="text-[11px] font-medium text-slate-300">Wire:</span>
          {WIRE_COLORS.slice(0, 6).map((c) => (
            <button
              key={c.name}
              onClick={() => setSelectedWireColor(c.name.toLowerCase())}
              className={`w-4 h-4 rounded-full transition-transform ${c.bg} ${
                selectedWireColor === c.name.toLowerCase() ? 'ring-2 ring-white scale-125' : 'hover:scale-110'
              }`}
              title={`${c.name} wire`}
            />
          ))}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom((z) => Math.min(2.5, z + 0.15))}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
          <span className="text-[11px] font-mono text-slate-400 w-9 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.max(0.4, z - 0.15))}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Reset View"
          >
            <Maximize size={16} />
          </button>
        </div>

        {/* Delete Selection Button */}
        {(selectedWireId || selectedCompId) && (
          <button
            onClick={() => {
              if (selectedWireId) {
                onDeleteWire(selectedWireId);
                setSelectedWireId(null);
              } else if (selectedCompId) {
                onDeleteComponent(selectedCompId);
                setSelectedCompId(null);
              }
            }}
            className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/50 border border-red-800/40 transition flex items-center gap-1 text-xs"
            title="Delete Selected"
          >
            <Trash2 size={14} />
            <span className="text-[10px]">Delete</span>
          </button>
        )}
      </div>
    </div>
  );
};

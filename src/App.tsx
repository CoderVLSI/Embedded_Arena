import React, { useState, useRef, useCallback, useMemo } from 'react';
import { CircuitComponent, WireConnection, ComponentType, DiagramConfig, ProjectFile } from './types/circuit';
import { SerialLogMessage, SimulationState } from './types/simulation';
import { PinManager } from './engine/pinManager';
import { ArduinoRuntime } from './engine/arduinoRuntime';
import { i2cBus } from './engine/i2cBus';
import { STARTER_PROJECTS } from './engine/examples';
import { TopNavBar } from './components/navbar/TopNavBar';
import { CodeEditor } from './components/editor/CodeEditor';
import { CircuitCanvas } from './components/canvas/CircuitCanvas';
import { ComponentPalette } from './components/canvas/ComponentPalette';
import { TerminalPanel } from './components/terminal/TerminalPanel';
import { DocsModal } from './components/docs/DocsModal';
import { AiAssistantPanel } from './components/ai/AiAssistantPanel';
import { GuidedLabPanel } from './components/guided/GuidedLabPanel';
import { AiProjectDesign } from './services/geminiService';
import { autoLayoutCircuit, findNextAutoPlaceCoordinate } from './utils/autoLayout';

const defaultProject = STARTER_PROJECTS[0];

function diagramToComponents(diagram: DiagramConfig): CircuitComponent[] {
  return diagram.parts.map((p) => ({
    id: p.id,
    type: p.type,
    top: p.top,
    left: p.left,
    rotate: p.rotate,
    attrs: p.attrs || {},
  }));
}

function diagramToWires(diagram: DiagramConfig): WireConnection[] {
  return diagram.connections.map((c, i) => ({
    id: `wire_${i}_${c[0]}_${c[1]}`,
    from: c[0],
    to: c[1],
    color: c[2],
  }));
}

function componentsToDiagram(components: CircuitComponent[], wires: WireConnection[]): DiagramConfig {
  return {
    version: 1,
    author: 'Embedded Arena',
    editor: 'embedded-arena-web',
    parts: components.map((c) => ({
      type: c.type,
      id: c.id,
      top: c.top,
      left: c.left,
      rotate: c.rotate,
      attrs: c.attrs,
    })),
    connections: wires.map((w) => [w.from, w.to, w.color] as [string, string, string]),
  };
}

const App: React.FC = () => {
  // Core state
  const [components, setComponents] = useState<CircuitComponent[]>(diagramToComponents(defaultProject.diagram));
  const [wires, setWires] = useState<WireConnection[]>(diagramToWires(defaultProject.diagram));
  const [inoCode, setInoCode] = useState(defaultProject.inoCode);
  const [libraries, setLibraries] = useState<string[]>(defaultProject.libraries);
  const [projectName, setProjectName] = useState(defaultProject.name);

  // Simulation state
  const [simState, setSimState] = useState<SimulationState>({
    isRunning: false, isPaused: false, timeMs: 0, cpuSpeedHz: 16000000, fps: 60,
  });
  const [serialLogs, setSerialLogs] = useState<SerialLogMessage[]>([]);
  const [baudRate, setBaudRate] = useState(9600);

  // Component palette, Docs, Guided Lab & AI Assistant modals
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [guidedLabOpen, setGuidedLabOpen] = useState(false);
  const [autoPlaceMode, setAutoPlaceMode] = useState(true);

  // Pin manager & runtime (persistent refs)
  const pinManagerRef = useRef(new PinManager());
  const runtimeRef = useRef(new ArduinoRuntime(pinManagerRef.current));

  // Memoize diagram JSON for editor
  const diagramJson = useMemo(() => {
    return JSON.stringify(componentsToDiagram(components, wires), null, 2);
  }, [components, wires]);

  // ---------- SIMULATION CALLBACKS ----------
  const handleStop = useCallback(() => {
    runtimeRef.current.stop();
    i2cBus.resetAll();
  }, []);

  const handlePause = useCallback(() => {
    runtimeRef.current.pause();
  }, []);

  // ---------- AI & GUIDED LAB DESIGN HANDLERS ----------
  const handleApplyAiDesign = useCallback((design: AiProjectDesign) => {
    handleStop();
    setComponents(design.components);
    setWires(design.wires);
    setInoCode(design.inoCode);
    setLibraries(design.libraries);
    setProjectName(design.title);
    setSerialLogs([]);
    i2cBus.resetAll();
    pinManagerRef.current.reset();
  }, [handleStop]);

  const handleLoadLabCircuit = useCallback((
    labComponents: CircuitComponent[],
    labWires: WireConnection[],
    labCode: string,
    labLibs: string[],
    labTitle: string
  ) => {
    handleStop();
    setComponents(labComponents);
    setWires(labWires);
    setInoCode(labCode);
    setLibraries(labLibs);
    setProjectName(labTitle);
    setSerialLogs([]);
    i2cBus.resetAll();
    pinManagerRef.current.reset();
  }, [handleStop]);

  const handleAutoLayout = useCallback(() => {
    setComponents((prev) => autoLayoutCircuit(prev, wires));
  }, [wires]);

  const handlePlay = useCallback(() => {
    const pm = pinManagerRef.current;
    const rt = runtimeRef.current;

    pm.setComponentsAndWires(components, wires);
    rt.setComponents(components);

    rt.setCallbacks(
      (msg) => setSerialLogs((prev) => [...prev, msg]),
      (state) => setSimState(state),
      (id, attrs) => {
        setComponents((prev) =>
          prev.map((c) => (c.id === id ? { ...c, attrs: { ...c.attrs, ...attrs } } : c))
        );
      }
    );

    setSerialLogs([]);
    rt.start(inoCode);
  }, [components, wires, inoCode]);

  // ---------- COMPONENT & WIRE MANAGEMENT ----------
  const handleUpdateComponentPosition = useCallback((id: string, left: number, top: number) => {
    setComponents((prev) => prev.map((c) => (c.id === id ? { ...c, left, top } : c)));
  }, []);

  const handleUpdateComponentAttrs = useCallback((id: string, attrs: Record<string, any>) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, attrs: { ...c.attrs, ...attrs } } : c))
    );
  }, []);

  const handleAddWire = useCallback((wire: WireConnection) => {
    setWires((prev) => [...prev, wire]);
  }, []);

  const handleDeleteWire = useCallback((wireId: string) => {
    setWires((prev) => prev.filter((w) => w.id !== wireId));
  }, []);

  const handleDeleteComponent = useCallback((compId: string) => {
    setComponents((prev) => prev.filter((c) => c.id !== compId));
    setWires((prev) => prev.filter((w) => !w.from.startsWith(compId + ':') && !w.to.startsWith(compId + ':')));
  }, []);

  const handleAddComponent = useCallback((type: ComponentType, attrs?: Record<string, any>) => {
    const id = type.replace('wokwi-', '').replace(/-/g, '') + '_' + Math.random().toString(36).substring(2, 6);
    const pos = autoPlaceMode
      ? findNextAutoPlaceCoordinate(components)
      : { top: 200 + Math.random() * 80, left: 300 + Math.random() * 120 };

    const newComp: CircuitComponent = {
      id,
      type,
      top: pos.top,
      left: pos.left,
      attrs: attrs || {},
    };
    setComponents((prev) => [...prev, newComp]);
  }, [autoPlaceMode, components]);

  // ---------- PROJECT LOAD / EXPORT ----------
  const handleLoadProject = useCallback((project: ProjectFile) => {
    handleStop();
    setComponents(diagramToComponents(project.diagram));
    setWires(diagramToWires(project.diagram));
    setInoCode(project.inoCode);
    setLibraries(project.libraries);
    setProjectName(project.name);
    setSerialLogs([]);
    i2cBus.resetAll();
    pinManagerRef.current.reset();
  }, [handleStop]);

  const handleExportProject = useCallback(() => {
    const data = {
      name: projectName,
      inoCode,
      diagram: componentsToDiagram(components, wires),
      libraries,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [projectName, inoCode, components, wires, libraries]);

  const handleChangeDiagramJson = useCallback((json: string) => {
    try {
      const parsed = JSON.parse(json) as DiagramConfig;
      setComponents(diagramToComponents(parsed));
      setWires(diagramToWires(parsed));
    } catch {
      // ignore invalid JSON during editing
    }
  }, []);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <TopNavBar
        simState={simState}
        onPlay={handlePlay}
        onPause={handlePause}
        onStop={handleStop}
        onLoadProject={handleLoadProject}
        onAddComponent={() => setPaletteOpen(true)}
        onExportProject={handleExportProject}
        onOpenDocs={() => setDocsOpen(true)}
        onOpenAiAssistant={() => setAiOpen(true)}
        onOpenGuidedLab={() => setGuidedLabOpen(true)}
        projectName={projectName}
      />

      {/* Main Body: Editor (Left) + Canvas (Right) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Code Editor */}
        <div className="w-[420px] min-w-[340px] flex flex-col border-r border-[#2d2d2d]">
          <div className="flex-1 overflow-hidden">
            <CodeEditor
              inoCode={inoCode}
              onChangeInoCode={setInoCode}
              diagramJson={diagramJson}
              onChangeDiagramJson={handleChangeDiagramJson}
              libraries={libraries}
              onAddLibrary={(lib) => setLibraries((p) => [...p, lib])}
              onRemoveLibrary={(lib) => setLibraries((p) => p.filter((l) => l !== lib))}
            />
          </div>
        </div>

        {/* Right Panel: Circuit Canvas + Terminal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Circuit Canvas */}
          <div className="flex-1 relative overflow-hidden">
            <CircuitCanvas
              components={components}
              wires={wires}
              pinManager={pinManagerRef.current}
              onUpdateComponentPosition={handleUpdateComponentPosition}
              onUpdateComponentAttrs={handleUpdateComponentAttrs}
              onAddWire={handleAddWire}
              onDeleteWire={handleDeleteWire}
              onDeleteComponent={handleDeleteComponent}
              onOpenAddPalette={() => setPaletteOpen(true)}
              onAutoLayout={handleAutoLayout}
              autoPlaceMode={autoPlaceMode}
              onToggleAutoPlaceMode={() => setAutoPlaceMode(!autoPlaceMode)}
            />
          </div>

          {/* Bottom Terminal Panel */}
          <TerminalPanel
            logs={serialLogs}
            onClearLogs={() => setSerialLogs([])}
            onSendSerialInput={(text) => runtimeRef.current.sendSerialInput(text)}
            pinManager={pinManagerRef.current}
            baudRate={baudRate}
            onChangeBaudRate={setBaudRate}
          />
        </div>
      </div>

      {/* Component Palette Modal */}
      <ComponentPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onAddComponent={handleAddComponent}
      />

      {/* Hardware & Arduino Documentation Modal */}
      <DocsModal
        isOpen={docsOpen}
        onClose={() => setDocsOpen(false)}
      />

      {/* AI Assistant (Beta) Sidebar */}
      <AiAssistantPanel
        isOpen={aiOpen}
        onClose={() => setAiOpen(false)}
        onApplyProject={handleApplyAiDesign}
      />

      {/* Guided AI Learning Lab Tutor */}
      <GuidedLabPanel
        isOpen={guidedLabOpen}
        onClose={() => setGuidedLabOpen(false)}
        onLoadLabCircuit={handleLoadLabCircuit}
      />
    </div>
  );
};

export default App;

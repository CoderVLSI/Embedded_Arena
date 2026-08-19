import React, { useState } from 'react';
import { STARTER_PROJECTS } from '../../engine/examples';
import { ProjectFile } from '../../types/circuit';
import { SimulationState } from '../../types/simulation';
import {
  Play, Pause, Square, Plus, FolderOpen, Download,
  Cpu, ChevronDown, Zap, ExternalLink
} from 'lucide-react';

interface Props {
  simState: SimulationState;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onLoadProject: (project: ProjectFile) => void;
  onAddComponent: () => void;
  onExportProject: () => void;
  projectName: string;
}

export const TopNavBar: React.FC<Props> = ({
  simState,
  onPlay,
  onPause,
  onStop,
  onLoadProject,
  onAddComponent,
  onExportProject,
  projectName,
}) => {
  const [showExamples, setShowExamples] = useState(false);

  const formatTime = (ms: number) => {
    const s = ms / 1000;
    if (s < 60) return `${s.toFixed(1)}s`;
    const m = Math.floor(s / 60);
    return `${m}m ${(s % 60).toFixed(0)}s`;
  };

  return (
    <div className="flex items-center justify-between h-12 px-4 bg-[#1a1a2e] border-b border-[#2d2d44] select-none shadow-lg z-30">
      {/* Left: Brand + Simulation Controls */}
      <div className="flex items-center gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2 mr-2">
          <div className="w-7 h-7 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
            <Cpu size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-none tracking-tight">Embedded Arena</h1>
            <p className="text-[9px] text-slate-400 leading-none mt-0.5">Circuit Simulator</p>
          </div>
        </div>

        {/* Simulation Controls */}
        <div className="flex items-center gap-1 bg-[#252540] rounded-lg p-0.5 border border-slate-700/50">
          {!simState.isRunning ? (
            <button
              onClick={onPlay}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-md text-xs font-semibold transition shadow"
            >
              <Play size={14} fill="currentColor" /> Run
            </button>
          ) : (
            <>
              <button
                onClick={onPause}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition ${
                  simState.isPaused
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-600/40'
                }`}
              >
                <Pause size={13} /> {simState.isPaused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={onStop}
                className="flex items-center gap-1 bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-700/40 px-2.5 py-1.5 rounded-md text-xs font-medium transition"
              >
                <Square size={13} fill="currentColor" /> Stop
              </button>
            </>
          )}
        </div>

        {/* Sim Timer */}
        {simState.isRunning && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono bg-slate-800/60 px-2.5 py-1 rounded border border-slate-700/50">
            <Zap size={12} className="text-emerald-400" />
            <span className="text-emerald-300">{formatTime(simState.timeMs)}</span>
          </div>
        )}
      </div>

      {/* Center: Project Name */}
      <div className="text-xs text-slate-300 font-medium truncate max-w-[250px]">
        {projectName}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Add Component */}
        <button
          onClick={onAddComponent}
          className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition shadow"
        >
          <Plus size={14} /> Add Part
        </button>

        {/* Load Example */}
        <div className="relative">
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium transition border border-slate-700"
          >
            <FolderOpen size={14} /> Examples <ChevronDown size={12} />
          </button>

          {showExamples && (
            <div className="absolute right-0 top-full mt-1.5 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 max-h-[400px] overflow-y-auto">
              <div className="p-2.5 border-b border-slate-800">
                <p className="text-[11px] text-slate-400 font-semibold">📦 Starter Projects (click to load)</p>
              </div>
              {STARTER_PROJECTS.map((proj) => (
                <button
                  key={proj.id}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-slate-800 border-b border-slate-800/50 transition"
                  onClick={() => {
                    onLoadProject(proj);
                    setShowExamples(false);
                  }}
                >
                  <div className="text-xs font-semibold text-white">{proj.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{proj.description}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Export */}
        <button
          onClick={onExportProject}
          className="flex items-center gap-1 text-slate-300 hover:text-white px-2 py-1.5 rounded-lg text-xs hover:bg-slate-800 transition"
          title="Export project as JSON"
        >
          <Download size={14} />
        </button>

        {/* GitHub */}
        <a
          href="https://github.com/CoderVLSI/Embedded_Arena"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-slate-400 hover:text-white px-2 py-1.5 rounded-lg text-xs hover:bg-slate-800 transition"
        >
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
};

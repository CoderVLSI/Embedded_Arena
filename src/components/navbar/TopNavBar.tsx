import React, { useState } from 'react';
import { STARTER_PROJECTS } from '../../engine/examples';
import { ProjectFile } from '../../types/circuit';
import { SimulationState } from '../../types/simulation';
import {
  Play, Pause, Square, Plus, FolderOpen, Download,
  BookOpen, ChevronDown, Zap, ExternalLink, Heart, Share2
} from 'lucide-react';

interface Props {
  simState: SimulationState;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onLoadProject: (project: ProjectFile) => void;
  onAddComponent: () => void;
  onExportProject: () => void;
  onOpenDocs: () => void;
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
  onOpenDocs,
  projectName,
}) => {
  const [showExamples, setShowExamples] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const formatTime = (ms: number) => {
    const s = ms / 1000;
    if (s < 60) return `${s.toFixed(1)}s`;
    const m = Math.floor(s / 60);
    return `${m}m ${(s % 60).toFixed(0)}s`;
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between h-11 px-3 bg-[#18181c] border-b border-[#2a2a30] select-none shadow-md z-30">
      {/* Left: Authentic Wokwi-style Logo & Controls */}
      <div className="flex items-center gap-3">
        {/* Clean Logo */}
        <div className="flex items-center gap-2 pr-2 border-r border-[#2d2d35]">
          <div className="flex items-center gap-1.5 cursor-pointer">
            <span className="font-extrabold tracking-tighter text-base text-white font-sans">
              EMBEDDED<span className="text-sky-400">ARENA</span>
            </span>
          </div>
        </div>

        {/* Simulation Run / Pause / Stop Button */}
        <div className="flex items-center gap-1">
          {!simState.isRunning ? (
            <button
              onClick={onPlay}
              className="flex items-center gap-1.5 bg-[#22c55e] hover:bg-[#16a34a] text-white px-3 py-1 rounded text-xs font-bold transition shadow-sm"
            >
              <Play size={13} fill="currentColor" /> Run
            </button>
          ) : (
            <>
              <button
                onClick={onPause}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition ${
                  simState.isPaused
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-600/50'
                }`}
              >
                <Pause size={12} /> {simState.isPaused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={onStop}
                className="flex items-center gap-1 bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-700/50 px-2.5 py-1 rounded text-xs font-semibold transition"
              >
                <Square size={12} fill="currentColor" /> Stop
              </button>
            </>
          )}

          {/* Add Part (+) Button */}
          <button
            onClick={onAddComponent}
            className="flex items-center justify-center w-7 h-7 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-bold transition shadow"
            title="Add Electronics Component"
          >
            <Plus size={15} />
          </button>
        </div>

        {/* Timer */}
        {simState.isRunning && (
          <div className="flex items-center gap-1 text-[11px] text-slate-300 font-mono bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
            <Zap size={11} className="text-emerald-400" />
            <span className="text-emerald-300 font-semibold">{formatTime(simState.timeMs)}</span>
          </div>
        )}
      </div>

      {/* Center: Project Title */}
      <div className="hidden md:flex items-center gap-2 text-xs text-slate-300 font-medium truncate max-w-md">
        <span className="text-slate-400">Project:</span>
        <span className="text-white font-semibold truncate">{projectName}</span>
      </div>

      {/* Right: Actions (Examples, Docs, Share, Export) */}
      <div className="flex items-center gap-2">
        {/* Load Example Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="flex items-center gap-1.5 bg-[#25252b] hover:bg-[#2f2f37] text-slate-200 px-2.5 py-1 rounded text-xs font-medium transition border border-slate-700"
          >
            <FolderOpen size={13} /> Examples <ChevronDown size={11} />
          </button>

          {showExamples && (
            <div className="absolute right-0 top-full mt-1.5 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 max-h-[400px] overflow-y-auto">
              <div className="p-2.5 border-b border-slate-800">
                <p className="text-[11px] text-slate-400 font-semibold">Starter Circuits</p>
              </div>
              {STARTER_PROJECTS.map((proj) => (
                <button
                  key={proj.id}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-800 border-b border-slate-800/50 transition"
                  onClick={() => {
                    onLoadProject(proj);
                    setShowExamples(false);
                  }}
                >
                  <div className="text-xs font-semibold text-white">{proj.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{proj.description}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Documentation Button */}
        <button
          onClick={onOpenDocs}
          className="flex items-center gap-1 text-slate-300 hover:text-white bg-[#25252b] hover:bg-[#2f2f37] border border-slate-700 px-2.5 py-1 rounded text-xs font-medium transition"
        >
          <BookOpen size={13} className="text-sky-400" />
          Docs
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="flex items-center gap-1 text-slate-300 hover:text-white bg-[#25252b] hover:bg-[#2f2f37] border border-slate-700 px-2.5 py-1 rounded text-xs font-medium transition"
          title="Copy project link"
        >
          <Share2 size={13} />
          {isCopied ? <span className="text-emerald-400">Copied!</span> : <span>Share</span>}
        </button>

        {/* Export JSON */}
        <button
          onClick={onExportProject}
          className="flex items-center gap-1 text-slate-400 hover:text-white p-1.5 rounded hover:bg-slate-800 transition"
          title="Export project JSON"
        >
          <Download size={15} />
        </button>

        {/* GitHub Link */}
        <a
          href="https://github.com/CoderVLSI/Embedded_Arena"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-slate-400 hover:text-white p-1.5 rounded hover:bg-slate-800 transition"
          title="GitHub Repository"
        >
          <ExternalLink size={15} />
        </a>
      </div>
    </div>
  );
};

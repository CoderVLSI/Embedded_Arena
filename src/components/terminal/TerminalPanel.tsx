import React, { useState } from 'react';
import { Terminal, Activity, Cpu, ChevronDown, ChevronUp } from 'lucide-react';
import { SerialMonitor } from './SerialMonitor';
import { SerialPlotter } from './SerialPlotter';
import { PinInspector } from './PinInspector';
import { SerialLogMessage } from '../../types/simulation';
import { PinManager } from '../../engine/pinManager';

interface Props {
  logs: SerialLogMessage[];
  onClearLogs: () => void;
  onSendSerialInput: (text: string) => void;
  pinManager: PinManager;
  baudRate: number;
  onChangeBaudRate: (baud: number) => void;
}

export const TerminalPanel: React.FC<Props> = ({
  logs,
  onClearLogs,
  onSendSerialInput,
  pinManager,
  baudRate,
  onChangeBaudRate,
}) => {
  const [tab, setTab] = useState<'monitor' | 'plotter' | 'inspector'>('monitor');
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`flex flex-col bg-[#1e1e1e] border-t border-[#2d2d2d] transition-all duration-200 ${
      isCollapsed ? 'h-9' : 'h-52'
    }`}>
      {/* Terminal Header & Tab Bar */}
      <div className="flex items-center justify-between px-3 bg-[#252526] border-b border-[#1f1f1f] h-9 select-none">
        <div className="flex items-center gap-1">
          <button
            onClick={() => { setTab('monitor'); setIsCollapsed(false); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-t transition ${
              tab === 'monitor' && !isCollapsed
                ? 'bg-[#18181b] text-sky-400 font-bold border-t-2 border-sky-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal size={13} />
            Serial Monitor
            {logs.length > 0 && (
              <span className="ml-1 text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded-full">
                {logs.length}
              </span>
            )}
          </button>

          <button
            onClick={() => { setTab('plotter'); setIsCollapsed(false); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-t transition ${
              tab === 'plotter' && !isCollapsed
                ? 'bg-[#18181b] text-sky-400 font-bold border-t-2 border-sky-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity size={13} />
            Serial Plotter
          </button>

          <button
            onClick={() => { setTab('inspector'); setIsCollapsed(false); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-t transition ${
              tab === 'inspector' && !isCollapsed
                ? 'bg-[#18181b] text-sky-400 font-bold border-t-2 border-sky-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu size={13} />
            Pin Inspector
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition"
            title={isCollapsed ? 'Expand Terminal' : 'Collapse Terminal'}
          >
            {isCollapsed ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      {!isCollapsed && (
        <div className="flex-1 overflow-hidden">
          {tab === 'monitor' && (
            <SerialMonitor
              logs={logs}
              onClear={onClearLogs}
              onSendInput={onSendSerialInput}
              baudRate={baudRate}
              onChangeBaudRate={onChangeBaudRate}
            />
          )}

          {tab === 'plotter' && <SerialPlotter logs={logs} />}

          {tab === 'inspector' && <PinInspector pinManager={pinManager} />}
        </div>
      )}
    </div>
  );
};

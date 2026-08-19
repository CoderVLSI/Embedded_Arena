import React, { useState, useRef, useEffect } from 'react';
import { SerialLogMessage } from '../../types/simulation';
import { Send, Trash2, Clock, Terminal } from 'lucide-react';

interface Props {
  logs: SerialLogMessage[];
  onClear: () => void;
  onSendInput: (text: string) => void;
  baudRate: number;
  onChangeBaudRate: (baud: number) => void;
}

export const SerialMonitor: React.FC<Props> = ({
  logs,
  onClear,
  onSendInput,
  baudRate,
  onChangeBaudRate,
}) => {
  const [input, setInput] = useState('');
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;
    onSendInput(input + '\n');
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-[#18181b] text-xs font-mono select-text">
      {/* Serial Controls Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#27272a] border-b border-[#3f3f46] text-slate-300">
        <form onSubmit={handleSend} className="flex-1 flex items-center gap-2 max-w-md">
          <input
            type="text"
            placeholder="Type command to send to Serial.read()..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-[#18181b] border border-slate-700 rounded px-2.5 py-1 text-white text-xs focus:outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            className="flex items-center gap-1 bg-sky-600 hover:bg-sky-500 text-white px-2.5 py-1 rounded transition"
          >
            <Send size={12} /> Send
          </button>
        </form>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1 cursor-pointer text-slate-400 hover:text-slate-200">
            <input
              type="checkbox"
              checked={showTimestamps}
              onChange={(e) => setShowTimestamps(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 accent-sky-500"
            />
            <Clock size={12} /> Timestamps
          </label>

          <label className="flex items-center gap-1 cursor-pointer text-slate-400 hover:text-slate-200">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 accent-sky-500"
            />
            Autoscroll
          </label>

          <select
            value={baudRate}
            onChange={(e) => onChangeBaudRate(Number(e.target.value))}
            className="bg-[#18181b] border border-slate-700 rounded px-2 py-0.5 text-slate-300 text-xs focus:outline-none focus:border-sky-500"
          >
            <option value={9600}>9600 baud</option>
            <option value={19200}>19200 baud</option>
            <option value={57600}>57600 baud</option>
            <option value={115200}>115200 baud</option>
          </select>

          <button
            onClick={onClear}
            className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
            title="Clear Serial Monitor"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Output Console Log */}
      <div className="flex-1 p-3 overflow-y-auto font-mono text-slate-200 space-y-0.5 leading-relaxed">
        {logs.length === 0 ? (
          <div className="flex items-center gap-2 text-slate-500 italic mt-2">
            <Terminal size={14} />
            Serial Monitor is ready. Click Play to start simulation.
          </div>
        ) : (
          logs.map((log) => {
            const timeStr = `[${(log.timestamp / 1000).toFixed(3)}s]`;
            let color = 'text-slate-200';
            if (log.type === 'system') color = 'text-sky-400 font-semibold';
            if (log.type === 'error') color = 'text-red-400 font-bold';
            if (log.type === 'rx') color = 'text-amber-400';

            return (
              <div key={log.id} className={`${color} whitespace-pre-wrap`}>
                {showTimestamps && <span className="text-slate-500 select-none mr-2">{timeStr}</span>}
                {log.text}
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
};

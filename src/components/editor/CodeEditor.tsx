import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { FileCode, FileJson, Library, BookOpen } from 'lucide-react';
import { LibraryManager } from './LibraryManager';

interface Props {
  inoCode: string;
  onChangeInoCode: (code: string) => void;
  diagramJson: string;
  onChangeDiagramJson: (json: string) => void;
  libraries: string[];
  onAddLibrary: (lib: string) => void;
  onRemoveLibrary: (lib: string) => void;
}

export const CodeEditor: React.FC<Props> = ({
  inoCode,
  onChangeInoCode,
  diagramJson,
  onChangeDiagramJson,
  libraries,
  onAddLibrary,
  onRemoveLibrary,
}) => {
  const [activeTab, setActiveTab] = useState<'ino' | 'diagram' | 'libraries' | 'manager'>('ino');

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] border-r border-[#2d2d2d]">
      {/* Editor Tabs */}
      <div className="flex items-center bg-[#252526] border-b border-[#1b1b1b] px-2 overflow-x-auto select-none">
        <button
          onClick={() => setActiveTab('ino')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono border-t-2 transition ${
            activeTab === 'ino'
              ? 'bg-[#1e1e1e] text-white border-sky-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200 border-transparent'
          }`}
        >
          <FileCode size={14} className="text-emerald-400" />
          sketch.ino
        </button>

        <button
          onClick={() => setActiveTab('diagram')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono border-t-2 transition ${
            activeTab === 'diagram'
              ? 'bg-[#1e1e1e] text-white border-sky-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200 border-transparent'
          }`}
        >
          <FileJson size={14} className="text-amber-400" />
          diagram.json
        </button>

        <button
          onClick={() => setActiveTab('libraries')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono border-t-2 transition ${
            activeTab === 'libraries'
              ? 'bg-[#1e1e1e] text-white border-sky-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200 border-transparent'
          }`}
        >
          <Library size={14} className="text-purple-400" />
          libraries.txt
        </button>

        <button
          onClick={() => setActiveTab('manager')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono border-t-2 transition ${
            activeTab === 'manager'
              ? 'bg-[#1e1e1e] text-white border-sky-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200 border-transparent'
          }`}
        >
          <BookOpen size={14} className="text-sky-400" />
          Library Manager
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 relative overflow-hidden">
        {activeTab === 'ino' && (
          <Editor
            height="100%"
            language="cpp"
            theme="vs-dark"
            value={inoCode}
            onChange={(val) => onChangeInoCode(val || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
              fontLigatures: true,
              automaticLayout: true,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              tabSize: 2,
            }}
          />
        )}

        {activeTab === 'diagram' && (
          <Editor
            height="100%"
            language="json"
            theme="vs-dark"
            value={diagramJson}
            onChange={(val) => onChangeDiagramJson(val || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily: "'Fira Code', Consolas, monospace",
              automaticLayout: true,
              tabSize: 2,
            }}
          />
        )}

        {activeTab === 'libraries' && (
          <div className="p-4 text-xs font-mono text-slate-300 space-y-2 h-full overflow-y-auto">
            <p className="text-slate-400 mb-2"># Included Libraries in this project:</p>
            {libraries.length === 0 ? (
              <p className="text-slate-500 italic">No external libraries included yet.</p>
            ) : (
              libraries.map((lib) => (
                <div key={lib} className="flex items-center justify-between p-2 bg-[#252526] rounded border border-slate-700">
                  <span className="text-sky-300">{lib}</span>
                  <button
                    onClick={() => onRemoveLibrary(lib)}
                    className="text-red-400 hover:text-red-300 text-xs px-2 py-0.5 rounded hover:bg-red-950/40"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'manager' && (
          <LibraryManager
            includedLibraries={libraries}
            onAddLibrary={onAddLibrary}
            onRemoveLibrary={onRemoveLibrary}
          />
        )}
      </div>
    </div>
  );
};

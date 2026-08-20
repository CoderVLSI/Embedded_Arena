import React, { useState, useEffect } from 'react';
import { generateProjectWithGemini, testGeminiApiKey, AiProjectDesign } from '../../services/geminiService';
import {
  Sparkles, Key, ArrowRight, Check, Play, Cpu, Layers, Code, Zap, X,
  ChevronRight, CheckCircle2, AlertCircle, RefreshCw, Eye, EyeOff, Save
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApplyProject: (design: AiProjectDesign) => void;
}

const QUICK_PROMPTS = [
  '🌡️ ESP32 IoT Weather Station with DHT22 and 16x2 LCD',
  '🚦 Smart Traffic Light with Pedestrian Push Button',
  '🤖 Ultrasonic Sonar Radar with Servo and LCD telemetry',
  '🎛️ Potentiometer Analog Voltage Divider with 5V Relay'
];

export const AiAssistantPanel: React.FC<Props> = ({ isOpen, onClose, onApplyProject }) => {
  const [prompt, setPrompt] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [tempApiKey, setTempApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [showKeyPassword, setShowKeyPassword] = useState(false);
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [keyStatus, setKeyStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDesign, setGeneratedDesign] = useState<AiProjectDesign | null>(null);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('gemini_api_key');
    if (saved) {
      setApiKey(saved);
      setTempApiKey(saved);
      setKeyStatus({
        type: 'success',
        message: 'API Key loaded from local storage.',
      });
    }
  }, []);

  const handleSaveAndTestKey = async () => {
    const clean = tempApiKey.trim();
    if (!clean) {
      setApiKey('');
      localStorage.removeItem('gemini_api_key');
      setKeyStatus({
        type: 'idle',
        message: 'Key cleared. Running in Offline Synthesizer mode.',
      });
      return;
    }

    setIsTestingKey(true);
    setKeyStatus({ type: 'idle', message: 'Testing connection to Google Gemini API...' });

    const result = await testGeminiApiKey(clean);
    setIsTestingKey(false);

    if (result.success) {
      setApiKey(clean);
      localStorage.setItem('gemini_api_key', clean);
      setKeyStatus({
        type: 'success',
        message: `✓ ${result.message}`,
      });
    } else {
      setKeyStatus({
        type: 'error',
        message: result.message,
      });
    }
  };

  const handleGenerate = async (targetPrompt?: string) => {
    const p = targetPrompt || prompt;
    if (!p.trim()) return;

    setIsGenerating(true);
    setApplied(false);
    try {
      const activeKey = apiKey || tempApiKey;
      const design = await generateProjectWithGemini(p, activeKey);
      setGeneratedDesign(design);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (!generatedDesign) return;
    onApplyProject(generatedDesign);
    setApplied(true);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[460px] max-w-full bg-[#16161d] border-l border-slate-700/80 shadow-2xl z-40 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-[#1e1e28] border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-sky-500 flex items-center justify-center text-white shadow-md">
            <Sparkles size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white leading-tight">AI Circuit Architect</h2>
              <span className="text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.2 rounded">
                BETA
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Powered by Google Gemini API</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border transition ${
              apiKey
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400 hover:bg-emerald-900/50'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Configure Gemini API Key"
          >
            <Key size={13} />
            <span className="font-semibold">{apiKey ? 'Key Set' : 'Set Key'}</span>
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Gemini API Key Configuration Drawer */}
      {showKeyInput && (
        <div className="p-4 bg-[#191924] border-b border-slate-800 space-y-2.5 text-xs animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <Key size={14} className="text-sky-400" /> Google Gemini API Key
            </span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-sky-400 hover:underline flex items-center gap-0.5 font-semibold"
            >
              Get Free Key &rarr;
            </a>
          </div>

          <div className="relative flex items-center">
            <input
              type={showKeyPassword ? 'text' : 'password'}
              placeholder="Paste AIzaSy... key here"
              value={tempApiKey}
              onChange={(e) => {
                setTempApiKey(e.target.value);
                setKeyStatus({ type: 'idle', message: '' });
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveAndTestKey()}
              className="w-full bg-slate-900 text-white pl-3 pr-10 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-sky-500 font-mono text-[11px]"
            />
            <button
              type="button"
              onClick={() => setShowKeyPassword(!showKeyPassword)}
              className="absolute right-2.5 text-slate-400 hover:text-slate-200 p-1"
            >
              {showKeyPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          {/* Save & Confirm Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveAndTestKey}
              disabled={isTestingKey}
              className="flex-1 flex items-center justify-center gap-1.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold py-1.5 px-3 rounded-lg text-xs transition shadow active:scale-95"
            >
              {isTestingKey ? (
                <>
                  <RefreshCw size={13} className="animate-spin" />
                  <span>Verifying Key with Gemini...</span>
                </>
              ) : (
                <>
                  <Save size={13} />
                  <span>Save & Verify Key</span>
                </>
              )}
            </button>
          </div>

          {/* Real-time Key Status Feedback */}
          {keyStatus.message && (
            <div
              className={`p-2 rounded-lg text-[11px] flex items-center gap-1.5 border ${
                keyStatus.type === 'success'
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                  : keyStatus.type === 'error'
                  ? 'bg-red-950/40 border-red-500/50 text-red-300'
                  : 'bg-slate-800/60 border-slate-700 text-slate-300'
              }`}
            >
              {keyStatus.type === 'success' ? (
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
              ) : keyStatus.type === 'error' ? (
                <AlertCircle size={14} className="text-red-400 shrink-0" />
              ) : (
                <Key size={14} className="text-sky-400 shrink-0" />
              )}
              <span className="leading-snug">{keyStatus.message}</span>
            </div>
          )}

          <p className="text-[10px] text-slate-400">
            Stored only in your browser. If left empty, the built-in offline smart synthesizer will be used.
          </p>
        </div>
      )}

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Quick Prompts */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quick Starters</label>
          <div className="space-y-1.5">
            {QUICK_PROMPTS.map((qp) => (
              <button
                key={qp}
                onClick={() => {
                  setPrompt(qp.substring(3));
                  handleGenerate(qp.substring(3));
                }}
                className="w-full text-left p-2 rounded-lg bg-[#1f202b] hover:bg-[#282937] border border-slate-700/50 text-xs text-slate-300 hover:text-white transition flex items-center justify-between group"
              >
                <span className="truncate pr-2">{qp}</span>
                <ChevronRight size={14} className="text-slate-500 group-hover:text-sky-400 transition-transform group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>
        </div>

        {/* Custom Prompt Input */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Describe Your Circuit Idea</label>
          <div className="relative">
            <textarea
              rows={3}
              placeholder="e.g. Design a Stack-chan robot with dual servo motors, OLED face display, and ESP32..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-slate-900/90 text-white p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-purple-500 text-xs placeholder:text-slate-500 resize-none shadow-inner"
            />
          </div>

          <button
            onClick={() => handleGenerate()}
            disabled={isGenerating || !prompt.trim()}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-sky-600 hover:from-purple-500 hover:to-sky-500 disabled:opacity-50 text-white font-bold text-xs py-2.5 rounded-xl shadow-lg transition hover:scale-[1.01] active:scale-[0.99]"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Synthesizing with Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles size={15} />
                <span>Generate Circuit & Code</span>
              </>
            )}
          </button>
        </div>

        {/* Generated Result Card */}
        {generatedDesign && (
          <div className="space-y-3 pt-2 animate-in fade-in duration-200">
            <div className="p-4 bg-[#1e1f2b] border border-purple-500/40 rounded-xl space-y-3 shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                    <Cpu size={16} className="text-sky-400" />
                    {generatedDesign.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{generatedDesign.description}</p>
                </div>
              </div>

              {/* Source & Stats badges */}
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                {generatedDesign.source === 'gemini' ? (
                  <span className="bg-emerald-950/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40 flex items-center gap-1">
                    <Sparkles size={11} className="text-yellow-300" /> Live Gemini AI ({generatedDesign.modelUsed})
                  </span>
                ) : (
                  <span className="bg-slate-800 text-sky-300 px-2 py-0.5 rounded border border-slate-700">
                    ⚡ Smart Synthesizer Engine
                  </span>
                )}
                <span className="bg-slate-800 text-sky-300 px-2 py-0.5 rounded border border-slate-700">
                  {generatedDesign.components.length} Components
                </span>
                <span className="bg-slate-800 text-emerald-300 px-2 py-0.5 rounded border border-slate-700">
                  {generatedDesign.wires.length} Wires
                </span>
              </div>

              {/* College Lab Explanation */}
              <div className="p-3 bg-[#15151c] rounded-lg border border-slate-800 text-xs text-slate-300 space-y-2 max-h-48 overflow-y-auto leading-relaxed">
                <div className="font-bold text-sky-400 text-[11px] uppercase tracking-wider">Engineering Theory & Pinout:</div>
                <div className="whitespace-pre-line font-sans text-slate-300">{generatedDesign.explanation}</div>
              </div>

              {/* Apply Button */}
              <button
                onClick={handleApply}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition shadow-lg ${
                  applied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white hover:scale-[1.01] active:scale-[0.99]'
                }`}
              >
                {applied ? (
                  <>
                    <Check size={16} /> Applied to Canvas!
                  </>
                ) : (
                  <>
                    <Zap size={16} /> Apply Circuit to Canvas & Editor
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

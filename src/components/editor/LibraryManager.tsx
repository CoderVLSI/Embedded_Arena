import React, { useState } from 'react';
import { BookOpen, Plus, Check, Search } from 'lucide-react';

interface Props {
  includedLibraries: string[];
  onAddLibrary: (name: string) => void;
  onRemoveLibrary: (name: string) => void;
}

const POPULAR_LIBRARIES = [
  { name: 'DHT sensor library', version: '1.4.4', desc: 'Arduino library for DHT11, DHT22, etc. Temp & Humidity Sensors' },
  { name: 'LiquidCrystal_I2C', version: '1.1.2', desc: 'Control LCD displays 1602/2004 via I2C PCF8574 adapter' },
  { name: 'Servo', version: '1.2.0', desc: 'Standard Arduino Servo library for SG90 / MG996R' },
  { name: 'Blynk', version: '1.3.2', desc: 'Blynk IoT library for ESP32 and Arduino' },
  { name: 'WiFi', version: '2.0.0', desc: 'ESP32 & Arduino WiFi client library' },
  { name: 'Adafruit GFX Library', version: '1.11.5', desc: 'Core graphics library for OLED and TFT displays' },
  { name: 'Adafruit SSD1306', version: '2.5.7', desc: 'SSD1306 128x64 / 128x32 OLED display driver' },
  { name: 'FastLED', version: '3.6.0', desc: 'High performance library for WS2812B NeoPixel RGB LEDs' },
  { name: 'Wire', version: '1.0.0', desc: 'Two Wire Interface (I2C) communication library' },
];

export const LibraryManager: React.FC<Props> = ({
  includedLibraries,
  onAddLibrary,
  onRemoveLibrary,
}) => {
  const [search, setSearch] = useState('');

  const filtered = POPULAR_LIBRARIES.filter(
    (l) => l.name.toLowerCase().includes(search.toLowerCase()) || l.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] p-4 text-xs font-sans">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen size={16} className="text-sky-400" />
        <h3 className="font-bold text-white text-sm">Library Manager</h3>
      </div>

      <div className="relative mb-3">
        <Search size={14} className="absolute left-2.5 top-2 text-slate-400" />
        <input
          type="text"
          placeholder="Search Arduino & ESP32 libraries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#252526] border border-slate-700 rounded-md pl-8 pr-3 py-1.5 text-white focus:outline-none focus:border-sky-500 text-xs"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {filtered.map((lib) => {
          const isInstalled = includedLibraries.includes(lib.name);
          return (
            <div
              key={lib.name}
              className="p-3 bg-[#252526] border border-slate-800 rounded-lg flex items-start justify-between gap-2 hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-xs">{lib.name}</span>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded font-mono">
                    v{lib.version}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] mt-1 line-clamp-2">{lib.desc}</p>
              </div>

              <button
                onClick={() => (isInstalled ? onRemoveLibrary(lib.name) : onAddLibrary(lib.name))}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition ${
                  isInstalled
                    ? 'bg-emerald-950/70 border border-emerald-700/60 text-emerald-300 hover:bg-red-950/60 hover:text-red-300 hover:border-red-800'
                    : 'bg-sky-600 hover:bg-sky-500 text-white shadow'
                }`}
              >
                {isInstalled ? (
                  <>
                    <Check size={12} /> Installed
                  </>
                ) : (
                  <>
                    <Plus size={12} /> Install
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

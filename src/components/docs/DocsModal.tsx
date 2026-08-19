import React, { useState } from 'react';
import { Book, Cpu, Zap, Code, HelpCircle, X, ChevronRight, Layers, Terminal, Sliders } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<'getting-started' | 'pinouts' | 'code-cheatsheet' | 'sensors' | 'shortcuts'>('getting-started');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-[#18181f] border border-slate-700/80 rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-[#1f2029] border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
              <Book size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">Embedded Arena Documentation</h2>
              <p className="text-[11px] text-slate-400">Hardware pinouts, wiring tutorials & Arduino C++ reference</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body (Sidebar + Content) */}
        <div className="flex flex-1 overflow-hidden">
          {/* Docs Sidebar */}
          <div className="w-60 bg-[#14141a] border-r border-slate-800 p-3 space-y-1 overflow-y-auto">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 py-1">Guides</div>

            <button
              onClick={() => setActiveSection('getting-started')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition ${
                activeSection === 'getting-started'
                  ? 'bg-sky-600/20 text-sky-300 border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <HelpCircle size={15} />
              Getting Started
            </button>

            <button
              onClick={() => setActiveSection('pinouts')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition ${
                activeSection === 'pinouts'
                  ? 'bg-sky-600/20 text-sky-300 border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Cpu size={15} />
              Board Pinouts & Specs
            </button>

            <button
              onClick={() => setActiveSection('sensors')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition ${
                activeSection === 'sensors'
                  ? 'bg-sky-600/20 text-sky-300 border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Layers size={15} />
              Sensors & Actuators
            </button>

            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 py-1 pt-3">Reference</div>

            <button
              onClick={() => setActiveSection('code-cheatsheet')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition ${
                activeSection === 'code-cheatsheet'
                  ? 'bg-sky-600/20 text-sky-300 border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Code size={15} />
              Arduino C++ Cheat Sheet
            </button>

            <button
              onClick={() => setActiveSection('shortcuts')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition ${
                activeSection === 'shortcuts'
                  ? 'bg-sky-600/20 text-sky-300 border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Zap size={15} />
              Keyboard Shortcuts
            </button>
          </div>

          {/* Docs Main Content */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 text-sm leading-relaxed">
            {activeSection === 'getting-started' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <HelpCircle className="text-sky-400" size={20} /> Getting Started with Embedded Arena
                </h3>
                <p className="text-slate-300">
                  Welcome to <strong>Embedded Arena</strong> — a 100% in-browser microcontroller and electronics circuit simulator designed for rapid prototyping, learning, and testing IoT projects without needing physical hardware.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 bg-[#20212d] border border-slate-700/60 rounded-xl space-y-1.5">
                    <span className="w-6 h-6 rounded-full bg-sky-500 text-white font-bold text-xs flex items-center justify-center">1</span>
                    <h4 className="font-bold text-white text-xs">Add Components</h4>
                    <p className="text-slate-400 text-xs">Click <strong>+ Add Part</strong> to choose ESP32, Arduino Uno, LEDs, DHT22, Servos, Relays, and sensors.</p>
                  </div>

                  <div className="p-3.5 bg-[#20212d] border border-slate-700/60 rounded-xl space-y-1.5">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center">2</span>
                    <h4 className="font-bold text-white text-xs">Wire Pins</h4>
                    <p className="text-slate-400 text-xs">Click any component pin (e.g. Pin 13), then click a target pin (e.g. LED Anode) to draw a color-coded wire.</p>
                  </div>

                  <div className="p-3.5 bg-[#20212d] border border-slate-700/60 rounded-xl space-y-1.5">
                    <span className="w-6 h-6 rounded-full bg-purple-500 text-white font-bold text-xs flex items-center justify-center">3</span>
                    <h4 className="font-bold text-white text-xs">Write Code & Run</h4>
                    <p className="text-slate-400 text-xs">Write standard Arduino C++ in <code>sketch.ino</code> and click <strong>▶ Run</strong> to see real-time simulation!</p>
                  </div>
                </div>

                <div className="p-4 bg-sky-950/40 border border-sky-600/40 rounded-xl text-sky-200 text-xs space-y-1">
                  <div className="font-bold text-sky-400 flex items-center gap-1.5">
                    <Zap size={14} /> Interactive Live Hardware
                  </div>
                  <p>While the simulation runs, you can click push buttons, rotate potentiometer dials, adjust temperature/humidity on DHT22, and slide distance on the ultrasonic sensor in real time!</p>
                </div>
              </div>
            )}

            {activeSection === 'pinouts' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Cpu className="text-sky-400" size={20} /> College Lab Microcontroller Pinout Posters & Specs
                  </h3>
                  <span className="text-xs text-sky-400 bg-sky-950/60 border border-sky-600/40 px-2.5 py-1 rounded-full font-medium">
                    University Lab Reference
                  </span>
                </div>

                {/* Lab Poster 1: Arduino Uno Pinout */}
                <div className="space-y-2">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                    Arduino Uno R3 Engineering Reference Chart
                  </h4>
                  <div className="rounded-xl overflow-hidden border border-slate-700/80 shadow-2xl bg-black">
                    <img
                      src="/images/arduino_uno_pinout.jpg"
                      alt="Arduino Uno R3 Pinout Reference"
                      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300 cursor-zoom-in"
                    />
                  </div>
                </div>

                {/* Lab Poster 2: ESP32 DevKit V1 Pinout */}
                <div className="space-y-2 pt-4">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                    ESP32 NodeMCU DevKit V1 Pinout & Architecture
                  </h4>
                  <div className="rounded-xl overflow-hidden border border-slate-700/80 shadow-2xl bg-black">
                    <img
                      src="/images/esp32_devkit_pinout.jpg"
                      alt="ESP32 DevKit V1 Pinout"
                      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300 cursor-zoom-in"
                    />
                  </div>
                </div>

                {/* College Lab Board Specs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {/* Raspberry Pi Pico */}
                  <div className="p-4 bg-[#20212d] border border-slate-700/60 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-emerald-300 text-sm">Raspberry Pi Pico (RP2040)</h4>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">3.3V / 133MHz</span>
                    </div>
                    <p className="text-xs text-slate-300">Dual-core ARM Cortex-M0+ with 26 multi-function GPIO pins, 3 ADC analog inputs (GP26-GP28), 2 UARTs, 2 SPI, 2 I2C, and 16 PWM channels.</p>
                  </div>

                  {/* STM32 Blue Pill */}
                  <div className="p-4 bg-[#20212d] border border-slate-700/60 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sky-300 text-sm">STM32 Blue Pill (STM32F103C8T6)</h4>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">3.3V / 72MHz</span>
                    </div>
                    <p className="text-xs text-slate-300">32-bit ARM Cortex-M3 processor, 64KB Flash, 20KB SRAM, 32 GPIO pins (PA0-PA15, PB0-PB15), 10 ADC channels, and built-in USB 2.0.</p>
                  </div>

                  {/* PIC16F877A */}
                  <div className="p-4 bg-[#20212d] border border-slate-700/60 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-amber-300 text-sm">PIC16F877A (DIP-40 Lab IC)</h4>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">5.0V / 20MHz</span>
                    </div>
                    <p className="text-xs text-slate-300">Standard university embedded lab PIC microcontroller. 5 I/O ports (PORTA to PORTE), 8-channel 10-bit ADC, CCP capture/compare/PWM, and USART.</p>
                  </div>

                  {/* ESP8266 NodeMCU */}
                  <div className="p-4 bg-[#20212d] border border-slate-700/60 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-blue-300 text-sm">ESP8266 NodeMCU (ESP-12E)</h4>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">3.3V / 80MHz</span>
                    </div>
                    <p className="text-xs text-slate-300">Tensilica Xtensa 32-bit processor with integrated 802.11 b/g/n WiFi, 4MB Flash, 10 GPIOs (D0-D8), and 1 10-bit ADC (A0).</p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'sensors' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Layers className="text-emerald-400" size={20} /> College Lab Sensors & Actuators Chart
                  </h3>
                  <span className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-600/40 px-2.5 py-1 rounded-full font-medium">
                    Wiring & Specifications
                  </span>
                </div>

                {/* Sensors Reference Chart Poster */}
                <div className="rounded-xl overflow-hidden border border-slate-700/80 shadow-2xl bg-black">
                  <img
                    src="/images/sensors_lab_reference.jpg"
                    alt="Sensors and Actuators Lab Chart"
                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300 cursor-zoom-in"
                  />
                </div>
              </div>
            )}

            {activeSection === 'code-cheatsheet' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Code className="text-sky-400" size={20} /> Arduino C++ Cheat Sheet
                </h3>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 bg-[#131317] border border-slate-800 rounded-lg">
                    <div className="text-slate-400 font-sans text-[11px] mb-1 font-semibold">Digital I/O:</div>
                    <div className="text-emerald-400">pinMode(13, OUTPUT);</div>
                    <div className="text-emerald-400">digitalWrite(13, HIGH); <span className="text-slate-500">// 5V / 3.3V</span></div>
                    <div className="text-emerald-400">int state = digitalRead(2);</div>
                  </div>

                  <div className="p-3 bg-[#131317] border border-slate-800 rounded-lg">
                    <div className="text-slate-400 font-sans text-[11px] mb-1 font-semibold">Analog & PWM:</div>
                    <div className="text-sky-400">int val = analogRead(A0); <span className="text-slate-500">// 0 to 1023</span></div>
                    <div className="text-sky-400">analogWrite(9, 128); <span className="text-slate-500">// 50% PWM Duty (0-255)</span></div>
                  </div>

                  <div className="p-3 bg-[#131317] border border-slate-800 rounded-lg">
                    <div className="text-slate-400 font-sans text-[11px] mb-1 font-semibold">Serial Monitor & Plotter:</div>
                    <div className="text-amber-300">Serial.begin(9600);</div>
                    <div className="text-amber-300">Serial.println("Temperature: " + String(temp));</div>
                  </div>

                  <div className="p-3 bg-[#131317] border border-slate-800 rounded-lg">
                    <div className="text-slate-400 font-sans text-[11px] mb-1 font-semibold">Audio Tones:</div>
                    <div className="text-purple-300">tone(8, 440, 500); <span className="text-slate-500">// 440Hz tone for 500ms</span></div>
                    <div className="text-purple-300">noTone(8);</div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'shortcuts' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Zap className="text-amber-400" size={20} /> Keyboard Shortcuts & Controls
                </h3>

                <div className="p-4 bg-[#20212d] border border-slate-700/60 rounded-xl space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-700/50 pb-2">
                    <span className="text-slate-300">Delete selected Wire or Component</span>
                    <kbd className="px-2 py-1 bg-slate-800 text-sky-300 rounded border border-slate-700 font-mono">Delete / Backspace</kbd>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-700/50 pb-2">
                    <span className="text-slate-300">Cancel active wire drawing</span>
                    <kbd className="px-2 py-1 bg-slate-800 text-sky-300 rounded border border-slate-700 font-mono">Escape</kbd>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-700/50 pb-2">
                    <span className="text-slate-300">Pan / Move Canvas</span>
                    <span className="text-slate-400">Click & Drag empty space or Middle Click</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Zoom In / Out</span>
                    <span className="text-slate-400">Use top-right zoom buttons (+ / -)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

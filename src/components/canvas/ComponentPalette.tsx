import React, { useState } from 'react';
import { ComponentType } from '../../types/circuit';
import { Search, X, Cpu } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddComponent: (type: ComponentType, attrs?: Record<string, any>) => void;
}

interface PaletteItem {
  type: ComponentType;
  name: string;
  category: 'MCU' | 'Sensors' | 'Actuators' | 'Inputs' | 'Passives';
  description: string;
  attrs?: Record<string, any>;
}

// Inline SVG mini-preview thumbnails for each component type
function ComponentThumbnail({ type, attrs }: { type: ComponentType; attrs?: Record<string, any> }) {
  const size = 48;
  switch (type) {
    case 'wokwi-esp32-devkit-v1':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <rect x="10" y="2" width="28" height="44" rx="3" fill="#1a1a1a" stroke="#374151" strokeWidth="1.2" />
          <rect x="14" y="5" width="20" height="10" rx="2" fill="#000" stroke="#b45309" strokeWidth="1" />
          <path d="M16 8 H32 M16 12 H30" stroke="#d97706" strokeWidth="1" fill="none" />
          <rect x="14" y="18" width="20" height="14" rx="2" fill="#9ca3af" stroke="#4b5563" strokeWidth="0.8" />
          <text x="24" y="28" fill="#1f2937" fontSize="5" fontWeight="bold" textAnchor="middle">ESP32</text>
          <rect x="18" y="40" width="12" height="6" rx="1" fill="#9ca3af" stroke="#4b5563" strokeWidth="0.8" />
        </svg>
      );

    case 'wokwi-esp32-s3':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <rect x="9" y="2" width="30" height="44" rx="3" fill="#111827" stroke="#374151" strokeWidth="1.2" />
          <rect x="13" y="6" width="22" height="14" rx="2" fill="#9ca3af" stroke="#4b5563" strokeWidth="0.8" />
          <text x="24" y="15" fill="#111827" fontSize="4.5" fontWeight="bold" textAnchor="middle">ESP32-S3</text>
          <circle cx="24" cy="27" r="2.5" fill="#22c55e" />
          <text x="24" y="36" fill="#f8fafc" fontSize="4" fontWeight="bold" textAnchor="middle">AI Vector</text>
          <rect x="13" y="42" width="9" height="4" rx="0.5" fill="#cbd5e1" />
          <rect x="26" y="42" width="9" height="4" rx="0.5" fill="#cbd5e1" />
        </svg>
      );

    case 'wokwi-esp32-c3':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <rect x="10" y="3" width="28" height="42" rx="3" fill="#18181b" stroke="#3f3f46" strokeWidth="1.2" />
          <rect x="14" y="6" width="20" height="12" rx="1" fill="#9ca3af" />
          <text x="24" y="14" fill="#111827" fontSize="4" fontWeight="bold" textAnchor="middle">C3 RISC-V</text>
          <circle cx="24" cy="24" r="2.5" fill="#38bdf8" />
          <text x="24" y="34" fill="#7dd3fc" fontSize="4" textAnchor="middle">160MHz</text>
          <rect x="18" y="41" width="12" height="4" rx="1" fill="#cbd5e1" />
        </svg>
      );

    case 'wokwi-esp32-c6':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <rect x="10" y="3" width="28" height="42" rx="3" fill="#0f172a" stroke="#1e3a8a" strokeWidth="1.2" />
          <rect x="14" y="6" width="20" height="12" rx="1" fill="#9ca3af" />
          <text x="24" y="14" fill="#111827" fontSize="4" fontWeight="bold" textAnchor="middle">C6 WiFi6</text>
          <circle cx="24" cy="24" r="2.5" fill="#ec4899" />
          <text x="24" y="34" fill="#f472b6" fontSize="4" textAnchor="middle">Thread</text>
          <rect x="18" y="41" width="12" height="4" rx="1" fill="#cbd5e1" />
        </svg>
      );

    case 'wokwi-seeed-xiao':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <rect x="12" y="8" width="24" height="32" rx="2" fill="#09090b" stroke="#27272a" strokeWidth="1" />
          <rect x="18" y="5" width="12" height="5" rx="1" fill="#cbd5e1" />
          <rect x="15" y="15" width="18" height="12" rx="1" fill="#9ca3af" />
          <text x="24" y="23" fill="#09090b" fontSize="4" fontWeight="bold" textAnchor="middle">XIAO</text>
          <text x="24" y="36" fill="#22c55e" fontSize="3.5" fontWeight="bold" textAnchor="middle">Seeed</text>
        </svg>
      );

    case 'wokwi-pi-pico':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <rect x="10" y="3" width="28" height="42" rx="3" fill="#008053" stroke="#00a86b" strokeWidth="1" />
          <rect x="18" y="1" width="12" height="5" rx="1" fill="#cbd5e1" />
          <rect x="18" y="18" width="12" height="12" rx="1" fill="#0f172a" stroke="#334155" strokeWidth="0.5" />
          <text x="24" y="26" fill="#f8fafc" fontSize="3.5" fontWeight="bold" textAnchor="middle">RP2040</text>
          <circle cx="24" cy="12" r="2.5" fill="#f8fafc" />
          <text x="24" y="38" fill="#fff" fontSize="5" fontWeight="bold" textAnchor="middle">Pico</text>
        </svg>
      );

    case 'wokwi-stm32-bluepill':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <rect x="10" y="3" width="28" height="42" rx="3" fill="#1e3a8a" stroke="#1d4ed8" strokeWidth="1" />
          <rect x="18" y="1" width="12" height="5" rx="1" fill="#cbd5e1" />
          <rect x="18" y="18" width="12" height="12" rx="1" fill="#0f172a" stroke="#334155" strokeWidth="0.5" />
          <text x="24" y="26" fill="#f8fafc" fontSize="3" fontWeight="bold" textAnchor="middle">STM32</text>
          <rect x="15" y="8" width="4" height="6" rx="0.5" fill="#eab308" />
          <rect x="21" y="8" width="4" height="6" rx="0.5" fill="#eab308" />
          <circle cx="24" cy="38" r="2" fill="#dc2626" />
        </svg>
      );

    case 'wokwi-esp8266-nodemcu':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <rect x="10" y="3" width="28" height="42" rx="3" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
          <rect x="14" y="6" width="20" height="14" rx="1" fill="#9ca3af" stroke="#4b5563" strokeWidth="0.5" />
          <text x="24" y="15" fill="#111827" fontSize="4" fontWeight="bold" textAnchor="middle">ESP8266</text>
          <text x="24" y="32" fill="#f8fafc" fontSize="4.5" fontWeight="bold" textAnchor="middle">NodeMCU</text>
          <rect x="18" y="42" width="12" height="5" rx="1" fill="#cbd5e1" />
        </svg>
      );

    case 'wokwi-pic16f877a':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <rect x="12" y="4" width="24" height="40" rx="2" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
          <path d="M 21 4 A 3 3 0 0 0 27 4 Z" fill="#09090b" />
          <text x="24" y="26" fill="#f8fafc" fontSize="4" fontWeight="bold" textAnchor="middle">PIC16F</text>
          {/* DIP legs */}
          {[8, 14, 20, 26, 32, 38].map((y) => (
            <g key={y}>
              <rect x="7" y={y} width="5" height="2" fill="#d1d5db" />
              <rect x="36" y={y} width="5" height="2" fill="#d1d5db" />
            </g>
          ))}
        </svg>
      );

    case 'wokwi-nrf52840-dk':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <rect x="10" y="3" width="28" height="42" rx="3" fill="#065f46" stroke="#047857" strokeWidth="1" />
          <rect x="15" y="6" width="18" height="6" rx="1" fill="#047857" stroke="#fbbf24" strokeWidth="0.8" />
          <rect x="18" y="18" width="12" height="12" rx="1" fill="#0f172a" />
          <text x="24" y="26" fill="#6ee7b7" fontSize="3" fontWeight="bold" textAnchor="middle">nRF52</text>
          <text x="24" y="38" fill="#fff" fontSize="4.5" fontWeight="bold" textAnchor="middle">BLE DK</text>
        </svg>
      );

    case 'wokwi-arduino-uno':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <rect x="3" y="5" width="42" height="38" rx="3" fill="#00646e" stroke="#00818f" strokeWidth="1.2" />
          <rect x="1" y="10" width="10" height="8" rx="1" fill="#cbd5e1" stroke="#64748b" strokeWidth="0.8" />
          <rect x="3" y="12" width="6" height="4" rx="1" fill="#334155" />
          <text x="28" y="18" fill="#fff" fontSize="6" fontWeight="bold" textAnchor="middle">ARDUINO</text>
          <text x="38" y="24" fill="#e2e8f0" fontSize="4.5" fontWeight="bold">UNO</text>
          <rect x="18" y="26" width="18" height="6" rx="1" fill="#0f172a" stroke="#334155" strokeWidth="0.5" />
          <circle cx="19" cy="29" r="1" fill="#334155" />
          <text x="28" y="30" fill="#94a3b8" fontSize="3" textAnchor="middle">328P</text>
          {/* Pin header strips */}
          <rect x="12" y="4" width="32" height="3" rx="1" fill="#1e293b" />
          <rect x="14" y="40" width="28" height="3" rx="1" fill="#1e293b" />
          <rect x="10" y="8" width="3" height="3" rx="1" fill="#dc2626" />
        </svg>
      );

    case 'wokwi-led': {
      const color = attrs?.color || 'red';
      const hex = color === 'red' ? '#ef4444' : color === 'green' ? '#22c55e' : color === 'blue' ? '#3b82f6' : color === 'yellow' ? '#eab308' : '#ef4444';
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          {/* Glow */}
          <circle cx="24" cy="18" r="14" fill={hex} opacity="0.25" />
          {/* Dome */}
          <path d="M16 22 A8 8 0 0 1 32 22 L32 26 A2 2 0 0 1 30 28 L18 28 A2 2 0 0 1 16 26 Z" fill={hex} stroke="#fff" strokeWidth="0.5" opacity="0.9" />
          {/* Reflector */}
          <path d="M20 24 L22 18 L26 18 L28 24 Z" fill="#fff" opacity="0.5" />
          <circle cx="24" cy="16" r="1.5" fill="#fff" opacity="0.7" />
          {/* Base */}
          <rect x="14" y="27" width="20" height="4" rx="1" fill={hex} stroke="#334155" strokeWidth="0.5" />
          {/* Legs */}
          <path d="M20 31 L20 38 L17 42 L17 46" stroke="#cbd5e1" strokeWidth="1.5" fill="none" />
          <path d="M28 31 L28 46" stroke="#cbd5e1" strokeWidth="1.5" fill="none" />
          <text x="15" y="46" fill="#94a3b8" fontSize="4.5">A</text>
          <text x="30" y="46" fill="#94a3b8" fontSize="4.5">C</text>
        </svg>
      );
    }

    case 'wokwi-relay-module':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <rect x="3" y="6" width="42" height="36" rx="3" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1" />
          <rect x="14" y="10" width="20" height="22" rx="2" fill="#1d4ed8" stroke="#1e40af" strokeWidth="1" />
          <text x="24" y="22" fill="#fff" fontSize="5.5" fontWeight="bold" textAnchor="middle">Relay</text>
          <text x="24" y="28" fill="#93c5fd" fontSize="3.5" textAnchor="middle">10A 250V</text>
          <rect x="37" y="10" width="6" height="22" rx="1" fill="#0284c7" stroke="#0369a1" strokeWidth="0.5" />
          <circle cx="10" cy="16" r="2" fill="#dc2626" />
          <circle cx="10" cy="28" r="2" fill="#14532d" />
        </svg>
      );

    case 'wokwi-buzzer':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="18" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
          <circle cx="24" cy="24" r="14" fill="#27272a" />
          <circle cx="24" cy="24" r="9" fill="#18181b" stroke="#3f3f46" strokeWidth="0.8" />
          <circle cx="24" cy="24" r="3" fill="#09090b" stroke="#71717a" strokeWidth="0.5" />
          <circle cx="24" cy="24" r="1" fill="#d4d4d8" />
          <text x="16" y="19" fill="#ef4444" fontSize="7" fontWeight="bold">+</text>
        </svg>
      );

    case 'wokwi-servo':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <rect x="4" y="14" width="40" height="24" rx="2" fill="#0284c7" stroke="#0369a1" strokeWidth="1" />
          <rect x="1" y="22" width="46" height="8" rx="1" fill="#0284c7" stroke="#0369a1" strokeWidth="0.8" />
          <circle cx="1" cy="26" r="1.5" fill="#f8fafc" />
          <circle cx="47" cy="26" r="1.5" fill="#f8fafc" />
          {/* Horn */}
          <g transform="rotate(-20 24 18)">
            <path d="M21 18 L23 4 A2 2 0 0 1 25 4 L27 18 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.8" />
            <circle cx="24" cy="18" r="5" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
            <circle cx="24" cy="18" r="2" fill="#475569" />
          </g>
          <text x="24" y="35" fill="#f8fafc" fontSize="4.5" fontWeight="bold" textAnchor="middle">SG90</text>
        </svg>
      );

    case 'wokwi-lcd1602':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <rect x="2" y="6" width="44" height="36" rx="3" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
          <circle cx="5" cy="9" r="1.2" fill="#64748b" />
          <circle cx="43" cy="9" r="1.2" fill="#64748b" />
          <circle cx="5" cy="39" r="1.2" fill="#64748b" />
          <circle cx="43" cy="39" r="1.2" fill="#64748b" />
          <rect x="6" y="11" width="36" height="18" rx="2" fill="#334155" stroke="#475569" strokeWidth="0.5" />
          <rect x="8" y="13" width="32" height="14" rx="1" fill="#0284c7" stroke="#0369a1" strokeWidth="0.5" />
          <text x="24" y="21" fill="#fff" fontSize="4.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Hello World</text>
          <text x="24" y="26" fill="#fff" fontSize="4" fontFamily="monospace" textAnchor="middle">16x2 LCD</text>
          <rect x="8" y="36" width="18" height="4" rx="1" fill="#1e293b" />
        </svg>
      );

    case 'wokwi-dht22':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <rect x="8" y="4" width="32" height="32" rx="4" fill="#fff" stroke="#94a3b8" strokeWidth="1" />
          {/* Grille */}
          {[10, 15, 20, 25].map((y) => (
            <g key={y}>
              <rect x="13" y={y} width="6" height="2.5" rx="0.5" fill="#64748b" />
              <rect x="21" y={y} width="8" height="2.5" rx="0.5" fill="#64748b" />
              <rect x="31" y={y} width="6" height="2.5" rx="0.5" fill="#64748b" />
            </g>
          ))}
          <rect x="13" y="28" width="22" height="6" rx="1.5" fill="#334155" />
          <text x="24" y="33" fill="#f8fafc" fontSize="5" fontWeight="bold" textAnchor="middle">DHT22</text>
          {/* Pins */}
          <line x1="16" y1="36" x2="16" y2="46" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="22" y1="36" x2="22" y2="46" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="28" y1="36" x2="28" y2="46" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="34" y1="36" x2="34" y2="46" stroke="#cbd5e1" strokeWidth="1.5" />
        </svg>
      );

    case 'wokwi-hc-sr04':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <rect x="3" y="10" width="42" height="24" rx="3" fill="#0284c7" stroke="#0369a1" strokeWidth="1" />
          {/* Left transducer */}
          <circle cx="16" cy="22" r="8" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
          <circle cx="16" cy="22" r="5.5" fill="#334155" />
          <circle cx="16" cy="22" r="2.5" fill="#1e293b" />
          {/* Right transducer */}
          <circle cx="32" cy="22" r="8" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
          <circle cx="32" cy="22" r="5.5" fill="#334155" />
          <circle cx="32" cy="22" r="2.5" fill="#1e293b" />
          <text x="16" y="16" fill="#f8fafc" fontSize="3.5" fontWeight="bold" textAnchor="middle">T</text>
          <text x="32" y="16" fill="#f8fafc" fontSize="3.5" fontWeight="bold" textAnchor="middle">R</text>
          {/* Pins */}
          {[14, 20, 28, 34].map((x) => (
            <line key={x} x1={x} y1="34" x2={x} y2="44" stroke="#cbd5e1" strokeWidth="1.5" />
          ))}
        </svg>
      );

    case 'wokwi-potentiometer':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <rect x="6" y="6" width="36" height="36" rx="3" fill="#0284c7" stroke="#0369a1" strokeWidth="1" />
          <circle cx="24" cy="24" r="14" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />
          <circle cx="24" cy="24" r="10" fill="#1e293b" />
          <circle cx="24" cy="24" r="8" fill="#475569" stroke="#64748b" strokeWidth="0.8" />
          {/* Indicator notch */}
          <rect x="22.5" y="14" width="3" height="5" rx="1.5" fill="#f8fafc" />
          {/* Pins */}
          <line x1="14" y1="42" x2="14" y2="47" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="24" y1="42" x2="24" y2="47" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="34" y1="42" x2="34" y2="47" stroke="#cbd5e1" strokeWidth="1.5" />
        </svg>
      );

    case 'wokwi-pushbutton': {
      const btnColor = attrs?.color === 'blue' ? '#2563eb' : attrs?.color === 'green' ? '#16a34a' : '#dc2626';
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <rect x="8" y="8" width="32" height="32" rx="3" fill="#334155" stroke="#1e293b" strokeWidth="1" />
          <rect x="10" y="10" width="28" height="28" rx="2" fill="#475569" />
          {/* Corner rivets */}
          <circle cx="14" cy="14" r="1.2" fill="#94a3b8" />
          <circle cx="34" cy="14" r="1.2" fill="#94a3b8" />
          <circle cx="14" cy="34" r="1.2" fill="#94a3b8" />
          <circle cx="34" cy="34" r="1.2" fill="#94a3b8" />
          {/* Button plunger */}
          <circle cx="24" cy="24" r="10" fill={btnColor} stroke="#1e293b" strokeWidth="0.8" />
          {/* Pin legs */}
          <line x1="12" y1="6" x2="12" y2="2" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="36" y1="6" x2="36" y2="2" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="12" y1="42" x2="12" y2="46" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="36" y1="42" x2="36" y2="46" stroke="#cbd5e1" strokeWidth="1.5" />
        </svg>
      );
    }

    case 'wokwi-slide-switch':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <rect x="4" y="12" width="40" height="18" rx="2" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
          <rect x="8" y="16" width="32" height="10" rx="1" fill="#334155" />
          {/* Slider knob */}
          <rect x="10" y="14" width="12" height="14" rx="2" fill="#0f172a" stroke="#94a3b8" strokeWidth="0.8" />
          {/* Pins */}
          <line x1="14" y1="30" x2="14" y2="42" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="24" y1="30" x2="24" y2="42" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="34" y1="30" x2="34" y2="42" stroke="#cbd5e1" strokeWidth="1.5" />
        </svg>
      );

    case 'wokwi-resistor':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          {/* Wire leads */}
          <line x1="2" y1="24" x2="12" y2="24" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="36" y1="24" x2="46" y2="24" stroke="#94a3b8" strokeWidth="1.5" />
          {/* Body */}
          <rect x="12" y="17" width="24" height="14" rx="4" fill="#e2d4b7" stroke="#b59a6d" strokeWidth="0.8" />
          {/* Color bands */}
          <rect x="16" y="17" width="2.5" height="14" fill="#dc2626" />
          <rect x="21" y="17" width="2.5" height="14" fill="#dc2626" />
          <rect x="26" y="17" width="2.5" height="14" fill="#854d0e" />
          <rect x="31" y="17" width="2.5" height="14" fill="#eab308" />
          <text x="24" y="40" fill="#cbd5e1" fontSize="5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
            {attrs?.value || '220'}Ω
          </text>
        </svg>
      );

    default:
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <rect x="8" y="8" width="32" height="32" rx="4" fill="#334155" stroke="#64748b" strokeWidth="1" />
          <text x="24" y="28" fill="#94a3b8" fontSize="8" textAnchor="middle">?</text>
        </svg>
      );
  }
}

const ITEMS: PaletteItem[] = [
  { type: 'wokwi-arduino-uno', name: 'Arduino Uno R3', category: 'MCU', description: 'Classic ATmega328P microcontroller board' },
  { type: 'wokwi-esp32-devkit-v1', name: 'ESP32 DevKit v1', category: 'MCU', description: 'Dual-core WiFi & Bluetooth IoT microcontroller' },
  { type: 'wokwi-esp32-s3', name: 'ESP32-S3 DevKit', category: 'MCU', description: 'Dual-core Xtensa LX7 with AI vector instructions & dual USB-C' },
  { type: 'wokwi-esp32-c3', name: 'ESP32-C3 DevKit', category: 'MCU', description: '32-bit RISC-V 160MHz single-core WiFi + BLE 5.0' },
  { type: 'wokwi-esp32-c6', name: 'ESP32-C6 DevKit', category: 'MCU', description: 'RISC-V WiFi 6, 802.15.4 Zigbee, Thread & BLE 5.0' },
  { type: 'wokwi-seeed-xiao', name: 'Seeed Studio XIAO', category: 'MCU', description: 'Thumb-sized ultra-compact ESP32-C3 / RP2040 board' },
  { type: 'wokwi-pi-pico', name: 'Raspberry Pi Pico', category: 'MCU', description: 'RP2040 Dual ARM Cortex-M0+ 133MHz board' },
  { type: 'wokwi-stm32-bluepill', name: 'STM32 Blue Pill', category: 'MCU', description: 'STM32F103C8T6 ARM Cortex-M3 72MHz board' },
  { type: 'wokwi-esp8266-nodemcu', name: 'ESP8266 NodeMCU', category: 'MCU', description: 'WiFi IoT microcontroller development board' },
  { type: 'wokwi-pic16f877a', name: 'PIC16F877A Microcontroller', category: 'MCU', description: 'Microchip 40-pin DIP university lab microcontroller' },
  { type: 'wokwi-nrf52840-dk', name: 'Nordic nRF52840 DK', category: 'MCU', description: 'Bluetooth Low Energy (BLE) & 802.15.4 ARM board' },
  { type: 'wokwi-led', name: 'Red LED', category: 'Actuators', description: '5mm standard through-hole LED', attrs: { color: 'red' } },
  { type: 'wokwi-led', name: 'Green LED', category: 'Actuators', description: '5mm green LED', attrs: { color: 'green' } },
  { type: 'wokwi-led', name: 'Blue LED', category: 'Actuators', description: '5mm blue LED', attrs: { color: 'blue' } },
  { type: 'wokwi-led', name: 'Yellow LED', category: 'Actuators', description: '5mm yellow LED', attrs: { color: 'yellow' } },
  { type: 'wokwi-relay-module', name: '5V Relay Module', category: 'Actuators', description: 'Electromechanical switch for high-voltage circuits' },
  { type: 'wokwi-buzzer', name: 'Piezo Buzzer', category: 'Actuators', description: 'Audio sound generator for alerts and melodies' },
  { type: 'wokwi-servo', name: 'SG90 Micro Servo', category: 'Actuators', description: '0-180 degree position control motor' },
  { type: 'wokwi-lcd1602', name: '16x2 I2C LCD', category: 'Actuators', description: 'HD44780 dot matrix display with I2C module' },
  { type: 'wokwi-dht22', name: 'DHT22 Sensor', category: 'Sensors', description: 'Digital temperature and humidity sensor', attrs: { temperature: 25, humidity: 50 } },
  { type: 'wokwi-hc-sr04', name: 'HC-SR04 Ultrasonic', category: 'Sensors', description: 'Sonar distance sensor (2cm - 400cm)', attrs: { distance: 30 } },
  { type: 'wokwi-potentiometer', name: 'Potentiometer', category: 'Inputs', description: '10k rotary dial analog voltage divider', attrs: { value: 512 } },
  { type: 'wokwi-pushbutton', name: 'Push Button', category: 'Inputs', description: 'Tactile momentary push button' },
  { type: 'wokwi-slide-switch', name: 'Slide Switch', category: 'Inputs', description: 'SPDT binary toggle switch' },
  { type: 'wokwi-resistor', name: 'Resistor 220Ω', category: 'Passives', description: 'Current limiting resistor for LEDs', attrs: { value: '220' } },
  { type: 'wokwi-resistor', name: 'Resistor 10kΩ', category: 'Passives', description: 'Pull-up / Pull-down resistor', attrs: { value: '10k' } },
];

export const ComponentPalette: React.FC<Props> = ({ isOpen, onClose, onAddComponent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'MCU', 'Sensors', 'Actuators', 'Inputs', 'Passives'];

  const filtered = ITEMS.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/50">
          <div className="flex items-center gap-2">
            <Cpu className="text-sky-400" size={20} />
            <h2 className="text-lg font-bold text-white">Add Electronics Component</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search & Categories */}
        <div className="p-4 border-b border-slate-800 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search components (e.g. ESP32, DHT22, LED, Servo, Resistor)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 text-white pl-10 pr-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-sky-500 text-sm"
              autoFocus
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition ${
                  activeCategory === cat
                    ? 'bg-sky-500 text-white font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Component Grid */}
        <div className="p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
          {filtered.map((item) => (
            <div
              key={item.name}
              onClick={() => {
                onAddComponent(item.type, item.attrs);
                onClose();
              }}
              className="flex items-center gap-3 p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-sky-500/80 rounded-lg cursor-pointer transition group"
            >
              {/* SVG Mini Preview */}
              <div className="flex-shrink-0 w-[52px] h-[52px] rounded-lg bg-slate-700/60 group-hover:bg-sky-500/10 border border-slate-600/40 group-hover:border-sky-500/40 flex items-center justify-center transition overflow-hidden">
                <ComponentThumbnail type={item.type} attrs={item.attrs} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white group-hover:text-sky-300 transition">
                    {item.name}
                  </h3>
                  <span className="text-[10px] text-slate-400 bg-slate-700/50 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


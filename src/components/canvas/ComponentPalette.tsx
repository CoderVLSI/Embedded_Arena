import React, { useState } from 'react';
import { ComponentType } from '../../types/circuit';
import { Cpu, Zap, Radio, Sliders, ToggleLeft, Volume2, Search, X } from 'lucide-react';

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
  icon: any;
}

const ITEMS: PaletteItem[] = [
  { type: 'wokwi-esp32-devkit-v1', name: 'ESP32 DevKit v1', category: 'MCU', description: 'Dual-core WiFi & Bluetooth IoT microcontroller', icon: Cpu },
  { type: 'wokwi-arduino-uno', name: 'Arduino Uno R3', category: 'MCU', description: 'Classic ATmega328P microcontroller board', icon: Cpu },
  { type: 'wokwi-led', name: 'Red LED', category: 'Actuators', description: '5mm standard through-hole LED', attrs: { color: 'red' }, icon: Zap },
  { type: 'wokwi-led', name: 'Green LED', category: 'Actuators', description: '5mm green LED', attrs: { color: 'green' }, icon: Zap },
  { type: 'wokwi-led', name: 'Blue LED', category: 'Actuators', description: '5mm blue LED', attrs: { color: 'blue' }, icon: Zap },
  { type: 'wokwi-led', name: 'Yellow LED', category: 'Actuators', description: '5mm yellow LED', attrs: { color: 'yellow' }, icon: Zap },
  { type: 'wokwi-relay-module', name: '5V Relay Module', category: 'Actuators', description: 'Electromechanical switch for high-voltage circuits', icon: Zap },
  { type: 'wokwi-buzzer', name: 'Piezo Buzzer', category: 'Actuators', description: 'Audio sound generator for alerts and melodies', icon: Volume2 },
  { type: 'wokwi-servo', name: 'SG90 Micro Servo', category: 'Actuators', description: '0-180 degree position control motor', icon: Sliders },
  { type: 'wokwi-lcd1602', name: '16x2 I2C LCD', category: 'Actuators', description: 'HD44780 dot matrix display with I2C module', icon: Radio },
  { type: 'wokwi-dht22', name: 'DHT22 Sensor', category: 'Sensors', description: 'Digital temperature and humidity sensor', attrs: { temperature: 25, humidity: 50 }, icon: Radio },
  { type: 'wokwi-hc-sr04', name: 'HC-SR04 Ultrasonic', category: 'Sensors', description: 'Sonar distance sensor (2cm - 400cm)', attrs: { distance: 30 }, icon: Radio },
  { type: 'wokwi-potentiometer', name: 'Potentiometer', category: 'Inputs', description: '10k rotary dial analog voltage divider', attrs: { value: 512 }, icon: Sliders },
  { type: 'wokwi-pushbutton', name: 'Push Button', category: 'Inputs', description: 'Tactile momentary push button', icon: ToggleLeft },
  { type: 'wokwi-slide-switch', name: 'Slide Switch', category: 'Inputs', description: 'SPDT binary toggle switch', icon: ToggleLeft },
  { type: 'wokwi-resistor', name: 'Resistor 220Ω', category: 'Passives', description: 'Current limiting resistor for LEDs', attrs: { value: '220' }, icon: Zap },
  { type: 'wokwi-resistor', name: 'Resistor 10kΩ', category: 'Passives', description: 'Pull-up / Pull-down resistor', attrs: { value: '10k' }, icon: Zap },
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
          {filtered.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                onClick={() => {
                  onAddComponent(item.type, item.attrs);
                  onClose();
                }}
                className="flex items-start gap-3 p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-sky-500/80 rounded-lg cursor-pointer transition group"
              >
                <div className="p-2.5 rounded-lg bg-slate-700 group-hover:bg-sky-500/20 text-sky-400 transition">
                  <Icon size={20} />
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
            );
          })}
        </div>
      </div>
    </div>
  );
};

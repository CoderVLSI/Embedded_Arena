import React, { useState } from 'react';
import { CircuitComponent, WireConnection } from '../../types/circuit';
import {
  GraduationCap, CheckCircle2, Circle, ArrowRight, Play, Sparkles,
  BookOpen, ChevronRight, X, Zap, Award
} from 'lucide-react';

export interface GuidedLabExperiment {
  id: string;
  title: string;
  category: 'Fundamentals' | 'Analog & Power' | 'Protocols' | 'IoT' | 'Robotics';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  learningObjectives: string[];
  steps: {
    title: string;
    instruction: string;
    hint?: string;
  }[];
}

export const LAB_EXPERIMENTS: GuidedLabExperiment[] = [
  {
    id: 'lab-1',
    title: 'Lab 1: Digital Output & Current Limiting (LED Blink)',
    category: 'Fundamentals',
    difficulty: 'Beginner',
    description: 'Learn the fundamentals of GPIO pin configuration, digital output states (HIGH/LOW), and current limiting resistor calculations using Ohm’s Law.',
    learningObjectives: [
      'Understand GPIO pin modes (OUTPUT) in microcontroller hardware',
      'Calculate resistor values: R = (Vcc - Vled) / Iled',
      'Write non-blocking / delay-based microcontroller routines in C++'
    ],
    steps: [
      {
        title: 'Step 1: Place Microcontroller Board',
        instruction: 'Add an Arduino Uno R3 or ESP32 DevKit to your workspace as the main controller.',
        hint: 'Click "+ Add Part" -> Select Arduino Uno R3.'
      },
      {
        title: 'Step 2: Connect 220Ω Resistor & Red LED',
        instruction: 'Connect Pin 13 to a 220Ω current-limiting resistor, then connect to the LED Anode (A). Connect the LED Cathode (C) to GND.',
        hint: 'Use red wire from Pin 13 to Resistor, and black wire from Cathode to GND.'
      },
      {
        title: 'Step 3: Program pinMode and digitalWrite',
        instruction: 'Set pinMode(13, OUTPUT) in setup(), and toggle digitalWrite(13, HIGH) / LOW with delay(1000) inside loop().'
      },
      {
        title: 'Step 4: Run Simulation & Observe Onboard "L" LED',
        instruction: 'Click "▶ Run" in the top navigation bar. Observe the LED glow animation and the synchronized pin 13 status.'
      }
    ]
  },
  {
    id: 'lab-2',
    title: 'Lab 2: Analog Sensing & 5V Relay Actuation',
    category: 'Analog & Power',
    difficulty: 'Intermediate',
    description: 'Construct an analog voltage divider using a 10k potentiometer, sample ADC values, and trigger a 5V electromechanical relay module.',
    learningObjectives: [
      'Understand 10-bit & 12-bit Analog-to-Digital Converters (ADC)',
      'Learn how electromechanical relays isolate low-voltage MCU signals from high-power loads',
      'Implement software hysteresis to prevent rapid relay chattering'
    ],
    steps: [
      {
        title: 'Step 1: Wire 10k Potentiometer to ADC Pin',
        instruction: 'Connect Potentiometer VCC to 5V/3.3V, GND to Ground, and Center Signal Pin (SIG) to Analog Pin A0 / GPIO 34.'
      },
      {
        title: 'Step 2: Wire 5V Relay Module',
        instruction: 'Connect Relay VCC to 5V, GND to Ground, and Relay Control Input (IN) to Digital Pin 7 / GPIO 19.'
      },
      {
        title: 'Step 3: Program Analog Threshold Comparator',
        instruction: 'Read analogRead(pin) and switch digitalWrite(relayPin, HIGH) when voltage exceeds 50% threshold.'
      },
      {
        title: 'Step 4: Test Real-Time Knob Dragging',
        instruction: 'Run simulation and drag the potentiometer dial across 0 to 1023 to hear the relay click and watch the status LED activate.'
      }
    ]
  },
  {
    id: 'lab-3',
    title: 'Lab 3: I2C Bus Protocol & 16x2 LCD Display',
    category: 'Protocols',
    difficulty: 'Intermediate',
    description: 'Master the 2-wire Inter-Integrated Circuit (I2C) communication bus with SDA/SCL lines to drive a HD44780 LCD display.',
    learningObjectives: [
      'Understand synchronous serial communication over SDA (Serial Data) and SCL (Serial Clock)',
      'Discover I2C 7-bit slave addressing (default 0x27 or 0x3F)',
      'Use LiquidCrystal_I2C library for cursor positioning and telemetry printing'
    ],
    steps: [
      {
        title: 'Step 1: Connect 4-Pin I2C Bus',
        instruction: 'Connect LCD VCC to 5V, GND to GND, SDA to A4 (or ESP32 GPIO 21), and SCL to A5 (or ESP32 GPIO 22).'
      },
      {
        title: 'Step 2: Initialize Display in Code',
        instruction: 'Include <LiquidCrystal_I2C.h>, instantiate lcd(0x27, 16, 2), and call lcd.init() and lcd.backlight().'
      },
      {
        title: 'Step 3: Print Real-Time Strings',
        instruction: 'Use lcd.setCursor(col, row) to format multi-line data and lcd.print("Hello Embedded!").'
      }
    ]
  },
  {
    id: 'lab-4',
    title: 'Lab 4: IoT Smart Thermostat & Environmental Monitor',
    category: 'IoT',
    difficulty: 'Intermediate',
    description: 'Interface a digital 1-wire DHT22 temperature and humidity sensor with an ESP32 and trigger acoustic buzzer alarms.',
    learningObjectives: [
      'Understand digital single-bus protocols and checksum verification',
      'Acquire Celsius/Fahrenheit temperature and Relative Humidity (%RH)',
      'Generate PWM audio frequencies using tone() for alert notification'
    ],
    steps: [
      {
        title: 'Step 1: Wire DHT22 to ESP32 Pin 4',
        instruction: 'Connect DHT22 VCC to 3.3V, GND to GND, and Data pin (SDA) to GPIO 4.'
      },
      {
        title: 'Step 2: Wire Piezo Buzzer to GPIO 18',
        instruction: 'Connect Buzzer (+) to GPIO 18 and (-) to GND.'
      },
      {
        title: 'Step 3: Test Temperature Sliders',
        instruction: 'Run simulation, open the DHT22 popup, and move the temperature slider above 30°C to verify real-time buzzer alarm.'
      }
    ]
  }
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLoadLabCircuit: (components: CircuitComponent[], wires: WireConnection[], inoCode: string, libraries: string[], title: string) => void;
}

export const GuidedLabPanel: React.FC<Props> = ({ isOpen, onClose, onLoadLabCircuit }) => {
  const [selectedLab, setSelectedLab] = useState<GuidedLabExperiment>(LAB_EXPERIMENTS[0]);
  const [completedSteps, setCompletedSteps] = useState<Record<string, number[]>>({});

  if (!isOpen) return null;

  const currentCompleted = completedSteps[selectedLab.id] || [];

  const handleToggleStep = (stepIdx: number) => {
    const prev = completedSteps[selectedLab.id] || [];
    const next = prev.includes(stepIdx) ? prev.filter(i => i !== stepIdx) : [...prev, stepIdx];
    setCompletedSteps({ ...completedSteps, [selectedLab.id]: next });
  };

  const handleQuickLoadLab = () => {
    if (selectedLab.id === 'lab-1') {
      onLoadLabCircuit(
        [
          { id: 'uno', type: 'wokwi-arduino-uno', top: 120, left: 80, attrs: {} },
          { id: 'res', type: 'wokwi-resistor', top: 100, left: 380, attrs: { value: '220' } },
          { id: 'led', type: 'wokwi-led', top: 180, left: 380, attrs: { color: 'red' } }
        ],
        [
          { id: 'w1', from: 'uno:13', to: 'res:1', color: 'red' },
          { id: 'w2', from: 'res:2', to: 'led:A', color: 'red' },
          { id: 'w3', from: 'uno:GND.1', to: 'led:C', color: 'black' }
        ],
        `// Lab 1: Microcontroller Digital Output & LED Blink
const int LED_PIN = 13;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("Lab 1: LED Blink Initialized");
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  Serial.println("LED ON");
  delay(1000);

  digitalWrite(LED_PIN, LOW);
  Serial.println("LED OFF");
  delay(1000);
}`,
        [],
        selectedLab.title
      );
    } else if (selectedLab.id === 'lab-2') {
      onLoadLabCircuit(
        [
          { id: 'uno', type: 'wokwi-arduino-uno', top: 120, left: 80, attrs: {} },
          { id: 'pot', type: 'wokwi-potentiometer', top: 100, left: 380, attrs: { value: 650 } },
          { id: 'relay', type: 'wokwi-relay-module', top: 220, left: 380, attrs: {} },
          { id: 'led', type: 'wokwi-led', top: 140, left: 540, attrs: { color: 'green' } }
        ],
        [
          { id: 'w1', from: 'uno:5V', to: 'pot:VCC', color: 'red' },
          { id: 'w2', from: 'uno:GND.2', to: 'pot:GND', color: 'black' },
          { id: 'w3', from: 'uno:A0', to: 'pot:SIG', color: 'yellow' },
          { id: 'w4', from: 'uno:5V', to: 'relay:VCC', color: 'red' },
          { id: 'w5', from: 'uno:GND.2', to: 'relay:GND', color: 'black' },
          { id: 'w6', from: 'uno:7', to: 'relay:IN', color: 'orange' },
          { id: 'w7', from: 'uno:13', to: 'led:A', color: 'green' },
          { id: 'w8', from: 'uno:GND.1', to: 'led:C', color: 'black' }
        ],
        `// Lab 2: Analog Voltage Sensing & Relay Trigger
const int POT_PIN = A0;
const int RELAY_PIN = 7;
const int STATUS_LED = 13;

void setup() {
  Serial.begin(9600);
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(STATUS_LED, OUTPUT);
  Serial.println("Lab 2: Analog & Relay Lab Online");
}

void loop() {
  int sensorValue = analogRead(POT_PIN);
  float voltage = (sensorValue / 1023.0) * 5.0;

  Serial.print("Raw ADC: ");
  Serial.print(sensorValue);
  Serial.print(" | Voltage: ");
  Serial.print(voltage);
  Serial.println(" V");

  if (sensorValue > 512) {
    digitalWrite(RELAY_PIN, HIGH);
    digitalWrite(STATUS_LED, HIGH);
  } else {
    digitalWrite(RELAY_PIN, LOW);
    digitalWrite(STATUS_LED, LOW);
  }

  delay(200);
}`,
        [],
        selectedLab.title
      );
    } else {
      onLoadLabCircuit(
        [
          { id: 'esp32', type: 'wokwi-esp32-devkit-v1', top: 100, left: 80, attrs: {} },
          { id: 'dht', type: 'wokwi-dht22', top: 90, left: 340, attrs: { temperature: 28, humidity: 60 } },
          { id: 'lcd', type: 'wokwi-lcd1602', top: 230, left: 340, attrs: {} },
          { id: 'buzzer', type: 'wokwi-buzzer', top: 90, left: 520, attrs: {} }
        ],
        [
          { id: 'w1', from: 'esp32:3V3', to: 'dht:VCC', color: 'red' },
          { id: 'w2', from: 'esp32:GND.1', to: 'dht:GND', color: 'black' },
          { id: 'w3', from: 'esp32:4', to: 'dht:SDA', color: 'blue' },
          { id: 'w4', from: 'esp32:VIN', to: 'lcd:VCC', color: 'red' },
          { id: 'w5', from: 'esp32:GND.2', to: 'lcd:GND', color: 'black' },
          { id: 'w6', from: 'esp32:21', to: 'lcd:SDA', color: 'green' },
          { id: 'w7', from: 'esp32:22', to: 'lcd:SCL', color: 'yellow' },
          { id: 'w8', from: 'esp32:18', to: 'buzzer:1', color: 'orange' },
          { id: 'w9', from: 'esp32:GND.1', to: 'buzzer:2', color: 'black' }
        ],
        `// Lab: IoT Temperature & Humidity Monitor with I2C LCD
#include <LiquidCrystal_I2C.h>
#include <DHT.h>

#define DHTPIN 4
#define DHTTYPE DHT22
#define BUZZER_PIN 18

DHT dht(DHTPIN, DHTTYPE);
LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  Serial.begin(115200);
  pinMode(BUZZER_PIN, OUTPUT);
  dht.begin();
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("IoT Weather Lab");
  delay(1000);
  lcd.clear();
}

void loop() {
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();

  lcd.setCursor(0, 0);
  lcd.print("Temp: ");
  lcd.print(temp, 1);
  lcd.print((char)223);
  lcd.print("C");

  lcd.setCursor(0, 1);
  lcd.print("Hum : ");
  lcd.print(hum, 1);
  lcd.print(" %");

  if (temp > 30.0) {
    tone(BUZZER_PIN, 880, 200);
  } else {
    noTone(BUZZER_PIN);
  }

  delay(1500);
}`,
        ['DHT sensor library', 'LiquidCrystal_I2C'],
        selectedLab.title
      );
    }
  };

  return (
    <div className="fixed inset-y-0 left-0 w-[460px] bg-[#15151c] border-r border-slate-700/80 shadow-2xl z-40 flex flex-col overflow-hidden animate-in slide-in-from-left duration-200 text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-[#1d1d28] border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center text-white shadow-md">
            <GraduationCap size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white leading-tight">Guided Lab Tutor</h2>
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                EXPERIMENTS
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Step-by-Step College Engineering Lab</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X size={18} />
        </button>
      </div>

      {/* Lab Experiment Selector Dropdown */}
      <div className="p-4 bg-[#191924] border-b border-slate-800 space-y-2">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Experiment</label>
        <select
          value={selectedLab.id}
          onChange={(e) => {
            const found = LAB_EXPERIMENTS.find(l => l.id === e.target.value);
            if (found) {
              setSelectedLab(found);
            }
          }}
          className="w-full bg-slate-900 text-white px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500 text-xs font-semibold"
        >
          {LAB_EXPERIMENTS.map((exp) => (
            <option key={exp.id} value={exp.id}>
              {exp.title} ({exp.difficulty})
            </option>
          ))}
        </select>

        {/* 1-Click Load Lab Circuit */}
        <button
          onClick={handleQuickLoadLab}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 rounded-lg transition shadow-md hover:scale-[1.01] active:scale-[0.99]"
        >
          <Zap size={14} />
          <span>⚡ Setup Experiment on Canvas</span>
        </button>
      </div>

      {/* Main Body: Steps & Objectives */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Description & Objectives */}
        <div className="space-y-2">
          <p className="text-xs text-slate-300 leading-relaxed">{selectedLab.description}</p>

          <div className="p-3 bg-[#1c1d27] border border-slate-800 rounded-xl space-y-1.5 text-xs">
            <div className="font-bold text-emerald-400 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <Award size={13} /> Learning Objectives:
            </div>
            <ul className="space-y-1 text-slate-300">
              {selectedLab.learningObjectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-400 mt-0.5">•</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Step-by-Step Interactive Checkpoints */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Experiment Checkpoints ({currentCompleted.length}/{selectedLab.steps.length})
            </label>
          </div>

          <div className="space-y-2">
            {selectedLab.steps.map((step, idx) => {
              const isDone = currentCompleted.includes(idx);
              return (
                <div
                  key={idx}
                  onClick={() => handleToggleStep(idx)}
                  className={`p-3 rounded-xl border transition cursor-pointer ${
                    isDone
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
                      : 'bg-[#1e1f2b] border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <button className="mt-0.5 text-emerald-400">
                      {isDone ? <CheckCircle2 size={16} /> : <Circle size={16} className="text-slate-600" />}
                    </button>
                    <div className="flex-1 space-y-1">
                      <div className={`text-xs font-bold ${isDone ? 'line-through text-emerald-300' : 'text-white'}`}>
                        {step.title}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{step.instruction}</p>
                      {step.hint && (
                        <div className="text-[10px] text-sky-400 bg-sky-950/30 px-2 py-0.5 rounded border border-sky-600/30 inline-block mt-1">
                          💡 Hint: {step.hint}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

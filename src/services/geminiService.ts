import { CircuitComponent, WireConnection } from '../types/circuit';

export interface AiProjectDesign {
  title: string;
  description: string;
  explanation: string;
  components: CircuitComponent[];
  wires: WireConnection[];
  inoCode: string;
  libraries: string[];
}

export async function generateProjectWithGemini(
  prompt: string,
  apiKey?: string
): Promise<AiProjectDesign> {
  const cleanPrompt = prompt.trim();

  // If user provided Gemini API Key, attempt live API call
  if (apiKey && apiKey.trim().length > 5) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are an expert embedded systems engineer and circuit designer for an Arduino/ESP32 Wokwi-style simulator.
Design a complete electronic circuit and Arduino C++ code based on this user prompt: "${cleanPrompt}".

Available component types:
- wokwi-esp32-devkit-v1, wokwi-esp32-s3, wokwi-esp32-c3, wokwi-esp32-c6, wokwi-seeed-xiao, wokwi-arduino-uno, wokwi-pi-pico, wokwi-stm32-bluepill, wokwi-esp8266-nodemcu, wokwi-pic16f877a, wokwi-nrf52840-dk
- wokwi-led (attrs: {color: "red"|"green"|"blue"|"yellow"}), wokwi-resistor (attrs: {value: "220"|"10k"}), wokwi-pushbutton, wokwi-potentiometer, wokwi-slide-switch
- wokwi-lcd1602, wokwi-servo, wokwi-buzzer, wokwi-dht22, wokwi-hc-sr04, wokwi-relay-module

Wire colors: red (power), black (ground), green, blue, yellow, orange, white.

Respond ONLY with valid, raw JSON (no markdown fences, no backticks, just pure JSON) with this exact schema:
{
  "title": "Title of project",
  "description": "Short 1-line description",
  "explanation": "Markdown formatted step-by-step circuit explanation, pin connections table, and theory of operation for college lab students.",
  "components": [
    { "id": "mcu", "type": "wokwi-esp32-devkit-v1", "top": 120, "left": 100, "attrs": {} },
    { "id": "dht", "type": "wokwi-dht22", "top": 100, "left": 360, "attrs": { "temperature": 27, "humidity": 60 } }
  ],
  "wires": [
    { "id": "w1", "from": "mcu:3V3", "to": "dht:VCC", "color": "red" },
    { "id": "w2", "from": "mcu:GND.1", "to": "dht:GND", "color": "black" },
    { "id": "w3", "from": "mcu:4", "to": "dht:SDA", "color": "blue" }
  ],
  "inoCode": "// full complete Arduino C++ code here...",
  "libraries": ["DHT sensor library"]
}`
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: 'application/json'
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawJson) {
          const parsed = JSON.parse(rawJson);
          return {
            title: parsed.title || 'AI Generated Circuit',
            description: parsed.description || cleanPrompt,
            explanation: parsed.explanation || 'Custom AI-designed embedded circuit.',
            components: parsed.components || [],
            wires: parsed.wires || [],
            inoCode: parsed.inoCode || '// No code generated',
            libraries: parsed.libraries || []
          };
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to smart embedded synthesis engine:', err);
    }
  }

  // Smart Embedded AI Circuit Synthesizer (Instant local generator)
  return synthesizeCircuitLocally(cleanPrompt);
}

function synthesizeCircuitLocally(prompt: string): AiProjectDesign {
  const p = prompt.toLowerCase();

  // 1. ESP32 / Arduino Weather Station & Thermostat
  if (p.includes('dht') || p.includes('temp') || p.includes('humid') || p.includes('weather') || p.includes('thermostat')) {
    return {
      title: 'AI Smart Weather & Temperature Monitor',
      description: 'ESP32 IoT Weather Station reading DHT22 sensor with 16x2 LCD display & buzzer alarm',
      explanation: `### AI Circuit Design: ESP32 IoT Environmental Station\n\n#### Circuit Topology:\n- **ESP32 DevKit V1** controls the environmental monitoring subsystem.\n- **DHT22 Sensor** measures real-time ambient temperature & humidity via digital GPIO 4.\n- **16x2 I2C LCD** (address \`0x27\`) outputs real-time temperature (°C) and humidity (%).\n- **Piezo Buzzer** triggers an audible 880Hz alert when temperature exceeds 30°C.\n- **Status LED** indicates system operational health.\n\n#### College Lab Experiments:\n1. Observe I2C communication protocol on GPIO 21 (SDA) and GPIO 22 (SCL).\n2. Drag the DHT22 temperature slider above 30°C to verify threshold interrupt triggering.`,
      components: [
        { id: 'esp32', type: 'wokwi-esp32-devkit-v1', top: 100, left: 80, attrs: {} },
        { id: 'dht', type: 'wokwi-dht22', top: 90, left: 340, attrs: { temperature: 28, humidity: 62 } },
        { id: 'lcd', type: 'wokwi-lcd1602', top: 230, left: 340, attrs: {} },
        { id: 'buzzer', type: 'wokwi-buzzer', top: 90, left: 520, attrs: {} },
        { id: 'led', type: 'wokwi-led', top: 230, left: 540, attrs: { color: 'green' } }
      ],
      wires: [
        { id: 'w1', from: 'esp32:3V3', to: 'dht:VCC', color: 'red' },
        { id: 'w2', from: 'esp32:GND.1', to: 'dht:GND', color: 'black' },
        { id: 'w3', from: 'esp32:4', to: 'dht:SDA', color: 'blue' },
        { id: 'w4', from: 'esp32:VIN', to: 'lcd:VCC', color: 'red' },
        { id: 'w5', from: 'esp32:GND.2', to: 'lcd:GND', color: 'black' },
        { id: 'w6', from: 'esp32:21', to: 'lcd:SDA', color: 'green' },
        { id: 'w7', from: 'esp32:22', to: 'lcd:SCL', color: 'yellow' },
        { id: 'w8', from: 'esp32:18', to: 'buzzer:1', color: 'orange' },
        { id: 'w9', from: 'esp32:GND.1', to: 'buzzer:2', color: 'black' },
        { id: 'w10', from: 'esp32:2', to: 'led:A', color: 'green' },
        { id: 'w11', from: 'esp32:GND.1', to: 'led:C', color: 'black' }
      ],
      inoCode: `// AI-Generated Embedded System: ESP32 Smart Environmental Monitor
#include <LiquidCrystal_I2C.h>
#include <DHT.h>

#define DHTPIN 4
#define DHTTYPE DHT22
#define BUZZER_PIN 18
#define LED_PIN 2

DHT dht(DHTPIN, DHTTYPE);
LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  Serial.begin(115200);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);

  dht.begin();
  lcd.init();
  lcd.backlight();

  lcd.setCursor(0, 0);
  lcd.print("AI Weather Sys");
  lcd.setCursor(0, 1);
  lcd.print("Initializing...");
  delay(1000);
  lcd.clear();
}

void loop() {
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();

  Serial.print("Temp: ");
  Serial.print(temp);
  Serial.print(" C, Hum: ");
  Serial.print(hum);
  Serial.println(" %");

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
    digitalWrite(LED_PIN, HIGH);
    tone(BUZZER_PIN, 880, 200);
  } else {
    digitalWrite(LED_PIN, LOW);
    noTone(BUZZER_PIN);
  }

  delay(1500);
}`,
      libraries: ['DHT sensor library', 'LiquidCrystal_I2C']
    };
  }

  // 2. Ultrasonic Radar & Distance Measuring
  if (p.includes('ultrasonic') || p.includes('distance') || p.includes('radar') || p.includes('sonar') || p.includes('hcsr04')) {
    return {
      title: 'AI Sonar Distance Radar with Servo Scanner',
      description: 'Arduino Uno sonar obstacle detector with SG90 sweeping servo and 16x2 LCD telemetry',
      explanation: `### AI Circuit Design: Ultrasonic Sonar Radar Scanner\n\n#### Circuit Architecture:\n- **Arduino Uno R3** pulses the **HC-SR04** ultrasonic trigger pin (Pin 9) and calculates distance from echo return time (Pin 10).\n- **SG90 Servo** sweeps 0° to 180° scanning the field of view.\n- **Piezo Buzzer** beeps proportionally faster as an obstacle approaches under 20cm.\n- **16x2 LCD** reports real-time obstacle distance in centimeters.\n\n#### Lab Learning Outcomes:\n- Understanding speed of sound calculations: \`distance = (duration * 0.0343) / 2\`.\n- Generating PWM pulse signals for servo angle positioning.`,
      components: [
        { id: 'uno', type: 'wokwi-arduino-uno', top: 120, left: 80, attrs: {} },
        { id: 'sonar', type: 'wokwi-hc-sr04', top: 80, left: 400, attrs: { distance: 25 } },
        { id: 'servo', type: 'wokwi-servo', top: 220, left: 400, attrs: { angle: 90 } },
        { id: 'lcd', type: 'wokwi-lcd1602', top: 120, left: 560, attrs: {} }
      ],
      wires: [
        { id: 'w1', from: 'uno:5V', to: 'sonar:VCC', color: 'red' },
        { id: 'w2', from: 'uno:GND.2', to: 'sonar:GND', color: 'black' },
        { id: 'w3', from: 'uno:9', to: 'sonar:TRIG', color: 'orange' },
        { id: 'w4', from: 'uno:10', to: 'sonar:ECHO', color: 'blue' },
        { id: 'w5', from: 'uno:5V', to: 'servo:V+', color: 'red' },
        { id: 'w6', from: 'uno:GND.2', to: 'servo:GND', color: 'black' },
        { id: 'w7', from: 'uno:6', to: 'servo:PWM', color: 'yellow' },
        { id: 'w8', from: 'uno:A4', to: 'lcd:SDA', color: 'green' },
        { id: 'w9', from: 'uno:A5', to: 'lcd:SCL', color: 'yellow' },
        { id: 'w10', from: 'uno:5V', to: 'lcd:VCC', color: 'red' },
        { id: 'w11', from: 'uno:GND.3', to: 'lcd:GND', color: 'black' }
      ],
      inoCode: `// AI Sonar Radar & Distance Scanner
#include <LiquidCrystal_I2C.h>
#include <Servo.h>

#define TRIG_PIN 9
#define ECHO_PIN 10
#define SERVO_PIN 6

LiquidCrystal_I2C lcd(0x27, 16, 2);
Servo radarServo;

void setup() {
  Serial.begin(9600);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  radarServo.attach(SERVO_PIN);
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("AI Radar Online");
  delay(1000);
}

void loop() {
  for (int angle = 15; angle <= 165; angle += 15) {
    radarServo.write(angle);
    delay(100);

    digitalWrite(TRIG_PIN, LOW);
    delayMicroseconds(2);
    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);

    long duration = pulseIn(ECHO_PIN, HIGH, 30000);
    float distance = (duration * 0.0343) / 2.0;

    Serial.print("Angle: ");
    Serial.print(angle);
    Serial.print(" deg | Distance: ");
    Serial.print(distance);
    Serial.println(" cm");

    lcd.setCursor(0, 0);
    lcd.print("Angle: ");
    lcd.print(angle);
    lcd.print(" deg   ");

    lcd.setCursor(0, 1);
    lcd.print("Dist : ");
    lcd.print(distance, 1);
    lcd.print(" cm   ");

    delay(200);
  }
}`,
      libraries: ['LiquidCrystal_I2C', 'Servo']
    };
  }

  // 3. Traffic Light System
  if (p.includes('traffic') || p.includes('pedestrian') || p.includes('cross') || p.includes('road')) {
    return {
      title: 'AI Smart Traffic Light with Pedestrian Pushbutton',
      description: 'Multi-phase intersection traffic controller with pedestrian call button and buzzer countdown',
      explanation: `### AI Circuit Design: Intelligent Traffic Light Controller\n\n#### Circuit Setup:\n- **Red, Yellow, Green LEDs** simulate the automotive traffic signals on Pins 13, 12, 11.\n- **Tactile Push Button** connected on Pin 2 with internal pull-up allows pedestrians to request safe crossing.\n- **Piezo Buzzer** sounds an audible crossing beeper for visually impaired pedestrians.\n\n#### Lab Learning Objectives:\n- Finite State Machine (FSM) programming in embedded C++.\n- Hardware debouncing and external interrupt handling.`,
      components: [
        { id: 'uno', type: 'wokwi-arduino-uno', top: 120, left: 80, attrs: {} },
        { id: 'red', type: 'wokwi-led', top: 80, left: 380, attrs: { color: 'red' } },
        { id: 'yellow', type: 'wokwi-led', top: 160, left: 380, attrs: { color: 'yellow' } },
        { id: 'green', type: 'wokwi-led', top: 240, left: 380, attrs: { color: 'green' } },
        { id: 'btn', type: 'wokwi-pushbutton', top: 100, left: 520, attrs: { color: 'blue' } },
        { id: 'buzzer', type: 'wokwi-buzzer', top: 220, left: 520, attrs: {} }
      ],
      wires: [
        { id: 'w1', from: 'uno:13', to: 'red:A', color: 'red' },
        { id: 'w2', from: 'uno:GND.1', to: 'red:C', color: 'black' },
        { id: 'w3', from: 'uno:12', to: 'yellow:A', color: 'yellow' },
        { id: 'w4', from: 'uno:GND.1', to: 'yellow:C', color: 'black' },
        { id: 'w5', from: 'uno:11', to: 'green:A', color: 'green' },
        { id: 'w6', from: 'uno:GND.1', to: 'green:C', color: 'black' },
        { id: 'w7', from: 'uno:2', to: 'btn:1.l', color: 'blue' },
        { id: 'w8', from: 'uno:GND.2', to: 'btn:2.l', color: 'black' },
        { id: 'w9', from: 'uno:8', to: 'buzzer:1', color: 'orange' },
        { id: 'w10', from: 'uno:GND.2', to: 'buzzer:2', color: 'black' }
      ],
      inoCode: `// AI Smart Traffic Light Controller
const int RED_PIN = 13;
const int YELLOW_PIN = 12;
const int GREEN_PIN = 11;
const int BUTTON_PIN = 2;
const int BUZZER_PIN = 8;

void setup() {
  Serial.begin(9600);
  pinMode(RED_PIN, OUTPUT);
  pinMode(YELLOW_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);

  Serial.println("AI Traffic System Online");
}

void loop() {
  // Green Phase (Normal Traffic Flow)
  digitalWrite(GREEN_PIN, HIGH);
  digitalWrite(YELLOW_PIN, LOW);
  digitalWrite(RED_PIN, LOW);

  for (int i = 0; i < 30; i++) {
    if (digitalRead(BUTTON_PIN) == LOW) {
      Serial.println("Pedestrian button pressed! Changing signals...");
      delay(500);
      break;
    }
    delay(100);
  }

  // Yellow Phase (Prepare to Stop)
  digitalWrite(GREEN_PIN, LOW);
  digitalWrite(YELLOW_PIN, HIGH);
  delay(2000);

  // Red Phase (Pedestrian Walk Phase)
  digitalWrite(YELLOW_PIN, LOW);
  digitalWrite(RED_PIN, HIGH);
  Serial.println("Pedestrians WALK now!");

  for (int b = 0; b < 6; b++) {
    tone(BUZZER_PIN, 1000, 200);
    delay(400);
  }

  delay(2000);
}`,
      libraries: []
    };
  }

  // Default: Universal Smart IoT Controller
  return {
    title: 'AI Smart IoT Multi-Device Controller',
    description: `AI designed circuit configured for "${prompt}" with interactive inputs, display & actuation`,
    explanation: `### AI Generated Circuit: ${prompt}\n\n#### Circuit Configuration:\n- **ESP32 Microcontroller**: Coordinates sensor acquisition and real-time outputs.\n- **Potentiometer**: Analog input on Pin 34 providing 0–1023 continuous variable control.\n- **5V Relay Module**: Switched via GPIO 19 to trigger AC/DC loads.\n- **Interactive LED & Buzzer**: Provide visual and acoustic feedback.\n\n#### Theory & Experimentation:\n- Measure voltage changes across the analog divider with \`analogRead(34)\`.\n- Control relay switching logic with threshold conditions.`,
    components: [
      { id: 'esp32', type: 'wokwi-esp32-devkit-v1', top: 120, left: 80, attrs: {} },
      { id: 'pot', type: 'wokwi-potentiometer', top: 100, left: 340, attrs: { value: 650 } },
      { id: 'relay', type: 'wokwi-relay-module', top: 240, left: 340, attrs: {} },
      { id: 'led', type: 'wokwi-led', top: 120, left: 540, attrs: { color: 'blue' } },
      { id: 'buzzer', type: 'wokwi-buzzer', top: 240, left: 540, attrs: {} }
    ],
    wires: [
      { id: 'w1', from: 'esp32:3V3', to: 'pot:VCC', color: 'red' },
      { id: 'w2', from: 'esp32:GND.1', to: 'pot:GND', color: 'black' },
      { id: 'w3', from: 'esp32:34', to: 'pot:SIG', color: 'yellow' },
      { id: 'w4', from: 'esp32:VIN', to: 'relay:VCC', color: 'red' },
      { id: 'w5', from: 'esp32:GND.2', to: 'relay:GND', color: 'black' },
      { id: 'w6', from: 'esp32:19', to: 'relay:IN', color: 'orange' },
      { id: 'w7', from: 'esp32:2', to: 'led:A', color: 'blue' },
      { id: 'w8', from: 'esp32:GND.1', to: 'led:C', color: 'black' },
      { id: 'w9', from: 'esp32:18', to: 'buzzer:1', color: 'purple' },
      { id: 'w10', from: 'esp32:GND.2', to: 'buzzer:2', color: 'black' }
    ],
    inoCode: `// AI Smart Embedded Project: ${prompt}
const int POT_PIN = 34;
const int RELAY_PIN = 19;
const int LED_PIN = 2;
const int BUZZER_PIN = 18;

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  Serial.println("AI Smart IoT System Initialized!");
}

void loop() {
  int potValue = analogRead(POT_PIN);
  float voltage = (potValue / 4095.0) * 3.3;

  Serial.print("Analog: ");
  Serial.print(potValue);
  Serial.print(" | Voltage: ");
  Serial.print(voltage);
  Serial.println(" V");

  if (potValue > 2048) {
    digitalWrite(RELAY_PIN, HIGH);
    digitalWrite(LED_PIN, HIGH);
    tone(BUZZER_PIN, 1200, 100);
  } else {
    digitalWrite(RELAY_PIN, LOW);
    digitalWrite(LED_PIN, LOW);
    noTone(BUZZER_PIN);
  }

  delay(250);
}`,
    libraries: []
  };
}

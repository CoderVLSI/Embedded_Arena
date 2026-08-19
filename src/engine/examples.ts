import { ProjectFile } from '../types/circuit';

export const STARTER_PROJECTS: ProjectFile[] = [
  {
    id: 'esp32-cactus-iot',
    name: 'ESP32 Smart IoT Station (DHT22, Relay, Buzzer, LED)',
    description: 'ESP32 IoT environmental monitor with DHT22 temperature & humidity, Relay switch, Piezo buzzer, and status LED.',
    libraries: ['DHT sensor library', 'WiFi', 'Blynk'],
    diagram: {
      version: 1,
      author: 'Embedded Arena',
      editor: 'wokwi',
      parts: [
        { type: 'wokwi-esp32-devkit-v1', id: 'esp', top: 220, left: 340, attrs: {} },
        { type: 'wokwi-dht22', id: 'dht1', top: 120, left: 160, attrs: { temperature: 26.5, humidity: 62 } },
        { type: 'wokwi-relay-module', id: 'relay1', top: 60, left: 330, attrs: { state: false } },
        { type: 'wokwi-led', id: 'led1', top: 140, left: 490, attrs: { color: 'red' } },
        { type: 'wokwi-buzzer', id: 'buzzer1', top: 260, left: 540, attrs: {} },
      ],
      connections: [
        // DHT22 connections
        ['esp:3V3', 'dht1:VCC', 'red', []],
        ['esp:GND.1', 'dht1:GND', 'black', []],
        ['esp:17', 'dht1:SDA', 'green', []],
        // Relay connections
        ['esp:5V', 'relay1:VCC', 'red', []],
        ['esp:GND.1', 'relay1:GND', 'black', []],
        ['esp:14', 'relay1:IN', 'green', []],
        // LED connections
        ['esp:2', 'led1:A', 'green', []],
        ['esp:GND.2', 'led1:C', 'black', []],
        // Buzzer connections
        ['esp:5', 'buzzer1:1', 'green', []],
        ['esp:GND.2', 'buzzer1:2', 'black', []],
      ],
    },
    inoCode: `// Embedded Arena ESP32 Environmental & IoT Controller
#define BLYNK_PRINT Serial

#define BLYNK_TEMPLATE_ID "TMPL6TjcEcllg4"
#define BLYNK_TEMPLATE_NAME "Cactus"
#define BLYNK_AUTH_TOKEN "hdfrj0goUsbjmx_Jd1Tho5rjP2ujc8OF"

#include <WiFi.h>
#include <WiFiClient.h>
#include <BlynkSimpleEsp32.h>
#include "DHT.h"

char ssid[] = "Wokwi-GUEST";
char pass[] = "";

#define DHTPIN 17
#define DHTTYPE DHT22

DHT dht(DHTPIN, DHTTYPE);
#define RELAY_PIN 14
#define BUZZER_PIN 5
#define LED_PIN 2

int pinValue = 0;

void setup() {
  Serial.begin(9600);
  Serial.println("Starting ESP32 Smart Station...");

  pinMode(RELAY_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);

  dht.begin();
  WiFi.begin(ssid, pass);

  digitalWrite(LED_PIN, HIGH);
  delay(300);
  digitalWrite(LED_PIN, LOW);
  
  Serial.println("System Ready!");
}

void loop() {
  // Read sensor values (adjust sliders on DHT22 to change values!)
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();

  Serial.print("Temperature: ");
  Serial.print(temp);
  Serial.print(" °C | Humidity: ");
  Serial.print(hum);
  Serial.println(" %");

  // Environmental automation logic
  if (temp > 28.0) {
    // High temperature alert: activate cooling relay & warning beep
    digitalWrite(RELAY_PIN, HIGH);
    digitalWrite(LED_PIN, HIGH);
    tone(BUZZER_PIN, 1200, 150);
    Serial.println(">>> ALERT: Temperature high! Cooling relay ON <<<");
  } else {
    digitalWrite(RELAY_PIN, LOW);
    digitalWrite(LED_PIN, LOW);
    noTone(BUZZER_PIN);
  }

  delay(1500);
}
`,
  },
  {
    id: 'arduino-blink',
    name: 'Arduino Uno - Classic Blink with Resistor & LED',
    description: 'The iconic "Hello World" of microcontrollers. Pulses digital pin 13 and external LED.',
    libraries: [],
    diagram: {
      version: 1,
      author: 'Embedded Arena',
      editor: 'wokwi',
      parts: [
        { type: 'wokwi-arduino-uno', id: 'uno', top: 120, left: 160, attrs: {} },
        { type: 'wokwi-resistor', id: 'r1', top: 140, left: 450, attrs: { value: '220' } },
        { type: 'wokwi-led', id: 'led1', top: 140, left: 540, attrs: { color: 'red' } },
      ],
      connections: [
        ['uno:13', 'r1:1', 'green', []],
        ['r1:2', 'led1:A', 'green', []],
        ['uno:GND.1', 'led1:C', 'black', []],
      ],
    },
    inoCode: `// Embedded Arena - Arduino Uno Blink
// Turns an LED on for one second, then off for one second, repeatedly.

const int ledPin = 13;

void setup() {
  Serial.begin(9600);
  Serial.println("Arduino Blink initialized!");
  pinMode(ledPin, OUTPUT);
}

void loop() {
  Serial.println("LED State: ON");
  digitalWrite(ledPin, HIGH);   // turn the LED on (HIGH is the voltage level)
  delay(1000);                  // wait for a second

  Serial.println("LED State: OFF");
  digitalWrite(ledPin, LOW);    // turn the LED off by making the voltage LOW
  delay(1000);                  // wait for a second
}
`,
  },
  {
    id: 'ultrasonic-lcd',
    name: 'Ultrasonic Radar with I2C LCD Display',
    description: 'Measures obstacle distance with HC-SR04 and renders real-time readings on an I2C 16x2 LCD display.',
    libraries: ['LiquidCrystal_I2C'],
    diagram: {
      version: 1,
      author: 'Embedded Arena',
      editor: 'wokwi',
      parts: [
        { type: 'wokwi-arduino-uno', id: 'uno', top: 140, left: 120, attrs: {} },
        { type: 'wokwi-hc-sr04', id: 'sonar1', top: 80, left: 450, attrs: { distance: 35 } },
        { type: 'wokwi-lcd1602', id: 'lcd1', top: 260, left: 450, attrs: { rows: 2, cols: 16 } },
      ],
      connections: [
        // Sonar
        ['uno:5V', 'sonar1:VCC', 'red', []],
        ['uno:GND.1', 'sonar1:GND', 'black', []],
        ['uno:9', 'sonar1:TRIG', 'blue', []],
        ['uno:10', 'sonar1:ECHO', 'green', []],
        // LCD I2C
        ['uno:5V', 'lcd1:VCC', 'red', []],
        ['uno:GND.2', 'lcd1:GND', 'black', []],
        ['uno:A4', 'lcd1:SDA', 'orange', []],
        ['uno:A5', 'lcd1:SCL', 'yellow', []],
      ],
    },
    inoCode: `// Ultrasonic Distance Radar with I2C LCD
#include <LiquidCrystal_I2C.h>

const int trigPin = 9;
const int echoPin = 10;

LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  Serial.begin(9600);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Distance Radar");
  lcd.setCursor(0, 1);
  lcd.print("Ready...");
  delay(1000);
  lcd.clear();
}

void loop() {
  // Trigger ultrasonic pulse
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  // Read echo pulse duration
  long duration = pulseIn(echoPin, HIGH);
  float distanceCm = duration * 0.034 / 2.0;

  // Print to Serial
  Serial.print("Distance: ");
  Serial.print(distanceCm);
  Serial.println(" cm");

  // Display on LCD
  lcd.setCursor(0, 0);
  lcd.print("Distance:       ");
  lcd.setCursor(10, 0);
  lcd.print((int)distanceCm);
  lcd.print("cm");

  lcd.setCursor(0, 1);
  if (distanceCm < 15) {
    lcd.print("Status: TOO CLOSE");
  } else if (distanceCm < 50) {
    lcd.print("Status: WARNING  ");
  } else {
    lcd.print("Status: CLEAR    ");
  }

  delay(400);
}
`,
  },
  {
    id: 'potentiometer-servo',
    name: 'Potentiometer Knob Servo Arm Controller',
    description: 'Turn the potentiometer dial to steer the SG90 servo motor in real time.',
    libraries: ['Servo'],
    diagram: {
      version: 1,
      author: 'Embedded Arena',
      editor: 'wokwi',
      parts: [
        { type: 'wokwi-arduino-uno', id: 'uno', top: 120, left: 160, attrs: {} },
        { type: 'wokwi-potentiometer', id: 'pot1', top: 140, left: 480, attrs: { value: 512 } },
        { type: 'wokwi-servo', id: 'servo1', top: 280, left: 480, attrs: { angle: 90 } },
      ],
      connections: [
        // Potentiometer
        ['uno:5V', 'pot1:VCC', 'red', []],
        ['uno:GND.1', 'pot1:GND', 'black', []],
        ['uno:A0', 'pot1:SIG', 'green', []],
        // Servo
        ['uno:5V', 'servo1:V+', 'red', []],
        ['uno:GND.2', 'servo1:GND', 'black', []],
        ['uno:9', 'servo1:PWM', 'orange', []],
      ],
    },
    inoCode: `// Potentiometer knob to SG90 Servo Controller
#include <Servo.h>

Servo myServo;
const int potPin = A0;

void setup() {
  Serial.begin(9600);
  myServo.attach(9);
  Serial.println("Rotate the potentiometer to steer the servo!");
}

void loop() {
  int potValue = analogRead(potPin); // 0 to 1023
  int angle = map(potValue, 0, 1023, 0, 180); // map to 0 - 180 degrees

  myServo.write(angle);

  Serial.print("Potentiometer: ");
  Serial.print(potValue);
  Serial.print(" | Servo Angle: ");
  Serial.print(angle);
  Serial.println(" deg");

  delay(50);
}
`,
  },
  {
    id: 'traffic-light',
    name: 'Smart Traffic Light with Pedestrian Crossing',
    description: '3-stage traffic signals (Red, Yellow, Green) with pedestrian push-button interrupt.',
    libraries: [],
    diagram: {
      version: 1,
      author: 'Embedded Arena',
      editor: 'wokwi',
      parts: [
        { type: 'wokwi-arduino-uno', id: 'uno', top: 120, left: 140, attrs: {} },
        { type: 'wokwi-led', id: 'led_red', top: 80, left: 460, attrs: { color: 'red' } },
        { type: 'wokwi-led', id: 'led_yellow', top: 170, left: 460, attrs: { color: 'yellow' } },
        { type: 'wokwi-led', id: 'led_green', top: 260, left: 460, attrs: { color: 'green' } },
        { type: 'wokwi-pushbutton', id: 'btn1', top: 350, left: 460, attrs: { color: 'blue' } },
      ],
      connections: [
        ['uno:12', 'led_red:A', 'red', []],
        ['uno:GND.1', 'led_red:C', 'black', []],
        ['uno:11', 'led_yellow:A', 'yellow', []],
        ['uno:GND.1', 'led_yellow:C', 'black', []],
        ['uno:10', 'led_green:A', 'green', []],
        ['uno:GND.1', 'led_green:C', 'black', []],
        ['uno:2', 'btn1:1.l', 'purple', []],
        ['uno:GND.2', 'btn1:2.l', 'black', []],
      ],
    },
    inoCode: `// Smart Traffic Light with Pedestrian Button
const int RED_PIN = 12;
const int YELLOW_PIN = 11;
const int GREEN_PIN = 10;
const int BUTTON_PIN = 2;

void setup() {
  Serial.begin(9600);
  pinMode(RED_PIN, OUTPUT);
  pinMode(YELLOW_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  Serial.println("Traffic system initialized.");
}

void loop() {
  // Green light
  digitalWrite(GREEN_PIN, HIGH);
  digitalWrite(YELLOW_PIN, LOW);
  digitalWrite(RED_PIN, LOW);
  Serial.println("Traffic: GREEN (Go)");

  for (int i = 0; i < 40; i++) {
    if (digitalRead(BUTTON_PIN) == LOW) {
      Serial.println("Pedestrian button pressed! Switching sequence...");
      break;
    }
    delay(100);
  }

  // Yellow light
  digitalWrite(GREEN_PIN, LOW);
  digitalWrite(YELLOW_PIN, HIGH);
  Serial.println("Traffic: YELLOW (Slow down)");
  delay(1500);

  // Red light
  digitalWrite(YELLOW_PIN, LOW);
  digitalWrite(RED_PIN, HIGH);
  Serial.println("Traffic: RED (Stop - Pedestrians Walk)");
  delay(3000);
}
`,
  }
];

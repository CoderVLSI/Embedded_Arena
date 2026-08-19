export type ComponentType =
  | 'wokwi-arduino-uno'
  | 'wokwi-esp32-devkit-v1'
  | 'wokwi-arduino-nano'
  | 'wokwi-arduino-mega'
  | 'wokwi-led'
  | 'wokwi-rgb-led'
  | 'wokwi-resistor'
  | 'wokwi-pushbutton'
  | 'wokwi-potentiometer'
  | 'wokwi-slide-switch'
  | 'wokwi-lcd1602'
  | 'wokwi-ssd1306'
  | 'wokwi-servo'
  | 'wokwi-buzzer'
  | 'wokwi-dht22'
  | 'wokwi-hc-sr04'
  | 'wokwi-relay-module'
  | 'wokwi-7segment'
  | 'wokwi-breadboard';

export interface PinDefinition {
  id: string;
  name: string;
  x: number; // pixel offset from component top-left
  y: number;
  type?: 'power' | 'ground' | 'digital' | 'analog' | 'i2c' | 'spi' | 'passive';
  description?: string;
}

export interface CircuitComponent {
  id: string;
  type: ComponentType;
  top: number;
  left: number;
  rotate?: number;
  attrs: {
    color?: string;
    value?: string | number;
    label?: string;
    temperature?: number;
    humidity?: number;
    distance?: number;
    angle?: number;
    state?: number | boolean;
    frequency?: number;
    rows?: number;
    cols?: number;
    digits?: number;
    pins?: string;
    [key: string]: any;
  };
}

export interface WireConnection {
  id: string;
  from: string; // e.g. "esp:2" or "uno:13" or "r1:1"
  to: string;   // e.g. "led1:A"
  color: string;
  points?: { x: number; y: number }[];
}

export interface DiagramConfig {
  version: 1;
  author?: string;
  editor?: string;
  parts: {
    type: ComponentType;
    id: string;
    top: number;
    left: number;
    rotate?: number;
    attrs?: Record<string, any>;
  }[];
  connections: [string, string, string, string[]?][];
}

export interface ProjectFile {
  id: string;
  name: string;
  description?: string;
  inoCode: string;
  diagram: DiagramConfig;
  libraries: string[];
}

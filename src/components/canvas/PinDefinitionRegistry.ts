import { ComponentType, PinDefinition } from '../../types/circuit';

export function getComponentPins(type: ComponentType): PinDefinition[] {
  switch (type) {
    case 'wokwi-arduino-uno':
      return [
        // Digital Header (Top)
        { id: 'AREF', name: 'AREF', x: 80, y: 15, type: 'passive' },
        { id: 'GND.1', name: 'GND', x: 92, y: 15, type: 'ground' },
        { id: '13', name: '13', x: 104, y: 15, type: 'digital' },
        { id: '12', name: '12', x: 116, y: 15, type: 'digital' },
        { id: '11', name: '11~', x: 128, y: 15, type: 'digital' },
        { id: '10', name: '10~', x: 140, y: 15, type: 'digital' },
        { id: '9', name: '9~', x: 152, y: 15, type: 'digital' },
        { id: '8', name: '8', x: 164, y: 15, type: 'digital' },
        { id: '7', name: '7', x: 184, y: 15, type: 'digital' },
        { id: '6', name: '6~', x: 196, y: 15, type: 'digital' },
        { id: '5', name: '5~', x: 208, y: 15, type: 'digital' },
        { id: '4', name: '4', x: 220, y: 15, type: 'digital' },
        { id: '3', name: '3~', x: 232, y: 15, type: 'digital' },
        { id: '2', name: '2', x: 244, y: 15, type: 'digital' },
        { id: '1', name: 'TX/1', x: 256, y: 15, type: 'digital' },
        { id: '0', name: 'RX/0', x: 268, y: 15, type: 'digital' },
        // Power Header (Bottom Left)
        { id: 'IOREF', name: 'IOREF', x: 100, y: 225, type: 'power' },
        { id: 'RESET', name: 'RESET', x: 112, y: 225, type: 'passive' },
        { id: '3V3', name: '3.3V', x: 124, y: 225, type: 'power' },
        { id: '5V', name: '5V', x: 136, y: 225, type: 'power' },
        { id: 'GND.2', name: 'GND', x: 148, y: 225, type: 'ground' },
        { id: 'GND.3', name: 'GND', x: 160, y: 225, type: 'ground' },
        { id: 'VIN', name: 'VIN', x: 172, y: 225, type: 'power' },
        // Analog Header (Bottom Right)
        { id: 'A0', name: 'A0', x: 196, y: 225, type: 'analog' },
        { id: 'A1', name: 'A1', x: 208, y: 225, type: 'analog' },
        { id: 'A2', name: 'A2', x: 220, y: 225, type: 'analog' },
        { id: 'A3', name: 'A3', x: 232, y: 225, type: 'analog' },
        { id: 'A4', name: 'A4/SDA', x: 244, y: 225, type: 'analog' },
        { id: 'A5', name: 'A5/SCL', x: 256, y: 225, type: 'analog' },
      ];

    case 'wokwi-esp32-devkit-v1':
      return [
        // Left Pin Header (Top to Bottom)
        { id: '3V3', name: '3V3', x: 12, y: 40, type: 'power' },
        { id: 'EN', name: 'EN', x: 12, y: 55, type: 'passive' },
        { id: 'VP', name: 'VP/36', x: 12, y: 70, type: 'analog' },
        { id: 'VN', name: 'VN/39', x: 12, y: 85, type: 'analog' },
        { id: '34', name: 'D34', x: 12, y: 100, type: 'digital' },
        { id: '35', name: 'D35', x: 12, y: 115, type: 'digital' },
        { id: '32', name: 'D32', x: 12, y: 130, type: 'digital' },
        { id: '33', name: 'D33', x: 12, y: 145, type: 'digital' },
        { id: '25', name: 'D25', x: 12, y: 160, type: 'digital' },
        { id: '26', name: 'D26', x: 12, y: 175, type: 'digital' },
        { id: '27', name: 'D27', x: 12, y: 190, type: 'digital' },
        { id: '14', name: 'D14', x: 12, y: 205, type: 'digital' },
        { id: '12', name: 'D12', x: 12, y: 220, type: 'digital' },
        { id: 'GND.1', name: 'GND', x: 12, y: 235, type: 'ground' },
        { id: '13', name: 'D13', x: 12, y: 250, type: 'digital' },
        // Right Pin Header (Top to Bottom)
        { id: 'VIN', name: 'VIN/5V', x: 108, y: 40, type: 'power' },
        { id: '5V', name: '5V', x: 108, y: 40, type: 'power' },
        { id: 'GND.2', name: 'GND', x: 108, y: 55, type: 'ground' },
        { id: '15', name: 'D15', x: 108, y: 70, type: 'digital' },
        { id: '2', name: 'D2', x: 108, y: 85, type: 'digital' },
        { id: '4', name: 'D4', x: 108, y: 100, type: 'digital' },
        { id: '16', name: 'RX2/16', x: 108, y: 115, type: 'digital' },
        { id: '17', name: 'TX2/17', x: 108, y: 130, type: 'digital' },
        { id: '5', name: 'D5', x: 108, y: 145, type: 'digital' },
        { id: '18', name: 'SCK/18', x: 108, y: 160, type: 'digital' },
        { id: '19', name: 'MISO/19', x: 108, y: 175, type: 'digital' },
        { id: '21', name: 'SDA/21', x: 108, y: 190, type: 'digital' },
        { id: 'RX', name: 'RX0/3', x: 108, y: 205, type: 'digital' },
        { id: 'TX', name: 'TX0/1', x: 108, y: 220, type: 'digital' },
        { id: '22', name: 'SCL/22', x: 108, y: 235, type: 'digital' },
        { id: '23', name: 'MOSI/23', x: 108, y: 250, type: 'digital' },
      ];

    case 'wokwi-dht22':
      return [
        { id: 'VCC', name: 'VCC', x: 16, y: 88, type: 'power' },
        { id: 'SDA', name: 'SDA', x: 28, y: 88, type: 'digital' },
        { id: 'NC', name: 'NC', x: 40, y: 88, type: 'passive' },
        { id: 'GND', name: 'GND', x: 52, y: 88, type: 'ground' },
      ];

    case 'wokwi-relay-module':
      return [
        // Input header (left)
        { id: 'VCC', name: 'VCC', x: 14, y: 22, type: 'power' },
        { id: 'GND', name: 'GND', x: 14, y: 38, type: 'ground' },
        { id: 'IN', name: 'IN', x: 14, y: 54, type: 'digital' },
        // Terminal block (right)
        { id: 'NO', name: 'NO', x: 110, y: 20, type: 'passive' },
        { id: 'COM', name: 'COM', x: 110, y: 38, type: 'passive' },
        { id: 'NC', name: 'NC', x: 110, y: 56, type: 'passive' },
      ];

    case 'wokwi-led':
      return [
        { id: 'A', name: 'Anode (+)', x: 12, y: 48, type: 'passive' },
        { id: 'C', name: 'Cathode (-)', x: 28, y: 48, type: 'ground' },
      ];

    case 'wokwi-buzzer':
      return [
        { id: '1', name: '1 (+)', x: 16, y: 42, type: 'digital' },
        { id: '2', name: '2 (-)', x: 44, y: 42, type: 'ground' },
      ];

    case 'wokwi-resistor':
      return [
        { id: '1', name: '1', x: 8, y: 15, type: 'passive' },
        { id: '2', name: '2', x: 72, y: 15, type: 'passive' },
      ];

    case 'wokwi-potentiometer':
      return [
        { id: 'GND', name: 'GND', x: 14, y: 64, type: 'ground' },
        { id: 'SIG', name: 'SIG/WIPER', x: 32, y: 64, type: 'analog' },
        { id: 'VCC', name: 'VCC', x: 50, y: 64, type: 'power' },
      ];

    case 'wokwi-pushbutton':
      return [
        { id: '1.l', name: '1.L', x: 10, y: 14, type: 'passive' },
        { id: '1.r', name: '1.R', x: 42, y: 14, type: 'passive' },
        { id: '2.l', name: '2.L', x: 10, y: 46, type: 'passive' },
        { id: '2.r', name: '2.R', x: 42, y: 46, type: 'passive' },
      ];

    case 'wokwi-slide-switch':
      return [
        { id: '1', name: '1', x: 12, y: 35, type: 'passive' },
        { id: 'COM', name: 'COM', x: 28, y: 35, type: 'passive' },
        { id: '2', name: '2', x: 44, y: 35, type: 'passive' },
      ];

    case 'wokwi-lcd1602':
      return [
        { id: 'GND', name: 'GND', x: 20, y: 110, type: 'ground' },
        { id: 'VCC', name: 'VCC', x: 38, y: 110, type: 'power' },
        { id: 'SDA', name: 'SDA', x: 56, y: 110, type: 'digital' },
        { id: 'SCL', name: 'SCL', x: 74, y: 110, type: 'digital' },
      ];

    case 'wokwi-servo':
      return [
        { id: 'GND', name: 'GND (Brown)', x: 20, y: 72, type: 'ground' },
        { id: 'V+', name: 'V+ (Red)', x: 38, y: 72, type: 'power' },
        { id: 'PWM', name: 'PWM (Orange)', x: 56, y: 72, type: 'digital' },
      ];

    case 'wokwi-hc-sr04':
      return [
        { id: 'VCC', name: 'VCC', x: 24, y: 64, type: 'power' },
        { id: 'TRIG', name: 'TRIG', x: 40, y: 64, type: 'digital' },
        { id: 'ECHO', name: 'ECHO', x: 56, y: 64, type: 'digital' },
        { id: 'GND', name: 'GND', x: 72, y: 64, type: 'ground' },
      ];

    default:
      return [];
  }
}

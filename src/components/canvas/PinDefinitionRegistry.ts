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

    case 'wokwi-pi-pico':
      return [
        // Left Pins (Top to Bottom)
        { id: 'GP0', name: 'GP0', x: 10, y: 25, type: 'digital' },
        { id: 'GP1', name: 'GP1', x: 10, y: 38, type: 'digital' },
        { id: 'GND.1', name: 'GND', x: 10, y: 51, type: 'ground' },
        { id: 'GP2', name: 'GP2', x: 10, y: 64, type: 'digital' },
        { id: 'GP3', name: 'GP3', x: 10, y: 77, type: 'digital' },
        { id: 'GP4', name: 'GP4', x: 10, y: 90, type: 'digital' },
        { id: 'GP5', name: 'GP5', x: 10, y: 103, type: 'digital' },
        { id: 'GND.2', name: 'GND', x: 10, y: 116, type: 'ground' },
        { id: 'GP6', name: 'GP6', x: 10, y: 129, type: 'digital' },
        { id: 'GP7', name: 'GP7', x: 10, y: 142, type: 'digital' },
        { id: 'GP8', name: 'GP8', x: 10, y: 155, type: 'digital' },
        { id: 'GP9', name: 'GP9', x: 10, y: 168, type: 'digital' },
        { id: 'GND.3', name: 'GND', x: 10, y: 181, type: 'ground' },
        { id: 'GP10', name: 'GP10', x: 10, y: 194, type: 'digital' },
        { id: 'GP11', name: 'GP11', x: 10, y: 207, type: 'digital' },
        { id: 'GP12', name: 'GP12', x: 10, y: 220, type: 'digital' },
        { id: 'GP13', name: 'GP13', x: 10, y: 233, type: 'digital' },
        { id: 'GND.4', name: 'GND', x: 10, y: 246, type: 'ground' },
        { id: 'GP14', name: 'GP14', x: 10, y: 259, type: 'digital' },
        { id: 'GP15', name: 'GP15', x: 10, y: 272, type: 'digital' },
        // Right Pins (Top to Bottom)
        { id: 'VBUS', name: 'VBUS/5V', x: 90, y: 25, type: 'power' },
        { id: 'VSYS', name: 'VSYS', x: 90, y: 38, type: 'power' },
        { id: 'GND.5', name: 'GND', x: 90, y: 51, type: 'ground' },
        { id: '3V3_EN', name: '3V3_EN', x: 90, y: 64, type: 'passive' },
        { id: '3V3', name: '3V3(OUT)', x: 90, y: 77, type: 'power' },
        { id: 'ADC_VREF', name: 'ADC_VREF', x: 90, y: 90, type: 'passive' },
        { id: 'GP28', name: 'GP28/ADC2', x: 90, y: 103, type: 'analog' },
        { id: 'GND.6', name: 'GND', x: 90, y: 116, type: 'ground' },
        { id: 'GP27', name: 'GP27/ADC1', x: 90, y: 129, type: 'analog' },
        { id: 'GP26', name: 'GP26/ADC0', x: 90, y: 142, type: 'analog' },
        { id: 'RUN', name: 'RUN', x: 90, y: 155, type: 'passive' },
        { id: 'GP22', name: 'GP22', x: 90, y: 168, type: 'digital' },
        { id: 'GND.7', name: 'GND', x: 90, y: 181, type: 'ground' },
        { id: 'GP21', name: 'GP21', x: 90, y: 194, type: 'digital' },
        { id: 'GP20', name: 'GP20', x: 90, y: 207, type: 'digital' },
        { id: 'GP19', name: 'GP19', x: 90, y: 220, type: 'digital' },
        { id: 'GP18', name: 'GP18', x: 90, y: 233, type: 'digital' },
        { id: 'GND.8', name: 'GND', x: 90, y: 246, type: 'ground' },
        { id: 'GP17', name: 'GP17', x: 90, y: 259, type: 'digital' },
        { id: 'GP16', name: 'GP16', x: 90, y: 272, type: 'digital' },
      ];

    case 'wokwi-stm32-bluepill':
      return [
        // Left Header
        { id: 'VBAT', name: 'VBAT', x: 10, y: 25, type: 'power' },
        { id: 'PC13', name: 'PC13/LED', x: 10, y: 38, type: 'digital' },
        { id: 'PC14', name: 'PC14', x: 10, y: 51, type: 'digital' },
        { id: 'PC15', name: 'PC15', x: 10, y: 64, type: 'digital' },
        { id: 'PA0', name: 'PA0/A0', x: 10, y: 77, type: 'analog' },
        { id: 'PA1', name: 'PA1/A1', x: 10, y: 90, type: 'analog' },
        { id: 'PA2', name: 'PA2/TX2', x: 10, y: 103, type: 'digital' },
        { id: 'PA3', name: 'PA3/RX2', x: 10, y: 116, type: 'digital' },
        { id: 'PA4', name: 'PA4/NSS', x: 10, y: 129, type: 'digital' },
        { id: 'PA5', name: 'PA5/SCK', x: 10, y: 142, type: 'digital' },
        { id: 'PA6', name: 'PA6/MISO', x: 10, y: 155, type: 'digital' },
        { id: 'PA7', name: 'PA7/MOSI', x: 10, y: 168, type: 'digital' },
        { id: 'PB0', name: 'PB0', x: 10, y: 181, type: 'digital' },
        { id: 'PB1', name: 'PB1', x: 10, y: 194, type: 'digital' },
        { id: 'PB10', name: 'PB10/SCL2', x: 10, y: 207, type: 'digital' },
        { id: 'PB11', name: 'PB11/SDA2', x: 10, y: 220, type: 'digital' },
        { id: 'NRST', name: 'NRST', x: 10, y: 233, type: 'passive' },
        { id: '3V3.1', name: '3.3V', x: 10, y: 246, type: 'power' },
        { id: 'GND.1', name: 'GND', x: 10, y: 259, type: 'ground' },
        { id: 'GND.2', name: 'GND', x: 10, y: 272, type: 'ground' },
        // Right Header
        { id: '5V', name: '5V', x: 90, y: 25, type: 'power' },
        { id: 'GND.3', name: 'GND', x: 90, y: 38, type: 'ground' },
        { id: '3V3.2', name: '3.3V', x: 90, y: 51, type: 'power' },
        { id: 'PB9', name: 'PB9/SDA1', x: 90, y: 64, type: 'digital' },
        { id: 'PB8', name: 'PB8/SCL1', x: 90, y: 77, type: 'digital' },
        { id: 'PB7', name: 'PB7', x: 90, y: 90, type: 'digital' },
        { id: 'PB6', name: 'PB6', x: 90, y: 103, type: 'digital' },
        { id: 'PB5', name: 'PB5', x: 90, y: 116, type: 'digital' },
        { id: 'PB4', name: 'PB4', x: 90, y: 129, type: 'digital' },
        { id: 'PB3', name: 'PB3', x: 90, y: 142, type: 'digital' },
        { id: 'PA15', name: 'PA15', x: 90, y: 155, type: 'digital' },
        { id: 'PA12', name: 'PA12/USB+', x: 90, y: 168, type: 'digital' },
        { id: 'PA11', name: 'PA11/USB-', x: 90, y: 168, type: 'digital' },
        { id: 'PA10', name: 'PA10/RX1', x: 90, y: 181, type: 'digital' },
        { id: 'PA9', name: 'PA9/TX1', x: 90, y: 194, type: 'digital' },
        { id: 'PA8', name: 'PA8', x: 90, y: 207, type: 'digital' },
        { id: 'PB15', name: 'PB15', x: 90, y: 220, type: 'digital' },
        { id: 'PB14', name: 'PB14', x: 90, y: 233, type: 'digital' },
        { id: 'PB13', name: 'PB13', x: 90, y: 246, type: 'digital' },
        { id: 'PB12', name: 'PB12', x: 90, y: 259, type: 'digital' },
      ];

    case 'wokwi-esp8266-nodemcu':
      return [
        // Left Pins
        { id: 'A0', name: 'A0(ADC)', x: 10, y: 35, type: 'analog' },
        { id: 'RSV.1', name: 'RSV', x: 10, y: 50, type: 'passive' },
        { id: 'RSV.2', name: 'RSV', x: 10, y: 65, type: 'passive' },
        { id: 'SD3', name: 'SD3', x: 10, y: 80, type: 'digital' },
        { id: 'SD2', name: 'SD2', x: 10, y: 95, type: 'digital' },
        { id: 'SD1', name: 'SD1', x: 10, y: 110, type: 'digital' },
        { id: 'CMD', name: 'CMD', x: 10, y: 125, type: 'digital' },
        { id: 'SD0', name: 'SD0', x: 10, y: 140, type: 'digital' },
        { id: 'CLK', name: 'CLK', x: 10, y: 155, type: 'digital' },
        { id: 'GND.1', name: 'GND', x: 10, y: 170, type: 'ground' },
        { id: '3V3.1', name: '3V3', x: 10, y: 185, type: 'power' },
        { id: 'EN', name: 'EN', x: 10, y: 200, type: 'passive' },
        { id: 'RST', name: 'RST', x: 10, y: 215, type: 'passive' },
        { id: 'GND.2', name: 'GND', x: 10, y: 230, type: 'ground' },
        { id: 'VIN', name: 'VIN/5V', x: 10, y: 245, type: 'power' },
        // Right Pins
        { id: 'D0', name: 'D0/16', x: 90, y: 35, type: 'digital' },
        { id: 'D1', name: 'D1/5(SCL)', x: 90, y: 50, type: 'digital' },
        { id: 'D2', name: 'D2/4(SDA)', x: 90, y: 65, type: 'digital' },
        { id: 'D3', name: 'D3/0', x: 90, y: 80, type: 'digital' },
        { id: 'D4', name: 'D4/2(LED)', x: 90, y: 95, type: 'digital' },
        { id: '3V3.2', name: '3V3', x: 90, y: 110, type: 'power' },
        { id: 'GND.3', name: 'GND', x: 90, y: 125, type: 'ground' },
        { id: 'D5', name: 'D5/14(SCK)', x: 90, y: 140, type: 'digital' },
        { id: 'D6', name: 'D6/12(MISO)', x: 90, y: 155, type: 'digital' },
        { id: 'D7', name: 'D7/13(MOSI)', x: 90, y: 170, type: 'digital' },
        { id: 'D8', name: 'D8/15(CS)', x: 90, y: 185, type: 'digital' },
        { id: 'RX', name: 'RX/3', x: 90, y: 200, type: 'digital' },
        { id: 'TX', name: 'TX/1', x: 90, y: 215, type: 'digital' },
        { id: 'GND.4', name: 'GND', x: 90, y: 230, type: 'ground' },
        { id: '3V3.3', name: '3V3', x: 90, y: 245, type: 'power' },
      ];

    case 'wokwi-pic16f877a':
      return [
        // Left Pins 1 to 20
        { id: 'MCLR', name: '1:MCLR/VPP', x: 10, y: 20, type: 'passive' },
        { id: 'RA0', name: '2:RA0/AN0', x: 10, y: 34, type: 'analog' },
        { id: 'RA1', name: '3:RA1/AN1', x: 10, y: 48, type: 'analog' },
        { id: 'RA2', name: '4:RA2/AN2', x: 10, y: 62, type: 'analog' },
        { id: 'RA3', name: '5:RA3/AN3', x: 10, y: 76, type: 'analog' },
        { id: 'RA4', name: '6:RA4/T0CKI', x: 10, y: 90, type: 'digital' },
        { id: 'RA5', name: '7:RA5/AN4', x: 10, y: 104, type: 'analog' },
        { id: 'RE0', name: '8:RE0/AN5', x: 10, y: 118, type: 'digital' },
        { id: 'RE1', name: '9:RE1/AN6', x: 10, y: 132, type: 'digital' },
        { id: 'RE2', name: '10:RE2/AN7', x: 10, y: 146, type: 'digital' },
        { id: 'VDD.1', name: '11:VDD(5V)', x: 10, y: 160, type: 'power' },
        { id: 'VSS.1', name: '12:VSS(GND)', x: 10, y: 174, type: 'ground' },
        { id: 'OSC1', name: '13:OSC1/CLKIN', x: 10, y: 188, type: 'passive' },
        { id: 'OSC2', name: '14:OSC2/CLKOUT', x: 10, y: 202, type: 'passive' },
        { id: 'RC0', name: '15:RC0/T1OSO', x: 10, y: 216, type: 'digital' },
        { id: 'RC1', name: '16:RC1/CCP2', x: 10, y: 230, type: 'digital' },
        { id: 'RC2', name: '17:RC2/CCP1', x: 10, y: 244, type: 'digital' },
        { id: 'RC3', name: '18:RC3/SCK/SCL', x: 10, y: 258, type: 'digital' },
        { id: 'RD0', name: '19:RD0/PSP0', x: 10, y: 272, type: 'digital' },
        { id: 'RD1', name: '20:RD1/PSP1', x: 10, y: 286, type: 'digital' },
        // Right Pins 21 to 40
        { id: 'RD2', name: '21:RD2/PSP2', x: 110, y: 286, type: 'digital' },
        { id: 'RD3', name: '22:RD3/PSP3', x: 110, y: 272, type: 'digital' },
        { id: 'RC4', name: '23:RC4/SDI/SDA', x: 110, y: 258, type: 'digital' },
        { id: 'RC5', name: '24:RC5/SDO', x: 110, y: 244, type: 'digital' },
        { id: 'RC6', name: '25:RC6/TX/CK', x: 110, y: 230, type: 'digital' },
        { id: 'RC7', name: '26:RC7/RX/DT', x: 110, y: 216, type: 'digital' },
        { id: 'RD4', name: '27:RD4/PSP4', x: 110, y: 202, type: 'digital' },
        { id: 'RD5', name: '28:RD5/PSP5', x: 110, y: 188, type: 'digital' },
        { id: 'RD6', name: '29:RD6/PSP6', x: 110, y: 174, type: 'digital' },
        { id: 'RD7', name: '30:RD7/PSP7', x: 110, y: 160, type: 'digital' },
        { id: 'VSS.2', name: '31:VSS(GND)', x: 110, y: 146, type: 'ground' },
        { id: 'VDD.2', name: '32:VDD(5V)', x: 110, y: 132, type: 'power' },
        { id: 'RB0', name: '33:RB0/INT', x: 110, y: 118, type: 'digital' },
        { id: 'RB1', name: '34:RB1', x: 110, y: 104, type: 'digital' },
        { id: 'RB2', name: '35:RB2', x: 110, y: 90, type: 'digital' },
        { id: 'RB3', name: '36:RB3/PGM', x: 110, y: 76, type: 'digital' },
        { id: 'RB4', name: '37:RB4', x: 110, y: 62, type: 'digital' },
        { id: 'RB5', name: '38:RB5', x: 110, y: 48, type: 'digital' },
        { id: 'RB6', name: '39:RB6/PGC', x: 110, y: 34, type: 'digital' },
        { id: 'RB7', name: '40:RB7/PGD', x: 110, y: 20, type: 'digital' },
      ];

    case 'wokwi-nrf52840-dk':
      return [
        { id: 'VDD', name: 'VDD(3.3V)', x: 12, y: 30, type: 'power' },
        { id: 'GND.1', name: 'GND', x: 12, y: 50, type: 'ground' },
        { id: 'P0.02', name: 'P0.02/A0', x: 12, y: 70, type: 'analog' },
        { id: 'P0.03', name: 'P0.03/A1', x: 12, y: 90, type: 'analog' },
        { id: 'P0.04', name: 'P0.04/A2', x: 12, y: 110, type: 'analog' },
        { id: 'P0.05', name: 'P0.05/A3', x: 12, y: 130, type: 'analog' },
        { id: 'P0.13', name: 'P0.13/LED1', x: 12, y: 150, type: 'digital' },
        { id: 'P0.14', name: 'P0.14/LED2', x: 12, y: 170, type: 'digital' },
        { id: 'P0.15', name: 'P0.15/LED3', x: 12, y: 190, type: 'digital' },
        { id: 'P0.16', name: 'P0.16/LED4', x: 12, y: 210, type: 'digital' },
        // Right Pins
        { id: 'P0.26', name: 'P0.26(SDA)', x: 88, y: 30, type: 'digital' },
        { id: 'P0.27', name: 'P0.27(SCL)', x: 88, y: 50, type: 'digital' },
        { id: 'P1.01', name: 'P1.01', x: 88, y: 70, type: 'digital' },
        { id: 'P1.02', name: 'P1.02', x: 88, y: 90, type: 'digital' },
        { id: 'P1.08', name: 'P1.08/TX', x: 88, y: 110, type: 'digital' },
        { id: 'P1.07', name: 'P1.07/RX', x: 88, y: 130, type: 'digital' },
        { id: 'GND.2', name: 'GND', x: 88, y: 150, type: 'ground' },
        { id: '5V', name: '5V(USB)', x: 88, y: 170, type: 'power' },
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

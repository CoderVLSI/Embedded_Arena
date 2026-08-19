export type PinMode = 'INPUT' | 'OUTPUT' | 'INPUT_PULLUP';

export interface PinState {
  mode: PinMode;
  value: number;       // 0 or 1 for digital, 0-255 for PWM, 0-1023 for analog
  voltage: number;     // 0V to 5.0V / 3.3V
  frequency?: number;  // for tone / PWM
}

export interface SimulationState {
  isRunning: boolean;
  isPaused: boolean;
  timeMs: number;
  cpuSpeedHz: number;
  fps: number;
}

export interface SerialLogMessage {
  id: string;
  type: 'tx' | 'rx' | 'system' | 'error';
  text: string;
  timestamp: number;
}

export interface PlotterDataPoint {
  time: number;
  channels: Record<string, number>;
}

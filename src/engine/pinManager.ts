import { CircuitComponent, WireConnection } from '../types/circuit';
import { PinState } from '../types/simulation';

export interface PinNode {
  componentId: string;
  pinId: string;
  fullId: string; // e.g. "esp:2" or "led1:A"
}

export class PinManager {
  private pinStates: Map<string, PinState> = new Map();
  private connections: WireConnection[] = [];
  private components: CircuitComponent[] = [];
  private listeners: Set<(states: Map<string, PinState>) => void> = new Set();

  public setComponentsAndWires(components: CircuitComponent[], connections: WireConnection[]) {
    this.components = components;
    this.connections = connections;
  }

  public getPinState(fullPinId: string): PinState {
    return this.pinStates.get(fullPinId) || { mode: 'INPUT', value: 0, voltage: 0 };
  }

  public getAllPinStates(): Map<string, PinState> {
    return new Map(this.pinStates);
  }

  public subscribe(cb: (states: Map<string, PinState>) => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify() {
    const copy = new Map(this.pinStates);
    this.listeners.forEach((cb) => cb(copy));
  }

  public setPinState(fullPinId: string, state: Partial<PinState>) {
    const current = this.getPinState(fullPinId);
    const updated: PinState = {
      mode: state.mode ?? current.mode,
      value: state.value ?? current.value,
      voltage: state.voltage ?? (state.value ? 5.0 : 0.0),
      frequency: state.frequency ?? current.frequency,
    };
    this.pinStates.set(fullPinId, updated);
    this.propagateSignals();
    this.notify();
  }

  public reset() {
    this.pinStates.clear();
    this.notify();
  }

  /**
   * Find all connected pins across wires and passive elements (like resistors, switches)
   */
  public getConnectedPins(startPin: string): string[] {
    const visited = new Set<string>();
    const queue = [startPin];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;
      visited.add(current);

      // 1. Direct wire connections
      for (const wire of this.connections) {
        if (wire.from === current && !visited.has(wire.to)) {
          queue.push(wire.to);
        } else if (wire.to === current && !visited.has(wire.from)) {
          queue.push(wire.from);
        }
      }

      // 2. Resistor internal connection (pin 1 connects to pin 2)
      const [compId, pinName] = current.split(':');
      const comp = this.components.find((c) => c.id === compId);
      if (comp && comp.type === 'wokwi-resistor') {
        const otherPin = pinName === '1' ? `${compId}:2` : `${compId}:1`;
        if (!visited.has(otherPin)) queue.push(otherPin);
      }

      // 3. Slide Switch internal connection if closed
      if (comp && comp.type === 'wokwi-slide-switch') {
        const state = comp.attrs?.state ?? 0;
        if (pinName === 'COM') {
          const target = state === 0 ? `${compId}:1` : `${compId}:2`;
          if (!visited.has(target)) queue.push(target);
        } else if ((pinName === '1' && state === 0) || (pinName === '2' && state === 1)) {
          const target = `${compId}:COM`;
          if (!visited.has(target)) queue.push(target);
        }
      }

      // 4. Pushbutton internal connection (1.l -> 2.l and 1.r -> 2.r when pressed)
      if (comp && comp.type === 'wokwi-pushbutton') {
        const isPressed = !!comp.attrs?.state;
        if (isPressed) {
          if (pinName === '1.l' && !visited.has(`${compId}:2.l`)) queue.push(`${compId}:2.l`);
          if (pinName === '2.l' && !visited.has(`${compId}:1.l`)) queue.push(`${compId}:1.l`);
          if (pinName === '1.r' && !visited.has(`${compId}:2.r`)) queue.push(`${compId}:2.r`);
          if (pinName === '2.r' && !visited.has(`${compId}:1.r`)) queue.push(`${compId}:1.r`);
        }
      }
    }

    return Array.from(visited);
  }

  private propagateSignals() {
    // Collect all microcontroller active output pins
    for (const [pinId, state] of this.pinStates.entries()) {
      if (state.mode === 'OUTPUT') {
        const connected = this.getConnectedPins(pinId);
        for (const connPin of connected) {
          if (connPin !== pinId) {
            const current = this.pinStates.get(connPin);
            if (!current || current.mode !== 'OUTPUT') {
              this.pinStates.set(connPin, {
                mode: 'INPUT',
                value: state.value,
                voltage: state.voltage,
                frequency: state.frequency,
              });
            }
          }
        }
      }
    }
  }

  /**
   * Helper to check if a component is powered (e.g. LED has Anode HIGH and Cathode connected to GND)
   */
  public isLedLit(ledId: string): { lit: boolean; brightness: number } {
    const anodeConnected = this.getConnectedPins(`${ledId}:A`);
    const cathodeConnected = this.getConnectedPins(`${ledId}:C`);

    let isCathodeGnd = cathodeConnected.some((p) =>
      p.endsWith(':GND') || p.endsWith(':GND.1') || p.endsWith(':GND.2') || p.endsWith(':GND.3') || p.endsWith(':GND.4')
    );
    let isAnodeGnd = anodeConnected.some((p) =>
      p.endsWith(':GND') || p.endsWith(':GND.1') || p.endsWith(':GND.2') || p.endsWith(':GND.3') || p.endsWith(':GND.4')
    );

    // Check if Anode receives HIGH from any MCU pin
    let anodeVal = 0;
    for (const p of anodeConnected) {
      const st = this.pinStates.get(p);
      if (st && st.value > 0) {
        anodeVal = Math.max(anodeVal, st.value);
      }
    }

    // Direct 5V / 3V3 power check
    const isAnodeVcc = anodeConnected.some((p) => p.endsWith(':5V') || p.endsWith(':3V3') || p.endsWith(':VCC'));
    if (isAnodeVcc) anodeVal = 255;

    if (isCathodeGnd && anodeVal > 0) {
      const brightness = anodeVal > 1 ? anodeVal / 255 : 1.0;
      return { lit: true, brightness };
    }

    return { lit: false, brightness: 0 };
  }

  /**
   * Helper to get analog reading from a pin (e.g. connected to potentiometer wiper or sensor)
   */
  public getAnalogInput(mcuPinId: string): number {
    const connected = this.getConnectedPins(mcuPinId);

    // Look for connected potentiometer
    for (const p of connected) {
      const [compId, pinName] = p.split(':');
      const comp = this.components.find((c) => c.id === compId);
      if (comp && comp.type === 'wokwi-potentiometer') {
        if (pinName === 'SIG' || pinName === 'WIPER' || pinName === '2') {
          // Potentiometer value is 0 to 1023
          const val = comp.attrs?.value ?? 512;
          return Number(val);
        }
      }
    }

    // Look for direct digital/analog state
    const st = this.pinStates.get(mcuPinId);
    if (st) {
      return st.value > 1 ? st.value * 4 : (st.value === 1 ? 1023 : 0);
    }

    return 0;
  }

  /**
   * Helper to get digital reading from a pin (e.g. connected to pushbutton)
   */
  public getDigitalInput(mcuPinId: string): number {
    const state = this.getPinState(mcuPinId);
    const connected = this.getConnectedPins(mcuPinId);

    // Check if connected to GND via pressed button
    const isConnectedToGnd = connected.some((p) =>
      p.endsWith(':GND') || p.endsWith(':GND.1') || p.endsWith(':GND.2') || p.endsWith(':GND.3')
    );

    const isConnectedToVcc = connected.some((p) =>
      p.endsWith(':5V') || p.endsWith(':3V3') || p.endsWith(':VCC')
    );

    if (state.mode === 'INPUT_PULLUP') {
      return isConnectedToGnd ? 0 : 1;
    }

    if (isConnectedToVcc) return 1;
    if (isConnectedToGnd) return 0;

    return state.value ? 1 : 0;
  }
}

import { PinManager } from './pinManager';
import { i2cBus } from './i2cBus';
import { audioSynth } from '../utils/audioSynthesizer';
import { SerialLogMessage, SimulationState } from '../types/simulation';
import { CircuitComponent } from '../types/circuit';

export class ArduinoRuntime {
  private pinManager: PinManager;
  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private shouldStop: boolean = false;
  private simTimeMs: number = 0;
  private serialRxQueue: string[] = [];
  private onSerialLog: (msg: SerialLogMessage) => void = () => {};
  private onStateChange: (state: SimulationState) => void = () => {};
  private onComponentUpdate: (id: string, attrs: Record<string, any>) => void = () => {};
  private components: CircuitComponent[] = [];

  constructor(pinManager: PinManager) {
    this.pinManager = pinManager;
  }

  public setCallbacks(
    onSerialLog: (msg: SerialLogMessage) => void,
    onStateChange: (state: SimulationState) => void,
    onComponentUpdate: (id: string, attrs: Record<string, any>) => void
  ) {
    this.onSerialLog = onSerialLog;
    this.onStateChange = onStateChange;
    this.onComponentUpdate = onComponentUpdate;
  }

  public setComponents(components: CircuitComponent[]) {
    this.components = components;
  }

  public sendSerialInput(text: string) {
    for (let i = 0; i < text.length; i++) {
      this.serialRxQueue.push(text[i]);
    }
  }

  private notifyState(fps: number = 60) {
    this.onStateChange({
      isRunning: this.isRunning,
      isPaused: this.isPaused,
      timeMs: this.simTimeMs,
      cpuSpeedHz: 16000000,
      fps,
    });
  }

  private logSerial(type: 'tx' | 'rx' | 'system' | 'error', text: string) {
    this.onSerialLog({
      id: Math.random().toString(36).substring(2, 9),
      type,
      text,
      timestamp: this.simTimeMs,
    });
  }

  public pause() {
    this.isPaused = !this.isPaused;
    this.notifyState();
  }

  public stop() {
    this.shouldStop = true;
    this.isRunning = false;
    this.isPaused = false;
    audioSynth.stopAll();
    this.pinManager.reset();
    this.notifyState();
  }

  /**
   * Preprocesses Arduino C++ code and turns it into executable modern async JavaScript
   */
  private preprocessCode(cppCode: string): string {
    let js = cppCode;

    // 1. Remove comments
    js = js.replace(/\/\*[\s\S]*?\*\//g, '');
    js = js.replace(/\/\/.*/g, '');

    // 2. Parse #define macros (e.g. #define LED 13 -> const LED = 13;)
    js = js.replace(/#define\s+([A-Za-z0-9_]+)\s+([^\r\n]+)/g, 'const $1 = $2;');

    // 3. Remove #include statements
    js = js.replace(/#include\s*[<"][^>"]+[>"]/g, '');

    // 4. Replace variable types (int, float, double, bool, boolean, char, String, uint8_t, unsigned long, long, byte) with let/const
    const typeRegex = /\b(unsigned\s+long|unsigned\s+int|long\s+long|unsigned\s+char|int|float|double|bool|boolean|char|String|uint8_t|uint16_t|uint32_t|int8_t|int16_t|int32_t|byte|size_t)\s+([A-Za-z0-9_]+)\s*(\[.*?\])?/g;
    js = js.replace(typeRegex, (_match, _type, varName, isArray) => {
      if (isArray) {
        return `let ${varName}`;
      }
      return `let ${varName}`;
    });

    // 5. Replace C++ function definitions (e.g. void setup() -> async function setup())
    js = js.replace(/\b(void|int|float|double|bool|String)\s+([A-Za-z0-9_]+)\s*\(([^)]*)\)\s*\{/g, 'async function $2($3) {');

    // 6. Replace BLYNK_WRITE(vPin) -> async function BLYNK_WRITE_vPin(param)
    js = js.replace(/BLYNK_WRITE\s*\(\s*([A-Za-z0-9_]+)\s*\)\s*\{/g, 'async function BLYNK_WRITE_$1(param) {');

    // 7. Inject delays with await
    js = js.replace(/\bdelay\s*\(/g, 'await delay(');
    js = js.replace(/\bdelayMicroseconds\s*\(/g, 'await delayMicroseconds(');

    // 8. Replace C++ object instantiations like LiquidCrystal_I2C lcd(0x27, 16, 2); -> const lcd = new LiquidCrystal_I2C(0x27, 16, 2);
    js = js.replace(/\bLiquidCrystal_I2C\s+([A-Za-z0-9_]+)\s*\(([^)]*)\);/g, 'const $1 = new LiquidCrystal_I2C($2);');
    js = js.replace(/\bDHT\s+([A-Za-z0-9_]+)\s*\(([^)]*)\);/g, 'const $1 = new DHT($2);');
    js = js.replace(/\bServo\s+([A-Za-z0-9_]+);/g, 'const $1 = new Servo();');

    return js;
  }

  public async start(cppCode: string) {
    this.stop();
    this.shouldStop = false;
    this.isRunning = true;
    this.isPaused = false;
    this.simTimeMs = 0;
    this.serialRxQueue = [];
    this.notifyState();

    this.logSerial('system', '--- Simulation Started ---');

    const mcu = this.components.find((c) =>
      c.type === 'wokwi-arduino-uno' ||
      c.type === 'wokwi-esp32-devkit-v1' ||
      c.type === 'wokwi-arduino-nano' ||
      c.type === 'wokwi-arduino-mega'
    );
    const mcuPrefix = mcu ? mcu.id : (this.components.some(c => c.type === 'wokwi-esp32-devkit-v1') ? 'esp' : 'uno');

    // Helper functions for Arduino environment
    const HIGH = 1;
    const LOW = 0;
    const INPUT = 'INPUT';
    const OUTPUT = 'OUTPUT';
    const INPUT_PULLUP = 'INPUT_PULLUP';
    const LED_BUILTIN = mcuPrefix === 'esp' ? 2 : 13;
    const DHT11 = 'DHT11';
    const DHT22 = 'DHT22';

    const pinMode = (pin: number | string, mode: string) => {
      const pinKey = `${mcuPrefix}:${pin}`;
      this.pinManager.setPinState(pinKey, { mode: mode as any });
    };

    const digitalWrite = (pin: number | string, value: number) => {
      const pinKey = `${mcuPrefix}:${pin}`;
      const val = value ? 1 : 0;
      this.pinManager.setPinState(pinKey, {
        mode: 'OUTPUT',
        value: val,
        voltage: val ? (mcuPrefix === 'esp' ? 3.3 : 5.0) : 0.0,
      });

      // If connected to Relay, update relay state
      for (const comp of this.components) {
        if (comp.type === 'wokwi-relay-module') {
          const connected = this.pinManager.getConnectedPins(`${comp.id}:IN`);
          if (connected.includes(pinKey)) {
            this.onComponentUpdate(comp.id, { state: val === 1 });
          }
        }
      }
    };

    const digitalRead = (pin: number | string): number => {
      const pinKey = `${mcuPrefix}:${pin}`;
      return this.pinManager.getDigitalInput(pinKey);
    };

    const analogWrite = (pin: number | string, value: number) => {
      const pinKey = `${mcuPrefix}:${pin}`;
      const val = Math.max(0, Math.min(255, Math.round(value)));
      this.pinManager.setPinState(pinKey, {
        mode: 'OUTPUT',
        value: val,
        voltage: (val / 255) * (mcuPrefix === 'esp' ? 3.3 : 5.0),
      });
    };

    const analogRead = (pin: number | string): number => {
      let pinName = String(pin);
      if (!pinName.startsWith('A') && !isNaN(Number(pinName))) {
        pinName = `A${pinName}`;
      }
      const pinKey = `${mcuPrefix}:${pinName}`;
      return this.pinManager.getAnalogInput(pinKey);
    };

    const delay = async (ms: number) => {
      const step = 10;
      let elapsed = 0;
      while (elapsed < ms && !this.shouldStop) {
        while (this.isPaused && !this.shouldStop) {
          await new Promise((r) => setTimeout(r, 50));
        }
        const delta = Math.min(step, ms - elapsed);
        await new Promise((r) => setTimeout(r, delta));
        elapsed += delta;
        this.simTimeMs += delta;
        this.notifyState();
      }
    };

    const delayMicroseconds = async (us: number) => {
      this.simTimeMs += us / 1000;
    };

    const millis = () => Math.floor(this.simTimeMs);
    const micros = () => Math.floor(this.simTimeMs * 1000);

    const tone = (pin: number | string, freq: number, duration?: number) => {
      const pinKey = `${mcuPrefix}:${pin}`;
      this.pinManager.setPinState(pinKey, {
        mode: 'OUTPUT',
        value: 1,
        frequency: freq,
      });

      // Find buzzer
      const buzzer = this.components.find((c) => c.type === 'wokwi-buzzer');
      if (buzzer) {
        audioSynth.playTone(buzzer.id, freq, duration);
      } else {
        audioSynth.playTone(pinKey, freq, duration);
      }
    };

    const noTone = (pin: number | string) => {
      const pinKey = `${mcuPrefix}:${pin}`;
      this.pinManager.setPinState(pinKey, { frequency: 0 });
      const buzzer = this.components.find((c) => c.type === 'wokwi-buzzer');
      if (buzzer) {
        audioSynth.stopTone(buzzer.id);
      } else {
        audioSynth.stopTone(pinKey);
      }
    };

    const map = (x: number, in_min: number, in_max: number, out_min: number, out_max: number) => {
      return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
    };

    const constrain = (amt: number, low: number, high: number) => {
      return Math.max(low, Math.min(high, amt));
    };

    const random = (minOrMax: number, max?: number) => {
      if (max !== undefined) {
        return Math.floor(Math.random() * (max - minOrMax)) + minOrMax;
      }
      return Math.floor(Math.random() * minOrMax);
    };

    const pulseIn = async (_pin: number | string, _val: number) => {
      // Find HC-SR04 ultrasonic distance
      const sonar = this.components.find((c) => c.type === 'wokwi-hc-sr04');
      if (sonar) {
        const distCm = sonar.attrs?.distance ?? 30;
        // distance = (time * 0.034) / 2 => time = (dist * 2) / 0.034 = dist * 58.82
        return Math.round(distCm * 58.82);
      }
      return 1000;
    };

    const Serial = {
      begin: (_baud: number) => {
        this.logSerial('system', `Serial initialized at ${_baud} baud.`);
      },
      print: (val: any) => {
        this.logSerial('tx', String(val));
      },
      println: (val: any = '') => {
        this.logSerial('tx', String(val) + '\n');
      },
      write: (val: any) => {
        this.logSerial('tx', String.fromCharCode(Number(val)));
      },
      available: () => this.serialRxQueue.length,
      read: () => {
        const ch = this.serialRxQueue.shift();
        return ch ? ch.charCodeAt(0) : -1;
      },
      readString: () => {
        const str = this.serialRxQueue.join('');
        this.serialRxQueue = [];
        return str;
      },
    };

    // Simulated LiquidCrystal_I2C
    const LiquidCrystal_I2C = class {
      private lcdId: string = 'lcd';
      constructor(_addr: number, cols: number = 16, rows: number = 2) {
        const lcdComp = thisRuntime.components.find((c) => c.type === 'wokwi-lcd1602');
        if (lcdComp) this.lcdId = lcdComp.id;
        i2cBus.lcdInit(this.lcdId, cols, rows);
      }
      init() {
        i2cBus.lcdInit(this.lcdId);
      }
      begin() {
        i2cBus.lcdInit(this.lcdId);
      }
      backlight() {
        i2cBus.lcdSetBacklight(this.lcdId, true);
      }
      noBacklight() {
        i2cBus.lcdSetBacklight(this.lcdId, false);
      }
      clear() {
        i2cBus.lcdClear(this.lcdId);
      }
      setCursor(col: number, row: number) {
        i2cBus.lcdSetCursor(this.lcdId, col, row);
      }
      print(str: any) {
        i2cBus.lcdPrint(this.lcdId, String(str));
      }
    };

    // Simulated DHT sensor class
    const thisRuntime = this;
    const DHT = class {
      private pin: number | string;
      constructor(pin: number | string, _type?: string) {
        this.pin = pin;
      }
      begin() {}
      readTemperature() {
        const dhtComp = thisRuntime.components.find((c) => c.type === 'wokwi-dht22');
        if (dhtComp && dhtComp.attrs?.temperature !== undefined) {
          return Number(dhtComp.attrs.temperature);
        }
        return 24.5;
      }
      readHumidity() {
        const dhtComp = thisRuntime.components.find((c) => c.type === 'wokwi-dht22');
        if (dhtComp && dhtComp.attrs?.humidity !== undefined) {
          return Number(dhtComp.attrs.humidity);
        }
        return 48.0;
      }
    };

    // Simulated Servo class
    const Servo = class {
      private attachedPin: number | string = -1;
      attach(pin: number | string) {
        this.attachedPin = pin;
      }
      write(angle: number) {
        const bounded = Math.max(0, Math.min(180, Math.round(angle)));
        const servo = thisRuntime.components.find((c) => c.type === 'wokwi-servo');
        if (servo) {
          thisRuntime.onComponentUpdate(servo.id, { angle: bounded });
        }
      }
      read() {
        const servo = thisRuntime.components.find((c) => c.type === 'wokwi-servo');
        return servo?.attrs?.angle ?? 90;
      }
    };

    // Simulated WiFi & Blynk
    const WiFi = {
      begin: (ssid: string, _pass?: string) => {
        Serial.println(`Connecting to WiFi: ${ssid}...`);
        setTimeout(() => Serial.println(`Connected! IP address: 192.168.1.104`), 500);
      },
      status: () => 3, // WL_CONNECTED
      localIP: () => '192.168.1.104',
    };

    const Blynk = {
      begin: (_auth: string, _ssid: string, _pass: string) => {
        Serial.println('Blynk connected to server!');
      },
      run: () => {},
      virtualWrite: (pin: number, val: any) => {
        Serial.println(`[Blynk] VirtualWrite V${pin}: ${val}`);
      },
      syncAll: () => {},
    };

    try {
      const processedJs = this.preprocessCode(cppCode);

      // Create runner function with sandboxed environment
      const runnerCode = `
        return async function(__env) {
          const {
            HIGH, LOW, INPUT, OUTPUT, INPUT_PULLUP, LED_BUILTIN, DHT11, DHT22,
            pinMode, digitalWrite, digitalRead, analogWrite, analogRead,
            delay, delayMicroseconds, millis, micros, tone, noTone,
            map, constrain, random, pulseIn, Serial,
            LiquidCrystal_I2C, DHT, Servo, WiFi, Blynk
          } = __env;

          ${processedJs}

          // Execute setup
          if (typeof setup === 'function') {
            await setup();
          }

          // Execution loop
          while (!__env.isCancelled()) {
            while (__env.isPaused() && !__env.isCancelled()) {
              await delay(50);
            }
            if (__env.isCancelled()) break;

            if (typeof loop === 'function') {
              await loop();
            }
            // Yield to event loop to avoid locking the UI
            await delay(1);
          }
        };
      `;

      const fnFactory = new Function(runnerCode);
      const runner = fnFactory();

      await runner({
        HIGH, LOW, INPUT, OUTPUT, INPUT_PULLUP, LED_BUILTIN, DHT11, DHT22,
        pinMode, digitalWrite, digitalRead, analogWrite, analogRead,
        delay, delayMicroseconds, millis, micros, tone, noTone,
        map, constrain, random, pulseIn, Serial,
        LiquidCrystal_I2C, DHT, Servo, WiFi, Blynk,
        isCancelled: () => this.shouldStop,
        isPaused: () => this.isPaused,
      });

    } catch (err: any) {
      if (!this.shouldStop) {
        console.error('Simulation error:', err);
        this.logSerial('error', `Runtime Error: ${err.message || err}`);
      }
    } finally {
      if (!this.shouldStop) {
        this.stop();
      }
    }
  }
}

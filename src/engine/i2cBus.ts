export interface LcdState {
  rows: number;
  cols: number;
  lines: string[];
  cursorCol: number;
  cursorRow: number;
  backlight: boolean;
}

export interface OledState {
  width: number;
  height: number;
  lines: { text: string; size: number; x: number; y: number; color: string }[];
  cursorX: number;
  cursorY: number;
  textSize: number;
  textColor: string;
}

export class I2CBus {
  private lcdMap: Map<string, LcdState> = new Map();
  private oledMap: Map<string, OledState> = new Map();
  private listeners: Set<() => void> = new Set();

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }

  public getLcdState(id: string = 'lcd'): LcdState {
    if (!this.lcdMap.has(id)) {
      this.lcdMap.set(id, {
        rows: 2,
        cols: 16,
        lines: ['                ', '                '],
        cursorCol: 0,
        cursorRow: 0,
        backlight: true,
      });
    }
    return this.lcdMap.get(id)!;
  }

  public lcdInit(id: string, cols: number = 16, rows: number = 2) {
    const lines = Array(rows).fill(' '.repeat(cols));
    this.lcdMap.set(id, {
      rows,
      cols,
      lines,
      cursorCol: 0,
      cursorRow: 0,
      backlight: true,
    });
    this.notify();
  }

  public lcdClear(id: string) {
    const lcd = this.getLcdState(id);
    lcd.lines = Array(lcd.rows).fill(' '.repeat(lcd.cols));
    lcd.cursorCol = 0;
    lcd.cursorRow = 0;
    this.notify();
  }

  public lcdSetCursor(id: string, col: number, row: number) {
    const lcd = this.getLcdState(id);
    lcd.cursorCol = Math.max(0, Math.min(lcd.cols - 1, col));
    lcd.cursorRow = Math.max(0, Math.min(lcd.rows - 1, row));
    this.notify();
  }

  public lcdPrint(id: string, text: string) {
    const lcd = this.getLcdState(id);
    const r = lcd.cursorRow;
    let line = lcd.lines[r] || ' '.repeat(lcd.cols);

    const str = String(text);
    for (let i = 0; i < str.length; i++) {
      const c = str[i];
      if (c === '\n') {
        lcd.cursorRow = (lcd.cursorRow + 1) % lcd.rows;
        lcd.cursorCol = 0;
        line = lcd.lines[lcd.cursorRow] || ' '.repeat(lcd.cols);
        continue;
      }
      const pos = lcd.cursorCol;
      if (pos < lcd.cols) {
        line = line.substring(0, pos) + c + line.substring(pos + 1);
        lcd.cursorCol++;
      }
    }
    lcd.lines[r] = line.padEnd(lcd.cols, ' ').substring(0, lcd.cols);
    this.notify();
  }

  public lcdSetBacklight(id: string, on: boolean) {
    const lcd = this.getLcdState(id);
    lcd.backlight = on;
    this.notify();
  }

  // OLED Methods
  public getOledState(id: string = 'oled'): OledState {
    if (!this.oledMap.has(id)) {
      this.oledMap.set(id, {
        width: 128,
        height: 64,
        lines: [],
        cursorX: 0,
        cursorY: 0,
        textSize: 1,
        textColor: '#ffffff',
      });
    }
    return this.oledMap.get(id)!;
  }

  public oledClear(id: string) {
    const oled = this.getOledState(id);
    oled.lines = [];
    oled.cursorX = 0;
    oled.cursorY = 0;
    this.notify();
  }

  public oledSetCursor(id: string, x: number, y: number) {
    const oled = this.getOledState(id);
    oled.cursorX = x;
    oled.cursorY = y;
  }

  public oledSetTextSize(id: string, size: number) {
    const oled = this.getOledState(id);
    oled.textSize = size;
  }

  public oledPrint(id: string, text: string) {
    const oled = this.getOledState(id);
    oled.lines.push({
      text: String(text),
      size: oled.textSize,
      x: oled.cursorX,
      y: oled.cursorY,
      color: oled.textColor,
    });
    oled.cursorY += oled.textSize * 10;
    this.notify();
  }

  public resetAll() {
    this.lcdMap.clear();
    this.oledMap.clear();
    this.notify();
  }
}

export const i2cBus = new I2CBus();

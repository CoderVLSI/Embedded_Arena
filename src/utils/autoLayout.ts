import { CircuitComponent, WireConnection } from '../types/circuit';

export interface LayoutOptions {
  padding?: number;
  gridSnap?: number;
  canvasWidth?: number;
  canvasHeight?: number;
}

/**
 * Calculates optimal positions for components to avoid overlaps and create a clean,
 * readable schematic layout.
 */
export function autoLayoutCircuit(
  components: CircuitComponent[],
  wires: WireConnection[],
  options: LayoutOptions = {}
): CircuitComponent[] {
  if (components.length === 0) return [];

  const padding = options.padding || 40;
  const startX = 80;
  const startY = 100;

  // Separate MCUs / Boards from Peripherals (sensors, actuators, inputs, passives)
  const mcus = components.filter(c => 
    c.type.includes('arduino') || 
    c.type.includes('esp32') || 
    c.type.includes('pico') || 
    c.type.includes('stm32') || 
    c.type.includes('nodemcu') || 
    c.type.includes('pic') || 
    c.type.includes('nrf') ||
    c.type.includes('xiao')
  );

  const peripherals = components.filter(c => !mcus.includes(c));

  const updated: CircuitComponent[] = [];

  // 1. Place MCUs on the left column
  let currentY = startY;
  mcus.forEach((mcu) => {
    updated.push({
      ...mcu,
      left: startX,
      top: currentY,
    });
    currentY += 310 + padding;
  });

  // 2. Place Peripherals in a neat 2-column grid to the right of the MCU
  const mcuWidth = 140;
  const peripheralStartX = startX + mcuWidth + 160;
  let col = 0;
  let rowY = startY;
  const colWidth = 180;
  const rowHeight = 130;

  peripherals.forEach((peri, idx) => {
    const pLeft = peripheralStartX + col * colWidth;
    const pTop = rowY;

    updated.push({
      ...peri,
      left: pLeft,
      top: pTop,
    });

    col++;
    if (col >= 2) {
      col = 0;
      rowY += rowHeight + padding;
    }
  });

  return updated;
}

/**
 * Finds the next optimal non-overlapping coordinate when Auto-Place Mode is active
 */
export function findNextAutoPlaceCoordinate(existingComponents: CircuitComponent[]): { left: number; top: number } {
  if (existingComponents.length === 0) {
    return { left: 120, top: 120 };
  }

  const startX = 360;
  const startY = 100;
  const stepX = 180;
  const stepY = 140;

  let col = 0;
  let row = 0;

  for (let i = 0; i < 50; i++) {
    const candidateLeft = startX + col * stepX;
    const candidateTop = startY + row * stepY;

    const hasOverlap = existingComponents.some(c => 
      Math.abs(c.left - candidateLeft) < 120 && Math.abs(c.top - candidateTop) < 100
    );

    if (!hasOverlap) {
      return { left: candidateLeft, top: candidateTop };
    }

    col++;
    if (col >= 2) {
      col = 0;
      row++;
    }
  }

  return {
    left: 300 + Math.random() * 150,
    top: 150 + Math.random() * 150,
  };
}

export interface Point {
  x: number;
  y: number;
}

export function computeOrthogonalPath(start: Point, end: Point): string {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  // Simple clean step routing
  if (Math.abs(dx) > Math.abs(dy)) {
    const midX = start.x + dx / 2;
    return `M ${start.x} ${start.y} L ${midX} ${start.y} L ${midX} ${end.y} L ${end.x} ${end.y}`;
  } else {
    const midY = start.y + dy / 2;
    return `M ${start.x} ${start.y} L ${start.x} ${midY} L ${end.x} ${midY} L ${end.x} ${end.y}`;
  }
}

export function computeSmoothPath(start: Point, end: Point): string {
  const dx = Math.abs(end.x - start.x);
  const dy = Math.abs(end.y - start.y);
  const curvature = Math.max(dx, dy) * 0.5;

  return `M ${start.x} ${start.y} C ${start.x} ${start.y + curvature}, ${end.x} ${end.y - curvature}, ${end.x} ${end.y}`;
}

export const WIRE_COLORS = [
  { name: 'Green', hex: '#22c55e', bg: 'bg-green-500' },
  { name: 'Red', hex: '#ef4444', bg: 'bg-red-500' },
  { name: 'Black', hex: '#18181b', bg: 'bg-zinc-800' },
  { name: 'Blue', hex: '#3b82f6', bg: 'bg-blue-500' },
  { name: 'Yellow', hex: '#eab308', bg: 'bg-yellow-500' },
  { name: 'Orange', hex: '#f97316', bg: 'bg-orange-500' },
  { name: 'Purple', hex: '#a855f7', bg: 'bg-purple-500' },
  { name: 'White', hex: '#f8fafc', bg: 'bg-slate-100' },
  { name: 'Cyan', hex: '#06b6d4', bg: 'bg-cyan-500' },
];

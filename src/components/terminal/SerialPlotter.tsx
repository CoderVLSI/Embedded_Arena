import React, { useRef, useEffect } from 'react';
import { SerialLogMessage } from '../../types/simulation';

interface Props {
  logs: SerialLogMessage[];
}

export const SerialPlotter: React.FC<Props> = ({ logs }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Parse numeric logs
    const points: { time: number; values: number[] }[] = [];

    for (const log of logs) {
      if (log.type === 'tx') {
        const matches = log.text.match(/[-+]?[0-9]*\.?[0-9]+/g);
        if (matches && matches.length > 0) {
          const numbers = matches.map(Number).filter((n) => !isNaN(n));
          if (numbers.length > 0) {
            points.push({ time: log.timestamp, values: numbers });
          }
        }
      }
    }

    // Keep last 100 points
    const recent = points.slice(-100);

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Draw background grid
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    if (recent.length === 0) {
      ctx.fillStyle = '#71717a';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No numerical serial data yet (e.g. Serial.println(temp))...', width / 2, height / 2);
      return;
    }

    // Determine min and max value
    let minVal = Infinity;
    let maxVal = -Infinity;
    recent.forEach((p) => {
      p.values.forEach((v) => {
        if (v < minVal) minVal = v;
        if (v > maxVal) maxVal = v;
      });
    });

    if (minVal === maxVal) {
      minVal -= 10;
      maxVal += 10;
    }

    const colors = ['#38bdf8', '#ef4444', '#22c55e', '#eab308', '#a855f7'];

    // Draw each series
    const numChannels = Math.max(...recent.map((r) => r.values.length));

    for (let c = 0; c < numChannels; c++) {
      ctx.beginPath();
      ctx.strokeStyle = colors[c % colors.length];
      ctx.lineWidth = 2;

      recent.forEach((p, idx) => {
        const val = p.values[c] ?? 0;
        const x = (idx / (recent.length - 1 || 1)) * (width - 60) + 10;
        const y = height - 20 - ((val - minVal) / (maxVal - minVal)) * (height - 40);

        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    // Min and max labels
    ctx.fillStyle = '#a1a1aa';
    ctx.font = '10px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`${maxVal.toFixed(1)}`, width - 5, 20);
    ctx.fillText(`${minVal.toFixed(1)}`, width - 5, height - 10);
  }, [logs]);

  return (
    <div className="w-full h-full bg-[#18181b] flex flex-col p-2">
      <canvas ref={canvasRef} width={800} height={200} className="w-full h-full rounded" />
    </div>
  );
};

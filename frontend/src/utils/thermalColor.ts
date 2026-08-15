export interface ThermalColor {
  hex: string;
  glow: string;
  pulseClass: string;
  statusLabel: string;
}

export function getThermalColor(score: number): ThermalColor {
  const clamped = Math.max(0, Math.min(100, score));

  // Keyframes for continuous thermal colormap
  const stops = [
    { pos: 0, r: 30, g: 58, b: 138, hex: '#1E3A8A' },    // Deep Blue
    { pos: 20, r: 8, g: 145, b: 178, hex: '#0891B2' },   // Thermal Cyan
    { pos: 40, r: 34, g: 197, b: 94, hex: '#22C55E' },   // Green
    { pos: 60, r: 234, g: 179, b: 8, hex: '#EAB308' },   // Yellow
    { pos: 80, r: 249, g: 115, b: 22, hex: '#F97316' },  // Orange
    { pos: 100, r: 239, g: 68, b: 68, hex: '#EF4444' }   // Hot Red
  ];

  let lower = stops[0];
  let upper = stops[stops.length - 1];

  for (let i = 0; i < stops.length - 1; i++) {
    if (clamped >= stops[i].pos && clamped <= stops[i + 1].pos) {
      lower = stops[i];
      upper = stops[i + 1];
      break;
    }
  }

  const range = upper.pos - lower.pos || 1;
  const factor = (clamped - lower.pos) / range;

  const r = Math.round(lower.r + factor * (upper.r - lower.r));
  const g = Math.round(lower.g + factor * (upper.g - lower.g));
  const b = Math.round(lower.b + factor * (upper.b - lower.b));

  const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  const glow = `rgba(${r}, ${g}, ${b}, 0.5)`;

  let pulseClass = 'pulse-safe';
  let statusLabel = 'STABLE';

  if (clamped >= 75) {
    pulseClass = 'pulse-critical';
    statusLabel = 'CRITICAL';
  } else if (clamped >= 50) {
    pulseClass = 'pulse-high';
    statusLabel = 'ELEVATED';
  } else if (clamped >= 25) {
    pulseClass = 'pulse-medium';
    statusLabel = 'MODERATE';
  }

  return { hex, glow, pulseClass, statusLabel };
}

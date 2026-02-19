// Organic Intelligence — Deep Space palette
export const Colors = {
  // Backgrounds (Deep Layers)
  bg: {
    deep: '#06060f',
    layer1: '#0a0a18',
    layer2: '#0f0f24',
    layer3: '#141430',
    glass: 'rgba(255, 255, 255, 0.04)',
    glassMid: 'rgba(255, 255, 255, 0.07)',
  },
  // Accent
  blue: {
    500: '#3b82f6',
    400: '#60a5fa',
    600: '#2563eb',
    glow: 'rgba(59, 130, 246, 0.3)',
  },
  emerald: {
    500: '#10b981',
    400: '#34d399',
    glow: 'rgba(16, 185, 129, 0.3)',
  },
  amber: {
    500: '#f59e0b',
    400: '#fbbf24',
    glow: 'rgba(245, 158, 11, 0.3)',
  },
  red: {
    500: '#ef4444',
    400: '#f87171',
    glow: 'rgba(239, 68, 68, 0.3)',
  },
  // Text
  text: {
    primary: '#f1f5f9',
    secondary: '#94a3b8',
    muted: '#475569',
  },
  // Border
  border: {
    subtle: 'rgba(255, 255, 255, 0.06)',
    mid: 'rgba(255, 255, 255, 0.10)',
  },
} as const;

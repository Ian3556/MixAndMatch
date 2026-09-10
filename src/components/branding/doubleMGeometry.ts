export const DOUBLE_M_VIEWBOX_SIZE = 256;
export const DOUBLE_M_TOP = 56;
export const DOUBLE_M_BOTTOM = 200;

export const DOUBLE_M_PATHS = [
  'M32 92.52C35.89 101.53 48.73 111.24 68.66 127.19V200H32V92.52Z',
  'M32 56C62.93 56 106.46 94.83 122.27 129.5C132.81 154.93 138.31 179.2 138.31 200H114.25C113.79 166.72 100.05 142.22 75.76 123.96L45.29 100.61C36.58 93.91 32 87.43 32 77.26V56Z',
  'M224 92.52C220.11 101.53 207.27 111.24 187.34 127.19V200H224V92.52Z',
  'M224 56C191.69 56 146.33 94.83 131.67 134.36C136.48 144.76 140.83 163.71 141.29 179.2C148.39 157.47 159.39 141.29 173.14 129.5L210.71 100.61C219.42 93.91 224 87.43 224 77.26V56Z',
] as const;

export function calculateDoubleMFillBounds(progress: number) {
  const clampedProgress = Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0;
  const logoHeight = DOUBLE_M_BOTTOM - DOUBLE_M_TOP;
  const height = logoHeight * clampedProgress;

  return {
    height,
    y: DOUBLE_M_BOTTOM - height,
  };
}

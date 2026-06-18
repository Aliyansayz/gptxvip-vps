export function wickEfficiency(
  open: number[],
  high: number[],
  low: number[],
  close: number[]
): number[] {
  const n = close.length;
  const efficiency = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    const body = Math.abs(close[i] - open[i]);
    const range = high[i] - low[i];

    efficiency[i] = body / Math.max(range, 1e-12);
  }

  return efficiency;
}


export function smoothedWickEfficiencyFast(
  open: number[],
  high: number[],
  low: number[],
  close: number[],
  window: number = 10
): (number | null)[] {
  const we = wickEfficiency(open, high, low, close);
  const n = we.length;

  const result: (number | null)[] = new Array(n).fill(null);

  let sum = 0;

  for (let i = 0; i < n; i++) {
    sum += we[i];

    if (i >= window) {
      sum -= we[i - window];
    }

    if (i >= window - 1) {
      result[i] = sum / window;
    }
  }

  return result;
}

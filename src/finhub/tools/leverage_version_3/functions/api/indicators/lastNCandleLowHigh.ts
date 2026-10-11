import { Ohlc } from './baseline';

export const calculateLastNCandles = (data: Ohlc[], period: number) => {
  const lastNLow: (number | undefined)[] = [];
  const lastNHigh: (number | undefined)[] = [];

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      lastNLow.push(undefined);
      lastNHigh.push(undefined);
    } else {
      let currentLow = data[i].low;
      let currentHigh = data[i].high;
      for (let j = 1; j < period; j++) {
        if (data[i - j].low < currentLow) {
          currentLow = data[i - j].low;
        }
        if (data[i - j].high > currentHigh) {
          currentHigh = data[i - j].high;
        }
      }
      lastNLow.push(currentLow);
      lastNHigh.push(currentHigh);
    }
  }

  return { lastNLow, lastNHigh };
};

export const lowForLongPrice = (data: Ohlc[], period: number, currentIndex: number): number | undefined => {
    if (currentIndex < period - 1 || currentIndex >= data.length) return undefined;
    let minLow = data[currentIndex].low;
    for (let i = 1; i < period; i++) {
        if (data[currentIndex - i].low < minLow) minLow = data[currentIndex - i].low;
    }
    return minLow;
}

export const highForShortPrice = (data: Ohlc[], period: number, currentIndex: number): number | undefined => {
    if (currentIndex < period - 1 || currentIndex >= data.length) return undefined;
    let maxHigh = data[currentIndex].high;
    for (let i = 1; i < period; i++) {
        if (data[currentIndex - i].high > maxHigh) maxHigh = data[currentIndex - i].high;
    }
    return maxHigh;
}

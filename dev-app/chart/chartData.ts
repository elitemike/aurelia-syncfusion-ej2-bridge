/** Local data for the chart demos, adapted from the Syncfusion EJ2 chart samples. */
export const salesData = [
  { month: 'Jan', sales: 35, profit: 20, target: 30 },
  { month: 'Feb', sales: 28, profit: 15, target: 30 },
  { month: 'Mar', sales: 34, profit: 24, target: 30 },
  { month: 'Apr', sales: 32, profit: 18, target: 30 },
  { month: 'May', sales: 40, profit: 30, target: 30 },
  { month: 'Jun', sales: 32, profit: 22, target: 30 }
];

export const numericData = [
  { x: 1, y: 21, size: 4 }, { x: 2, y: 24, size: 6 }, { x: 3, y: 36, size: 8 }, { x: 4, y: 38, size: 5 },
  { x: 5, y: 54, size: 9 }, { x: 6, y: 57, size: 7 }, { x: 7, y: 70, size: 3 }
];

export const dateData = [
  { x: new Date(2024, 0, 1), y: 21 }, { x: new Date(2024, 1, 1), y: 24 }, { x: new Date(2024, 2, 1), y: 36 },
  { x: new Date(2024, 3, 1), y: 38 }, { x: new Date(2024, 4, 1), y: 54 }, { x: new Date(2024, 5, 1), y: 57 }
];

export const financialData = [
  { x: new Date(2024, 0, 1), open: 120, high: 130, low: 110, close: 125, volume: 100 },
  { x: new Date(2024, 0, 2), open: 125, high: 140, low: 120, close: 135, volume: 120 },
  { x: new Date(2024, 0, 3), open: 135, high: 138, low: 118, close: 122, volume: 90 },
  { x: new Date(2024, 0, 4), open: 122, high: 129, low: 115, close: 128, volume: 140 },
  { x: new Date(2024, 0, 5), open: 128, high: 145, low: 126, close: 142, volume: 160 },
  { x: new Date(2024, 0, 8), open: 142, high: 150, low: 135, close: 138, volume: 110 },
  { x: new Date(2024, 0, 9), open: 138, high: 147, low: 130, close: 145, volume: 130 },
  { x: new Date(2024, 0, 10), open: 145, high: 155, low: 140, close: 152, volume: 170 },
  { x: new Date(2024, 0, 11), open: 152, high: 158, low: 144, close: 148, volume: 150 },
  { x: new Date(2024, 0, 12), open: 148, high: 160, low: 146, close: 158, volume: 180 },
  { x: new Date(2024, 0, 15), open: 158, high: 165, low: 150, close: 154, volume: 120 },
  { x: new Date(2024, 0, 16), open: 154, high: 162, low: 148, close: 160, volume: 140 }
];

export const boxData = [
  { x: 'A', y: [22, 22, 23, 25, 25, 25, 26, 27, 27, 28, 28, 29, 30, 32, 34, 32, 34, 36, 35, 38] },
  { x: 'B', y: [22, 33, 23, 25, 26, 28, 29, 30, 34, 33, 32, 31, 50] }
];

/** A 1x1 transparent png, used where a url is required but nothing must be fetched. */
export const pixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

/** Deterministic daily OHLC data (weekdays only) for the stock chart demos. */
export const stockData = (() => {
  const rows: any[] = [];
  let close = 100;
  let seed = 7;
  const next = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const day = new Date(2024, 0, 1);
  while (rows.length < 120) {
    if (day.getDay() !== 0 && day.getDay() !== 6) {
      const open = close;
      close = Math.max(20, open + (next() - 0.45) * 8);
      rows.push({
        x: new Date(day), open, close, high: Math.max(open, close) + next() * 3, low: Math.min(open, close) - next() * 3,
        volume: Math.round(1000 + next() * 4000)
      });
    }
    day.setDate(day.getDate() + 1);
  }
  return rows;
})();

import { Ohlc } from '../indicators/baseline';

export interface CsvFileMetadata {
  asset?: string;
  timeframe?: string;
}

/** Decode UTF-8 and UTF-16 CSV exports, including common MetaTrader BOMs. */
export function decodeCsvBytes(bytes: Uint8Array): string {
  let encoding = 'utf-8';
  if (bytes[0] === 0xff && bytes[1] === 0xfe) encoding = 'utf-16le';
  else if (bytes[0] === 0xfe && bytes[1] === 0xff) encoding = 'utf-16be';
  else if (!(bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf)) {
    let oddNuls = 0, evenNuls = 0;
    for (let i = 0; i < Math.min(bytes.length, 200); i++) {
      if (bytes[i] === 0) i % 2 ? oddNuls++ : evenNuls++;
    }
    if (oddNuls > 8 && oddNuls > evenNuls * 2) encoding = 'utf-16le';
    else if (evenNuls > 8 && evenNuls > oddNuls * 2) encoding = 'utf-16be';
  }
  return new TextDecoder(encoding).decode(bytes).replace(/^\uFEFF/, '');
}

/** Infer the asset and bar interval from MetaTrader export filenames. */
export function inferCsvFileMetadata(fileName: string): CsvFileMetadata {
  const match = /^([A-Z0-9]+)_([SMHD])(\d+)_.*\.csv$/i.exec(fileName.trim());
  if (!match) return {};
  const symbol = match[1].toUpperCase();
  const assetBySymbol: Record<string, string> = { XAUUSD: 'Gold', XAGUSD: 'Silver', USOIL: 'Oil', USTEC: 'Nasdaq100' };
  const unit = match[2].toUpperCase();
  const value = Number(match[3]);
  if (!Number.isInteger(value) || value < 1) return {};
  return {
    asset: assetBySymbol[symbol] || symbol,
    timeframe: `${unit === 'D' ? value * 24 : value}${unit === 'S' ? 's' : unit === 'M' ? 'm' : 'h'}`
  };
}

function readDelimitedRows(csvText: string): string[][] {
  const text = csvText.replace(/^\uFEFF/, '');
  const firstLine = text.split(/\r?\n/, 1)[0]?.trim() || '';
  const declaredDelimiter = /^sep=(,|;|\t)$/i.exec(firstLine)?.[1];
  const content = declaredDelimiter ? text.slice(text.indexOf('\n') + 1) : text;
  const header = content.split(/\r?\n/, 1)[0] || '';
  const delimiter = declaredDelimiter || (['\t', ',', ';'].sort((a, b) => header.split(b).length - header.split(a).length)[0]);
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (char === '"') {
      if (quoted && content[i + 1] === '"') { field += '"'; i++; }
      else quoted = !quoted;
    } else if (!quoted && char === delimiter) {
      row.push(field.trim()); field = '';
    } else if (!quoted && (char === '\n' || char === '\r')) {
      if (char === '\r' && content[i + 1] === '\n') i++;
      row.push(field.trim()); field = '';
      if (row.some(value => value !== '')) rows.push(row);
      row = [];
    } else {
      field += char;
    }
  }
  if (quoted) throw new Error('CSV contains an unclosed quoted field.');
  row.push(field.trim());
  if (row.some(value => value !== '')) rows.push(row);
  return rows;
}

function parseTimezoneOffset(timezone: string): number {
  if (/^(?:GMT|UTC)?Z?$/i.test(timezone.trim())) return 0;
  const match = /^(?:GMT|UTC)?([+-])(\d{1,2})(?::?(\d{2}))?$/i.exec(timezone.trim());
  if (!match) throw new Error(`Unsupported CSV timezone "${timezone}". Use UTC or GMT+3, for example.`);
  const hours = Number(match[2]), minutes = Number(match[3] || 0);
  if (hours > 14 || minutes > 59) throw new Error(`Invalid CSV timezone "${timezone}".`);
  return (match[1] === '-' ? -1 : 1) * (hours * 60 + minutes);
}

function parseCsvTimestamp(value: string, timezoneOffsetMinutes: number): number {
  const timestamp = value.trim();
  if (/^\d{13}$/.test(timestamp)) return Number(timestamp);
  if (/^\d{10}$/.test(timestamp)) return Number(timestamp) * 1000;
  if (/(?:Z|[+-]\d{2}:?\d{2})$/i.test(timestamp)) {
    const parsed = Date.parse(timestamp);
    if (Number.isFinite(parsed)) return parsed;
  }

  const separated = /^(\d{4})[-./](\d{1,2})[-./](\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?)?$/.exec(timestamp);
  const compact = /^(\d{4})(\d{2})(\d{2})(?:[ T]?(\d{2})(\d{2})(\d{2})?)?$/.exec(timestamp);
  const parts = separated || compact;
  if (!parts) throw new Error(`Invalid datetime "${value}".`);
  const year = Number(parts[1]), month = Number(parts[2]), day = Number(parts[3]);
  const hour = Number(parts[4] || 0), minute = Number(parts[5] || 0), second = Number(parts[6] || 0);
  const millisecond = separated ? Number((parts[7] || '').padEnd(3, '0')) : 0;
  const asUtc = Date.UTC(year, month - 1, day, hour, minute, second, millisecond);
  const date = new Date(asUtc);
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day ||
      date.getUTCHours() !== hour || date.getUTCMinutes() !== minute || date.getUTCSeconds() !== second) {
    throw new Error(`Invalid datetime "${value}".`);
  }
  return asUtc - timezoneOffsetMinutes * 60_000;
}

/** Parse standard OHLC CSV and MetaTrader tab exports into chronologically sorted candles. */
export function parseCsvCandles(csvText: string, timezone = 'GMT+3'): Ohlc[] {
  const rows = readDelimitedRows(csvText);
  if (rows.length < 2) throw new Error('CSV has no candle data.');
  const headers = rows[0].map(value => value.replace(/^\uFEFF/, '').trim().replace(/^<|>$/g, '').toLowerCase().replace(/[\s_-]/g, ''));
  const column = (...names: string[]) => headers.findIndex(header => names.includes(header));
  const openIndex = column('open'), highIndex = column('high'), lowIndex = column('low'), closeIndex = column('close');
  const datetimeIndex = column('datetime', 'timestamp');
  const dateIndex = column('date'), timeIndex = column('time');
  const tickVolumeIndex = column('tickvol', 'tickvolume');
  const volumeIndex = tickVolumeIndex >= 0 ? tickVolumeIndex : column('volume', 'vol', 'realvolume');
  if ([openIndex, highIndex, lowIndex, closeIndex].some(index => index < 0) || (datetimeIndex < 0 && dateIndex < 0)) {
    throw new Error('CSV needs open, high, low, close and datetime (or date and time) columns. Volume is optional.');
  }
  const offsetMinutes = parseTimezoneOffset(timezone);
  const candles: Ohlc[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length !== headers.length) throw new Error(`CSV row ${i + 1} has ${row.length} columns; expected ${headers.length}.`);
    const rawDatetime = datetimeIndex >= 0 ? row[datetimeIndex] : `${row[dateIndex]} ${timeIndex >= 0 ? row[timeIndex] : ''}`.trim();
    let time: number;
    try { time = parseCsvTimestamp(rawDatetime, offsetMinutes); }
    catch (error) { throw new Error(`CSV row ${i + 1}: ${(error as Error).message}`); }
    const required = [openIndex, highIndex, lowIndex, closeIndex];
    if (required.some(index => row[index] === '')) throw new Error(`CSV row ${i + 1} has an empty OHLC value.`);
    const [open, high, low, close] = required.map(index => Number(row[index]));
    const volume = volumeIndex >= 0 && row[volumeIndex] !== '' ? Number(row[volumeIndex]) : 0;
    if (![open, high, low, close, volume].every(Number.isFinite) || [open, high, low, close].some(value => value <= 0) || volume < 0) {
      throw new Error(`CSV row ${i + 1} has an invalid price or volume.`);
    }
    if (high < Math.max(open, close, low) || low > Math.min(open, close, high)) {
      throw new Error(`CSV row ${i + 1} has inconsistent high/low prices.`);
    }
    candles.push({ time, open, high, low, close, volume });
  }
  candles.sort((a, b) => a.time - b.time);
  for (let i = 1; i < candles.length; i++) {
    if (candles[i].time === candles[i - 1].time) throw new Error('CSV contains duplicate candle datetimes.');
  }
  return candles;
}

/** Preserve the normalized CSV export API for callers that need CSV text. */
export function normalizeCSV(csvText: string, timezone = 'GMT+3'): string {
  const candles = parseCsvCandles(csvText, timezone);
  return ['datetime,open,high,low,close,volume', ...candles.map(candle =>
    `${new Date(candle.time).toISOString()},${candle.open},${candle.high},${candle.low},${candle.close},${candle.volume}`
  )].join('\n');
}

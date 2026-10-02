import { strict as assert } from 'node:assert';
import { decodeCsvBytes, inferCsvFileMetadata, normalizeCSV, parseCsvCandles } from './normalizeCsvFile';

const standard = '\uFEFFdatetime,open,close,high,low\r\n"2026-06-03 11:38:00",3350.1,3350.4,3350.6,3349.8\r\n"2026-06-03 11:39:00",3350.4,3350.2,3350.7,3350.0\r\n';
const standardCandles = parseCsvCandles(standard, 'GMT+3');
assert.equal(standardCandles.length, 2);
assert.equal(standardCandles[0].time, Date.parse('2026-06-03T08:38:00Z'));
assert.equal(standardCandles[0].close, 3350.4);
assert.equal(standardCandles[0].volume, 0);
assert.equal(standardCandles[1].time - standardCandles[0].time, 60_000);

const mt5 = '<DATE>\t<TIME>\t<OPEN>\t<HIGH>\t<LOW>\t<CLOSE>\t<TICKVOL>\t<VOL>\t<SPREAD>\r\n' +
  '2026.06.03\t11:38:00\t3350.10\t3350.60\t3349.80\t3350.40\t172\t0\t15\r\n' +
  '2026.06.03\t11:39:00\t3350.40\t3350.70\t3350.00\t3350.20\t183\t0\t14\r\n';
const mt5Candles = parseCsvCandles(mt5, 'GMT+3');
assert.deepEqual(parseCsvCandles(decodeCsvBytes(new Uint8Array(Buffer.concat([Buffer.from([0xff, 0xfe]), Buffer.from(mt5, 'utf16le')]))), 'GMT+3'), mt5Candles);
assert.deepEqual(mt5Candles.map(({ volume, close, time }) => ({ volume, close, time })),
  standardCandles.map(({ close, time }, index) => ({ volume: index ? 183 : 172, close, time })));
assert.deepEqual(inferCsvFileMetadata('XAUUSD_M1_202606031138_202609171412.csv'), { asset: 'Gold', timeframe: '1m' });

const normalized = normalizeCSV(mt5, 'GMT+3');
assert.ok(normalized.startsWith('datetime,open,high,low,close,volume\n2026-06-03T08:38:00.000Z'));
assert.deepEqual(parseCsvCandles(normalized, 'GMT+3'), mt5Candles); // explicit Z is not shifted

const semicolon = 'datetime;open;high;low;<CLOSE>\n2026-06-03T08:38:00Z;3350.1;3350.6;3349.8;3350.4';
assert.equal(parseCsvCandles(semicolon)[0].close, 3350.4);
assert.throws(() => parseCsvCandles('datetime,open,high,low,close\nnot-a-date,1,2,0.5,1.5'), /CSV row 2: Invalid datetime/);
assert.throws(() => parseCsvCandles('datetime,open,high,low,close\n2026-06-03T08:38:00Z,2,1,0.5,1.5'), /inconsistent high\/low/);
assert.throws(() => parseCsvCandles('datetime,open,high,low,close\n2026-06-03T08:38:00Z,1,2,0.5,1.5\n2026-06-03T08:38:00Z,1,2,0.5,1.5'), /duplicate/);
console.log('CSV import checks passed');

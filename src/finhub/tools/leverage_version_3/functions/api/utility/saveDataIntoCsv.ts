import { Ohlc } from '../indicators/baseline';

/**
 * Utility to convert simulated data (alpha, beta, delta) with values (open, high, low, close, volume)
 * into a standardized CSV structure and trigger a browser download.
 *
 * File name structure:
 * {Asset Name}_{Data Source [alpha/beta/delta]}_{Time Interval}_{Preset Name if used}.csv
 * Example: Gold_alpha_5s_HFT_Aggressive.csv
 */
export function saveDataIntoCsv(
  data: Ohlc[],
  assetName: string,
  dataSourceName: 'alpha' | 'beta' | 'delta',
  timeInterval: string,
  presetName?: string
): void {
  if (!data || data.length === 0) {
    console.error("No data available to save into CSV.");
    return;
  }

  // Create CSV rows
  const headers = ['datetime', 'open', 'high', 'low', 'close', 'volume'];
  const rows = data.map(item => {
    // Format timestamp dynamically as a standard ISO string for clean parsing across platforms
    const datetimeStr = new Date(item.time).toISOString();
    return [
      datetimeStr,
      item.open,
      item.high,
      item.low,
      item.close,
      Math.floor(item.volume || 0)
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');

  // Construct the descriptive filename based on requested components
  const cleanAsset = assetName.replace(/[^a-zA-Z0-9]/g, '');
  const cleanInterval = timeInterval.replace(/[^a-zA-Z0-9]/g, '');
  const cleanPreset = presetName ? `_${presetName.replace(/[^a-zA-Z0-9]/g, '_')}` : '';
  const filename = `${cleanAsset}_${dataSourceName}_${cleanInterval}${cleanPreset}.csv`;

  // Create a Blob and trigger native browser file download
  try {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to generate and download CSV file in browser:", error);
  }
}

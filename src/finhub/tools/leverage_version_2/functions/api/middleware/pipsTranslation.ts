export function pipsToPrice(pips: number, assetType: string = 'gold', currentPrice?: number): number {
  if (!pips) return 0;
  
  const type = assetType.toLowerCase();
  
  if (type.includes('gold') || type === 'xauusd') {
    return pips * 0.1;
  }
  
  if (type.includes('jpy')) {
    return pips * 0.01;
  }
  
  if (currentPrice && currentPrice > 1000) {
    if (type.includes('btc') || type === 'bitcoin') {
      return pips;
    }
  }

  return pips;
}

export function priceToPips(priceDiff: number, assetType: string = 'gold', currentPrice?: number): number {
  if (!priceDiff) return 0;
  
  const type = assetType.toLowerCase();
  
  if (type.includes('gold') || type === 'xauusd') {
    // Standard Gold pip translation
    // 1 pip = 0.1 for most gold quotes
    return priceDiff / 0.1;
  }
  
  // Example translation for JPY pairs
  if (type.includes('jpy')) {
    // 1 pip = 0.01
    return priceDiff / 0.01;
  }
  
  // Default for most major forex pairs (EURUSD, GBPUSD)
  // 1 pip = 0.0001
  // If price is larger, maybe it's crypto / indices
  if (currentPrice && currentPrice > 1000) {
    if (type.includes('btc') || type === 'bitcoin') {
      return priceDiff; // 1 point = 1 pip
    }
  }

  // Fallback default
  return priceDiff;
}

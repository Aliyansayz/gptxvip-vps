export function isSerialTradingActive(globalStoreOrConfig: any): boolean {
    return !!globalStoreOrConfig?.serialTradingEnabled;
}

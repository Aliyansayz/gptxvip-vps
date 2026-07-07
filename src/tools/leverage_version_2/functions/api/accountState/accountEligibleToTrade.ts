import { Trade } from '../../../../types/trading';

export const SERIAL_ACCOUNTS = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10'];

// Given the trades and base balance, determine which root account is eligible to trade
export function getEligibleRootAccount(
    trades: Trade[],
    baseBalance: number,
    leverageConfig: any,
    currentPrice: number,
    assetName: string,
    serialTradingEnabled: boolean
): string {
    const minPositionSize = leverageConfig?.minPositionSize || 0.01;
    let notionalValue = currentPrice * minPositionSize;
    if (assetName.toLowerCase() === 'gold') notionalValue *= 100;
    const requiredMargin = leverageConfig?.enabled ? notionalValue / (leverageConfig.leverage || 100) : 0.01;

    // Accounts to evaluate in order: A1, then S1 to S10 if serial is enabled
    const accountsToCheck = ['A1'];
    if (serialTradingEnabled) {
        accountsToCheck.push(...SERIAL_ACCOUNTS);
    }

    // Helper to get closed PnL for a specific account
    const getClosedPnL = (accountId: string) => {
        // filter trades belonging to this account and calculate PnL
        return trades
            .filter(t => t.status === 'CLOSED' && (t.accountId === accountId || (!t.accountId && accountId === 'A1')))
            .reduce((sum, t) => sum + (t.pnl || 0), 0);
    };

    // Find the first account that still has sufficient balance
    for (const accId of accountsToCheck) {
        const closedPnL = getClosedPnL(accId);
        const accountBalance = baseBalance + closedPnL;
        
        if (accountBalance >= requiredMargin) {
            return accId;
        }
    }

    return 'A1'; // Default fallback if all are drained
}

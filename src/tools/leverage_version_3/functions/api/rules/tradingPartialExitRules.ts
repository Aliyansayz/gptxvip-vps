import { Trade } from '../../../../types/trading';

/**
 * Calculates the quantity to exit during a partial exit.
 * - Minimum size is 0.01.
 * - If size is 0.03 and percent is 70, it exits 0.02, keeping 0.01 active.
 * - If size is 0.02 and percent is 70, it exits 0.01, keeping 0.01 active.
 * - If size <= 0.01, it cannot be partially closed, so it returns 0.
 */
export function calculatePartialExitSize(totalSize: number, percentage: number): number {
  if (totalSize < 0.01) {
    return 0; // 0.00 is invalid
  }

  // Calculate raw exit size based on percentage
  const rawExitSize = totalSize * (percentage / 100);

  // Perform round off nearest valid lot size (0.01 increments)
  let exitSize = Math.round(rawExitSize * 100) / 100;

  // Ensure we keep at least 0.01 active if it was partially exited.
  if (totalSize - exitSize < 0.01 && totalSize >= 0.02) {
    exitSize = Number((totalSize - 0.01).toFixed(2));
  } else if (totalSize === 0.01) {
    // If trade size is 0.01, we cannot do a partial exit because we can't keep 0.01 active and exit something.
    return 0; 
  }

  if (exitSize < 0.01) {
    exitSize = 0;
  }

  return exitSize;
}

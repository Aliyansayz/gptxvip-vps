import { Trade } from '../../../../types/trading';

/**
 * Calculates the quantity to exit during a partial exit.
 * - Minimum size is 0.01.
 * - If size is 0.03 and percent is 70, it exits 0.02, keeping 0.01 active.
 * - If size is 0.02 and percent is 70, it exits 0.01, keeping 0.01 active.
 * - If size <= 0.01, it cannot be partially closed, so it returns 0.
 */
export function calculatePartialExitSize(totalSize: number, percentage: number): number {
  if (totalSize <= 0.01) {
    return 0; // cannot partially exit 0.01 or less
  }

  // Calculate raw exit size based on percentage
  const rawExitSize = totalSize * (percentage / 100);

  // Perform rounding to 2 decimals as specified by requirement
  // For totalSize = 0.03, percentage = 70: rawExitSize = 0.021 -> round to 0.02
  // For totalSize = 0.02, percentage = 70: rawExitSize = 0.014 -> round to 0.01
  let exitSize = Math.round(rawExitSize * 100) / 100;

  // Ensure we keep at least 0.01 active if it was partially exited.
  if (exitSize >= totalSize) {
    exitSize = Number((totalSize - 0.01).toFixed(2));
  }

  if (exitSize < 0.01) {
    exitSize = 0;
  }

  return exitSize;
}

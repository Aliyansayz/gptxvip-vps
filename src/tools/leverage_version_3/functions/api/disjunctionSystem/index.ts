/**
 * Disjunction System
 * 
 * Instructions:
 * - This system integrates multiple classic systems to work in disjunction (OR logic).
 * - It allows selecting as many classic systems as available.
 * - The Disjunction System yields a valid signal when *any* (at least one) of the
 *   selected systems signals an entry in a given direction.
 */

export interface DisjunctionSystemConfig {
    /** Any number of system IDs to be used in disjunction */
    systems: string[];
}

/**
 * Checks if at least one of the selected systems gives a signal.
 * Returns 'LONG' if any 'LONG' signal is present.
 * Returns 'SHORT' if any 'SHORT' signal is present, AND no 'LONG' signal is present 
 * (or we could return conflict? Actually if one is LONG and one is SHORT, what happens? 
 * Usually, we evaluate LONG first then SHORT, or if there's conflict return null).
 * Let's just return LONG if LONG is present, SHORT if SHORT is present, 
 * and if both are present, what should we do?
 * A simple way is to check the first valid signal, or return null if conflict.
 * Since OR operator triggers the moment an entry happens, let's treat LONG > SHORT 
 * or if there's a conflict return null.
 */
export function evaluateDisjunctionSystem(signals: Array<'LONG' | 'SHORT' | null>): 'LONG' | 'SHORT' | null {
    if (!signals || signals.length === 0) return null;

    const hasLong = signals.includes('LONG');
    const hasShort = signals.includes('SHORT');

    if (hasLong && hasShort) {
        // If there's a conflict, maybe they cancel out? 
        return null; 
    }

    if (hasLong) return 'LONG';
    if (hasShort) return 'SHORT';

    return null;
}

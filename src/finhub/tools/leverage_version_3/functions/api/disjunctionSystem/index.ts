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

/** Any selected system can trigger. Selection order breaks opposite-signal ties. */
export function evaluateDisjunctionSystem(signals: Array<'LONG' | 'SHORT' | null>): 'LONG' | 'SHORT' | null {
    return signals?.find(signal => signal === 'LONG' || signal === 'SHORT') || null;
}

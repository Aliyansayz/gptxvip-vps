/**
 * Conjunction System
 * 
 * Instructions:
 * - This system integrates multiple classic systems to work in conjunction.
 * - It allows selecting up to 3 classic systems natively available in the tool.
 * - The Conjunction System yields a valid signal ONLY when all selected systems
 *   align in the same direction (i.e., all correlate).
 * - "In front end add the button of : Conjunction System and in it it also contains 
 *    all the system of classic system, it can select upto maximum 3 system that will
 *    be used in conjunction when they align all in same direction or all correlate"
 */

export interface ConjunctionSystemConfig {
    /** Up to 3 system IDs to be used in conjunction */
    systems: string[];
}

/**
 * Checks if the selected systems in the conjunction align in the same direction.
 * Returns the direction if all correlate perfectly, or null if there is any 
 * disagreement between the systems.
 */
export function evaluateConjunctionSystem(signals: Array<'LONG' | 'SHORT' | null>): 'LONG' | 'SHORT' | null {
    if (!signals || signals.length === 0) return null;
    
    // Check if every signal in the list is 'LONG'
    if (signals.every(s => s === 'LONG')) {
        return 'LONG';
    }
    
    // Check if every signal in the list is 'SHORT'
    if (signals.every(s => s === 'SHORT')) {
        return 'SHORT';
    }
    
    // Disagreement or missing signals
    return null;
}


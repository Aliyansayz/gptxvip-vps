import { getBaseSystemId, newNamesAfterReplication } from './selfReplicationLabelManage';

/**
 * Checks if we can replicate a system. 
 * Constraints:
 * 1. Total conjunction systems max is 3.
 * 2. Specific base system max replicas is 3.
 */
export function isReplicationPossible(baseId: string, activeSystems: string[]): boolean {
    if (activeSystems.length >= 3) return false;
    
    // Count how many times this base system is already replicated
    const currentCount = activeSystems.filter(id => getBaseSystemId(id) === baseId).length;
    if (currentCount >= 3) return false;
    
    return true;
}

export function replicateSystem(baseId: string, activeSystems: string[]): string[] {
    if (!isReplicationPossible(baseId, activeSystems)) {
        return activeSystems;
    }
    const newId = newNamesAfterReplication(baseId, activeSystems);
    if (newId) {
        return [...activeSystems, newId];
    }
    return activeSystems;
}

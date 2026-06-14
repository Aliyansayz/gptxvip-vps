/**
 * Manages label names for replicated systems in the Conjunction panel.
 */

export const REPLICATION_SUFFIXES = ['alpha', 'beta', 'delta'];

export function getBaseSystemId(systemInstanceId: string): string {
    for (const suffix of REPLICATION_SUFFIXES) {
        if (systemInstanceId.endsWith(`_${suffix}`)) {
            return systemInstanceId.replace(`_${suffix}`, '');
        }
    }
    return systemInstanceId;
}

export function newNamesAfterReplication(baseId: string, currentInstances: string[]): string | null {
    // Finds the next available suffix for the given baseId in the current instances
    for (const suffix of REPLICATION_SUFFIXES) {
        const candidate = `${baseId}_${suffix}`;
        if (!currentInstances.includes(candidate)) {
            return candidate;
        }
    }
    return null;
}

export function getSystemLabelForDisplay(baseName: string, instanceId: string): string {
    if (instanceId.endsWith('_alpha')) return `${baseName} - Alpha`;
    if (instanceId.endsWith('_beta')) return `${baseName} - Beta`;
    if (instanceId.endsWith('_delta')) return `${baseName} - Delta`;
    return baseName; 
}

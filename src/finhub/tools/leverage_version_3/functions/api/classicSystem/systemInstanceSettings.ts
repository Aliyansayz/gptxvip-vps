import { getBaseSystemId } from '../conjunctionSystem/selfReplicationLabelManage';

/** Combine a system's shared defaults with the settings for one selected instance. */
export function getSystemInstanceSettings(
  settings: Record<string, any>,
  instanceId: string
): Record<string, any> {
  const base = settings[getBaseSystemId(instanceId)] || {};
  const instance = settings[instanceId] || {};
  return {
    ...base,
    ...instance,
    alphaParams: { ...base.alphaParams, ...instance.alphaParams },
    betaParams: { ...base.betaParams, ...instance.betaParams },
    deltaParams: { ...base.deltaParams, ...instance.deltaParams },
    allowedPatterns: { ...base.allowedPatterns, ...instance.allowedPatterns }
  };
}

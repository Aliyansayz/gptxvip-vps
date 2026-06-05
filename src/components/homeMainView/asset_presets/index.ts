import { GOLD_ONLY_PRESETS, GoldPresetName } from './goldPresetAdjustments';
import { SILVER_PRESETS, SilverPresetName } from './silverSimulationPresets';
import { NASDAQ100_PRESETS, NasdaqPresetName } from './nasdaq100SimulationPresets';
import { OIL_PRESETS, OilPresetName } from './oilSimulationPresets';
import { OHLCSimulationParams } from './types';

export * from './types';
export * from './goldPresetAdjustments';
export * from './silverSimulationPresets';
export * from './nasdaq100SimulationPresets';
export * from './oilSimulationPresets';

export type PresetName = GoldPresetName | SilverPresetName | NasdaqPresetName | OilPresetName | 'default';

export interface GenericPreset {
  name: string;
  label: string;
  description: string;
  params: OHLCSimulationParams;
}

export const getPresetsForAsset = (asset: string): GenericPreset[] => {
  const genericList: GenericPreset[] = [];
  
  if (asset === 'Gold') {
    Object.entries(GOLD_ONLY_PRESETS).forEach(([key, val]) => {
      genericList.push({
        name: key,
        label: val.label,
        description: val.description,
        params: val.params
      });
    });
  } else if (asset === 'Silver') {
    Object.entries(SILVER_PRESETS).forEach(([key, val]) => {
      genericList.push({
        name: key,
        label: val.label,
        description: val.description,
        params: val.params
      });
    });
  } else if (asset === 'Nasdaq100') {
    Object.entries(NASDAQ100_PRESETS).forEach(([key, val]) => {
      genericList.push({
        name: key,
        label: val.label,
        description: val.description,
        params: val.params
      });
    });
  } else if (asset === 'Oil') {
    Object.entries(OIL_PRESETS).forEach(([key, val]) => {
      genericList.push({
        name: key,
        label: val.label,
        description: val.description,
        params: val.params
      });
    });
  }
  
  return genericList;
};

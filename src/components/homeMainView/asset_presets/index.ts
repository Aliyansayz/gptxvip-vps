import { GOLD_ONLY_PRESETS, GoldPresetName } from './goldPresetAdjustments';
import { SILVER_PRESETS, SilverPresetName } from './silverSimulationPresets';
import { NASDAQ100_PRESETS, NasdaqPresetName } from './nasdaq100SimulationPresets';
import { OIL_PRESETS, OilPresetName } from './oilSimulationPresets';
import { USDJPY_PRESETS, USDJPYPresetName } from './usdjpySimulationPresets';
import { GBPJPY_PRESETS, GBPJPYPresetName } from './gbpjpySimulationPresets';
import { EURJPY_PRESETS, EURJPYPresetName } from './eurjpySimulationPresets';
import { EURUSD_PRESETS, EurUsdPresetName } from './eurusdSimulationPresets';
import { AUDUSD_PRESETS, AUDUSDPresetName } from './audusdSimulationPresets';
import { USDCAD_PRESETS, USDCADPresetName } from './usdcadSimulationPresets';
import { EURCAD_PRESETS, EURCADPresetName } from './eurcadSimulationPresets';
import { OHLCSimulationParams } from './types';

export * from './types';
export * from './goldPresetAdjustments';
export * from './silverSimulationPresets';
export * from './nasdaq100SimulationPresets';
export * from './oilSimulationPresets';
export * from './usdjpySimulationPresets';
export * from './gbpjpySimulationPresets';
export * from './eurjpySimulationPresets';
export * from './eurusdSimulationPresets';
export * from './audusdSimulationPresets';
export * from './usdcadSimulationPresets';
export * from './eurcadSimulationPresets';

export type PresetName = GoldPresetName | SilverPresetName | NasdaqPresetName | OilPresetName | USDJPYPresetName | GBPJPYPresetName | EURJPYPresetName | EurUsdPresetName | AUDUSDPresetName | USDCADPresetName | EURCADPresetName | 'default';

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
      genericList.push({ name: key, label: val.label, description: val.description, params: val.params });
    });
  } else if (asset === 'Silver') {
    Object.entries(SILVER_PRESETS).forEach(([key, val]) => {
      genericList.push({ name: key, label: val.label, description: val.description, params: val.params });
    });
  } else if (asset === 'Nasdaq100') {
    Object.entries(NASDAQ100_PRESETS).forEach(([key, val]) => {
      genericList.push({ name: key, label: val.label, description: val.description, params: val.params });
    });
  } else if (asset === 'Oil') {
    Object.entries(OIL_PRESETS).forEach(([key, val]) => {
      genericList.push({ name: key, label: val.label, description: val.description, params: val.params });
    });
  } else if (asset === 'USDJPY') {
    Object.entries(USDJPY_PRESETS).forEach(([key, val]) => {
      genericList.push({ name: key, label: val.label, description: val.description, params: val.params });
    });
  } else if (asset === 'GBPJPY') {
    Object.entries(GBPJPY_PRESETS).forEach(([key, val]) => {
      genericList.push({ name: key, label: val.label, description: val.description, params: val.params });
    });
  } else if (asset === 'EURJPY') {
    Object.entries(EURJPY_PRESETS).forEach(([key, val]) => {
      genericList.push({ name: key, label: val.label, description: val.description, params: val.params });
    });
  } else if (asset === 'EURUSD') {
    Object.entries(EURUSD_PRESETS).forEach(([key, val]) => {
      genericList.push({ name: key, label: val.label, description: val.description, params: val.params });
    });
  } else if (asset === 'AUDUSD') {
    Object.entries(AUDUSD_PRESETS).forEach(([key, val]) => {
      genericList.push({ name: key, label: val.label, description: val.description, params: val.params });
    });
  } else if (asset === 'USDCAD') {
    Object.entries(USDCAD_PRESETS).forEach(([key, val]) => {
      genericList.push({ name: key, label: val.label, description: val.description, params: val.params });
    });
  } else if (asset === 'EURCAD') {
    Object.entries(EURCAD_PRESETS).forEach(([key, val]) => {
      genericList.push({ name: key, label: val.label, description: val.description, params: val.params });
    });
  }
  
  return genericList;
};

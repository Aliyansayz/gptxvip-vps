import React from 'react';
import { StopLossModifierConfig } from '../../functions/api/stopLossModifier/stopLossModifierConfig';

interface ProfitPipsStopControlsProps {
  config: StopLossModifierConfig;
  onChange: (updates: Partial<StopLossModifierConfig>) => void;
  disabled?: boolean;
}

export const ProfitPipsStopControls: React.FC<ProfitPipsStopControlsProps> = ({ config, onChange, disabled = false }) => {
  const setNumber = (field: 'trailAfterProfitPips' | 'profitLockTriggerPips' | 'profitLockPercent', value: string) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return;
    const bounded = field === 'profitLockPercent' ? Math.min(100, Math.max(0, parsed)) : Math.max(0, parsed);
    onChange({ [field]: bounded });
  };

  return <div className={`space-y-3 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
    <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
      <input type="checkbox" checked={config.enableTrailAfterProfitPips}
        onChange={e => onChange({ enableTrailAfterProfitPips: e.target.checked })}
        className="rounded bg-zinc-800 text-purple-500 focus:ring-purple-500" />
      Start indicator trailing after X pips profit
    </label>
    {config.enableTrailAfterProfitPips && <label className="flex items-center gap-2 text-xs text-zinc-400 ml-5">
      <span>Profit trigger:</span>
      <input type="number" min="0" step="1" value={config.trailAfterProfitPips}
        onChange={e => setNumber('trailAfterProfitPips', e.target.value)}
        className="w-20 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
      <span>pips</span>
    </label>}

    <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
      <input type="checkbox" checked={config.enableProfitPipsLock}
        onChange={e => onChange({ enableProfitPipsLock: e.target.checked })}
        className="rounded bg-zinc-800 text-purple-500 focus:ring-purple-500" />
      Lock a percentage of pip profit in the stop loss
    </label>
    {config.enableProfitPipsLock && <div className="flex flex-wrap items-center gap-3 ml-5">
      <label className="flex items-center gap-2 text-xs text-zinc-400">
        <span>Profit trigger:</span>
        <input type="number" min="0" step="1" value={config.profitLockTriggerPips}
          onChange={e => setNumber('profitLockTriggerPips', e.target.value)}
          className="w-20 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
        <span>pips</span>
      </label>
      <label className="flex items-center gap-2 text-xs text-zinc-400">
        <span>Lock:</span>
        <input type="number" min="0" max="100" step="1" value={config.profitLockPercent}
          onChange={e => setNumber('profitLockPercent', e.target.value)}
          className="w-20 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
        <span>% of current profit</span>
      </label>
    </div>}
    <p className="text-[10px] text-zinc-500">
      Measured at candle close. At 70 pips profit, 50% locks 35 pips above entry for a long trade; 70% locks 49 pips. Shorts are mirrored. The stop only moves toward profit.
    </p>
    {disabled && <p className="text-[10px] text-amber-400">Enable Use Stop Loss in Trading and Control first.</p>}
  </div>;
};

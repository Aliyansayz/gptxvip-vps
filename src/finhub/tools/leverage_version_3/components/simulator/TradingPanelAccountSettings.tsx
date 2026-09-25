import React, { useState } from 'react';
import { useIndicatorsStore, ParallelAccount, TradeExecutionMode } from '../../stores/indicators_store';
import { ChevronDown, ChevronRight, Settings, Plus, Trash2, RefreshCw } from 'lucide-react';

export const TradingPanelAccountSettings: React.FC = () => {
  const { leverageSettings, setLeverageSettings, parallelAccounts, setParallelAccounts, serialTradingEnabled, setSerialTradingEnabled } = useIndicatorsStore();
  const [isOpen, setIsOpen] = useState(true);

  const [collapsedAccounts, setCollapsedAccounts] = useState<Record<string, boolean>>({});

  const toggleAccountCollapse = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCollapsedAccounts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const addParallelAccount = () => {
    if (parallelAccounts.length >= 14) return;
    
    // Find the next available account ID (A2, A3, etc.)
    const existingIds = parallelAccounts.map(a => parseInt(a.id.replace('A', ''), 10));
    let nextId = 2;
    while (existingIds.includes(nextId)) {
      nextId++;
    }
    
    const newAccount: ParallelAccount = {
      id: `A${nextId}`,
      simultaneousTradeState: true,
      tradeExecutionMode: 'normal'
    };
    
    setParallelAccounts([...parallelAccounts, newAccount].sort((a, b) => parseInt(a.id.replace('A', '')) - parseInt(b.id.replace('A', ''))));
  };

  const applyPreset = () => {
    const newAccounts: ParallelAccount[] = [];
    for (let i = 2; i <= 11; i++) {
        let mode: TradeExecutionMode = 'normal';
        if (i >= 8 && i <= 9) mode = 'hedge';
        if (i >= 10 && i <= 11) mode = 'invert';
        
        newAccounts.push({
            id: `A${i}`,
            simultaneousTradeState: true,
            tradeExecutionMode: mode
        });
    }
    setParallelAccounts(newAccounts);
    setCollapsedAccounts(newAccounts.reduce((acc, a) => ({ ...acc, [a.id]: true }), {}));
  };

  const removeParallelAccount = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setParallelAccounts(parallelAccounts.filter(a => a.id !== id));
  };

  const resetAllAccounts = () => {
    setParallelAccounts(parallelAccounts.map(a => ({
      ...a,
      simultaneousTradeState: true,
      tradeExecutionMode: 'normal'
    })));
  };
  
  const deleteAllAccounts = () => {
    setParallelAccounts([]);
  };

  const updateAccount = (id: string, updates: Partial<ParallelAccount>) => {
    setParallelAccounts(parallelAccounts.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  return (
    <div className="space-y-4">
      {/* Root Account Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-3 bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
        >
          <div className="flex items-center gap-2 text-zinc-300 font-semibold text-sm">
            <Settings size={16} className="text-cyan-400" />
            A1: Root Trading Account
          </div>
          {isOpen ? <ChevronDown size={18} className="text-zinc-500" /> : <ChevronRight size={18} className="text-zinc-500" />}
        </button>

        {isOpen && (
          <div className="p-4 space-y-4 border-t border-zinc-800">
            <div className="space-y-4">
              <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Account Type</label>
                  <input 
                    type="text" 
                    disabled
                    value="Root Trading Account"
                    className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded px-3 py-1.5 text-xs text-zinc-500 cursor-not-allowed"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">This is the master account (A1). It cannot be changed.</p>
              </div>

              <div className="flex items-center justify-between p-3 bg-zinc-800/30 rounded border border-zinc-700/50">
                <div>
                  <span className="text-xs font-semibold text-zinc-300">Leverage Mode</span>
                  <p className="text-[10px] text-zinc-500 mt-1">Enable leveraged trading rules and margin constraints.</p>
                </div>
                <div
                  className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors ${
                    leverageSettings.enabled ? 'bg-cyan-500' : 'bg-zinc-700'
                  }`}
                  onClick={() => setLeverageSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
                >
                  <div
                    className={`w-3 h-3 rounded-full bg-white transition-transform ${
                      leverageSettings.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Initial Balance</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 bg-zinc-800 border border-r-0 border-zinc-700 rounded-l text-xs text-zinc-400">
                    {leverageSettings.currency}
                  </span>
                  <input
                    type="number"
                    value={leverageSettings.balance}
                    onChange={(e) => setLeverageSettings((prev) => ({ ...prev, balance: Number(e.target.value) }))}
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-r px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-cyan-400"
                    min="0"
                  />
                </div>
                <p className="text-[10px] text-zinc-500 mt-1">Set the initial starting capital for this account.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Serial Trading Feature */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex flex-col">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-zinc-300">Serial Account Feature</span>
            <span className="text-[10px] text-zinc-500 mt-0.5">Predefined preset providing 10 extra root accounts (S1-S10) as reserves when an account drains</span>
          </div>
          <div
            className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors ${
              serialTradingEnabled ? 'bg-cyan-500' : 'bg-zinc-700'
            }`}
            onClick={() => setSerialTradingEnabled(prev => !prev)}
          >
            <div
              className={`w-3 h-3 rounded-full bg-white transition-transform ${
                serialTradingEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Parallel Accounts Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex flex-col">
        <div className="p-3 bg-zinc-800/50 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-300 font-semibold text-sm">
            <Settings size={16} className="text-purple-400" />
            Parallel Accounts
          </div>
          <div className="text-[10px] text-zinc-500 font-medium bg-zinc-800 px-2 py-1 rounded border border-zinc-700">
            {parallelAccounts.length}/14
          </div>
        </div>

        <div className="p-4">
          <p className="text-[10px] text-zinc-500 mb-4">
            Parallel accounts clone the base settings (Balance, Leverage) of the A1 account. You can configure execution settings independently.
          </p>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <button
              onClick={addParallelAccount}
              disabled={parallelAccounts.length >= 14}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold hover:bg-opacity-80 transition-colors ${
                parallelAccounts.length >= 14 
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                  : 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
              }`}
            >
              <Plus size={14} /> Add Pattern Account
            </button>
            <button
              onClick={applyPreset}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-opacity-80 transition-colors"
            >
              Apply 10-Account Preset
            </button>
            {parallelAccounts.length > 0 && (
              <>
                <button
                  onClick={resetAllAccounts}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs border border-zinc-700 transition-colors flex items-center gap-1 ml-auto"
                  title="Reset all to defaults"
                >
                  <RefreshCw size={14} /> Reset
                </button>
                <button
                  onClick={deleteAllAccounts}
                  className="px-3 py-1.5 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded text-xs border border-red-900/30 transition-colors flex items-center gap-1"
                  title="Delete all parallel accounts"
                >
                  <Trash2 size={14} /> Delete All
                </button>
              </>
            )}
          </div>

          <div className="space-y-2">
            {parallelAccounts.map((account) => {
              const isCollapsed = collapsedAccounts[account.id];
              return (
              <div key={account.id} className="bg-zinc-800/30 border border-zinc-700/50 rounded-lg overflow-hidden">
                <button 
                  onClick={(e) => toggleAccountCollapse(account.id, e)}
                  className="w-full flex items-center justify-between p-3 bg-zinc-800/40 hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-sm font-bold text-zinc-200">
                    {isCollapsed ? <ChevronRight size={16} className="text-zinc-500" /> : <ChevronDown size={16} className="text-zinc-500" />}
                    <span className="text-purple-400">{account.id}</span>
                    {isCollapsed && (
                      <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400 capitalize font-medium flex items-center gap-1.5 border border-zinc-700/50 ml-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${account.simultaneousTradeState ? 'bg-emerald-400' : 'bg-zinc-500'}`} />
                        {account.tradeExecutionMode} {account.simultaneousTradeState ? 'Active' : 'Inactive'}
                      </span>
                    )}
                  </div>
                  <div 
                    onClick={(e) => removeParallelAccount(account.id, e)}
                    className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                    title="Delete Account"
                  >
                    <Trash2 size={14} />
                  </div>
                </button>

                {!isCollapsed && (
                <div className="p-3 space-y-3 border-t border-zinc-700/50">
                  <div className="flex items-center justify-between bg-zinc-800/40 p-2 rounded border border-zinc-700/30">
                    <span className="text-[10px] font-semibold text-zinc-300 uppercase">Simultaneous Trade</span>
                    <div
                      className={`w-8 h-4 rounded-full p-0.5 cursor-pointer transition-colors ${
                        account.simultaneousTradeState ? 'bg-purple-500' : 'bg-zinc-700'
                      }`}
                      onClick={() => updateAccount(account.id, { simultaneousTradeState: !account.simultaneousTradeState })}
                    >
                      <div
                        className={`w-3 h-3 rounded-full bg-white transition-transform ${
                          account.simultaneousTradeState ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Execution Mode</label>
                    <select
                      value={account.tradeExecutionMode}
                      onChange={(e) => updateAccount(account.id, { tradeExecutionMode: e.target.value as TradeExecutionMode })}
                      className="w-full bg-zinc-800/80 border border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-300 outline-none focus:border-purple-500/50 transition-colors disabled:opacity-50"
                    >
                      <option value="normal">Normal Mode (Follow A1)</option>
                      <option value="hedge">Hedge Mode (50% Same / 50% Opposite)</option>
                      <option value="invert">Invert Mode (Fully Opposite)</option>
                    </select>
                  </div>
                </div>
                )}
              </div>
            )})}
            
            {parallelAccounts.length === 0 && (
              <div className="text-center py-6 px-4 bg-zinc-800/20 rounded border border-zinc-700/30 border-dashed">
                <p className="text-xs text-zinc-500">No parallel accounts configured. Click "Add Pattern Account" to create clones that follow A1 signals.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

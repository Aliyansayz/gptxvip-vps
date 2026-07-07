import React, { useState } from 'react';
import { Globe, Lock, Unlock, Zap, ShieldAlert, ArrowRight } from 'lucide-react';

export default function CsrfSandbox() {
  const [balance, setBalance] = useState(5000);
  const [tokenSecured, setTokenSecured] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const handleVictimTransfer = () => {
    setBalance(prev => prev - 100);
    addLog('User legitimately transferred $100');
  };

  const handleAttackerExploit = () => {
    if (tokenSecured) {
      addLog('CSRF Attack Blocked: Invalid anti-CSRF token.');
    } else {
      setBalance(prev => prev - 1000);
      addLog('CSRF Attack Successful! $1,000 transferred to attacker.');
    }
  };

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 5));
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-700 text-slate-200">
      <div className="bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-bold font-mono">CSRF Lab: Split Context</h2>
        </div>
        <button 
          onClick={() => setTokenSecured(!tokenSecured)}
          className={`px-3 py-1 text-xs font-semibold rounded-md border flex items-center gap-1 ${tokenSecured ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}
        >
          {tokenSecured ? <><Lock className="w-3 h-3" /> CSRF Tokens: ON</> : <><Unlock className="w-3 h-3" /> CSRF Tokens: OFF</>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 h-[400px]">
        {/* Victim Context */}
        <div className="p-6 border-r border-slate-700 flex flex-col relative">
          <div className="absolute top-0 right-0 bg-blue-500/20 text-blue-300 text-[10px] px-2 py-1 rounded-bl-lg border-b border-l border-blue-500/30 font-mono font-bold uppercase">
            bank.example.com
          </div>
          <div className="mb-6 mt-4">
            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
               Victim's Bank Account
            </h3>
            <p className="text-xs text-slate-400 mt-1">Authenticated Session ID: <span className="font-mono text-emerald-400">abc123xyz890</span></p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex-1 flex flex-col items-center justify-center">
            <p className="text-sm text-slate-400 uppercase tracking-widest mb-2">Current Balance</p>
            <h1 className="text-5xl font-bold text-emerald-400 mb-8">${balance.toLocaleString()}</h1>
            
            <button 
              onClick={handleVictimTransfer}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Transfer $100 (Legitimate) <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Attacker Context */}
        <div className="p-6 bg-slate-950 flex flex-col relative">
          <div className="absolute top-0 right-0 bg-red-500/20 text-red-300 text-[10px] px-2 py-1 rounded-bl-lg border-b border-l border-red-500/30 font-mono font-bold uppercase">
            evil-attacker.com
          </div>
          <div className="mb-6 mt-4">
            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2 text-red-400">
               <ShieldAlert className="w-5 h-5" /> Malicious Website
            </h3>
            <p className="text-xs text-slate-500 mt-1">Lures the victim to click while logged into the bank.</p>
          </div>

          <div className="bg-slate-900 border border-red-900/30 rounded-xl p-6 flex-1 flex flex-col">
            <div className="bg-slate-800 rounded p-4 border border-slate-700 font-mono text-xs text-slate-300 mb-6 flex-1">
              <span className="text-pink-400">&lt;form</span> <span className="text-emerald-300">action=</span><span className="text-yellow-300">"http://bank.example.com/transfer"</span> <span className="text-emerald-300">method=</span><span className="text-yellow-300">"POST"</span><span className="text-pink-400">&gt;</span><br/>
              &nbsp;&nbsp;<span className="text-pink-400">&lt;input</span> <span className="text-emerald-300">type=</span><span className="text-yellow-300">"hidden"</span> <span className="text-emerald-300">name=</span><span className="text-yellow-300">"amount"</span> <span className="text-emerald-300">value=</span><span className="text-yellow-300">"1000"</span> <span className="text-pink-400">/&gt;</span><br/>
              &nbsp;&nbsp;<span className="text-pink-400">&lt;input</span> <span className="text-emerald-300">type=</span><span className="text-yellow-300">"hidden"</span> <span className="text-emerald-300">name=</span><span className="text-yellow-300">"to"</span> <span className="text-emerald-300">value=</span><span className="text-yellow-300">"attacker_acc"</span> <span className="text-pink-400">/&gt;</span><br/>
              &nbsp;&nbsp;<span className="text-slate-500">&lt;!-- Invisible submission or tempting button --&gt;</span><br/>
              <span className="text-pink-400">&lt;/form&gt;</span>
            </div>

            <button 
              onClick={handleAttackerExploit}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-900/20"
            >
              <Zap className="w-5 h-5" /> Click here for cute cat pictures!
            </button>
          </div>
        </div>
      </div>
      
      {/* Logs Footer */}
      <div className="bg-slate-950 p-4 border-t border-slate-800">
        <h4 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">Network Logs</h4>
        <div className="space-y-1 h-20 overflow-y-auto custom-scrollbar font-mono text-xs">
          {logs.map((log, i) => (
            <div key={i} className={log.includes('Successful') ? 'text-red-400' : log.includes('Blocked') ? 'text-emerald-400' : 'text-blue-300'}>
              {log}
            </div>
          ))}
          {logs.length === 0 && <div className="text-slate-700">No activity yet.</div>}
        </div>
      </div>
    </div>
  );
}

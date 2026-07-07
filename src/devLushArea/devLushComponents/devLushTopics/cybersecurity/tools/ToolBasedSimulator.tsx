import React, { useState } from 'react';
import { Target, Search, ArrowRight, Activity, Database, CheckCircle, Play, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface RequestLog {
  id: number;
  method: string;
  url: string;
  status: number;
  length: number;
  params: string;
  isVulnerable?: boolean;
}

const initialHistory: RequestLog[] = [
  { id: 1, method: "GET", url: "/api/products", status: 200, length: 1450, params: "category=shoes" },
  { id: 2, method: "GET", url: "/api/products/1", status: 200, length: 820, params: "id=1" },
  { id: 3, method: "POST", url: "/api/login", status: 401, length: 102, params: "username=admin&password=foo" },
  { id: 4, method: "GET", url: "/api/admin/dashboard", status: 403, length: 250, params: "", isVulnerable: true },
  { id: 5, method: "GET", url: "/assets/style.css", status: 200, length: 5040, params: "" },
];

export const ToolBasedSimulator: React.FC = () => {
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [mode, setMode] = useState<'history' | 'intruder'>('history');
  
  // Intruder state
  const [intruderRunning, setIntruderRunning] = useState(false);
  const [intruderResults, setIntruderResults] = useState<{payload: string, status: number, length: number}[]>([]);
  const [progress, setProgress] = useState(0);

  const handleSelectRequest = (id: number) => {
    setSelectedRequestId(id);
    const req = initialHistory.find(r => r.id === id);
    if (req?.isVulnerable) {
      toast.success("Good eye! This request looks interesting for further testing.");
    }
  };

  const sendToIntruder = () => {
    if (!selectedRequestId) {
      toast.error("Select a request first.");
      return;
    }
    setMode('intruder');
    setIntruderResults([]);
    setProgress(0);
  };

  const startIntruder = () => {
    setIntruderRunning(true);
    setIntruderResults([]);
    setProgress(0);

    const payloads = ['admin', 'administrator', 'root', 'super', 'test'];
    const selectedReq = initialHistory.find(r => r.id === selectedRequestId);
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < payloads.length) {
        const payload = payloads[i];
        // Mock logic: if it's the vulnerable request and payload is 'administrator', it succeeds
        const isSuccess = selectedReq?.isVulnerable && payload === 'administrator';
        
        setIntruderResults(prev => [...prev, {
          payload,
          status: isSuccess ? 200 : 403,
          length: isSuccess ? 3042 : 250
        }]);
        
        setProgress(((i + 1) / payloads.length) * 100);
        i++;
      } else {
        clearInterval(interval);
        setIntruderRunning(false);
        
        const hasSuccess = intruderResults.some(r => r.status === 200) || (selectedReq?.isVulnerable && payloads.includes('administrator'));
        if (hasSuccess) {
          toast.success("Intruder attack successful! Payload found.");
        } else {
          toast.info("Intruder finished. No successful payloads found.");
        }
      }
    }, 600);
  };

  return (
    <div className="flex flex-col min-h-[350px] bg-slate-950 text-slate-300 font-sans border border-slate-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center bg-slate-900 px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-orange-500" />
          <span className="font-bold text-slate-200">Burp Suite Simulator</span>
        </div>
        <div className="flex bg-slate-800 p-1 rounded-lg">
          <button 
            onClick={() => setMode('history')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${mode === 'history' ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            HTTP History
          </button>
          <button 
            onClick={() => setMode('intruder')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${mode === 'intruder' ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Intruder
          </button>
        </div>
      </div>

      {mode === 'history' && (
        <div className="flex flex-col h-full animate-in fade-in">
          <div className="p-4 border-b border-slate-800 bg-slate-900/50">
            <h3 className="font-bold text-slate-200 mb-1 flex items-center gap-2"><Database className="w-4 h-4"/> Traffic Log</h3>
            <p className="text-xs text-slate-400">Analyze the requests to find a potential target for fuzzing. Click a row to select it, then send to Intruder.</p>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <table className="w-full text-left text-sm font-mono border-collapse">
              <thead>
                <tr className="text-slate-500 border-b border-slate-800">
                  <th className="pb-2 font-semibold">#</th>
                  <th className="pb-2 font-semibold">Method</th>
                  <th className="pb-2 font-semibold">URL</th>
                  <th className="pb-2 font-semibold">Params</th>
                  <th className="pb-2 font-semibold">Status</th>
                  <th className="pb-2 font-semibold">Length</th>
                </tr>
              </thead>
              <tbody>
                {initialHistory.map((req) => (
                  <tr 
                    key={req.id} 
                    onClick={() => handleSelectRequest(req.id)}
                    className={`border-b border-slate-800/50 cursor-pointer transition-colors ${selectedRequestId === req.id ? 'bg-orange-900/30' : 'hover:bg-slate-900'}`}
                  >
                    <td className="py-2 text-slate-500">{req.id}</td>
                    <td className={`py-2 font-bold ${req.method === 'POST' ? 'text-blue-400' : 'text-emerald-400'}`}>{req.method}</td>
                    <td className="py-2 text-slate-300">{req.url}</td>
                    <td className="py-2 text-slate-500">{req.params || '-'}</td>
                    <td className={`py-2 ${req.status >= 400 ? 'text-rose-400' : 'text-emerald-400'}`}>{req.status}</td>
                    <td className="py-2 text-slate-400">{req.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end">
             <button 
               onClick={sendToIntruder}
               disabled={!selectedRequestId}
               className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors"
             >
               Send to Intruder <ArrowRight className="w-4 h-4" />
             </button>
          </div>
        </div>
      )}

      {mode === 'intruder' && (
        <div className="flex flex-col h-full animate-in fade-in">
          <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-200 mb-1 flex items-center gap-2"><Activity className="w-4 h-4"/> Intruder Attack</h3>
              <p className="text-xs text-slate-400">
                {selectedRequestId 
                  ? `Targeting Request #${selectedRequestId}: ${initialHistory.find(r=>r.id===selectedRequestId)?.url}` 
                  : "No request selected. Go back to HTTP History."}
              </p>
            </div>
            {selectedRequestId && (
               <button 
                 onClick={startIntruder}
                 disabled={intruderRunning}
                 className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors"
               >
                 {intruderRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                 {intruderRunning ? 'Running...' : 'Start Attack'}
               </button>
            )}
          </div>
          
          <div className="flex-1 overflow-auto p-4 bg-slate-950">
            {intruderRunning && (
              <div className="mb-4 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Attack Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            )}
            
            {intruderResults.length > 0 ? (
              <table className="w-full text-left text-sm font-mono border-collapse">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-800">
                    <th className="pb-2 font-semibold">Payload</th>
                    <th className="pb-2 font-semibold">Status</th>
                    <th className="pb-2 font-semibold">Length</th>
                  </tr>
                </thead>
                <tbody>
                  {intruderResults.map((res, i) => (
                    <tr key={i} className={`border-b border-slate-800/50 ${res.status === 200 ? 'bg-emerald-900/20' : ''}`}>
                      <td className="py-2 text-slate-300">{res.payload}</td>
                      <td className="py-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${res.status === 200 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'text-rose-400'}`}>
                          {res.status}
                        </span>
                      </td>
                      <td className={`py-2 ${res.status === 200 ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>{res.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
                <Search className="w-12 h-12 opacity-20" />
                <p>Click "Start Attack" to begin fuzzing.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolBasedSimulator;

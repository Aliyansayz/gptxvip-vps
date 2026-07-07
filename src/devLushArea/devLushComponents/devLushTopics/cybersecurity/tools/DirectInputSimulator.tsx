import React, { useState } from 'react';
import { Terminal, Send, Search, ShieldAlert, Code } from 'lucide-react';
import { toast } from 'sonner';

export const DirectInputSimulator: React.FC = () => {
  const [requestContent, setRequestContent] = useState(
    "POST /api/profile/update HTTP/1.1\nHost: target-app.internal\nContent-Type: application/json\n\n{\n  \"id\": 1,\n  \"bio\": \"My updated bio\"\n}"
  );
  const [responseContent, setResponseContent] = useState("Waiting for request...");
  const [isHacked, setIsHacked] = useState(false);

  const handleSend = () => {
    // Simulated latency
    setResponseContent("Sending...");
    setTimeout(() => {
      // Very basic mock server logic
      if (requestContent.includes("<script>alert(1)</script>")) {
        setResponseContent("HTTP/1.1 200 OK\n\nProfile updated successfully. Executed <script>alert(1)</script>.");
        setIsHacked(true);
        toast.success("XSS Payload successfully injected!");
      } else if (requestContent.includes("\"id\": \"carlos\"") || requestContent.includes("\"id\": \"admin\"")) {
        setResponseContent("HTTP/1.1 200 OK\n\nSuccessfully modified profile for user 'carlos'.");
        setIsHacked(true);
        toast.success("IDOR Payload successfully executed!");
      } else {
        setResponseContent("HTTP/1.1 200 OK\n\nProfile updated successfully.");
        setIsHacked(false);
      }
    }, 600);
  };

  const handleReset = () => {
    setRequestContent("POST /api/profile/update HTTP/1.1\nHost: target-app.internal\nContent-Type: application/json\n\n{\n  \"id\": 1,\n  \"bio\": \"My updated bio\"\n}");
    setResponseContent("Waiting for request...");
    setIsHacked(false);
  };

  return (
    <div className="flex flex-col min-h-[350px] bg-slate-950 text-slate-300 font-mono text-xs border border-slate-800 rounded-xl overflow-hidden">
      <div className="flex justify-between items-center bg-slate-900 px-4 py-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-500" />
          <span className="font-bold">Burp Repeater Simulator</span>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReset} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition-colors">
            Reset
          </button>
          <button onClick={handleSend} className="flex items-center gap-2 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded transition-colors">
            <Send className="w-3 h-3" />
            Send
          </button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row flex-1 p-4 gap-4">
        {/* Request Panel */}
        <div className="flex-1 flex flex-col border border-slate-800 rounded-lg overflow-hidden bg-slate-900/50">
          <div className="bg-slate-800 px-3 py-1 text-slate-400 font-bold border-b border-slate-800 flex items-center gap-2">
            <Code className="w-3 h-3" /> Request
          </div>
          <textarea 
            value={requestContent}
            onChange={(e) => setRequestContent(e.target.value)}
            className="flex-1 bg-transparent border-none p-3 resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500/50 text-emerald-400"
            spellCheck="false"
          />
        </div>
        
        {/* Response Panel */}
        <div className="flex-1 flex flex-col border border-slate-800 rounded-lg overflow-hidden bg-slate-900/50">
          <div className="bg-slate-800 px-3 py-1 text-slate-400 font-bold border-b border-slate-800 flex items-center gap-2">
            <Search className="w-3 h-3" /> Response
          </div>
          <div className={`flex-1 p-3 overflow-y-auto whitespace-pre-wrap ${isHacked ? 'text-amber-400' : 'text-slate-400'}`}>
            {responseContent}
          </div>
        </div>
      </div>

      {isHacked && (
        <div className="bg-amber-950/50 border-t border-amber-900/50 p-3 text-amber-500 font-bold flex items-center justify-center gap-2 animate-pulse">
          <ShieldAlert className="w-4 h-4" />
          VULNERABILITY EXPLOITED SUCCESSFULLY
        </div>
      )}
    </div>
  );
};

export default DirectInputSimulator;

import React, { useState } from 'react';
import { Network, Server, ArrowRight, ShieldAlert, ArrowLeftRight, Database, Globe } from 'lucide-react';

export default function SsrfSandbox() {
  const [url, setUrl] = useState('https://api.github.com/users/octocat');
  const [response, setResponse] = useState<string>('Enter a URL and click Fetch to view the response.');
  const [isLoading, setIsLoading] = useState(false);
  const [isProtected, setIsProtected] = useState(false);

  const handleFetch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse('Connecting...');

    setTimeout(() => {
      let result = '';
      
      // Simulate SSRF Protection
      if (isProtected && (url.includes('localhost') || url.includes('127.0.0.1') || url.includes('169.254.169.254') || url.includes('internal'))) {
        result = 'ERROR: Access to internal/private IP ranges is forbidden by security policy.';
      } 
      // Simulate successful SSRF payload to AWS Metadata
      else if (url.includes('169.254.169.254/latest/meta-data/iam/security-credentials')) {
        result = '{\n  "Code" : "Success",\n  "Type" : "AWS-HMAC",\n  "AccessKeyId" : "AKIAIOSFODNN7EXAMPLE",\n  "SecretAccessKey" : "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",\n  "Token" : "IQoJb3JpZ2luX2VjEJv...[truncated]",\n  "Expiration" : "2026-10-10T12:00:00Z"\n}';
      }
      // Simulate successful SSRF payload to internal admin panel
      else if (url.includes('localhost:8080/admin') || url.includes('127.0.0.1:8080/admin')) {
        result = '<html><body>\n<h1>Internal Admin Dashboard</h1>\n<ul>\n<li><a href="/delete_all_users">Drop Database</a></li>\n<li><a href="/config">View Secrets</a></li>\n</ul>\n</body></html>';
      }
      // Simulate generic external API (normal use case)
      else if (url.includes('api.github.com')) {
        result = '{\n  "login": "octocat",\n  "id": 1,\n  "type": "User",\n  "site_admin": false\n}';
      }
      // Generic fallback
      else {
        result = `HTTP 200 OK\n\nFetched contents from ${url}...`;
      }

      setResponse(result);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-700 text-slate-200">
      <div className="bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold font-mono">SSRF Lab: Internal Network Pivoting</h2>
        </div>
        <button 
          onClick={() => setIsProtected(!isProtected)}
          className={`px-3 py-1 text-xs font-semibold rounded-md border flex items-center gap-1 ${isProtected ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}
        >
          {isProtected ? 'SSRF Protection: ON' : 'SSRF Protection: OFF'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 min-h-[400px]">
        {/* Attacker Context */}
        <div className="p-6 border-r border-slate-700 bg-slate-950 flex flex-col">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4" /> Webhook Tester
            </h3>
            <p className="text-xs text-slate-500">
              This application fetches data from a user-provided URL to test webhook integrations.
            </p>
          </div>

          <form onSubmit={handleFetch} className="space-y-4 mb-8">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Webhook URL to Fetch</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
                className="w-full bg-slate-800 border border-slate-600 rounded-md p-3 text-slate-200 font-mono text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all disabled:opacity-50"
              />
            </div>
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-2 px-4 rounded-md transition-colors"
            >
              {isLoading ? 'Fetching from Server...' : 'Fetch URL Content'}
            </button>
          </form>

          {/* Network Diagram */}
          <div className="flex-1 border border-slate-800 rounded-lg p-4 bg-slate-900/50 flex flex-col justify-center relative overflow-hidden">
             <div className="absolute top-2 left-2 text-[10px] text-slate-500 font-mono uppercase">Network Flow</div>
             
             <div className="flex items-center justify-between mt-4">
               <div className="flex flex-col items-center z-10">
                 <div className="w-10 h-10 bg-slate-800 border border-slate-600 rounded-full flex items-center justify-center">
                   <Globe className="w-5 h-5 text-slate-400" />
                 </div>
                 <span className="text-[10px] text-slate-400 mt-1">You</span>
               </div>
               
               <div className={`flex-1 h-0.5 bg-slate-700 mx-2 relative ${isLoading ? 'overflow-hidden' : ''}`}>
                 {isLoading && <div className="absolute top-0 left-0 h-full bg-amber-500 w-1/3 animate-[slide_1s_ease-in-out_infinite]" />}
               </div>
               
               <div className="flex flex-col items-center z-10 relative">
                 <div className={`w-12 h-12 bg-slate-800 border ${isProtected ? 'border-emerald-500' : 'border-red-500'} rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
                   <Server className={`w-6 h-6 ${isProtected ? 'text-emerald-400' : 'text-red-400'}`} />
                 </div>
                 <span className="text-[10px] text-slate-400 mt-1">Web Server</span>
               </div>
               
               <div className={`flex-1 h-0.5 bg-slate-700 mx-2 relative ${isLoading ? 'overflow-hidden' : ''}`}>
                 {isLoading && <div className="absolute top-0 left-0 h-full bg-amber-500 w-1/3 animate-[slide_1s_ease-in-out_infinite]" />}
               </div>
               
               <div className="flex flex-col items-center z-10">
                 <div className="w-10 h-10 bg-slate-800 border border-slate-600 rounded-lg flex items-center justify-center border-dashed">
                   <Database className="w-5 h-5 text-slate-400" />
                 </div>
                 <span className="text-[10px] text-slate-400 mt-1 truncate max-w-[60px] text-center">Target<br/>Dest.</span>
               </div>
             </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="p-6 bg-slate-900 flex flex-col">
           <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-2">
              <ArrowLeftRight className="w-4 h-4" /> Server Response
            </h3>
          </div>
          
          <div className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-4 font-mono text-sm overflow-auto custom-scrollbar relative">
            {isLoading ? (
              <div className="h-full flex items-center justify-center opacity-50">
                <span className="animate-pulse text-amber-400">Waiting for server response...</span>
              </div>
            ) : (
              <pre className={`whitespace-pre-wrap ${response.includes('ERROR') ? 'text-red-400' : response.includes('AKIA') || response.includes('admin') ? 'text-red-400' : 'text-emerald-400'}`}>
                {response}
              </pre>
            )}
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button onClick={() => setUrl('http://169.254.169.254/latest/meta-data/iam/security-credentials')} className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-[10px] font-mono text-slate-400 text-left transition-colors">
              <span className="text-red-400">Cloud Metadata</span><br/>http://169.254.169.254/...
            </button>
            <button onClick={() => setUrl('http://127.0.0.1:8080/admin')} className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-[10px] font-mono text-slate-400 text-left transition-colors">
              <span className="text-red-400">Localhost Bypass</span><br/>http://127.0.0.1:8080/admin
            </button>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}} />
    </div>
  );
}

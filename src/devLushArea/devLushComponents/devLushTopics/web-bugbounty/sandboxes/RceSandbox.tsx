import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Server, AlertTriangle, Play, ChevronRight, HardDrive } from 'lucide-react';

export default function RceSandbox() {
  const [ip, setIp] = useState('8.8.8.8');
  const [output, setOutput] = useState<string[]>([
    'Welcome to the Network Diagnostic Tool',
    'Enter an IP address to ping:',
  ]);
  const [isExecuting, setIsExecuting] = useState(false);
  const endOfOutputRef = useRef<HTMLDivElement>(null);

  const handlePing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ip.trim() || isExecuting) return;

    setIsExecuting(true);
    const command = `ping -c 3 ${ip}`;
    setOutput(prev => [...prev, `$ ${command}`]);

    // Vulnerable implementation simulation: passing input directly to shell
    const maliciousInput = ip.split(';');
    
    setTimeout(() => {
      if (maliciousInput.length > 1) {
        // Simulated execution of injected commands
        const injectedCmd = maliciousInput[1].trim();
        setOutput(prev => [...prev, 'PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.', '64 bytes from 8.8.8.8: icmp_seq=1 ttl=117 time=14.2 ms']);
        
        setTimeout(() => {
          if (injectedCmd.includes('ls')) {
            setOutput(prev => [...prev, 'app.js  config.json  index.html  package.json  server.js  users.db']);
          } else if (injectedCmd.includes('cat users') || injectedCmd.includes('cat *')) {
            setOutput(prev => [...prev, 'admin:x:0:0:root:/root:/bin/bash', 'user1:x:1000:1000:User,,,:/home/user1:/bin/bash', 'db_pass: super_secret_p@ssw0rd']);
          } else if (injectedCmd.includes('whoami')) {
            setOutput(prev => [...prev, 'root']);
          } else {
            setOutput(prev => [...prev, `sh: 1: ${injectedCmd.split(' ')[0]}: not found or simulated command output.`]);
          }
          setIsExecuting(false);
        }, 1000);
      } else {
        // Normal ping
        setTimeout(() => setOutput(prev => [...prev, 'PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.']), 500);
        setTimeout(() => setOutput(prev => [...prev, '64 bytes from 8.8.8.8: icmp_seq=1 ttl=117 time=14.2 ms']), 1000);
        setTimeout(() => setOutput(prev => [...prev, '64 bytes from 8.8.8.8: icmp_seq=2 ttl=117 time=15.1 ms']), 1500);
        setTimeout(() => {
          setOutput(prev => [...prev, '64 bytes from 8.8.8.8: icmp_seq=3 ttl=117 time=14.8 ms', '--- 8.8.8.8 ping statistics ---', '3 packets transmitted, 3 received, 0% packet loss']);
          setIsExecuting(false);
        }, 2000);
      }
    }, 500);
  };

  useEffect(() => {
    endOfOutputRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  return (
    <div className="w-full max-w-5xl mx-auto bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-700 text-slate-200">
      <div className="bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-red-400" />
          <h2 className="text-lg font-bold font-mono">RCE Lab: Command Injection</h2>
        </div>
        <div className="px-3 py-1 text-xs font-semibold rounded-md border bg-red-500/10 text-red-400 border-red-500/30 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" /> VULNERABLE ENDPOINT
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 min-h-[400px]">
        {/* Attacker Input */}
        <div className="p-6 border-r border-slate-700 bg-slate-950 flex flex-col">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-2">
              <Server className="w-4 h-4" /> Web Utility App (Frontend)
            </h3>
            <p className="text-xs text-slate-500">
              The server takes this IP address and passes it directly into a system shell using: <code className="font-mono text-pink-400 bg-slate-800 px-1 py-0.5 rounded">exec('ping -c 3 ' + ip)</code>
            </p>
          </div>

          <form onSubmit={handlePing} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Target IP Address</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                  disabled={isExecuting}
                  className="flex-1 bg-slate-800 border border-slate-600 rounded-md p-3 text-slate-200 font-mono text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all disabled:opacity-50"
                  placeholder="e.g. 8.8.8.8"
                />
                <button 
                  type="submit"
                  disabled={isExecuting}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-2 px-6 rounded-md transition-colors flex items-center gap-2"
                >
                  <Play className="w-4 h-4" /> {isExecuting ? 'Running...' : 'Ping'}
                </button>
              </div>
            </div>
          </form>

          <div className="mt-8 border-t border-slate-800 pt-6">
            <h4 className="text-xs font-mono text-slate-500 uppercase mb-3">Payload Hints</h4>
            <div className="space-y-2">
              <button onClick={() => setIp('8.8.8.8; ls')} className="block w-full text-left p-2 bg-slate-800/50 hover:bg-slate-800 rounded border border-slate-700 text-xs font-mono text-emerald-400 transition-colors">
                8.8.8.8; ls
              </button>
              <button onClick={() => setIp('8.8.8.8; cat users.db')} className="block w-full text-left p-2 bg-slate-800/50 hover:bg-slate-800 rounded border border-slate-700 text-xs font-mono text-emerald-400 transition-colors">
                8.8.8.8; cat users.db
              </button>
              <button onClick={() => setIp('8.8.8.8; whoami')} className="block w-full text-left p-2 bg-slate-800/50 hover:bg-slate-800 rounded border border-slate-700 text-xs font-mono text-emerald-400 transition-colors">
                8.8.8.8; whoami
              </button>
            </div>
          </div>
        </div>

        {/* Server Terminal */}
        <div className="p-6 bg-black flex flex-col font-mono">
          <div className="flex items-center gap-2 mb-4 text-slate-500 border-b border-slate-800 pb-2">
            <HardDrive className="w-4 h-4" />
            <span className="text-xs">Server Internal Console (STDOUT)</span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar text-sm space-y-1 p-2">
            {output.map((line, i) => (
              <div key={i} className={`flex items-start ${line.startsWith('$') ? 'text-amber-400 mt-2' : line.includes('error') || line.includes('not found') ? 'text-red-400' : 'text-emerald-400'}`}>
                {line.startsWith('$') ? <span className="mr-2 opacity-50">&gt;</span> : null}
                <span className="break-all">{line}</span>
              </div>
            ))}
            {isExecuting && (
              <div className="flex items-center text-emerald-400/50 mt-1">
                <span className="animate-pulse">_</span>
              </div>
            )}
            <div ref={endOfOutputRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

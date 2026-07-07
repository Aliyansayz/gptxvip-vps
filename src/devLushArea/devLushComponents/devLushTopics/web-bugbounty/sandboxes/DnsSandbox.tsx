import React, { useState } from 'react';
import { Search, Globe, ShieldAlert, Server, Network } from 'lucide-react';

export default function DnsSandbox() {
  const [domain, setDomain] = useState('example.com');
  const [recordType, setRecordType] = useState('AXFR');
  const [results, setResults] = useState<string>('Run a DNS query to see the results here.');
  const [isVulnerable, setIsVulnerable] = useState(true);

  const handleQuery = (e: React.FormEvent) => {
    e.preventDefault();
    setResults('Querying DNS server...');

    setTimeout(() => {
      if (domain !== 'example.com' && domain !== 'internal.example.com') {
        setResults(`;; connection timed out; no servers could be reached for ${domain}`);
        return;
      }

      if (recordType === 'AXFR') {
        if (isVulnerable) {
          setResults(`; <<>> DiG 9.16.1-Ubuntu <<>> AXFR ${domain}
;; global options: +cmd
example.com.            86400   IN      SOA     ns1.example.com. admin.example.com. 2023101801 7200 3600 1209600 3600
example.com.            86400   IN      NS      ns1.example.com.
example.com.            86400   IN      NS      ns2.example.com.
example.com.            86400   IN      A       93.184.216.34
example.com.            86400   IN      MX      10 mail.example.com.
admin.example.com.      86400   IN      A       93.184.216.40
dev.example.com.        86400   IN      A       93.184.216.41
internal.example.com.   86400   IN      A       10.0.0.15
vpn.example.com.        86400   IN      A       93.184.216.45
secret-db.example.com.  86400   IN      A       10.0.0.22
example.com.            86400   IN      SOA     ns1.example.com. admin.example.com. 2023101801 7200 3600 1209600 3600
;; Query time: 14 msec
;; SERVER: 93.184.216.34#53(93.184.216.34)`);
        } else {
          setResults(`; <<>> DiG 9.16.1-Ubuntu <<>> AXFR ${domain}
;; global options: +cmd
; Transfer failed.
;; connection timed out; no servers could be reached`);
        }
      } else if (recordType === 'A') {
        setResults(`; <<>> DiG 9.16.1-Ubuntu <<>> A ${domain}
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 12345
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; ANSWER SECTION:
${domain}.            86400   IN      A       93.184.216.34

;; Query time: 4 msec`);
      } else {
        setResults(`;; Standard query response for ${recordType} on ${domain}`);
      }
    }, 800);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-700 text-slate-200">
      <div className="bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-bold font-mono">DNS Lab: Zone Transfer (AXFR)</h2>
        </div>
        <button 
          onClick={() => setIsVulnerable(!isVulnerable)}
          className={`px-3 py-1 text-xs font-semibold rounded-md border flex items-center gap-1 ${!isVulnerable ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}
        >
          {!isVulnerable ? 'Zone Transfer Protection: ON' : 'Zone Transfer Protection: OFF'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 min-h-[400px]">
        {/* Query Interface */}
        <div className="p-6 border-r border-slate-700 bg-slate-950 flex flex-col">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-2">
              <Server className="w-4 h-4" /> DNS Query Tool (dig)
            </h3>
            <p className="text-xs text-slate-500">
              Attempt to request a full zone transfer (AXFR) to map the internal network structure.
            </p>
          </div>

          <form onSubmit={handleQuery} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Domain</label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-md p-3 text-slate-200 font-mono text-sm focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Record Type</label>
              <select
                value={recordType}
                onChange={(e) => setRecordType(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-md p-3 text-slate-200 font-mono text-sm focus:outline-none focus:border-blue-500 transition-all"
              >
                <option value="A">A (IPv4 Address)</option>
                <option value="AAAA">AAAA (IPv6 Address)</option>
                <option value="MX">MX (Mail Exchange)</option>
                <option value="TXT">TXT (Text Record)</option>
                <option value="AXFR">AXFR (Zone Transfer)</option>
              </select>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors flex justify-center items-center gap-2"
            >
              <Search className="w-4 h-4" /> Execute Query
            </button>
          </form>

          {isVulnerable && recordType === 'AXFR' && results.includes('secret-db') && (
            <div className="mt-6 p-4 bg-red-950/40 border border-red-900/50 rounded-lg">
              <div className="flex items-center gap-2 text-red-400 mb-2">
                <ShieldAlert className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Vulnerability Found</span>
              </div>
              <p className="text-xs text-slate-400">
                The DNS server allowed an AXFR request, exposing internal subdomains like <code className="text-red-300 bg-red-900/30 px-1 rounded">secret-db.example.com</code> and <code className="text-red-300 bg-red-900/30 px-1 rounded">vpn.example.com</code>.
              </p>
            </div>
          )}
        </div>

        {/* Console Output */}
        <div className="p-6 bg-slate-900 flex flex-col font-mono text-sm">
           <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-2 font-sans">
              <Globe className="w-4 h-4" /> Terminal Output
            </h3>
          </div>
          <div className={`flex-1 border rounded-lg p-4 overflow-auto custom-scrollbar ${results.includes('Transfer failed') ? 'bg-slate-950 border-emerald-900/50 text-emerald-400' : 'bg-slate-950 border-slate-700 text-slate-300'}`}>
            <pre className="whitespace-pre-wrap">{results}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

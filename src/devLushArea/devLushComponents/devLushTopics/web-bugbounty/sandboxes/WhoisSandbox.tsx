import React, { useState } from 'react';
import { Search, Globe, Shield, ShieldAlert, BookOpen, Users } from 'lucide-react';

export default function WhoisSandbox() {
  const [domain, setDomain] = useState('vulnerable-startup.com');
  const [results, setResults] = useState<string>('Enter a domain and click Lookup to retrieve WHOIS data.');
  const [isProtected, setIsProtected] = useState(false);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setResults('Querying WHOIS databases...');

    setTimeout(() => {
      if (domain.trim() === '') {
        setResults('Please enter a valid domain.');
        return;
      }

      if (isProtected) {
        setResults(`Domain Name: ${domain.toUpperCase()}
Registry Domain ID: 123456789_DOMAIN_COM-VRSN
Registrar WHOIS Server: whois.registrar.com
Registrar URL: http://www.registrar.com
Updated Date: 2024-01-15T12:00:00Z
Creation Date: 2020-01-15T12:00:00Z
Registrar Registration Expiration Date: 2025-01-15T12:00:00Z
Registrar: Example Registrar LLC

Registrant Name: REDACTED FOR PRIVACY
Registrant Organization: REDACTED FOR PRIVACY
Registrant Street: REDACTED FOR PRIVACY
Registrant City: REDACTED FOR PRIVACY
Registrant State/Province: REDACTED FOR PRIVACY
Registrant Postal Code: REDACTED FOR PRIVACY
Registrant Country: REDACTED FOR PRIVACY
Registrant Phone: REDACTED FOR PRIVACY
Registrant Email: https://tieredaccess.com/contact/${domain}

Admin Email: REDACTED FOR PRIVACY
Tech Email: REDACTED FOR PRIVACY`);
      } else {
        setResults(`Domain Name: ${domain.toUpperCase()}
Registry Domain ID: 123456789_DOMAIN_COM-VRSN
Registrar WHOIS Server: whois.registrar.com
Registrar URL: http://www.registrar.com
Updated Date: 2024-01-15T12:00:00Z
Creation Date: 2020-01-15T12:00:00Z
Registrar Registration Expiration Date: 2025-01-15T12:00:00Z
Registrar: Example Registrar LLC

Registrant Name: John Doe (CEO)
Registrant Organization: Vulnerable Startup Inc.
Registrant Street: 123 Main St, Suite 400
Registrant City: San Francisco
Registrant State/Province: CA
Registrant Postal Code: 94105
Registrant Country: US
Registrant Phone: +1.4155550198 (Personal Cell)
Registrant Email: john.doe@personal-email-provider.com

Admin Name: Alice Smith (IT Ops)
Admin Phone: +1.4155550199
Admin Email: alice.admin@vulnerable-startup.com
Tech Name: IT Support Team
Tech Email: helpdesk@vulnerable-startup.com`);
      }
    }, 600);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-700 text-slate-200">
      <div className="bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-yellow-400" />
          <h2 className="text-lg font-bold font-mono">WHOIS Lab: OSINT & Privacy</h2>
        </div>
        <button 
          onClick={() => setIsProtected(!isProtected)}
          className={`px-3 py-1 text-xs font-semibold rounded-md border flex items-center gap-1 ${isProtected ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}
        >
          {isProtected ? <><Shield className="w-3 h-3"/> WHOIS Privacy: ON</> : <><ShieldAlert className="w-3 h-3"/> WHOIS Privacy: OFF</>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 min-h-[400px]">
        {/* Tool Context */}
        <div className="p-6 border-r border-slate-700 bg-slate-950 flex flex-col">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4" /> Domain WHOIS Lookup
            </h3>
            <p className="text-xs text-slate-500">
              Query the public registry to identify who owns the domain, where they are located, and how to contact them.
            </p>
          </div>

          <form onSubmit={handleLookup} className="space-y-4 mb-8">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Domain Name</label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-md p-3 text-slate-200 font-mono text-sm focus:outline-none focus:border-yellow-500 transition-all"
                placeholder="example.com"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-slate-900 font-bold py-2 px-4 rounded-md transition-colors flex justify-center items-center gap-2"
            >
              <Search className="w-4 h-4" /> Search Registry
            </button>
          </form>

          {/* Social Engineering Context Box */}
          {!isProtected && results.includes('John Doe') && (
            <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg">
              <h4 className="text-xs font-bold text-yellow-400 flex items-center gap-2 mb-2 uppercase tracking-wider">
                <Users className="w-4 h-4" /> OSINT Findings (Risk)
              </h4>
              <p className="text-xs text-slate-400 mb-2">
                An attacker can use this exposed contact information for:
              </p>
              <ul className="text-xs text-slate-300 list-disc pl-4 space-y-1">
                <li>Targeted phishing against <span className="font-mono text-yellow-300">john.doe@personal-email-provider.com</span></li>
                <li>SIM swapping or vishing using <span className="font-mono text-yellow-300">+1.4155550198</span></li>
                <li>Social engineering IT Ops via <span className="font-mono text-yellow-300">alice.admin@vulnerable-startup.com</span></li>
              </ul>
            </div>
          )}
        </div>

        {/* Output Panel */}
        <div className="p-6 bg-slate-900 flex flex-col font-mono text-sm">
           <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-2 font-sans">
              <Search className="w-4 h-4" /> Registry Response
            </h3>
          </div>
          <div className="flex-1 border rounded-lg p-4 overflow-auto custom-scrollbar bg-slate-950 border-slate-700 text-slate-300 relative">
            <pre className="whitespace-pre-wrap">{results}</pre>
            
            {!isProtected && results.includes('John Doe') && (
              <div className="absolute top-1/2 left-2 right-2 p-2 border-2 border-red-500/50 bg-red-900/20 rounded pointer-events-none translate-y-[30px]">
                <div className="text-red-400 text-xs font-bold uppercase mb-1">Exposure Warning</div>
                <div className="text-red-300 text-[10px] bg-red-950/80 p-1">Personal Identifiable Information (PII) leaked in plain text.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

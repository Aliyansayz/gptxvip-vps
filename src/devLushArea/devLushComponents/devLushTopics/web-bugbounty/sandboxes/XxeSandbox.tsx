import React, { useState } from 'react';
import { FileCode, Settings, Braces, Terminal } from 'lucide-react';

export default function XxeSandbox() {
  const [xmlInput, setXmlInput] = useState('<?xml version="1.0" encoding="ISO-8859-1"?>\n<request>\n  <name>John Doe</name>\n  <action>login</action>\n</request>');
  const [response, setResponse] = useState<string>('Ready to process XML payload.');
  const [isSecure, setIsSecure] = useState(false);

  const handleProcess = (e: React.FormEvent) => {
    e.preventDefault();
    setResponse('Processing XML...');

    setTimeout(() => {
      if (isSecure) {
        if (xmlInput.includes('<!ENTITY') || xmlInput.includes('<!DOCTYPE')) {
          setResponse('XML Parser Error: DTDs and External Entities are disabled for security reasons.');
          return;
        }
      }

      // Very simple parsing simulation for educational purposes
      let extractedName = 'Unknown';
      const nameMatch = xmlInput.match(/<name>(.*?)<\/name>/s);
      
      if (nameMatch) {
        extractedName = nameMatch[1];
        
        // Simulate entity resolution
        if (!isSecure && xmlInput.includes('<!ENTITY xxe SYSTEM "file:///etc/passwd">') && extractedName.includes('&xxe;')) {
          extractedName = extractedName.replace('&xxe;', 'root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin...');
        }
      }

      if (extractedName === 'Unknown' && !xmlInput.includes('<name>')) {
         setResponse(`Error: Missing <name> element.`);
      } else {
         setResponse(`Success: Processed action for user: \n${extractedName}`);
      }
    }, 800);
  };

  const loadXxePayload = () => {
    setXmlInput('<?xml version="1.0" encoding="ISO-8859-1"?>\n<!DOCTYPE foo [\n  <!ELEMENT foo ANY >\n  <!ENTITY xxe SYSTEM "file:///etc/passwd" >]>\n<request>\n  <name>&xxe;</name>\n  <action>login</action>\n</request>');
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-700 text-slate-200">
      <div className="bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Braces className="w-5 h-5 text-fuchsia-400" />
          <h2 className="text-lg font-bold font-mono">XXE Lab: XML External Entities</h2>
        </div>
        <button 
          onClick={() => setIsSecure(!isSecure)}
          className={`px-3 py-1 text-xs font-semibold rounded-md border flex items-center gap-1 ${isSecure ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}
        >
          {isSecure ? 'Disable DTDs (Secure): ON' : 'Disable DTDs (Secure): OFF'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 min-h-[400px]">
        {/* Attacker Input */}
        <div className="p-6 border-r border-slate-700 bg-slate-950 flex flex-col">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-2">
              <FileCode className="w-4 h-4" /> XML API Endpoint
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Send an XML payload to the server. The server parses the <code className="text-fuchsia-400 bg-slate-800 px-1 rounded">&lt;name&gt;</code> element and echoes it back.
            </p>
            <button 
              onClick={loadXxePayload}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-[10px] font-mono text-fuchsia-400 transition-colors"
            >
              Load XXE Payload
            </button>
          </div>

          <form onSubmit={handleProcess} className="space-y-4 flex-1 flex flex-col">
            <div className="flex-1">
              <textarea
                value={xmlInput}
                onChange={(e) => setXmlInput(e.target.value)}
                className="w-full h-full min-h-[200px] bg-slate-800 border border-slate-600 rounded-md p-3 text-slate-200 font-mono text-xs focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all custom-scrollbar"
                spellCheck="false"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
            >
              Send XML Payload
            </button>
          </form>
        </div>

        {/* Server Render */}
        <div className="p-6 bg-slate-900 flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-2">
              <Terminal className="w-4 h-4" /> Server Response
            </h3>
          </div>

          <div className={`flex-1 border rounded-lg p-4 font-mono text-sm overflow-auto custom-scrollbar ${response.includes('Error') ? 'bg-red-950/20 border-red-900/50 text-red-400' : 'bg-slate-950 border-slate-700 text-slate-300'}`}>
            <pre className="whitespace-pre-wrap">{response}</pre>
          </div>
          
          {/* Parser internals visualization */}
          <div className="mt-4 p-4 bg-slate-800 border border-slate-700 rounded-lg">
             <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
               <Settings className="w-3 h-3" /> XML Parser Config
             </div>
             <ul className="text-xs font-mono space-y-1 text-slate-500">
               <li>feature("http://apache.org/xml/features/disallow-doctype-decl"): <span className={isSecure ? 'text-emerald-400' : 'text-red-400'}>{isSecure ? 'true' : 'false'}</span></li>
               <li>feature("http://xml.org/sax/features/external-general-entities"): <span className={isSecure ? 'text-emerald-400' : 'text-red-400'}>{isSecure ? 'false' : 'true'}</span></li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

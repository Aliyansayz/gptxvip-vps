import React, { useState } from 'react';
import { FileCode, FileSearch, ShieldAlert, FolderOpen, AlertTriangle } from 'lucide-react';

export default function LfiSandbox() {
  const [fileParam, setFileParam] = useState('welcome.txt');
  const [content, setContent] = useState<string>('Welcome to the document viewer! Please select a file.');
  const [isProtected, setIsProtected] = useState(false);
  const [highlightedPath, setHighlightedPath] = useState('/var/www/html/docs/welcome.txt');

  const fileSystem: Record<string, string> = {
    '/var/www/html/docs/welcome.txt': 'Welcome to the Document Viewer!\n\nThis system allows you to read internal documentation.',
    '/var/www/html/docs/help.txt': 'Help Guide:\n1. Pass the file name to the ?file= parameter.\n2. Read the file contents on screen.',
    '/etc/passwd': 'root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nbin:x:2:2:bin:/bin:/usr/sbin/nologin\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\nalice:x:1000:1000:Alice,,,:/home/alice:/bin/bash',
    '/etc/hosts': '127.0.0.1 localhost\n127.0.1.1 prod-web-server-01\n10.0.0.5 internal-db-secret',
    '/var/www/html/config.php': '<?php\n  $db_host = "10.0.0.5";\n  $db_user = "admin";\n  $db_pass = "Sup3rS3cr3tP@ssw0rd!";\n?>'
  };

  const handleFetch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Base path simulation
    const basePath = '/var/www/html/docs/';
    let resolvedPath = basePath + fileParam;

    // Simulate basic path resolution (very simplified)
    if (fileParam.includes('../')) {
      const parts = resolvedPath.split('/');
      const resolvedParts = [];
      for (const part of parts) {
        if (part === '..') {
          resolvedParts.pop();
        } else if (part !== '' && part !== '.') {
          resolvedParts.push(part);
        }
      }
      resolvedPath = '/' + resolvedParts.join('/');
    }

    setHighlightedPath(resolvedPath);

    if (isProtected) {
      // Protection: Only allow alphanumeric and dot (prevent directory traversal)
      if (!/^[a-zA-Z0-9.]+$/.test(fileParam)) {
        setContent("SECURITY WARNING: Invalid characters detected in file parameter. Access Denied.");
        return;
      }
      // Or Protection: basename() equivalent
      const basename = fileParam.split('/').pop() || '';
      resolvedPath = basePath + basename;
      setHighlightedPath(resolvedPath);
    }

    if (fileSystem[resolvedPath]) {
      setContent(fileSystem[resolvedPath]);
    } else {
      setContent(`Error: File not found at path: ${resolvedPath}`);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-700 text-slate-200">
      <div className="bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileSearch className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold font-mono">LFI Lab: Directory Traversal</h2>
        </div>
        <button 
          onClick={() => setIsProtected(!isProtected)}
          className={`px-3 py-1 text-xs font-semibold rounded-md border flex items-center gap-1 ${isProtected ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}
        >
          {isProtected ? 'Path Sanitization: ON' : 'Path Sanitization: OFF'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 min-h-[400px]">
        {/* URL and Path Context */}
        <div className="p-6 border-r border-slate-700 bg-slate-950 flex flex-col">
           <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-2">
              <FolderOpen className="w-4 h-4" /> Document Viewer
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              The backend PHP script uses: <code className="font-mono text-pink-400 bg-slate-800 px-1 py-0.5 rounded">include('/var/www/html/docs/' . $_GET['file']);</code>
            </p>
          </div>

          <form onSubmit={handleFetch} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">URL Parameter (?file=)</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-600 bg-slate-800 text-slate-400 sm:text-sm font-mono">
                  viewer.php?file=
                </span>
                <input
                  type="text"
                  value={fileParam}
                  onChange={(e) => setFileParam(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-600 rounded-r-md p-2 text-slate-200 font-mono text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>
            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
            >
              Load File
            </button>
          </form>

          {/* Path Resolution Visualizer */}
          <div className="mt-8 border-t border-slate-800 pt-6 flex-1">
             <h4 className="text-xs font-mono text-slate-500 uppercase mb-3">Path Resolution Simulator</h4>
             <div className="bg-slate-900 rounded-lg border border-slate-700 p-3 font-mono text-xs">
                <div className="text-slate-500 mb-1">Base Path:</div>
                <div className="text-slate-300">/var/www/html/docs/</div>
                <div className="text-slate-500 mt-2 mb-1">+ Input:</div>
                <div className="text-indigo-400">{fileParam}</div>
                <div className="text-slate-500 mt-2 mb-1">= Resolved Backend Path:</div>
                <div className={`break-all ${highlightedPath.includes('/etc/') || highlightedPath.includes('config.php') ? 'text-red-400 font-bold' : 'text-emerald-400'}`}>
                  {highlightedPath}
                </div>
             </div>
             
             <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => setFileParam('help.txt')} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-[10px] font-mono text-slate-400 transition-colors">
                  Normal: help.txt
                </button>
                <button onClick={() => setFileParam('../../../../../etc/passwd')} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-[10px] font-mono text-red-400 transition-colors">
                  LFI: ../../../../../etc/passwd
                </button>
                <button onClick={() => setFileParam('../config.php')} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-[10px] font-mono text-red-400 transition-colors">
                  LFI: ../config.php
                </button>
             </div>
          </div>
        </div>

        {/* File Content Render */}
        <div className="p-6 bg-slate-900 flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-2">
              <FileCode className="w-4 h-4" /> Rendered File Output
            </h3>
          </div>

          <div className={`flex-1 border rounded-lg p-4 font-mono text-sm overflow-auto custom-scrollbar ${content.includes('SECURITY WARNING') ? 'bg-red-950/20 border-red-900/50 text-red-400' : 'bg-slate-950 border-slate-700 text-slate-300'}`}>
            <pre className="whitespace-pre-wrap">{content}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

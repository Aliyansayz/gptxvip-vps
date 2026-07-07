import React, { useState } from 'react';
import { Terminal, ShieldAlert, Code, Eye } from 'lucide-react';

export default function XssSandbox() {
  const [input, setInput] = useState('');
  const [comments, setComments] = useState<{id: number, text: string, raw: string}[]>([]);
  const [isVulnerable, setIsVulnerable] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // In a real app, this would be sanitized. Here we intentionally allow it if isVulnerable is true.
    setComments([...comments, { 
      id: Date.now(), 
      text: isVulnerable ? input : input.replace(/</g, "&lt;").replace(/>/g, "&gt;"), 
      raw: input 
    }]);
    setInput('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-700 text-slate-200">
      <div className="bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold font-mono">XSS Lab: Reflected & Stored</h2>
        </div>
        <button 
          onClick={() => setIsVulnerable(!isVulnerable)}
          className={`px-3 py-1 text-xs font-semibold rounded-md border ${isVulnerable ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'}`}
        >
          {isVulnerable ? 'Vulnerable Mode: ON' : 'Sanitization: ACTIVE'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* Input Pane */}
        <div className="p-6 border-r border-slate-700">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-2">
              <Code className="w-4 h-4" /> Input Vector (Attacker Context)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Try injecting a payload like: <code className="text-pink-400 bg-slate-800 px-1 py-0.5 rounded">&lt;img src="x" onerror="alert('XSS')"&gt;</code>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Leave a comment</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-md p-3 text-slate-200 font-mono text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all h-32"
                placeholder="Type your comment here..."
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Post Comment
            </button>
          </form>
        </div>

        {/* Reflection Pane */}
        <div className="p-6 bg-slate-800/50">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4" /> Output Reflection (Victim Context)
            </h3>
          </div>

          <div className="space-y-4 h-[280px] overflow-y-auto custom-scrollbar">
            {comments.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500">
                <ShieldAlert className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">No comments yet.</p>
              </div>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="bg-slate-800 border border-slate-700 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">U</div>
                    <span className="text-xs text-slate-400">User_{comment.id.toString().slice(-4)}</span>
                  </div>
                  {/* DANGEROUS REFLECTION */}
                  <div 
                    className="text-sm text-slate-300 break-words"
                    dangerouslySetInnerHTML={{ __html: comment.text }}
                  />
                  <div className="mt-3 pt-2 border-t border-slate-700">
                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Raw Input:</span>
                    <p className="text-xs font-mono text-slate-400 mt-1 break-all">{comment.raw}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

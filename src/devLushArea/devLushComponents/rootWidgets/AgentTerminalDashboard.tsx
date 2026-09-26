import React, { useState } from 'react';

export default function AgentTerminalDashboard() {
  const [inputValue, setInputValue] = useState('');
  const [submittedCommand, setSubmittedCommand] = useState('');

  const handleExecute = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const command = inputValue.trim();
    if (!command) return;
    setSubmittedCommand(command);
    setInputValue('');
  };

  return (
    <div className="flex w-full h-full min-h-[600px] bg-[#0a0a0a] text-[#ededed] font-sans overflow-hidden border border-[#2a2a2a] rounded-xl shadow-2xl">
      {/* Sidebar */}
      <aside className="w-[260px] bg-[#141414] border-r border-[#2a2a2a] flex flex-col p-6">
        <div className="text-[0.8rem] uppercase tracking-[0.1em] text-[#888888] mb-6 pl-2">
          Active Agents
        </div>
        <ul className="list-none flex flex-col gap-2">
          <li className="flex items-center p-3 rounded-md cursor-pointer transition-colors duration-200 bg-[#1f1f1f] border-l-[3px] border-[#00f0ff]">
            <div className="w-2 h-2 rounded-full mr-3 bg-[#00f0ff] shadow-[0_0_8px_#00f0ff] animate-pulse"></div>
            <span className="text-[0.9rem] font-medium">Data_Synthesizer_01</span>
          </li>
          <li className="flex items-center p-3 rounded-md cursor-pointer transition-colors duration-200 hover:bg-[#1f1f1f] border-l-[3px] border-transparent">
            <div className="w-2 h-2 rounded-full mr-3 bg-[#888888]"></div>
            <span className="text-[0.9rem] font-medium">Web_Scraper_Alpha</span>
          </li>
          <li className="flex items-center p-3 rounded-md cursor-pointer transition-colors duration-200 hover:bg-[#1f1f1f] border-l-[3px] border-transparent">
            <div className="w-2 h-2 rounded-full mr-3 bg-[#888888]"></div>
            <span className="text-[0.9rem] font-medium">Code_Review_Bot</span>
          </li>
        </ul>
      </aside>

      {/* Main Stage */}
      <main className="flex-1 flex flex-col bg-[#0a0a0a]">
        {/* Header */}
        <header className="h-[60px] border-b border-[#2a2a2a] flex items-center px-8 justify-between shrink-0">
          <div className="text-[1rem] font-medium">Task: Compile Competitor Analysis</div>
          <div className="text-[0.8rem] text-[#888888] font-mono">Model: gpt-4-turbo | Tokens: 4,201</div>
        </header>

        {/* Terminal/Log Area */}
        <div className="flex-1 p-8 overflow-y-auto flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[0.75rem] text-[#888888]">[10:42:01 AM] User Prompt Received</span>
            <div className="text-[0.95rem] leading-relaxed text-[#ededed]">Gather pricing data from Top 3 competitors and format into a markdown table.</div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[0.75rem] text-[#888888]">[10:42:03 AM] Agent Thought</span>
            <div className="text-[0.95rem] leading-relaxed text-[#ededed]">I need to search the web for the top 3 competitors in the specified sector, navigate to their pricing pages, and extract the relevant data arrays.</div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[0.75rem] text-[#888888]">[10:42:04 AM] Action Execution</span>
            <div className="font-mono bg-[#141414] p-3 px-4 rounded border-l-2 border-[#00f0ff] text-[0.85rem] text-[#00f0ff]">
              &gt; USE_TOOL: web_search<br/>
              &gt; PARAMS: {"{"}"query": "top enterprise SaaS competitors 2026 pricing"{"}"}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[0.75rem] text-[#888888]">[10:42:10 AM] Agent Status</span>
            <div className="text-[0.95rem] leading-relaxed text-[#888888]">Parsing DOM structures...</div>
          </div>
        </div>

        {/* Input Dock */}
        <div className="p-6 px-8 bg-[#141414] border-t border-[#2a2a2a] shrink-0">
          <form onSubmit={handleExecute} className="flex bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg overflow-hidden transition-colors duration-200 focus-within:border-[#00f0ff]">
            <input 
              type="text" 
              aria-label="Agent instruction"
              className="flex-1 bg-transparent border-none text-[#ededed] p-4 text-[0.95rem] font-sans outline-none placeholder-[#888888]" 
              placeholder="Instruct the agent or inject context..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit" disabled={!inputValue.trim()} className="bg-transparent text-[#00f0ff] border-none px-6 font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#00f0ff]/10 disabled:opacity-40 disabled:cursor-not-allowed">
              Execute
            </button>
          </form>
          {submittedCommand && (
            <p role="status" className="mt-3 text-xs text-[#888888]" aria-live="polite">
              Captured “{submittedCommand}” in this local demo. No agent service is connected.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

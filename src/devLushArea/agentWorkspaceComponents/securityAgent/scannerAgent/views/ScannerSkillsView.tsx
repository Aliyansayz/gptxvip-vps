import React, { useState, useEffect } from 'react';
import { Wrench, Puzzle } from 'lucide-react';
import { load } from 'js-yaml';
import topicsYamlStr from '../wiki_info/topics.yaml?raw';

interface SkillWikiInfo {
  what_is_it: string;
  what_it_provides: string;
}

export default function ScannerSkillsView() {
  const [wikiInfo, setWikiInfo] = useState<Record<string, SkillWikiInfo>>({});

  useEffect(() => {
    try {
      const parsed = load(topicsYamlStr) as any;
      if (parsed && parsed.skills) {
        setWikiInfo(parsed.skills);
      }
    } catch (error) {
      console.error("Error parsing topics YAML:", error);
    }
  }, []);

  return (
    <div className="p-8 h-full flex flex-col bg-slate-50">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
        <Wrench className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-bold text-slate-800">Skill Library</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {['Nmap Integration', 'Nuclei Scanner', 'Burp Suite API', 'SQLmap', 'Dirsearch', 'Waybackurls'].map(skill => (
          <div key={skill} className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Puzzle className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-slate-800">{skill}</h3>
              </div>
              <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase rounded">Equipped</span>
            </div>
            
            {wikiInfo[skill] ? (
              <div className="mt-2 bg-slate-50 border border-slate-100 rounded-lg p-3 space-y-2 flex-1">
                <p className="text-xs text-slate-700 leading-relaxed">
                  <span className="font-semibold text-slate-900 block mb-0.5">What is it?</span>
                  {wikiInfo[skill].what_is_it}
                </p>
                <p className="text-xs text-slate-700 leading-relaxed">
                  <span className="font-semibold text-slate-900 block mb-0.5">What it provides:</span>
                  {wikiInfo[skill].what_it_provides}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500 mt-2">Provides native capability for agents to utilize {skill} during missions.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

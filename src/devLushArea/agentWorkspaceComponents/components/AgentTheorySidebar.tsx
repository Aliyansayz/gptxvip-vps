import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronDown, Save } from 'lucide-react';
import { toast } from 'sonner';
import { load } from 'js-yaml';
import theoriesYamlStr from './wiki_info/theories.yaml?raw';

import { saveTopicTheory, getSavedTopicTheories } from './TopicTheorySaves';

interface TheoryTopic {
  id: string;
  title: string;
  description: string;
  details: string;
  real_use_case?: string;
  example?: string;
  conceptual_diagram?: string;
  defenses: string[];
  glossary?: { term: string; definition: string }[];
}

interface AgentTheorySidebarProps {
  agentType: 'scanner' | 'ecommerce' | 'devtools' | 'dfir' | 'threat_intel' | 'cloud_posture' | 'sast' | 'red_team';
}

export default function AgentTheorySidebar({ agentType }: AgentTheorySidebarProps) {
  const [agentTheories, setAgentTheories] = useState<Record<string, TheoryTopic[]>>({});
  
  useEffect(() => {
    try {
      const parsed = load(theoriesYamlStr) as any;
      if (parsed) {
        setAgentTheories(parsed);
      }
    } catch (error) {
      console.error("Error parsing theories YAML:", error);
    }
  }, []);

  const theories = agentTheories[agentType] || [];
  const [selectedTheoryId, setSelectedTheoryId] = useState('');
  const [savedTheories, setSavedTheories] = useState(getSavedTopicTheories());

  useEffect(() => {
    if (theories.length > 0) {
      if (!selectedTheoryId || !theories.find(t => t.id === selectedTheoryId)) {
        setSelectedTheoryId(theories[0].id);
      }
    }
  }, [theories, selectedTheoryId]);

  const content = theories.find(t => t.id === selectedTheoryId) || theories[0];
  
  const isSaved = savedTheories.some(s => s.theoryId === content?.id && s.agentType === agentType);

  const handleAutoImport = () => {
    if (!content) return;
    toast.success(`Successfully imported "${content.title}" to global Topic Theory Library`);
  };

  const handleSaveTheory = () => {
    if (!content) return;
    if (isSaved) {
      toast.info(`"${content.title}" is already saved.`);
      return;
    }
    
    const savedTheory = saveTopicTheory({
      theoryId: content.id,
      agentType: agentType,
      title: content.title
    });
    if (!savedTheory) {
      toast.error('Could not save this theory in browser storage.');
      return;
    }
    setSavedTheories((current) => [...current, savedTheory]);
    toast.success(`Saved "${content.title}" to Topic Theory Saves`);
  };

  if (!content) {
    return <div className="p-8 text-slate-500">Loading theories...</div>;
  }

  return (
    <div className="w-full h-full bg-white flex flex-col shadow-sm">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <h2 className="font-bold text-slate-800 text-sm">Theory Wiki Area</h2>
        </div>
        <div className="flex items-center gap-4">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Select Theory Topic:
          </label>
          <div className="relative w-64">
            <select 
              className="w-full appearance-none bg-white border border-slate-200 rounded-lg p-2 pr-8 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all shadow-sm"
              value={selectedTheoryId}
              onChange={(e) => setSelectedTheoryId(e.target.value)}
            >
              {theories.map(t => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 max-w-4xl mx-auto w-full space-y-8">
        <div>
          <h1 className="text-2xl font-bold font-heading mb-3 text-slate-800">{content.title}</h1>
          <p className="text-slate-600 text-base">{content.description}</p>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 border-b border-slate-100 pb-2">Deep Dive</h3>
          <p className="text-slate-700 leading-relaxed">
            {content.details}
          </p>
        </div>

        {(content.real_use_case || content.example) && (
          <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            {content.real_use_case && (
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">Real World Use Case</h4>
                <p className="text-sm text-slate-800">{content.real_use_case}</p>
              </div>
            )}
            {content.example && (
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">Example</h4>
                <div className="bg-slate-800 text-slate-200 p-3 rounded-lg text-sm font-mono mt-1 overflow-x-auto">
                  {content.example}
                </div>
              </div>
            )}
          </div>
        )}

        {content.conceptual_diagram && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 border-b border-slate-100 pb-2">Conceptual Diagram</h3>
            <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-xs whitespace-pre overflow-x-auto">
              {content.conceptual_diagram}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 border-b border-slate-100 pb-2">Key Concepts / Defenses</h3>
          <ul className="space-y-3">
            {content.defenses.map((defense, idx) => (
              <li key={idx} className="flex items-start gap-3 text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-indigo-500 mt-0.5 font-bold">•</span>
                <span>{defense}</span>
              </li>
            ))}
          </ul>
        </div>

        {content.glossary && content.glossary.length > 0 && (
          <div className="pt-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 mb-4 border-b border-slate-100 pb-2">Glossary</h3>
            <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm bg-white">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-3 border-b border-slate-200 font-semibold w-1/3 text-xs uppercase tracking-wider text-slate-500">Term</th>
                    <th className="p-3 border-b border-slate-200 font-semibold text-xs uppercase tracking-wider text-slate-500">Definition</th>
                  </tr>
                </thead>
                <tbody>
                  {content.glossary.map((g, i) => (
                    <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                      <td className="p-3 align-top font-mono text-sm text-slate-800 font-medium">{g.term}</td>
                      <td className="p-3 text-sm text-slate-600">{g.definition}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        <div className="pt-6 pb-12 flex justify-end">
          <button 
            onClick={handleSaveTheory}
            className={`flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold transition-colors shadow-sm hover:shadow-md border ${
              isSaved
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700 hover:border-indigo-700'
            }`}
          >
            <Save className="w-5 h-5" />
            {isSaved ? 'Saved to Topic Theory Saves' : 'Save Theory'}
          </button>
        </div>
      </div>
    </div>
  );
}

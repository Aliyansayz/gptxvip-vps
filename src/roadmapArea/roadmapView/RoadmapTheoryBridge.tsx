import React, { useState } from 'react';
import { Lightbulb, ShieldAlert, Cpu, Code } from 'lucide-react';
import { RoadmapTheoryVisual } from './RoadmapTheoryVisual';
import { ChevronDownIcon, BookOpenText } from '../../devLushArea/agentDevRootComponents/icons';
import SaveTheoryButton from '../../devLushArea/agentDevRootComponents/TopicTheoryView/SaveTheoryButton';

interface TheoryItem {
  title: string;
  content: string;
  analogy?: string;
  application?: string;
  visual_element?: string;
}

interface RoadmapTheoryBridgeProps {
  item: {
    labId?: string;
    exerciseTitle?: string;
    theory: TheoryItem;
  };
}

export const RoadmapTheoryBridge: React.FC<RoadmapTheoryBridgeProps> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { title, content, analogy, application, visual_element } = item.theory;

  return (
    <div className="bg-white dark:bg-slate-900 h-full flex flex-col space-y-4">
      {/* Theory Header / Accordion Toggle */}
      <div 
        className="cursor-pointer w-full flex justify-between items-center text-lg font-bold text-slate-900 dark:text-white"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2 font-heading tracking-wide text-indigo-600 dark:text-indigo-400">
          <BookOpenText className="w-5 h-5" />
          {title}
        </span>
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <SaveTheoryButton theory={item.theory} />
          <ChevronDownIcon className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && (
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 animate-fade-in space-y-6">
          <div className="flex items-center gap-2 text-indigo-500 mb-1">
            <Cpu className="w-4 h-4 animate-pulse" />
            <span className="text-xs font-bold tracking-wider uppercase">Agent Theory Blueprint</span>
          </div>

          {/* Main Narrative/Content */}
          <div className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
            <div 
              className="leading-relaxed space-y-4" 
              dangerouslySetInnerHTML={{ __html: content }} 
            />
          </div>

          {/* Dynamic SVG Visuals (Mirror Pattern) */}
          <RoadmapTheoryVisual 
             analogyName={title} 
             keywords={[visual_element || '', title, content, item.exerciseTitle || '']} 
          />

          {/* Analogy Card */}
          {analogy && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/10 rounded-xl border border-amber-200 dark:border-amber-900/30">
              <h4 className="text-sm font-bold text-slate-900 dark:text-amber-400 mb-2 flex items-center gap-2 uppercase tracking-wider">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                Conceptual Analogy
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm italic leading-relaxed mb-3">
                "{analogy}"
              </p>
              <div className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-900/30">
                  <RoadmapTheoryVisual analogyName={analogy} keywords={[analogy, title]} />
              </div>
            </div>
          )}

          {/* Production Application / Architectural Guardrail */}
          {application && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/10 rounded-xl border border-emerald-200 dark:border-emerald-900/30">
              <h4 className="text-sm font-bold text-slate-900 dark:text-emerald-400 mb-2 flex items-center gap-2 uppercase tracking-wider">
                <Code className="w-4 h-4 text-emerald-500" />
                Production Guardrails
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {application}
              </p>
            </div>
          )}

          {/* AI Agent Danger Notice (Operational Pain Point highlights) */}
          <div className="p-4 bg-rose-50 dark:bg-rose-950/10 rounded-xl border border-rose-200 dark:border-rose-900/30">
            <h4 className="text-sm font-bold text-slate-900 dark:text-rose-400 mb-1 flex items-center gap-2 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              Critical Failure Vector
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Uncontrolled agent context loops, injection vulnerabilities, and race conditions account for over 90% of autonomous business agent financial and resource overhead leakages.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapTheoryBridge;

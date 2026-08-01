import React, { useState } from 'react';
import { Lightbulb, ShieldAlert, Cpu, Code } from 'lucide-react';
import { DevLushTheoryVisual } from './DevLushTheoryVisual';
import { ChevronDownIcon, BookOpenText } from '../../agentDevRootComponents/icons';
import SaveTheoryButton from '../../agentDevRootComponents/TopicTheoryView/SaveTheoryButton';

interface TheoryItem {
  title: string;
  content: string;
  analogy?: string;
  application?: string;
  visual_element?: string;
  critical_failure_vector?: string;
  key_characteristics?: string;
}

interface DevLushTheoryBridgeProps {
  item: {
    labId?: string;
    exerciseTitle?: string;
    theory: TheoryItem;
  };
}

export const DevLushTheoryBridge: React.FC<DevLushTheoryBridgeProps> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { title, content, analogy, application, visual_element, critical_failure_vector, key_characteristics } = item.theory;

  return (
    <div className="bg-white dark:bg-slate-900 h-full flex flex-col space-y-4">
      {/* Theory Header / Accordion Toggle */}
      <div
        className="cursor-pointer w-full flex justify-between items-center text-lg font-bold text-slate-900 dark:text-white"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2 font-heading tracking-wide text-indigo-600 dark:text-indigo-400">
          {title}
        </span>
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <SaveTheoryButton
            theory={item.theory}
            labId={item.labId}
            exerciseTitle={item.exerciseTitle}
            courseType="devLush"
          />
          <ChevronDownIcon className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && (
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 animate-fade-in space-y-6">
          <div className="flex items-center gap-2 text-indigo-500 mb-1">
            {/* <Cpu className="w-4 h-4 animate-pulse" /> */}
            {/* <span className="text-xs font-bold tracking-wider uppercase">Agent Theory Blueprint</span>  */}
          </div>

          {/* Main Narrative/Content */}
          <div className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
            <div
              className="leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>

          {/* Dynamic SVG Visuals (Mirror Pattern) */}
          <DevLushTheoryVisual
            analogyName={title}
            keywords={[visual_element || '', title, content, item.exerciseTitle || '']}
          />

          {/* Analogy Card */}
          {analogy && (() => {
            // Hash to select a color theme and icon
            const hash = Array.from(title).reduce((acc, char) => acc + char.charCodeAt(0), 0);
            
            const themes = [
              { bg: 'bg-amber-50 dark:bg-amber-950/10', border: 'border-amber-200 dark:border-amber-900/30', text: 'text-amber-400', iconColor: 'text-amber-500', Icon: Lightbulb },
              { bg: 'bg-indigo-50 dark:bg-indigo-950/10', border: 'border-indigo-200 dark:border-indigo-900/30', text: 'text-indigo-400', iconColor: 'text-indigo-500', Icon: Code },
              { bg: 'bg-emerald-50 dark:bg-emerald-950/10', border: 'border-emerald-200 dark:border-emerald-900/30', text: 'text-emerald-400', iconColor: 'text-emerald-500', Icon: ShieldAlert },
              { bg: 'bg-sky-50 dark:bg-sky-950/10', border: 'border-sky-200 dark:border-sky-900/30', text: 'text-sky-400', iconColor: 'text-sky-500', Icon: Cpu },
              { bg: 'bg-fuchsia-50 dark:bg-fuchsia-950/10', border: 'border-fuchsia-200 dark:border-fuchsia-900/30', text: 'text-fuchsia-400', iconColor: 'text-fuchsia-500', Icon: Lightbulb },
            ];
            
            const theme = themes[hash % themes.length];
            const Icon = theme.Icon;
            
            return (
              <div className={`p-4 rounded-xl border ${theme.bg} ${theme.border}`}>
                <h4 className={`text-sm font-bold text-slate-900 dark:${theme.text} mb-2 flex items-center gap-2 uppercase tracking-wider`}>
                  <Icon className={`w-4 h-4 ${theme.iconColor}`} />
                  Conceptual Analogy
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm italic leading-relaxed mb-3">
                  "{analogy}"
                </p>
                <div className={`mt-4 pt-4 border-t ${theme.border}`}>
                  <DevLushTheoryVisual analogyName={analogy} keywords={[analogy, title]} />
                </div>
              </div>
            );
          })()}

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

          {/* AI Agent Danger Notice (Operational Pain Point highlights) / Key Characteristics */}
          {(critical_failure_vector || key_characteristics) && (
            <div className={`p-4 rounded-xl border ${critical_failure_vector ? 'bg-rose-50 dark:bg-rose-950/10 border-rose-200 dark:border-rose-900/30' : 'bg-indigo-50 dark:bg-indigo-950/10 border-indigo-200 dark:border-indigo-900/30'}`}>
              <h4 className={`text-sm font-bold mb-1 flex items-center gap-2 uppercase tracking-wider ${critical_failure_vector ? 'text-slate-900 dark:text-rose-400' : 'text-slate-900 dark:text-indigo-400'}`}>
                {critical_failure_vector ? <ShieldAlert className="w-4 h-4 text-rose-500" /> : <Lightbulb className="w-4 h-4 text-indigo-500" />}
                {critical_failure_vector ? 'Critical Failure Vector' : 'Key Characteristics'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {critical_failure_vector || key_characteristics}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DevLushTheoryBridge;

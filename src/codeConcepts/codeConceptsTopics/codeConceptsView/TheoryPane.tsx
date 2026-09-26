import React from 'react';
import { CriticalConcept } from '../../../types';
import { Lightbulb } from 'lucide-react';
import { componentRegistry } from '../../codeConceptsTopicsRegistry/componentRegistry';

interface TheoryPaneProps {
  concepts: CriticalConcept[];
  themeColor?: string;
  categoryId?: string;
}

export const TheoryPane: React.FC<TheoryPaneProps> = ({ concepts, themeColor = 'indigo', categoryId }) => {
  if (!concepts || concepts.length === 0) return null;

  return (
    <div className="mb-12 space-y-8">
      {concepts.map((concept, idx) => {
        // Resolve custom visual components mapped to concepts if applicable
        let VisualComponent = concept.componentId ? componentRegistry[concept.componentId] : null;

        if (!VisualComponent) {
          if (categoryId === 'cpp_engine_design') {
             if (concept.concept.includes('Low Latency')) {
                VisualComponent = componentRegistry['cpp_low_latency'];
             } else if (concept.concept.includes('Order Book')) {
                VisualComponent = componentRegistry['cpp_order_book'];
             } else if (concept.concept.includes('Hierarchy')) {
                VisualComponent = componentRegistry['cpp_hft_stack'];
             } else if (concept.concept.includes('Volatility')) {
                VisualComponent = componentRegistry['cpp_volatility_response'];
             } else if (concept.concept.includes('Pipelines')) {
                VisualComponent = componentRegistry['cpp_pipelines'];
             } else if (concept.concept.includes('Padding')) {
                VisualComponent = componentRegistry['cpp_struct_padding'];
             }
          } else if (categoryId === 'cpp_hello_world') {
             if (concept.concept.includes('Compiled')) {
                VisualComponent = componentRegistry['cpp_compiled_visual'];
             } else if (concept.concept.includes('Memory')) {
                VisualComponent = componentRegistry['cpp_memory_visual'];
             } else if (concept.concept.includes('Object-Oriented') || concept.concept.includes('OOP')) {
                VisualComponent = componentRegistry['cpp_oop_visual'];
             }
          }
        }

        return (
          <div key={idx} className="flex flex-col gap-5 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/50 sm:gap-8 sm:p-6 lg:flex-row lg:p-8">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                 <div className={`p-2 rounded-lg ${themeColor === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500' : themeColor === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-500' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500'}`}>
                   <Lightbulb className="w-5 h-5" />
                 </div>
                 <h3 className="text-xl font-bold dark:text-zinc-100">{concept.concept}</h3>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm md:text-base">
                {concept.elaboration}
              </p>
              {(concept.visual_prompt || concept.visual_interactive_prompt) && !VisualComponent && (
                 <div className="mt-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500 italic border-dashed">
                    [Visual Prompt] {concept.visual_prompt || concept.visual_interactive_prompt}
                 </div>
              )}
            </div>
            
            {(VisualComponent || concept.visual_prompt || concept.visual_interactive_prompt) && (
              <div className="w-full min-w-0 lg:flex-1 flex items-center justify-center overflow-hidden">
                {VisualComponent ? <VisualComponent componentId={concept.componentId} exercise={concept} themeColor={themeColor} /> : (
                  <div className="w-full h-48 rounded-xl bg-zinc-100 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-400">
                     Visual placeholder for: {concept.concept}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

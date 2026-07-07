import React, { useState } from 'react';
import { Folder, File, FileCode, ShieldBan, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Exercise } from '../../../../types';
import { LabSettings } from '../../../agentDevRootComponents/LabSettingsMenu';
import { DevLushLayout } from '../../devLushTopicsView/DevLushLayout';
import SaveTheoryButton from '../../../agentDevRootComponents/TopicTheoryView/SaveTheoryButton';
import { DevLushTheoryBridge } from '../../devLushTopicsView/DevLushTheoryBridge';

interface ChapterProps {
  step?: number;
  exercises?: Exercise[];
  infoVisible?: boolean;
  infoPlacement?: 'side' | 'bottom';
  settings?: LabSettings;
}


const PathTraversalClimberContent = () => {
  const [filePath, setFilePath] = useState('logo.png');
  const [defense, setDefense] = useState<'vulnerable' | 'secure'>('vulnerable');
  const [status, setStatus] = useState<'idle' | 'climbing' | 'success' | 'blocked'>('idle');
  const [currentStep, setCurrentStep] = useState(0);

  const handleFetch = () => {
    setStatus('climbing');
    setCurrentStep(0);
    
    const steps = filePath.split('/');
    let current = 0;

    const interval = setInterval(() => {
      current++;
      setCurrentStep(current);
      
      if (defense === 'secure' && filePath.includes('../')) {
         clearInterval(interval);
         setStatus('blocked');
      } else if (current >= steps.length) {
         clearInterval(interval);
         setStatus('success');
      }
    }, 600);
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">File Fetcher API</h3>
          <div className="flex items-center gap-2 mb-3">
             <span className="text-gray-400 font-mono text-sm">?file=</span>
             <input
               value={filePath}
               onChange={(e) => { setFilePath(e.target.value); setStatus('idle'); }}
               className="flex-1 bg-gray-950 border border-gray-800 rounded p-2 text-sm text-amber-400 font-mono"
             />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setFilePath('logo.png')} className="px-2 py-1 bg-gray-800 rounded text-xs">Normal</button>
            <button onClick={() => setFilePath('../../../../etc/passwd')} className="px-2 py-1 bg-gray-800 rounded text-xs text-red-400">Attack Payload</button>
          </div>
          <button
            onClick={handleFetch}
            disabled={status === 'climbing'}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium disabled:opacity-50 w-full"
          >
            Read File
          </button>
        </div>

        <div className="flex-1 border-l border-gray-800 pl-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Path Normalization & Allowlisting</h3>
          <div className="flex flex-col gap-2">
            <label className={`flex items-center gap-3 p-2 rounded cursor-pointer border ${defense === 'vulnerable' ? 'bg-red-900/20 border-red-800/50' : 'bg-gray-950 border-gray-800'}`}>
              <input type="radio" checked={defense === 'vulnerable'} onChange={() => { setDefense('vulnerable'); setStatus('idle'); }} />
              <div>
                <div className="text-sm font-medium text-gray-200">Vulnerable (Direct read)</div>
              </div>
            </label>
            <label className={`flex items-center gap-3 p-2 rounded cursor-pointer border ${defense === 'secure' ? 'bg-emerald-900/20 border-emerald-800/50' : 'bg-gray-950 border-gray-800'}`}>
              <input type="radio" checked={defense === 'secure'} onChange={() => { setDefense('secure'); setStatus('idle'); }} />
              <div>
                <div className="text-sm font-medium text-gray-200">Sandboxed (Base path enforced)</div>
                <div className="text-xs text-gray-500">Resolves path and checks if within /var/www/html/images/</div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-gray-950 border border-gray-800 rounded-lg p-6 relative min-h-[300px]">
         <h3 className="text-sm font-semibold text-gray-400 mb-4">Server File System</h3>
         
         <div className="flex flex-col gap-1 font-mono text-sm ml-4 border-l border-gray-800 pl-4 relative">
            <div className={`flex items-center gap-2 p-1 rounded ${filePath.includes('etc/passwd') && status === 'success' ? 'bg-red-900/30' : ''}`}>
              <Folder className="w-4 h-4 text-blue-400" /> <span className="text-gray-300">/</span>
            </div>
            <div className="ml-4 border-l border-gray-800 pl-4 flex flex-col gap-1">
               <div className="flex items-center gap-2 p-1">
                 <Folder className="w-4 h-4 text-blue-400" /> <span className="text-gray-300">etc</span>
               </div>
               <div className="ml-4 border-l border-gray-800 pl-4">
                  <div className={`flex items-center gap-2 p-1 rounded ${filePath.includes('etc/passwd') && status === 'success' ? 'bg-red-900/50 text-red-200' : 'text-gray-400'}`}>
                    <FileCode className="w-4 h-4" /> passwd
                  </div>
               </div>
               
               <div className="flex items-center gap-2 p-1">
                 <Folder className="w-4 h-4 text-blue-400" /> <span className="text-gray-300">var</span>
               </div>
               <div className="ml-4 border-l border-gray-800 pl-4 flex flex-col gap-1">
                  <div className="flex items-center gap-2 p-1">
                    <Folder className="w-4 h-4 text-blue-400" /> <span className="text-gray-300">www</span>
                  </div>
                  <div className="ml-4 border-l border-gray-800 pl-4 flex flex-col gap-1">
                     <div className="flex items-center gap-2 p-1">
                       <Folder className="w-4 h-4 text-blue-400" /> <span className="text-gray-300">html</span>
                     </div>
                     <div className="ml-4 border-l border-gray-800 pl-4 flex flex-col gap-1 relative">
                        {/* The Sandbox Boundary */}
                        {defense === 'secure' && (
                           <div className="absolute -inset-2 border border-emerald-900 bg-emerald-950/10 rounded pointer-events-none z-0" />
                        )}
                        <div className="flex items-center gap-2 p-1 relative z-10">
                          <Folder className="w-4 h-4 text-blue-400" /> <span className="text-gray-300">images</span>
                        </div>
                        <div className="ml-4 border-l border-gray-800 pl-4 relative z-10">
                           <div className={`flex items-center gap-2 p-1 rounded ${filePath === 'logo.png' && status === 'success' ? 'bg-emerald-900/50 text-emerald-200' : 'text-gray-400'}`}>
                             <File className="w-4 h-4" /> logo.png
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Animation Overlay */}
            <AnimatePresence>
               {status === 'climbing' && (
                  <motion.div 
                    className="absolute w-4 h-4 bg-amber-400 rounded-full shadow-[0_0_10px_#fbbf24] z-20 left-4 bottom-8"
                    animate={{ 
                       y: [0, -30, -60, -90, -120].slice(0, currentStep + 1),
                       x: [0, -10, -20, -30, -10].slice(0, currentStep + 1)
                    }}
                    transition={{ duration: 0.5 }}
                  />
               )}
            </AnimatePresence>
         </div>

         <AnimatePresence>
          {status === 'blocked' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 right-4 bg-emerald-950 border border-emerald-800 text-emerald-400 p-3 rounded shadow-lg text-sm font-medium z-20 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> Traversal Blocked! Path escapes /images/ directory.
            </motion.div>
          )}
          {status === 'success' && filePath.includes('etc/passwd') && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 right-4 bg-red-950 border border-red-800 text-red-400 p-3 rounded shadow-lg text-sm font-medium z-20 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2"><ShieldBan className="w-4 h-4" /> Critical File Extracted!</div>
              <div className="text-xs font-mono opacity-80">root:x:0:0:root:/root:/bin/bash</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


export default function PathTraversalClimber(props: ChapterProps) {
  if (!props.exercises || props.step === undefined) return <PathTraversalClimberContent />;
  
  const question = props.exercises[props.step];
  if (!question) return <PathTraversalClimberContent />;

  const theoryData = question.theory || (question.theory_explanation ? {
    title: question.title || "Theory Concept",
    content: question.theory_explanation,
    analogy: question.real_world_analogy
  } : null);

  const theoryContent = theoryData ? (
    <div className="h-full flex flex-col">
      <div className="flex justify-end items-center mb-2">
        <SaveTheoryButton theory={theoryData} />
      </div>
      <div className="flex-1">
        <DevLushTheoryBridge item={{ labId: 'cybersecurity', exerciseTitle: question.title, theory: theoryData }} />
      </div>
    </div>
  ) : null;

  return (
    <DevLushLayout
      title={question.title}
      prompt={question.prompt}
      exerciseContent={<PathTraversalClimberContent />}
      theoryContent={theoryContent}
      infoVisible={!!props.infoVisible && !!theoryData}
      infoPlacement={props.infoPlacement || 'side'}
      settings={props.settings}
    />
  );
}

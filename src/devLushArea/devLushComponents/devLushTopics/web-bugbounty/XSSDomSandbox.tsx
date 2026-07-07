import React, { useState } from 'react';
import { Shield, ShieldAlert, Code, Eye, RefreshCw, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

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


const XSSDomSandboxContent = () => {
  const [payload, setPayload] = useState("<img src=x onerror=alert('XSS')>");
  const [protection, setProtection] = useState<'none' | 'encode'>('none');
  const [isAttacked, setIsAttacked] = useState(false);

  const encodedPayload = protection === 'encode' 
    ? payload.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    : payload;

  const handleSimulate = () => {
    setIsAttacked(true);
    setTimeout(() => setIsAttacked(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left Pane - Attacker Input */}
        <div className="flex-1 bg-gray-900 border border-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <Code className="w-4 h-4 text-emerald-400" />
            The Vector (Attacker Input)
          </h3>
          <textarea
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded p-3 text-emerald-400 font-mono text-sm mb-4 h-24"
            placeholder="Enter XSS payload..."
          />
          
          <div className="flex flex-col gap-3">
             <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Defense Mechanism</h4>
             <div className="flex gap-2">
                <button
                  onClick={() => setProtection('none')}
                  className={`flex-1 py-2 px-3 rounded text-xs font-medium border ${protection === 'none' ? 'bg-red-900/30 border-red-800 text-red-400' : 'bg-gray-800 border-gray-700 text-gray-400'}`}
                >
                  Raw (Vulnerable)
                </button>
                <button
                  onClick={() => setProtection('encode')}
                  className={`flex-1 py-2 px-3 rounded text-xs font-medium border ${protection === 'encode' ? 'bg-emerald-900/30 border-emerald-800 text-emerald-400' : 'bg-gray-800 border-gray-700 text-gray-400'}`}
                >
                  Context Encode
                </button>
             </div>
             
             <button
               onClick={handleSimulate}
               className="mt-2 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-sm flex items-center justify-center gap-2"
             >
               <RefreshCw className="w-4 h-4" /> Simulate Execution
             </button>
          </div>
        </div>

        {/* Right Pane - DOM Output */}
        <div className="flex-1 bg-gray-900 border border-gray-800 rounded-lg p-4 flex flex-col">
          <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-400" />
            Rendered Output & DOM
          </h3>
          <div className="flex-1 bg-white rounded p-4 text-gray-800 mb-4 overflow-hidden relative">
             <p className="text-sm text-gray-600 mb-2">User Comment:</p>
             {protection === 'none' && isAttacked ? (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-red-100 border border-red-300 p-3 rounded text-red-700 text-xs font-mono break-all"
                >
                  [Execution!] Script alert('XSS') ran.
                </motion.div>
             ) : (
                <div className="text-sm break-all font-mono">
                  {encodedPayload}
                </div>
             )}
          </div>
          <div className="bg-gray-950 p-3 rounded border border-gray-800 font-mono text-xs text-gray-400">
            {'<div class="comment">'}<br/>
            &nbsp;&nbsp;{protection === 'none' && isAttacked ? <span className="text-red-400">{payload}</span> : <span className="text-emerald-400">{encodedPayload}</span>}<br/>
            {'</div>'}
          </div>
        </div>
      </div>

      {/* Bottom Bar - The Vault */}
      <div className={`p-4 rounded-lg border transition-colors duration-500 flex items-center justify-between ${protection === 'none' && isAttacked ? 'bg-red-900/20 border-red-800' : 'bg-gray-900 border-gray-800'}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${protection === 'none' && isAttacked ? 'bg-red-900/50' : 'bg-gray-800'}`}>
            {protection === 'none' && isAttacked ? <ShieldAlert className="w-5 h-5 text-red-400" /> : <Shield className="w-5 h-5 text-gray-400" />}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-200">Victim's Browser Storage (Cookies)</h4>
            <p className="text-xs text-gray-500">session_id=abc123xyz890</p>
          </div>
        </div>
        {protection === 'none' && isAttacked && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-red-400 text-sm font-semibold bg-red-950/50 px-3 py-1 rounded border border-red-900"
          >
            ! Cookies Exfiltrated
          </motion.div>
        )}
        {protection === 'encode' && isAttacked && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-emerald-400 text-sm font-semibold bg-emerald-950/50 px-3 py-1 rounded border border-emerald-900 flex items-center gap-2"
          >
            <Lock className="w-4 h-4" /> Secured
          </motion.div>
        )}
      </div>
    </div>
  );
}


export default function XSSDomSandbox(props: ChapterProps) {
  if (!props.exercises || props.step === undefined) return <XSSDomSandboxContent />;
  
  const question = props.exercises[props.step];
  if (!question) return <XSSDomSandboxContent />;

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
      exerciseContent={<XSSDomSandboxContent />}
      theoryContent={theoryContent}
      infoVisible={!!props.infoVisible && !!theoryData}
      infoPlacement={props.infoPlacement || 'side'}
      settings={props.settings}
    />
  );
}

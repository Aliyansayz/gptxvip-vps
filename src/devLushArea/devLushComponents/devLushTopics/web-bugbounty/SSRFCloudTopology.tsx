import React, { useState } from 'react';
import { Cloud, Server, Database, Globe, ShieldBan, Network, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Exercise } from '../../devLushTypes';

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


const SSRFCloudTopologyContent = () => {
  const [url, setUrl] = useState('http://169.254.169.254/latest/meta-data/iam/');
  const [defense, setDefense] = useState<'vulnerable' | 'isolated'>('vulnerable');
  const [simulating, setSimulating] = useState(false);
  const [result, setResult] = useState<'none' | 'success' | 'blocked'>('none');

  const handleFetch = () => {
    setSimulating(true);
    setResult('none');

    // Animate packet to server
    setTimeout(() => {
      if (defense === 'isolated') {
        setResult('blocked');
        setSimulating(false);
      } else {
        // Animate server to metadata
        setTimeout(() => {
          setResult('success');
          setSimulating(false);
        }, 1500);
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Control Panel */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Application: Image Fetcher</h3>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-gray-950 border border-gray-800 rounded p-2 text-sm text-gray-300 font-mono"
              placeholder="Enter URL to fetch..."
            />
            <button
              onClick={handleFetch}
              disabled={simulating}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium disabled:opacity-50"
            >
              Fetch
            </button>
          </div>
          <p className="text-xs text-gray-500">The application will make an HTTP request to this URL to download an image.</p>
        </div>

        <div className="flex-1 border-l border-gray-800 pl-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <Network className="w-4 h-4 text-emerald-400" /> Network Architecture Rules
          </h3>
          <div className="flex flex-col gap-2">
            <label className={`flex items-center gap-3 p-2 rounded cursor-pointer border ${defense === 'vulnerable' ? 'bg-red-900/20 border-red-800/50' : 'bg-gray-950 border-gray-800'}`}>
              <input type="radio" checked={defense === 'vulnerable'} onChange={() => setDefense('vulnerable')} />
              <div>
                <div className="text-sm font-medium text-gray-200">Flat Network (Vulnerable)</div>
                <div className="text-xs text-gray-500">App Server can access all internal subnets.</div>
              </div>
            </label>
            <label className={`flex items-center gap-3 p-2 rounded cursor-pointer border ${defense === 'isolated' ? 'bg-emerald-900/20 border-emerald-800/50' : 'bg-gray-950 border-gray-800'}`}>
              <input type="radio" checked={defense === 'isolated'} onChange={() => setDefense('isolated')} />
              <div>
                <div className="text-sm font-medium text-gray-200">DNS & VPC Segregation</div>
                <div className="text-xs text-gray-500">Blocks RFC 1918 (Private IP) resolution.</div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Topology Canvas */}
      <div className="bg-gray-950 border border-gray-800 rounded-lg p-8 relative overflow-hidden min-h-[300px] flex items-center justify-between">
        {/* Attacker */}
        <div className="flex flex-col items-center gap-2 relative z-10">
          <div className="w-12 h-12 bg-red-950 border border-red-800 rounded-full flex items-center justify-center">
            <Globe className="w-6 h-6 text-red-400" />
          </div>
          <span className="text-xs font-semibold text-gray-400">Attacker (External)</span>
        </div>

        {/* Network Line 1 */}
        <div className="flex-1 h-px bg-gray-800 relative z-0 mx-4">
          {simulating && (
            <motion.div
              initial={{ left: 0 }}
              animate={{ left: "100%" }}
              transition={{ duration: 1.5, ease: "linear" }}
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]"
            />
          )}
        </div>

        {/* App Server */}
        <div className="flex flex-col items-center gap-2 relative z-10">
          <div className={`w-16 h-16 rounded-xl flex items-center justify-center border-2 transition-colors ${defense === 'isolated' ? 'bg-emerald-950 border-emerald-800' : 'bg-gray-900 border-gray-700'}`}>
            <Server className="w-8 h-8 text-blue-400" />
          </div>
          <span className="text-xs font-semibold text-gray-300">App Server (Public)</span>
          {defense === 'isolated' && (
            <div className="absolute -top-3 -right-3 bg-emerald-900 p-1 rounded-full border border-emerald-700">
              <ShieldBan className="w-3 h-3 text-emerald-400" />
            </div>
          )}
        </div>

        {/* Network Line 2 (Internal) */}
        <div className="flex-1 h-px bg-gray-800 relative z-0 mx-4">
          {defense === 'vulnerable' && simulating && result === 'none' && ( // Packet 2 only starts after Packet 1 arrives (roughly)
            <motion.div
              initial={{ left: 0 }}
              animate={{ left: "100%" }}
              transition={{ delay: 1.5, duration: 1.5, ease: "linear" }}
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_#ef4444]"
            />
          )}
          {result === 'success' && ( // Return packet
            <motion.div
              initial={{ left: "100%" }}
              animate={{ left: 0 }}
              transition={{ duration: 1.5, ease: "linear" }}
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-amber-500 rounded-full shadow-[0_0_10px_#f59e0b]"
            />
          )}
        </div>

        {/* Cloud Metadata */}
        <div className="flex flex-col items-center gap-2 relative z-10">
          <div className="w-14 h-14 bg-indigo-950 border border-indigo-800 rounded-lg flex items-center justify-center">
            <Cloud className="w-6 h-6 text-indigo-400" />
          </div>
          <span className="text-xs font-semibold text-indigo-300">169.254.169.254</span>
          <span className="text-[10px] text-gray-500">(Internal Metadata)</span>
        </div>

        {/* Result Overlay */}
        <AnimatePresence>
          {result === 'blocked' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-1/4 left-1/2 -translate-x-1/2 bg-emerald-950 border border-emerald-800 text-emerald-400 p-3 rounded shadow-lg text-sm font-medium z-20 flex items-center gap-2"
            >
              <ShieldBan className="w-4 h-4" /> SSRF Blocked! Internal IP resolution denied.
            </motion.div>
          )}
          {result === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-950 border border-red-800 text-red-400 p-4 rounded shadow-lg text-sm font-medium z-20 flex flex-col gap-2 max-w-sm"
            >
              <div className="flex items-center gap-2 border-b border-red-900 pb-2">
                <ShieldAlert className="w-4 h-4" /> Critical Data Exfiltrated!
              </div>
              <div className="font-mono text-xs opacity-80">
                {`{
  "AccessKeyId": "ASIA...1234",
  "SecretAccessKey": "abc...xyz",
  "Token": "IQoJb3Jp..."
}`}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


export default function SSRFCloudTopology(props: ChapterProps) {
  if (!props.exercises || props.step === undefined) return <SSRFCloudTopologyContent />;

  const question = props.exercises[props.step];
  if (!question) return <SSRFCloudTopologyContent />;

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
      exerciseContent={<SSRFCloudTopologyContent />}
      theoryContent={theoryContent}
      infoVisible={!!props.infoVisible && !!theoryData}
      infoPlacement={props.infoPlacement || 'side'}
      settings={props.settings}
    />
  );
}

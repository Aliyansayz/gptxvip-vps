import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Database, Plus, Trash2 } from 'lucide-react';

export const MemoryManagementVisual: React.FC = () => {
  const [allocationState, setAllocationState] = useState<'idle' | 'allocating' | 'allocated' | 'freeing'>('idle');

  useEffect(() => {
    const cycle = async () => {
      while (true) {
        setAllocationState('allocating');
        await new Promise(r => setTimeout(r, 1500));
        setAllocationState('allocated');
        await new Promise(r => setTimeout(r, 2000));
        setAllocationState('freeing');
        await new Promise(r => setTimeout(r, 1500));
        setAllocationState('idle');
        await new Promise(r => setTimeout(r, 1000));
      }
    };
    cycle();
  }, []);

  return (
    <div className="flex items-center justify-center w-full relative z-10 p-4">
      <svg viewBox="0 0 500 250" className="w-full h-auto max-w-[500px]" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gradHeap" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#27272a" />
            <stop offset="100%" stopColor="#18181b" />
          </linearGradient>
          <linearGradient id="gradPointer" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id="gradAllocated" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="gradFreed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
          <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Code Block Context */}
        <rect x="50" y="20" width="400" height="40" rx="6" fill="#18181b" stroke="#3f3f46" />
        <text x="250" y="45" fill="white" fontSize="14" fontFamily="monospace" textAnchor="middle">
          {allocationState === 'allocating' || allocationState === 'allocated' 
             ? "int* ptr = new int;" 
             : allocationState === 'freeing' 
               ? "delete ptr;" 
               : "// waiting..."}
        </text>

        {/* Heap Memory Frame */}
        <rect x="150" y="100" width="300" height="100" rx="8" fill="url(#gradHeap)" stroke="#52525b" strokeWidth="2" />
        <text x="300" y="190" fill="#a1a1aa" fontSize="10" textAnchor="middle" letterSpacing="2">HEAP MEMORY</text>

        {/* Memory Grid Cells */}
        {[0, 1, 2, 3].map((col) => (
          <React.Fragment key={col}>
            <rect x={170 + col * 60} y="120" width="40" height="40" rx="4" fill="#3f3f46" />
            <text x={190 + col * 60} y="145" fill="#71717a" fontSize="10" textAnchor="middle">0x{col}A</text>
          </React.Fragment>
        ))}

        {/* The Animated Memory Cell (Index 1) */}
        <motion.rect 
          x="230" y="120" width="40" height="40" rx="4"
          initial={{ fill: "#3f3f46" }}
          animate={{ 
            fill: allocationState === 'allocated' ? "url(#gradAllocated)" 
                : allocationState === 'freeing' ? "url(#gradFreed)" : "#3f3f46" 
          }}
          transition={{ duration: 0.3 }}
          filter={(allocationState === 'allocated' || allocationState === 'freeing') ? "url(#glowGreen)" : ""}
        />
        {(allocationState === 'allocating' || allocationState === 'allocated') && (
           <motion.text 
             x="250" y="145" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle"
             initial={{ opacity: 0 }} animate={{ opacity: 1 }}
           >
             42
           </motion.text>
        )}

        {/* Pointer Reference */}
        <motion.g 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: (allocationState === 'allocated' || allocationState === 'allocating') ? 1 : 0, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <rect x="50" y="120" width="60" height="40" rx="6" fill="url(#gradPointer)" />
          <text x="80" y="145" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">ptr</text>
          
          <path d="M 110 140 L 220 140" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
          <polygon points="220,135 230,140 220,145" fill="#3b82f6" />
        </motion.g>

        {/* Freeing Cross */}
        {allocationState === 'freeing' && (
          <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
             <line x1="235" y1="125" x2="265" y2="155" stroke="white" strokeWidth="4" />
             <line x1="265" y1="125" x2="235" y2="155" stroke="white" strokeWidth="4" />
          </motion.g>
        )}
      </svg>
    </div>
  );
};

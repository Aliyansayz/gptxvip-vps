import React from 'react';
import { motion } from 'motion/react';
import { FileCode2, Settings, Binary, PlaySquare, ArrowRight } from 'lucide-react';

export const CompiledLanguageVisual: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full relative z-10 p-4">
      <svg viewBox="0 0 500 200" className="w-full h-auto max-w-[500px]" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Definitions */}
        <defs>
          <linearGradient id="gradSource" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id="gradCompile" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="gradMachine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="gradExec" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6d28d9" />
          </linearGradient>
          
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Connecting Lines */}
        <path d="M 80 100 L 180 100" stroke="#71717a" strokeWidth="2" strokeDasharray="4 4" />
        <path d="M 220 100 L 320 100" stroke="#71717a" strokeWidth="2" strokeDasharray="4 4" />
        <path d="M 360 100 L 460 100" stroke="#71717a" strokeWidth="2" strokeDasharray="4 4" />

        {/* Animated Arrows */}
        <motion.polygon 
          points="130,96 140,100 130,104" 
          fill="#3b82f6"
          animate={{ x: [0, 20, 0] }} 
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
        <motion.polygon 
          points="270,96 280,100 270,104" 
          fill="#f59e0b"
          animate={{ x: [0, 20, 0] }} 
          transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
        />
        <motion.polygon 
          points="410,96 420,100 410,104" 
          fill="#10b981"
          animate={{ x: [0, 20, 0] }} 
          transition={{ repeat: Infinity, duration: 1.5, delay: 1 }}
        />

        {/* Blocks */}
        {/* Source Code */}
        <motion.g initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <rect x="40" y="60" width="80" height="80" rx="12" fill="url(#gradSource)" filter="url(#glow)"/>
          <text x="80" y="95" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">C++</text>
          <text x="80" y="115" fill="white" fontSize="10" textAnchor="middle">Source</text>
        </motion.g>

        {/* Compiler */}
        <motion.g initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
           <rect x="180" y="60" width="80" height="80" rx="12" fill="url(#gradCompile)" filter="url(#glow)"/>
           <circle cx="220" cy="90" r="10" fill="none" stroke="white" strokeWidth="2"/>
           <line x1="220" y1="80" x2="220" y2="100" stroke="white" strokeWidth="2" />
           <line x1="210" y1="90" x2="230" y2="90" stroke="white" strokeWidth="2" />
           <text x="220" y="115" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">COMPILER</text>
        </motion.g>

        {/* Machine Code */}
        <motion.g initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
           <rect x="320" y="60" width="80" height="80" rx="12" fill="url(#gradMachine)" filter="url(#glow)"/>
           <text x="360" y="90" fill="white" fontSize="12" fontFamily="monospace" textAnchor="middle">0101</text>
           <text x="360" y="105" fill="white" fontSize="12" fontFamily="monospace" textAnchor="middle">1010</text>
           <text x="360" y="125" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">MACHINE</text>
        </motion.g>

        {/* Executable */}
        <motion.g initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }}>
           <rect x="460" y="70" width="60" height="60" rx="30" fill="url(#gradExec)" filter="url(#glow)" />
           <polygon points="485,90 495,100 485,110" fill="white" />
           <text x="490" y="145" fill="#8b5cf6" fontSize="10" textAnchor="middle" fontWeight="bold">EXECUTION</text>
        </motion.g>
      </svg>
    </div>
  );
};

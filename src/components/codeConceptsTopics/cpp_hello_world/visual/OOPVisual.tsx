import React from 'react';
import { motion } from 'motion/react';
import { Box, Car, Battery, Zap, ChevronDown } from 'lucide-react';

export const OOPVisual: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full relative z-10 p-4">
      <svg viewBox="0 0 500 300" className="w-full h-auto max-w-[500px]" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gradClass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#3730a3" />
          </linearGradient>
          <linearGradient id="gradObj1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="gradObj2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <filter id="glowOOP" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Base Class 'Car' */}
        <motion.g initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
          <rect x="150" y="20" width="200" height="100" rx="12" fill="url(#gradClass)" filter="url(#glowOOP)" />
          <text x="250" y="45" fill="white" fontSize="16" fontWeight="bold" textAnchor="middle" letterSpacing="1">CLASS: CAR</text>
          <line x1="170" y1="55" x2="330" y2="55" stroke="white" strokeWidth="1" strokeOpacity="0.3" />
          <text x="170" y="75" fill="#c7d2fe" fontSize="12" fontFamily="monospace">+ int batteryCapacity</text>
          <text x="170" y="95" fill="#c7d2fe" fontSize="12" fontFamily="monospace">+ void drive()</text>
        </motion.g>

        {/* Inheritance Lines */}
        <motion.path 
          d="M 250 120 L 250 160 M 150 160 L 350 160 M 150 160 L 150 190 M 350 160 L 350 190" 
          stroke="#71717a" strokeWidth="2" strokeDasharray="4 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        />
        
        {/* Arrows */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
          <polygon points="145,185 155,185 150,195" fill="#71717a" />
          <polygon points="345,185 355,185 350,195" fill="#71717a" />
        </motion.g>

        {/* Object 1 */}
        <motion.g initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.4, duration: 0.5, type: 'spring' }}>
          <rect x="70" y="200" width="160" height="80" rx="12" fill="url(#gradObj1)" filter="url(#glowOOP)" />
          <text x="150" y="225" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">Object: Car1</text>
          <line x1="90" y1="235" x2="210" y2="235" stroke="white" strokeWidth="1" strokeOpacity="0.3" />
          <text x="150" y="260" fill="#a7f3d0" fontSize="10" textAnchor="middle">inherits Car</text>
        </motion.g>

        {/* Object 2 */}
        <motion.g initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.6, duration: 0.5, type: 'spring' }}>
          <rect x="270" y="200" width="160" height="80" rx="12" fill="url(#gradObj2)" filter="url(#glowOOP)" />
          <text x="350" y="225" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">Object: Car2</text>
          <line x1="290" y1="235" x2="410" y2="235" stroke="white" strokeWidth="1" strokeOpacity="0.3" />
          <text x="350" y="260" fill="#fde68a" fontSize="10" textAnchor="middle">inherits Car</text>
        </motion.g>

      </svg>
    </div>
  );
};

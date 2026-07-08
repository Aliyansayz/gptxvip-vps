import React, { useState, useEffect } from 'react';
import { TheoryVisual } from '../../TheoryVisual';
import { LabData, Exercise } from '../../../types';
import { motion, AnimatePresence } from 'motion/react';

interface CleavageSimulatorProps {
    labData: LabData;
    exercises: Exercise[];
    onComplete: () => void;
}

const CleavageSimulatorActivity: React.FC<CleavageSimulatorProps> = ({ exercises, onComplete }) => {
    const [stage, setStage] = useState(0); // 0: 1 cell, 1: 2 cells, 2: 4 cells, 3: 8 cells, 4: 16 cells

    const cellCounts = [1, 2, 4, 8, 16];
    const currentCells = cellCounts[stage];

    const handleNextStage = () => {
        if (stage < cellCounts.length - 1) {
            setStage(stage + 1);
        } else {
            onComplete();
        }
    };

    const handleReset = () => {
        setStage(0);
    };

    // Generate positions for cells to keep them clustered
    const getCellStyles = (index: number, total: number) => {
        if (total === 1) return { x: 0, y: 0, scale: 1 };
        
        // Simple clustering logic
        const angle = (index / total) * Math.PI * 2;
        const radius = total > 4 ? 40 : 25;
        const offset = total > 8 ? Math.random() * 15 : 0;
        
        return {
            x: Math.cos(angle) * (radius + offset),
            y: Math.sin(angle) * (radius + offset),
            scale: Math.max(0.3, 1 - (stage * 0.15)) // Cells get smaller
        };
    };

    return (
        <div className="w-full flex flex-col items-center justify-center min-h-[500px] p-6">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Cleavage Simulator</h2>
                <p className="text-muted-foreground">Click the embryo to trigger the next division.</p>
                <div className="mt-4 font-mono text-lg">
                    Stage: {stage + 1} | Cells: {currentCells}
                </div>
            </div>

            <div 
                className="relative w-64 h-64 cursor-pointer flex items-center justify-center"
                onClick={handleNextStage}
            >
                {/* SVG Filter for Gooey Effect */}
                <svg className="absolute w-0 h-0">
                    <defs>
                        <filter id="goo">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
                            <feBlend in="SourceGraphic" in2="goo" />
                        </filter>
                    </defs>
                </svg>

                {/* Container with gooey filter */}
                <div 
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ filter: 'url(#goo)' }}
                >
                    <AnimatePresence>
                        {Array.from({ length: currentCells }).map((_, i) => {
                            const { x, y, scale } = getCellStyles(i, currentCells);
                            return (
                                <motion.div
                                    key={`${stage}-${i}`}
                                    initial={{ x: 0, y: 0, scale: scale * 1.5, opacity: 0 }}
                                    animate={{ x, y, scale, opacity: 1 }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    transition={{ type: "spring", stiffness: 100, damping: 15, mass: 1 }}
                                    className="absolute w-32 h-32 bg-blue-500 rounded-full"
                                    style={{
                                        boxShadow: 'inset -10px -10px 20px rgba(0,0,0,0.2)'
                                    }}
                                />
                            );
                        })}
                    </AnimatePresence>
                </div>
                
                {/* Zona Pellucida (Outer Shell) */}
                <div className="absolute inset-0 border-4 border-blue-200/50 rounded-full pointer-events-none" />
            </div>

            <div className="mt-12 flex gap-4">
                <button 
                    onClick={handleReset}
                    className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-muted transition-colors"
                >
                    Reset
                </button>
                {stage === cellCounts.length - 1 && (
                    <button 
                        onClick={onComplete}
                        className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg hover:shadow-orange-500/40"
                    >
                        Complete Activity
                    </button>
                )}
            </div>
        </div>
    );
};

export default CleavageSimulatorActivity;

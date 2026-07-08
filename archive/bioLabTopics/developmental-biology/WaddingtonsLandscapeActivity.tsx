import React, { useState, useEffect } from 'react';
import { TheoryVisual } from '../../TheoryVisual';
import { LabData, Exercise } from '../../../types';
import { motion } from 'motion/react';

interface WaddingtonsLandscapeProps {
    labData: LabData;
    exercises: Exercise[];
    onComplete: () => void;
}

const WaddingtonsLandscapeActivity: React.FC<WaddingtonsLandscapeProps> = ({ onComplete }) => {
    const [ballState, setBallState] = useState<'top' | 'rolling' | 'bottom'>('top');
    const [fate, setFate] = useState<string | null>(null);
    const [path, setPath] = useState<number>(0); // 0: left, 1: middle, 2: right

    const handleDrop = () => {
        if (ballState !== 'top') return;
        
        setBallState('rolling');
        
        // Randomly choose a path
        const chosenPath = Math.floor(Math.random() * 3);
        setPath(chosenPath);

        // Determine fate based on path
        setTimeout(() => {
            setBallState('bottom');
            if (chosenPath === 0) setFate("Neuron (Ectoderm)");
            else if (chosenPath === 1) setFate("Muscle Cell (Mesoderm)");
            else setFate("Gut Cell (Endoderm)");
        }, 2000); // 2 seconds rolling animation
    };

    const handleReset = () => {
        setBallState('top');
        setFate(null);
    };

    // Animation variants for the ball
    const ballVariants = {
        top: { x: 0, y: 0, scale: 1 },
        rolling: (customPath: number) => ({
            x: customPath === 0 ? -100 : customPath === 1 ? 0 : 100,
            y: 200,
            scale: 0.8,
            transition: { 
                duration: 2, 
                ease: "easeInOut" as const,
                times: [0, 0.5, 1],
                // Add a little bounce/wobble in the middle
                x: [0, customPath === 0 ? -50 : customPath === 1 ? 20 : 50, customPath === 0 ? -100 : customPath === 1 ? 0 : 100]
            }
        }),
        bottom: (customPath: number) => ({
            x: customPath === 0 ? -100 : customPath === 1 ? 0 : 100,
            y: 200,
            scale: 1.2,
            boxShadow: "0px 0px 20px 5px rgba(255, 255, 255, 0.8)"
        })
    };

    return (
        <div className="w-full flex flex-col items-center justify-center min-h-[600px] p-6">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Waddington's Epigenetic Landscape</h2>
                <p className="text-muted-foreground">Drop the pluripotent stem cell to see its fate.</p>
            </div>

            <div className="relative w-full max-w-md h-[400px] bg-card rounded-2xl shadow-inner border border-border overflow-hidden flex flex-col items-center">
                
                {/* Background Landscape SVG */}
                <svg className="absolute inset-0 w-full h-full opacity-50" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#bg-grad)" />
                    
                    {/* Ridges/Valleys */}
                    <path d="M50,10 Q30,50 10,90" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" opacity="0.5" />
                    <path d="M50,10 Q70,50 90,90" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" opacity="0.5" />
                    <path d="M50,10 Q50,50 50,90" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" opacity="0.3" strokeDasharray="4 4" />

                    <defs>
                        <linearGradient id="bg-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--background))" />
                            <stop offset="100%" stopColor="hsl(var(--muted))" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* The Stem Cell */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
                    <motion.div
                        custom={path}
                        variants={ballVariants}
                        initial="top"
                        animate={ballState}
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-orange-500 shadow-[0_0_15px_rgba(250,204,21,0.6)] border-2 border-white cursor-pointer flex items-center justify-center text-white font-bold text-xs"
                        onClick={handleDrop}
                        whileHover={ballState === 'top' ? { scale: 1.1 } : {}}
                    >
                        {ballState === 'top' ? 'Drop' : ''}
                    </motion.div>
                </div>

                {/* Fate Labels at the bottom */}
                <div className="absolute bottom-8 w-full flex justify-between px-8 text-sm font-semibold text-muted-foreground">
                    <div className="w-24 text-center">Ectoderm</div>
                    <div className="w-24 text-center">Mesoderm</div>
                    <div className="w-24 text-center">Endoderm</div>
                </div>

                {/* Result Overlay */}
                {ballState === 'bottom' && fate && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-24 bg-background/90 backdrop-blur-sm p-4 rounded-xl border border-border shadow-xl text-center z-20"
                    >
                        <h3 className="text-lg font-bold text-primary mb-1">Cell Differentiated!</h3>
                        <p className="text-foreground">{fate}</p>
                    </motion.div>
                )}
            </div>

            <div className="mt-8 flex gap-4">
                <button 
                    onClick={handleReset}
                    disabled={ballState === 'rolling'}
                    className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                >
                    Reset Cell
                </button>
                {ballState === 'bottom' && (
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

export default WaddingtonsLandscapeActivity;

import React, { useState } from 'react';
import { TheoryVisual } from '../../TheoryVisual';
import { LabData, Exercise } from '../../../types';
import { motion } from 'motion/react';

interface MorphogenGradientProps {
    labData: LabData;
    exercises: Exercise[];
    onComplete: () => void;
}

const MorphogenGradientActivity: React.FC<MorphogenGradientProps> = ({ onComplete }) => {
    const [concentration, setConcentration] = useState(50);

    // Determine cell fate based on concentration
    let cellFate = "Undifferentiated";
    let fateColor = "text-gray-500";
    let icon = "🥚";

    if (concentration > 80) {
        cellFate = "Head Structures (High Concentration)";
        fateColor = "text-red-500";
        icon = "🧠";
    } else if (concentration > 40) {
        cellFate = "Thorax Structures (Medium Concentration)";
        fateColor = "text-purple-500";
        icon = "🫁";
    } else {
        cellFate = "Tail Structures (Low Concentration)";
        fateColor = "text-blue-500";
        icon = "🦵";
    }

    return (
        <div className="w-full flex flex-col items-center justify-center min-h-[500px] p-6">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Morphogen Gradient</h2>
                <p className="text-muted-foreground">Adjust the morphogen concentration to see how it affects cell fate.</p>
            </div>

            <div className="w-full max-w-2xl bg-card p-8 rounded-2xl shadow-lg border border-border">
                {/* Gradient Visualizer */}
                <div className="relative w-full h-32 rounded-xl overflow-hidden mb-8">
                    <div 
                        className="absolute inset-0 transition-all duration-300"
                        style={{
                            background: `linear-gradient(90deg, rgba(239,68,68,1) 0%, rgba(168,85,247,1) 50%, rgba(59,130,246,1) 100%)`,
                            opacity: concentration / 100
                        }}
                    />
                    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 -z-10" />
                    
                    {/* Cell Indicator */}
                    <motion.div 
                        className="absolute top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-900 rounded-full shadow-lg flex items-center justify-center text-2xl border-4 border-white dark:border-gray-800"
                        animate={{ left: `${100 - concentration}%` }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        style={{ transform: 'translate(-50%, -50%)' }}
                    >
                        {icon}
                    </motion.div>
                </div>

                {/* Slider Control */}
                <div className="mb-8">
                    <label className="block text-sm font-medium mb-4 text-center">
                        Morphogen Concentration: <span className="font-bold text-primary">{concentration}%</span>
                    </label>
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={concentration} 
                        onChange={(e) => setConcentration(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>Low (Tail)</span>
                        <span>Medium (Thorax)</span>
                        <span>High (Head)</span>
                    </div>
                </div>

                {/* Result Display */}
                <div className="text-center p-6 bg-muted/50 rounded-xl">
                    <h3 className="text-lg font-semibold mb-2">Resulting Cell Fate:</h3>
                    <motion.div 
                        key={cellFate}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`text-2xl font-bold ${fateColor}`}
                    >
                        {icon} {cellFate}
                    </motion.div>
                </div>
            </div>

            <div className="mt-8">
                <button 
                    onClick={onComplete}
                    className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg hover:shadow-orange-500/40"
                >
                    Complete Activity
                </button>
            </div>
        </div>
    );
};

export default MorphogenGradientActivity;

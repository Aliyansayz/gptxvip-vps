import React, { useState, useMemo } from 'react';
import { InteractiveQuestion as Exercise, MCQQuestion } from '../../../../types';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Clock, Calendar, TrendingUp, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface TimeHorizonVolatilityProps {
    exercise: any; // Cast to any to access custom properties easily since it is a hybrid
    onComplete: () => void;
}

export const TimeHorizonVolatility: React.FC<TimeHorizonVolatilityProps> = ({ exercise, onComplete }) => {
    const [horizon, setHorizon] = useState<'3d' | '3w'>('3d');
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ correct: boolean; text: string } | null>(null);

    const checkAnswer = () => {
        if (selectedOption === exercise?.answer) {
            setFeedback({ correct: true, text: exercise?.explanation || "Correct! Volatility scales with the square root of time." });
            toast.success("Correct answer!");
            onComplete();
        } else {
            setFeedback({ correct: false, text: "Not quite. Remember the square root rule: longer horizons mean much wider potential price ranges." });
            toast.error("Incorrect. Try again.");
        }
    };

    // Constants for visualization
    const dailyVol = 15; // fixed daily sigma for demo
    const days = horizon === '3d' ? 3 : 21;
    const timeRatio = Math.sqrt(days);
    const coneWidth = dailyVol * timeRatio;

    const width = 400;
    const height = 200;
    const centerX = 0;
    const centerY = height / 2;

    // Generate points for the diffusion cone path
    const conePathTop = useMemo(() => {
        const points = [];
        for (let x = 0; x <= width; x += 10) {
            const currentT = (x / width) * days;
            const currentSigma = dailyVol * Math.sqrt(currentT);
            points.push(`${x},${centerY - currentSigma}`);
        }
        return `M 0,${centerY} L ${points.join(' L ')}`;
    }, [days, centerY]);

    const conePathBottom = useMemo(() => {
        const points = [];
        for (let x = 0; x <= width; x += 10) {
            const currentT = (x / width) * days;
            const currentSigma = dailyVol * Math.sqrt(currentT);
            points.push(`${x},${centerY + currentSigma}`);
        }
        return `M 0,${centerY} L ${points.join(' L ')}`;
    }, [days, centerY]);

    return (
        <div className="space-y-6 w-full">
            {/* HEADERS */}
            <div className="flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                    <Clock className="w-3.5 h-3.5" />
                    Time-Horizon Impact
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 italic">Temporal Volatility Diffusion</h3>
            </div>

            {/* HORIZON TOGGLE */}
            <div className="flex justify-center">
                <div className="inline-flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
                    <button 
                        onClick={() => setHorizon('3d')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${horizon === '3d' ? 'bg-white dark:bg-zinc-700 text-emerald-600 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                    >
                        <Calendar className="w-4 h-4" /> 3 Days
                    </button>
                    <button 
                        onClick={() => setHorizon('3w')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${horizon === '3w' ? 'bg-white dark:bg-zinc-700 text-emerald-600 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                    >
                        <TrendingUp className="w-4 h-4" /> 3 Weeks
                    </button>
                </div>
            </div>

            {/* CHART DISPLAY */}
            <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 relative overflow-hidden h-72">
                <div className="absolute top-4 left-6 text-xs font-mono text-zinc-500 uppercase flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   Probability Diffusion (Confidence Interval)
                </div>

                <div className="absolute right-6 top-4 text-[10px] font-mono text-zinc-400">
                    Range: ±{coneWidth.toFixed(1)} USD
                </div>

                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full mt-4" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <line x1="0" y1={centerY} x2={width} y2={centerY} stroke="#1f2937" strokeWidth="1" strokeDasharray="4 4" />
                    
                    {/* The Diffusion Cone Area */}
                    <motion.path 
                        key={horizon}
                        initial={{ opacity: 0, scaleY: 0.5 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        d={`${conePathTop} L ${width},${centerY} L ${width},${centerY} Z`}
                        fill="url(#grad-top)"
                        fillOpacity="0.4"
                    />
                     <motion.path 
                        key={horizon + "-bot"}
                        initial={{ opacity: 0, scaleY: 0.5 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        d={`${conePathBottom} L ${width},${centerY} L ${width},${centerY} Z`}
                        fill="url(#grad-bot)"
                        fillOpacity="0.4"
                    />

                    {/* Boundary Lines */}
                    <motion.path 
                        key={horizon + "-line-top"}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1 }}
                        d={conePathTop}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                    />
                    <motion.path 
                        key={horizon + "-line-bot"}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1 }}
                        d={conePathBottom}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                    />

                    <defs>
                        <linearGradient id="grad-top" x1="0" y1="1" x2="0" y2="0">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.5" />
                        </linearGradient>
                        <linearGradient id="grad-bot" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.5" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Legend */}
                <div className="absolute bottom-4 left-6 flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                        <div className="w-4 h-0.5 bg-emerald-500" /> Upper Prob (95%)
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                        <div className="w-4 h-0.5 bg-emerald-500" /> Lower Prob (95%)
                    </div>
                </div>
            </div>

            {/* EDUCATIONAL TIP */}
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 rounded-xl flex gap-3">
                <Info className="w-5 h-5 text-emerald-500 shrink-0" />
                <p className="text-sm text-emerald-800 dark:text-emerald-300 italic">
                    Note how the probability "cone" expands as you move from 3 Days to 3 Weeks. Even with static daily risk, the potential price drift increases with the **square root of time** (σ √t).
                </p>
            </div>

            {/* INTERACTIVE QUIZ */}
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <label className="font-bold text-lg text-zinc-900 dark:text-zinc-100">{exercise.question}</label>
                <div className="flex flex-col gap-3 mt-4">
                    {exercise.options?.map((optionObj: any, index: number) => {
                        const optionText = typeof optionObj === 'string' ? optionObj : optionObj.text;
                        return (
                        <button 
                            key={index} 
                            onClick={() => setSelectedOption(optionText)} 
                            disabled={!!feedback} 
                            className={`p-4 border rounded-xl text-left text-sm transition-all duration-200 font-medium ${selectedOption === optionText ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20' : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-emerald-400 hover:bg-emerald-50/50'}`}
                        >
                            {optionText}
                        </button>
                        );
                    })}
                </div>
                <button 
                    onClick={checkAnswer} 
                    disabled={!selectedOption || !!feedback} 
                    className="mt-6 px-6 py-3 w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black uppercase tracking-widest rounded-xl disabled:opacity-50 hover:opacity-90 transition-all active:scale-[0.98]"
                >
                    Submit Verification
                </button>

                {feedback && (
                     <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-6 p-4 border-l-4 rounded-r-xl ${feedback.correct ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : 'border-red-500 bg-red-50 dark:bg-red-500/10'}`}
                    >
                        <h5 className={`font-bold flex items-center gap-2 ${feedback.correct ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                            {feedback.correct ? <CheckCircle className="w-5 h-5"/> : <XCircle className="w-5 h-5"/>} 
                            {feedback.correct ? "Insight Validated" : "Logic Error"}
                        </h5>
                        <p className={`text-sm mt-1 leading-relaxed ${feedback.correct ? 'text-emerald-600 dark:text-emerald-300' : 'text-red-600 dark:text-red-300'}`}>{feedback.text}</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

import React, { useState, useEffect, useRef } from 'react';
import { InteractiveQuestion as Exercise } from '../../../../types';
import { toast } from 'sonner';
import { CheckCircle as CheckCircleIcon, XCircle, Database, Flame, Zap, ArrowRight, Activity, TrendingUp, RefreshCw } from 'lucide-react';
import { HFTTheoryLayout } from './HFTTheoryLayout';

interface ExerciseProps {
  exercise: any;
  onComplete: () => void;
}

type Phase = 'idle' | 'preprocess' | 'inprocess' | 'postprocess' | 'complete';

export const GoldVolatilityWorkflow: React.FC<ExerciseProps> = ({ exercise, onComplete }) => {
    const [phase, setPhase] = useState<Phase>('idle');
    const [priceHistory, setPriceData] = useState<number[]>(Array.from({length: 40}, () => 2000));
    const [volatility, setVolatility] = useState(5); // Sigma
    const [signal, setSignal] = useState<'HOLD' | 'BUY' | 'SELL'>('HOLD');
    const [diffusionCone, setDiffusionCone] = useState<{upper: number, lower: number} | null>(null);
    const [selectedOption, setSelectedOption] = useState<string|null>(null);
    const [feedback, setFeedback] = useState<{correct: boolean, text: string}|null>(null);

    const isCorrect = selectedOption === exercise?.answer;

    // Simulation Step
    const runPipeline = () => {
        if (phase !== 'idle' && phase !== 'complete') return;
        
        // 1. PRE-PROCESS
        setPhase('preprocess');
        setSignal('HOLD');
        
        setTimeout(() => {
            // Generate next price movement based on random walk
            const lastPrice = priceHistory[priceHistory.length - 1];
            const shock = (Math.random() - 0.5) * volatility * 2;
            const newPrice = lastPrice + shock;
            const newHistory = [...priceHistory.slice(1), newPrice];
            setPriceData(newHistory);

            // 2. IN-PROCESS (Physics Engine)
            setPhase('inprocess');
            setTimeout(() => {
                // Apply Time-Adjusted Diffusion Equation: sigma_t = sigma * sqrt(t)
                // Here we model the expected bound for the *next* step (t=1)
                const timeHorizon = 1; 
                const diffusionSpread = volatility * Math.sqrt(timeHorizon) * 1.5; // 1.5 std dev confidence interval
                
                // The "Heat" spreads from the moving average, not just the last point (mean reversion)
                const avg = newHistory.reduce((a,b) => a+b, 0) / newHistory.length;
                
                setDiffusionCone({
                    upper: avg + diffusionSpread,
                    lower: avg - diffusionSpread
                });

                // 3. POST-PROCESS (Execution)
                setPhase('postprocess');
                setTimeout(() => {
                    if (newPrice > avg + diffusionSpread) setSignal('SELL'); // Price diffused too high (Overheated)
                    else if (newPrice < avg - diffusionSpread) setSignal('BUY'); // Price diffused too low (Overcooled)
                    else setSignal('HOLD');
                    
                    setPhase('complete');
                }, 1000);

            }, 1000);
        }, 1000);
    };

    const checkAnswer = () => {
        if (!selectedOption) return;
        if (isCorrect) {
            toast.success("Correct!");
            setFeedback({correct: true, text: exercise.explanation || 'Correct answer.'});
            onComplete();
        } else {
            const feedbackText = exercise.wrong_answer_feedback?.find((f: any) => f.option === selectedOption)?.feedback || 'Incorrect.';
            setFeedback({correct: false, text: feedbackText});
        }
    };

    // Visualization Helpers
    const width = 400;
    const height = 150;
    const maxPrice = Math.max(...priceHistory) + 20;
    const minPrice = Math.min(...priceHistory) - 20;
    const mapY = (p: number) => height - ((p - minPrice) / (maxPrice - minPrice)) * height;
    const mapX = (i: number) => (i / (priceHistory.length - 1)) * width;

    const linePath = priceHistory.map((p, i) => `${i===0?'M':'L'} ${mapX(i)} ${mapY(p)}`).join(' ');

    return (
        <div className="space-y-6 w-full">
            {/* PIPELINE VISUALIZATION */}
            <div className="grid grid-cols-3 gap-2 md:gap-4">
                <div className={`p-3 rounded-lg border-2 transition-all duration-300 flex flex-col items-center text-center ${phase === 'preprocess' ? 'border-emerald-500 bg-emerald-500/10 scale-105 shadow-md' : 'border-border bg-card opacity-70'}`}>
                    <Database className="w-6 h-6 mb-2 text-emerald-500"/>
                    <div className="text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300">Pre-Process</div>
                    <div className="text-[10px] text-zinc-500 mt-1">Clean Ticks &<br/>Calc Volatility (σ)</div>
                </div>
                <div className={`p-3 rounded-lg border-2 transition-all duration-300 flex flex-col items-center text-center ${phase === 'inprocess' ? 'border-orange-500 bg-orange-500/10 scale-105 shadow-md' : 'border-border bg-card opacity-70'}`}>
                    <Flame className="w-6 h-6 mb-2 text-orange-500"/>
                    <div className="text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300">In-Process</div>
                    <div className="text-[10px] text-zinc-500 mt-1">Apply Diffusion Eq:<br/>σ_t = σ√t</div>
                </div>
                <div className={`p-3 rounded-lg border-2 transition-all duration-300 flex flex-col items-center text-center ${phase === 'postprocess' ? 'border-green-500 bg-green-500/10 scale-105 shadow-md' : 'border-border bg-card opacity-70'}`}>
                    <Zap className="w-6 h-6 mb-2 text-green-500"/>
                    <div className="text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300">Post-Process</div>
                    <div className="text-[10px] text-zinc-500 mt-1">Logic Gate:<br/>Exec Buy/Sell</div>
                </div>
            </div>

            {/* CHART AREA */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 relative overflow-hidden h-64 w-full">
                <div className="absolute top-2 left-4 text-xs font-mono text-slate-400">GOLD (XAU/USD)</div>
                <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-full block">
                    {/* Diffusion Cone (Bollinger Bands analogy) */}
                    {diffusionCone && phase !== 'preprocess' && (
                        <path 
                            d={`M ${width} ${mapY(diffusionCone.upper)} L ${width} ${mapY(diffusionCone.lower)}`} 
                            stroke="hsl(var(--destructive))" 
                            strokeWidth="20" // Visual hack for a 'zone' at the end
                            strokeOpacity="0.2"
                        />
                    )}
                    
                    {/* Bounds lines */}
                    {diffusionCone && (
                        <>
                            <line x1="0" y1={mapY(diffusionCone.upper)} x2={width} y2={mapY(diffusionCone.upper)} stroke="orange" strokeDasharray="4 2" opacity="0.5" />
                            <line x1="0" y1={mapY(diffusionCone.lower)} x2={width} y2={mapY(diffusionCone.lower)} stroke="orange" strokeDasharray="4 2" opacity="0.5" />
                        </>
                    )}

                    {/* Price Line */}
                    <path d={linePath} fill="none" stroke="#10b981" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
                    
                    {/* Current Point */}
                    <circle cx={width} cy={mapY(priceHistory[priceHistory.length-1])} r="3" fill="#10b981" />
                </svg>
                
                {/* HUD Overlay */}
                <div className="absolute bottom-2 right-4 flex gap-4">
                    <div className="text-xs font-mono text-slate-400">Vol: <span className="text-white">{volatility.toFixed(1)}</span></div>
                    <div className="text-xs font-mono text-slate-400">Signal: <span className={`font-bold ${signal === 'BUY' ? 'text-green-400' : signal === 'SELL' ? 'text-red-400' : 'text-slate-200'}`}>{signal}</span></div>
                </div>
            </div>

            {/* CONTROLS */}
            <div className="flex gap-4 items-center p-4 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg w-full">
                <button 
                    onClick={runPipeline} 
                    disabled={phase !== 'idle' && phase !== 'complete'}
                    className="shrink-0 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg disabled:opacity-50 flex items-center gap-2 transition-colors"
                >
                    <RefreshCw className={`w-4 h-4 ${phase !== 'idle' && phase !== 'complete' ? 'animate-spin' : ''}`}/>
                    Run Trading Cycle
                </button>
                <div className="flex-1 text-xs text-zinc-500">
                    {phase === 'idle' && "Ready to process new market data."}
                    {phase === 'preprocess' && "Ingesting market feed. Calculating volatility..."}
                    {phase === 'inprocess' && "Modeling probability diffusion over time (σ√t)..."}
                    {phase === 'postprocess' && "Checking price against probability bounds..."}
                    {phase === 'complete' && `Cycle Complete. Action: ${signal}`}
                </div>
            </div>

            {/* QUIZ */}
             <div className={`p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 mt-6`}>
                <label className="font-semibold text-zinc-900 dark:text-zinc-100">{exercise.question}</label>
                <div className="flex flex-col gap-2 mt-3">
                    {exercise.options?.map((optionObj: any, index: number) => {
                        const optionText = typeof optionObj === 'string' ? optionObj : optionObj.text;
                        return (
                            <button key={index} onClick={() => setSelectedOption(optionText)} disabled={!!feedback} className={`p-3 border rounded-lg text-left text-sm transition-all ${selectedOption === optionText ? 'bg-emerald-600 text-white font-semibold border-emerald-600' : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-emerald-400'}`}>{optionText}</button>
                        );
                    })}
                </div>
                <button onClick={checkAnswer} disabled={!selectedOption || !!feedback} className="mt-4 px-4 py-2.5 w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold tracking-wide rounded-lg disabled:opacity-50 transition-colors">Check Answer</button>
                {feedback && (
                     <div className={`mt-4 p-4 border-l-4 rounded-r-lg ${feedback.correct ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : 'border-red-500 bg-red-50 dark:bg-red-500/10'}`}>
                        <h5 className={`font-bold flex items-center gap-2 ${feedback.correct ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>{feedback.correct ? <CheckCircleIcon className="w-5 h-5"/> : <XCircle className="w-5 h-5"/>} {feedback.correct ? "Correct!" : "Not Quite"}</h5>
                        <p className={`text-sm mt-1.5 ${feedback.correct ? 'text-emerald-600 dark:text-emerald-300' : 'text-red-600 dark:text-red-300'}`}>{feedback.text}</p>
                    </div>
                 )}
            </div>
        </div>
    );
};

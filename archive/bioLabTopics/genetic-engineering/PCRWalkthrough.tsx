import React, { useState, useMemo } from 'react';
import { TheoryVisual } from '../../TheoryVisual';
import { Check, ChevronsRight, RotateCcw } from 'lucide-react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// --- Type Definitions ---
interface Exercise {
    title: string;
    prompt: string;
}

// --- Reusable Formula Component ---
const Formula = ({ tex, inline = false }: { tex: string, inline?: boolean }) => {
    const html = katex.renderToString(tex, {
        throwOnError: false,
        displayMode: !inline,
    });

    if (inline) {
        return (
            <span
                className="bg-muted/50 px-1.5 py-0.5 rounded-md text-foreground mx-1"
                dangerouslySetInnerHTML={{ __html: html }}
            />
        );
    }

    return (
        <div className="bg-muted/80 p-4 rounded-lg my-4 text-center overflow-x-auto">
            <span dangerouslySetInnerHTML={{ __html: html }} />
        </div>
    );
};

// --- Reusable Step Panel Component ---
const StepPanel = ({ title, children, isVisible, stepNumber }: { title: string, children: React.ReactNode, isVisible: boolean, stepNumber: number }) => (
    <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isVisible ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        {isVisible && (
            <div className="bg-card p-6 rounded-2xl shadow-md border border-border h-full flex flex-col">
                <h3 className="text-xl font-bold text-card-foreground mb-3"><span className="text-primary">{stepNumber}.</span> {title}</h3>
                <div className="space-y-3 text-muted-foreground prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 flex-grow">
                    {children}
                </div>
            </div>
        )}
    </div>
);

// --- PCR CONSTANTS & FUNCTIONS ---
const MAX_CYCLES = 35;
const INITIAL_COPIES = 1;

function calculateCopies(n: number) {
    return INITIAL_COPIES * Math.pow(2, n);
}

const MAX_COPIES = calculateCopies(MAX_CYCLES);

// --- STEP-BY-STEP CONTENT ---
const stepsData = [
    {
        title: "Understand the Goal",
        content: () => (
            <>
                <p><strong>Goal:</strong> Calculate the number of DNA copies generated after <Formula tex="n" inline/> cycles of Polymerase Chain Reaction (PCR).</p>
                <p><strong>Constants:</strong></p>
                <ul className="list-disc list-inside">
                    <li>Initial DNA copies: <Formula tex="N_0 = 1" inline/></li>
                    <li>Amplification factor per cycle: <Formula tex="2" inline/> (each double-stranded DNA splits and replicates into two)</li>
                </ul>
            </>
        )
    },
    {
        title: "Formulate the Exponential Equation",
        content: () => (
            <>
                <p>In each cycle, the number of DNA molecules doubles. We can express this as an exponential function.</p>
                <ul className="list-disc list-inside">
                    <li>After 1 cycle: <Formula tex="N_1 = N_0 \times 2^1" inline/></li>
                    <li>After 2 cycles: <Formula tex="N_2 = N_0 \times 2^2" inline/></li>
                    <li>After <Formula tex="n" inline/> cycles:</li>
                </ul>
                <Formula tex="N(n) = N_0 \times 2^n" />
            </>
        )
    },
    {
        title: "Calculate for a Specific Cycle",
        content: () => (
            <>
                <p>Let's calculate the number of copies after 30 cycles, a typical number for a PCR run.</p>
                <Formula tex="N(30) = 1 \times 2^{30}" />
                <p>Since <Formula tex="2^{10} \approx 10^3" inline/>, we can estimate <Formula tex="2^{30} \approx (10^3)^3 = 10^9" inline/>.</p>
                <p>The exact calculation gives:</p>
                <Formula tex="N(30) = 1,073,741,824" />
                <p>This means from a single DNA molecule, we get over 1 billion copies in just 30 cycles!</p>
            </>
        )
    },
    {
        title: "Determine the Cycle for a Target Amount",
        content: () => (
            <>
                <p>Suppose we need at least <Formula tex="10^6" inline/> (1 million) copies for sequencing. How many cycles <Formula tex="n" inline/> are required?</p>
                <Formula tex="2^n = 10^6" />
                <p>Take the base-2 logarithm of both sides:</p>
                <Formula tex="n = \log_2(10^6)" />
                <p>Using the change of base formula:</p>
                <Formula tex="n = \frac{\log_{10}(10^6)}{\log_{10}(2)} = \frac{6}{0.301} \approx 19.93" />
                <p>Since we can only complete full cycles, we round up to <strong>20 cycles</strong>.</p>
            </>
        )
    }
];

// --- MAIN COMPONENT ---
export const PCRWalkthrough: React.FC<{ exercise: Exercise; onComplete: () => void; }> = ({ exercise, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [cycles, setCycles] = useState(10);

    const nextStep = () => setCurrentStep(s => Math.min(s + 1, stepsData.length + 1));
    const resetSteps = () => setCurrentStep(0);

    // --- SVG & Graph Calculations using useMemo ---
    const SVG_WIDTH = 500;
    const SVG_HEIGHT = 300;
    const PADDING = 50;

    const { curvePath, currentPoint } = useMemo(() => {
        const mapX = (n: number) => PADDING + (n / MAX_CYCLES) * (SVG_WIDTH - 2 * PADDING);
        // Use logarithmic scale for Y axis to make the exponential curve visible
        const logMax = Math.log10(MAX_COPIES);
        const mapY = (copies: number) => {
            if (copies <= 0) return SVG_HEIGHT - PADDING;
            const logCopies = Math.log10(copies);
            return SVG_HEIGHT - PADDING - (logCopies / logMax) * (SVG_HEIGHT - 2 * PADDING);
        };

        let points = '';
        for (let x_val = 0; x_val <= MAX_CYCLES; x_val += 1) {
            const y_val = calculateCopies(x_val);
            points += `${mapX(x_val)},${mapY(y_val)} `;
        }

        const currPoint = { x: mapX(cycles), y: mapY(calculateCopies(cycles)) };

        return { curvePath: points.trim(), currentPoint: currPoint };
    }, [cycles]);

    const currentCopies = calculateCopies(cycles);

    return (
        <div className="space-y-6 w-full">
            <h3 className="text-2xl font-bold text-center">{exercise.title}</h3>
            <p className="text-muted-foreground text-center">{exercise.prompt}</p>

            <h2 className="text-2xl font-bold text-foreground">Interactive PCR Visualization</h2>
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Visual Panel */}
                <div className="flex-1 min-w-[300px] bg-background p-4 rounded-lg border border-border">
                    <h3 className="font-semibold text-lg text-foreground mb-4">DNA Copies in Tube</h3>
                    <div className="relative w-full h-48 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800 overflow-hidden flex items-center justify-center">
                        {/* Render dots representing DNA. Cap at 500 for performance */}
                        {Array.from({ length: Math.min(currentCopies, 500) }).map((_, i) => (
                            <div 
                                key={i}
                                className="absolute w-1.5 h-1.5 bg-blue-500 rounded-full opacity-70"
                                style={{
                                    left: `${Math.random() * 96 + 2}%`,
                                    top: `${Math.random() * 96 + 2}%`,
                                    transform: `rotate(${Math.random() * 360}deg)`
                                }}
                            />
                        ))}
                        {currentCopies > 500 && (
                            <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-[1px] flex items-center justify-center">
                                <span className="text-blue-900 dark:text-blue-100 font-bold text-xl bg-white/50 dark:bg-black/50 px-3 py-1 rounded-lg">
                                    Too many to render!
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Graph Panel (using SVG) */}
                <div className="flex-1 min-w-[300px] bg-background p-4 rounded-lg border border-border">
                    <h3 className="font-semibold text-lg text-foreground">DNA Copies vs Cycles (Log Scale)</h3>
                    <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full h-auto mt-2">
                        <line x1={PADDING} y1={SVG_HEIGHT - PADDING} x2={SVG_WIDTH - PADDING} y2={SVG_HEIGHT - PADDING} stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
                        <line x1={PADDING} y1={PADDING} x2={PADDING} y2={SVG_HEIGHT - PADDING} stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
                        <text x={SVG_WIDTH / 2} y={SVG_HEIGHT - 10} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="14">Cycles (n)</text>
                        <text x={15} y={SVG_HEIGHT / 2} textAnchor="middle" transform={`rotate(-90 15, ${SVG_HEIGHT / 2})`} fill="hsl(var(--muted-foreground))" fontSize="14">Log(Copies)</text>
                        <polyline points={curvePath} fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5" />
                        <circle cx={currentPoint.x} cy={currentPoint.y} r="6" fill="hsl(var(--destructive))" stroke="white" strokeWidth="2" />
                    </svg>
                </div>

                {/* Controls & Metrics Panel */}
                <div className="lg:max-w-xs w-full bg-background p-4 rounded-lg border border-border">
                    <h3 className="font-semibold text-lg text-foreground">Controls & Metrics</h3>
                    <div className="mt-4 space-y-4">
                        <div>
                            <label htmlFor="cycles-slider" className="block text-sm font-medium mb-2">Number of Cycles (n)</label>
                            <input type="range" id="cycles-slider" min="0" max="35" value={cycles} onChange={e => setCycles(Number(e.target.value))} step="1" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                        </div>
                        <div className="text-sm space-y-2 pt-2">
                            <p className="flex justify-between"><span>Cycles (n):</span> <span className="font-bold text-foreground">{cycles}</span></p>
                            <p className="flex justify-between items-center">
                                <span>DNA Copies:</span> 
                                <span className="font-bold text-primary text-lg">
                                    {currentCopies > 10000 ? currentCopies.toExponential(2) : currentCopies.toLocaleString()}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-foreground pt-4">Step-by-Step Mathematical Solution</h2>
            <div className="flex justify-center gap-4 my-4">
                <button onClick={nextStep} disabled={currentStep > stepsData.length} className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg flex items-center gap-2 hover:bg-primary/90 disabled:opacity-50 transition-all">
                    {currentStep <= stepsData.length ? 'Reveal Next Step' : 'Finished'} <ChevronsRight className="w-5 h-5" />
                </button>
                <button onClick={resetSteps} className="px-4 py-2 bg-muted text-muted-foreground rounded-lg flex items-center gap-2 hover:bg-secondary">
                    <RotateCcw className="w-4 h-4" /> Reset
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stepsData.map((step, index) => (
                    <StepPanel key={index} title={step.title} isVisible={index < currentStep} stepNumber={index + 1}>
                        {step.content()}
                    </StepPanel>
                ))}
            </div>
            {currentStep > stepsData.length && (
                <div className="text-center p-6 bg-green-500/10 rounded-lg animate-fade-in border border-green-500/20">
                    <Check className="w-12 h-12 mx-auto text-green-600 mb-2"/>
                    <h3 className="text-xl font-bold text-green-700">Walkthrough Complete!</h3>
                    <p className="text-green-700/80">You've successfully explored the exponential growth of PCR amplification.</p>
                    <button onClick={onComplete} className="mt-4 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                        Continue
                    </button>
                </div>
            )}
        </div>
    );
};

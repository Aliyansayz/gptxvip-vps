import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Code2, Terminal, ChevronRight } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const exampleCode = `struct OrderNode {
    Order order;
    std::atomic<OrderNode*> next;
    std::atomic<int> state;
};

class LockFreeOrderBook {
    std::atomic<OrderNode*> head;
public:
    void push(Order order) {
        while (true) {
            OrderNode* old = head.load();
            OrderNode* node = new OrderNode{order, old, 0};
            if (head.compare_exchange_weak(old, node))
                break;
        }
    }
};`;

const steps = [
    { range: [1, 5], title: "Memory Layout", description: "In lock-free programming, we use std::atomic to prevent CPU reordering and ensure multi-core visibility." },
    { range: [12, 12], title: "Optimistic Snapshot", description: "We capture the current state of the list's head. We proceed assuming this hasn't changed." },
    { range: [14, 15], title: "Atomic Commit", description: "compare_exchange_weak checks if head is still what we thought it was. If yes, it swaps in our new node." }
];

export const CodeExplainerShowcase: React.FC = () => {
    const [activeStep, setActiveStep] = useState(0);

    // Auto rotate steps
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % steps.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div 
          style={{ transform: 'skewY(-2deg)' }}
          className="w-full flex flex-col md:flex-row gap-8 relative bg-zinc-900 border border-zinc-800/80 rounded-none p-6 shadow-2xl overflow-hidden mt-8"
        >
            <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-50"></div>
            
            {/* Left: Code Snippet */}
            <div 
              style={{ transform: 'skewY(-1deg)' }}
              className="w-full md:w-3/5 bg-[#020617] rounded-none border border-zinc-800 overflow-hidden flex flex-col z-10 shadow-inner"
            >
                <div style={{ transform: 'skewY(1deg)' }} className="h-full flex flex-col">
                    <div className="h-10 border-b border-zinc-800 bg-zinc-900/50 flex items-center px-4 gap-3">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                        </div>
                        <Terminal className="w-4 h-4 text-indigo-500 ml-2" />
                        <span className="text-xs font-mono text-zinc-400">lock_free_queue.cpp</span>
                    </div>
                    <div className="font-mono text-xs md:text-sm leading-relaxed overflow-x-auto relative">
                        <SyntaxHighlighter
                            language="cpp"
                            style={vscDarkPlus}
                            showLineNumbers={true}
                            wrapLines={true}
                            customStyle={{
                                margin: 0,
                                padding: '1rem',
                                paddingLeft: '0',
                                backgroundColor: 'transparent'
                            }}
                            lineNumberStyle={(lineNumber) => {
                                const [start, end] = steps[activeStep].range;
                                const isHighlighted = lineNumber >= start && lineNumber <= end;
                                return {
                                    minWidth: '2rem',
                                    paddingRight: '1rem',
                                    color: isHighlighted ? '#818cf8' : '#52525b',
                                    fontWeight: isHighlighted ? 'bold' : 'normal',
                                    transition: 'color 0.5s'
                                };
                            }}
                            lineProps={(lineNumber) => {
                                const [start, end] = steps[activeStep].range;
                                const isHighlighted = lineNumber >= start && lineNumber <= end;
                                return {
                                    style: {
                                        display: 'block',
                                        backgroundColor: isHighlighted ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                                        borderLeft: isHighlighted ? '3px solid #6366f1' : '3px solid transparent',
                                        boxShadow: isHighlighted ? 'inset 2px 0 10px rgba(99,102,241,0.2)' : 'none',
                                        transition: 'background-color 0.5s, border-color 0.5s, box-shadow 0.5s',
                                        paddingRight: '1rem'
                                    }
                                };
                            }}
                        >
                            {exampleCode}
                        </SyntaxHighlighter>
                    </div>
                </div>
            </div>

            {/* Right: Explainer Steps */}
            <div style={{ transform: 'skewY(2deg)' }} className="w-full md:w-2/5 flex flex-col justify-center z-10">
                <div className="mb-6">
                    <h3 className="text-2xl font-display font-bold text-white mb-2 flex items-center gap-3">
                        <div className="p-2 rounded-none bg-indigo-500/10 border border-indigo-500/20">
                            <Code2 className="w-5 h-5 text-indigo-400" />
                        </div>
                        Code Walkthrough
                    </h3>
                    <p className="text-sm text-zinc-400 font-light leading-relaxed">
                        Highlights relevant lines while explaining the theory, bridging the gap between high-level architectural concepts and implementation details.
                    </p>
                </div>

                <div className="space-y-3">
                    {steps.map((step, idx) => {
                        const isActive = idx === activeStep;
                        return (
                            <div 
                                key={idx}
                                onClick={() => setActiveStep(idx)}
                                style={{ transform: 'skewY(-2deg)' }}
                                className={`p-4 rounded-none border transition-all duration-300 cursor-pointer relative overflow-hidden ${isActive ? 'bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.1)]' : 'bg-zinc-900/50 border-zinc-800/50 hover:bg-zinc-800/80'}`}
                            >
                                <div style={{ transform: 'skewY(2deg)' }}>
                                    {isActive && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
                                    )}
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`text-xs font-bold uppercase tracking-widest ${isActive ? 'text-indigo-400' : 'text-zinc-500'}`}>
                                            Step 0{idx + 1} // {step.title}
                                        </span>
                                        {isActive && <ChevronRight className="w-4 h-4 text-indigo-400" />}
                                    </div>
                                    <p className={`text-sm leading-relaxed ${isActive ? 'text-zinc-300' : 'text-zinc-600'}`}>
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

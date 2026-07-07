import React, { useState, useEffect } from "react";
import { Exercise } from "../../../../types";
import { LabSettings } from "../../../agentDevRootComponents/LabSettingsMenu";
import { BookOpen, CheckCircle, MessageCircle, BrainCircuit, Lightbulb, ShieldAlert, Cpu, Zap, Activity, Quote } from "lucide-react";
import SaveTheoryButton from "../../../agentDevRootComponents/TopicTheoryView/SaveTheoryButton";
import { DevLushTheoryVisual } from "../../devLushTopicsView/DevLushTheoryVisual";
import { motion } from "motion/react";

// Minimal editorial section
const SectionCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; id: string }> = ({ icon, title, children, id }) => (
    <section id={id} className="py-8 md:py-12 border-b border-slate-200/60 dark:border-slate-800/50 last:border-0 scroll-mt-20">
        <h2 className="text-2xl md:text-3xl font-sans tracking-tight font-medium text-slate-900 dark:text-slate-50 flex items-center mb-6">
            <span className="p-2.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl mr-4 text-slate-600 dark:text-slate-400">
                {icon}
            </span>
            {title}
        </h2>
        <div className="space-y-6 text-slate-700 dark:text-slate-300 prose prose-slate dark:prose-invert prose-lg max-w-none leading-relaxed">
            {children}
        </div>
    </section>
);

interface ChapterProps {
  step: number;
  exercises: Exercise[];
  infoVisible: boolean;
  infoPlacement: "side" | "bottom";
  settings?: LabSettings;
  labData?: any;
  renderVisualizer?: (conceptName: string) => React.ReactNode;
}

export const ReadingActivity: React.FC<ChapterProps> = ({
  step,
  exercises,
  labData,
  renderVisualizer,
}) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    setUserAnswer("");
    setShowResult(false);
  }, [step]);

  const question = exercises[step] as any;

  const handleCompare = () => {
    if (!userAnswer.trim()) return;
    setShowResult(true);
  };

  const theoryData = question.theory || (question.theory_explanation ? {
    title: question.title || "Theory Concept",
    content: question.theory_explanation,
    analogy: question.real_world_analogy || question.analogy,
  } : null);

  return (
    <div className="w-full h-full bg-white dark:bg-[#0a0a0a] overflow-y-auto custom-scrollbar selection:bg-indigo-100 dark:selection:bg-indigo-900/50">
        <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-16 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
            
            {/* Header Section */}
            <header className="pt-16 pb-12 md:pt-24 md:pb-16 border-b border-slate-200/60 dark:border-slate-800/50">
                <div className="flex items-center gap-2 mb-6 text-indigo-600 dark:text-indigo-400 font-semibold tracking-widest uppercase text-xs">
                    <BookOpen className="w-4 h-4" />
                    <span>Reading Material</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans tracking-tighter text-slate-900 dark:text-slate-50 mb-6 leading-[1.1] font-medium">
                    {question.title || "Theory & Concepts"}
                </h1>
                <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed font-light">
                    Review the following concepts, explore real-world analogies, and reflect on the core principles to deepen your understanding.
                </p>
            </header>

            {/* Core Features & Use Cases / Prompt */}
            {question.prompt && (
                <SectionCard id="overview" title="Concept Overview" icon={<Zap className="w-6 h-6"/>}>
                    <div
                        className="whitespace-pre-wrap leading-loose font-normal text-lg md:text-xl text-slate-700 dark:text-slate-300 first-letter:text-5xl first-letter:font-bold first-letter:text-slate-900 dark:first-letter:text-slate-50 first-letter:mr-1 first-letter:float-left"
                        dangerouslySetInnerHTML={{ __html: question.prompt }}
                    />
                </SectionCard>
            )}

            {/* Critical Concepts Breakdown */}
            {labData?.critical_concepts && labData.critical_concepts.length > 0 && (
                <SectionCard id="critical-concepts" title="Critical Concepts" icon={<ShieldAlert className="w-6 h-6"/>}>
                    <div className="space-y-12">
                        {labData.critical_concepts.map((concept: any, idx: number) => (
                            <div key={idx} className="grid md:grid-cols-[1fr_300px] gap-8 items-center bg-slate-50 dark:bg-slate-900/40 p-6 md:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">
                                        {concept.concept}
                                    </h3>
                                    <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                        {concept.elaboration}
                                    </p>
                                </div>
                                <div className="h-48 w-full bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center p-4 shadow-inner">
                                    {renderVisualizer ? renderVisualizer(concept.concept) : (
                                        <Activity className="w-8 h-8 text-slate-400" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionCard>
            )}

            {/* Theory Deep Dive */}
            {theoryData && theoryData.content && (
                <SectionCard id="theory" title="Theory & Mechanics" icon={<BrainCircuit className="w-6 h-6"/>}>
                    <p className="leading-loose text-lg font-normal">
                        {theoryData.content}
                    </p>
                </SectionCard>
            )}

            {/* Real World Analogy with Visual */}
            {theoryData && theoryData.analogy && (
                <SectionCard id="analogy" title="Real-World Analogy" icon={<Lightbulb className="w-6 h-6"/>}>
                    <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start mt-4">
                        <div className="relative">
                            <Quote className="absolute -top-4 -left-4 w-12 h-12 text-emerald-500/10 dark:text-emerald-500/20 rotate-180" />
                            <blockquote className="relative z-10 pl-6 border-l-2 border-emerald-500 text-slate-800 dark:text-slate-200">
                                <p className="text-lg md:text-xl leading-relaxed font-medium italic">
                                    {theoryData.analogy}
                                </p>
                            </blockquote>
                        </div>
                        <div className="w-full">
                            <DevLushTheoryVisual 
                                analogyName={theoryData.title} 
                                keywords={[theoryData.analogy]} 
                            />
                        </div>
                    </div>
                </SectionCard>
            )}

            {/* Reflection / Interactive Section */}
            {question.question && (
                <SectionCard id="reflection" title="Reflection Question" icon={<MessageCircle className="w-6 h-6"/>}>
                    <div className="space-y-6">
                        <p className="text-xl text-slate-900 dark:text-slate-100 font-medium leading-relaxed">
                            {question.question}
                        </p>

                        <div className="space-y-4 pt-2">
                            <textarea
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                disabled={showResult}
                                placeholder="Write your perspective here. Take a moment to articulate your thoughts..."
                                className="w-full p-6 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 rounded-2xl text-lg min-h-[160px] resize-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all dark:text-slate-200 shadow-sm"
                            />
                            
                            {!showResult ? (
                                <button
                                    onClick={handleCompare}
                                    disabled={!userAnswer.trim()}
                                    className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white disabled:opacity-30 dark:text-slate-900 text-white font-semibold rounded-full shadow-sm transition-all flex items-center justify-center gap-2"
                                >
                                    Compare with Model Answer
                                </button>
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-8 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 rounded-2xl space-y-6 mt-4"
                                >
                                    <h4 className="font-semibold text-indigo-900 dark:text-indigo-300 text-sm tracking-widest uppercase flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" /> Core Perspective
                                    </h4>
                                    <p className="text-lg text-indigo-950 dark:text-indigo-100 leading-loose font-medium">
                                        {question.answer}
                                    </p>
                                    <div className="pt-6 border-t border-indigo-200/50 dark:border-indigo-800/50">
                                        <button
                                            onClick={() => {
                                                setUserAnswer("");
                                                setShowResult(false);
                                            }}
                                            className="text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                                        >
                                            Reset & Try Again
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </SectionCard>
            )}

            <div className="pb-12" />
        </div>
    </div>
  );
};

export default ReadingActivity;


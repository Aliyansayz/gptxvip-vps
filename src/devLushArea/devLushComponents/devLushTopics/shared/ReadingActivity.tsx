import React, { useState, useEffect } from "react";
import { BookOpen, CheckCircle, Lightbulb, Activity, Code, ShieldAlert, Cpu } from "lucide-react";
import { DevLushLayout } from "../../devLushTopicsView/DevLushLayout";
import { DevLushTheoryBridge } from "../../devLushTopicsView/DevLushTheoryBridge";
import SaveTheoryButton from "../../../agentDevRootComponents/TopicTheoryView/SaveTheoryButton";
import { DevLushTheoryVisual } from "../../devLushTopicsView/DevLushTheoryVisual";
import { motion } from "motion/react";
import { Exercise } from "../../devLushTypes";
import { LabSettings } from "../../../agentDevRootComponents/LabSettingsMenu";

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
  infoVisible = true,
  infoPlacement = "side",
  settings,
  labData,
  renderVisualizer
}) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    setUserAnswer("");
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
  }, [step]);

  const question = exercises[step] as any;

  const handleCompare = () => {
    if (!userAnswer.trim()) return;
    setShowResult(true);
  };

  const handleOptionSelect = (option: string) => {
    if (showResult) return;
    setSelectedAnswer(option);
    const correct = option === question.answer;
    setIsCorrect(correct);
    setShowResult(true);
  };

  const theoryData = question.theory || (question.theory_explanation ? {
    title: question.title || "Theory Concept",
    content: question.theory_explanation,
    analogy: question.real_world_analogy || question.analogy,
  } : null);

  const theoryContent = theoryData ? (
    <div className="h-full flex flex-col">
      <div className="flex justify-end items-center mb-2">
        <SaveTheoryButton theory={theoryData} />
      </div>
      <div className="flex-1">
        <DevLushTheoryBridge item={{ labId: 'reading-activity', exerciseTitle: question.title, theory: theoryData }} />
      </div>
    </div>
  ) : null;

  const InteractionContent = (
    <div className="space-y-6">
        {question.question && (
            <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                {question.question}
            </h4>
        )}
        
        {question.options && question.options.length > 0 ? (
            <div className="space-y-4">
               <div className="space-y-3">
                  {question.options.map((option: string, idx: number) => {
                      const isSelected = selectedAnswer === option;
                      const isCorrectOption = option === question.answer;
                      let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 font-medium ";
                      
                      if (!showResult) {
                          btnClass += "border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300";
                      } else {
                          if (isCorrectOption) {
                              btnClass += "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300";
                          } else if (isSelected) {
                              btnClass += "border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300";
                          } else {
                              btnClass += "border-slate-200 dark:border-slate-700 opacity-50 text-slate-500";
                          }
                      }
                      
                      return (
                          <button
                              key={idx}
                              onClick={() => handleOptionSelect(option)}
                              disabled={showResult}
                              className={btnClass}
                          >
                              <div className="flex justify-between items-center">
                                  <span>{option}</span>
                                  {showResult && isCorrectOption && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                                  {showResult && isSelected && !isCorrectOption && <ShieldAlert className="w-5 h-5 text-rose-500" />}
                              </div>
                          </button>
                      );
                  })}
               </div>
               
               {showResult && (
                   <motion.div 
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       className={`p-4 rounded-xl border text-sm leading-relaxed ${isCorrect ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500/30 text-emerald-950 dark:text-emerald-100' : 'bg-rose-50 dark:bg-rose-950/20 border-rose-500/30 text-rose-950 dark:text-rose-100'}`}
                   >
                       <div className={`flex items-center gap-2 mb-2 font-bold ${isCorrect ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
                           {isCorrect ? <CheckCircle className="w-5 h-5"/> : <ShieldAlert className="w-5 h-5"/>} {isCorrect ? 'Correct!' : 'Incorrect'}
                       </div>
                       <p>{question.explanation || question.answer}</p>
                       
                       <div className={`pt-4 mt-4 border-t ${isCorrect ? 'border-emerald-200/50 dark:border-emerald-800/50' : 'border-rose-200/50 dark:border-rose-800/50'}`}>
                           <button
                               onClick={() => {
                                   setSelectedAnswer(null);
                                   setShowResult(false);
                                   setIsCorrect(false);
                               }}
                               className="text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                           >
                               Reset & Try Again
                           </button>
                       </div>
                   </motion.div>
               )}
            </div>
        ) : (
            <div className="space-y-4">
                <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    disabled={showResult}
                    placeholder="Write your perspective here. Take a moment to articulate your thoughts..."
                    className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 rounded-xl min-h-[160px] resize-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all dark:text-slate-200 shadow-sm"
                />
                
                {!showResult ? (
                    <div className="flex justify-end">
                        <button
                            onClick={handleCompare}
                            disabled={!userAnswer.trim()}
                            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
                        >
                            Compare with Model Answer
                        </button>
                    </div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl border text-sm leading-relaxed bg-indigo-50 dark:bg-indigo-950/20 border-indigo-500/30 text-indigo-950 dark:text-indigo-100`}
                    >
                        <div className="flex items-center gap-2 mb-2 font-bold text-indigo-700 dark:text-indigo-400">
                            <CheckCircle className="w-5 h-5"/> Core Perspective
                        </div>
                        <p>{question.answer}</p>
                        
                        <div className="pt-4 mt-4 border-t border-indigo-200/50 dark:border-indigo-800/50">
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
        )}
    </div>
  );

  return (
    <DevLushLayout
      title={question.title || "Theory & Concepts"}
      prompt={question.prompt}
      visualContent={
        <div className="relative w-full h-full min-h-[400px] flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-y-auto overflow-x-hidden custom-scrollbar">
             <div className="absolute top-4 left-4 flex items-center gap-2">
                 <BookOpen className="w-5 h-5 text-indigo-500" />
                 <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-bold tracking-widest">READING ACTIVITY</span>
             </div>
             
             <div className="flex flex-col gap-6 relative w-full max-w-2xl z-10 mt-8 mb-4">
                 {/* Critical Concepts Breakdown */}
                 {labData?.critical_concepts && labData.critical_concepts.length > 0 ? (
                     <div className="space-y-6 w-full">
                         {labData.critical_concepts.map((concept: any, idx: number) => (
                             <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={idx} 
                                className="w-full bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-4"
                             >
                                 <div>
                                     <div className="flex items-center gap-2 mb-2">
                                         <ShieldAlert className="w-4 h-4 text-indigo-500" />
                                         <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                             {concept.concept}
                                         </h3>
                                     </div>
                                     <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                                         {concept.elaboration}
                                     </p>
                                 </div>
                                 <div className="h-40 w-full bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center p-4">
                                     {renderVisualizer ? renderVisualizer(concept.concept) : (
                                         <Activity className="w-8 h-8 text-slate-400 opacity-50" />
                                     )}
                                 </div>
                             </motion.div>
                         ))}
                     </div>
                 ) : (
                     <div className="w-full bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center text-center gap-4">
                         <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500">
                             <BookOpen className="w-8 h-8" />
                         </div>
                         <div>
                             <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                                 {question.title || "Theory Exploration"}
                             </h3>
                             <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                                 Read the conceptual breakdown and interact with the reflection question to solidify your understanding.
                             </p>
                         </div>
                     </div>
                 )}
                 
                 {theoryData && theoryData.analogy && (
                     <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="w-full"
                     >
                         <DevLushTheoryVisual 
                             analogyName={theoryData.title} 
                             keywords={[theoryData.analogy]} 
                         />
                     </motion.div>
                 )}
             </div>
        </div>
      }
      interactionContent={InteractionContent}
      theoryContent={theoryContent}
      infoVisible={infoVisible && !!theoryData}
      infoPlacement={infoPlacement}
      settings={settings}
    />
  );
};

export default ReadingActivity;

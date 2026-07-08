import React, { useState } from 'react';
import { TheoryVisual } from '../../TheoryVisual';
import { LabData, Exercise } from '../../../types';
import { toast } from 'sonner';
import { BookOpenText, ChevronDownIcon, ChevronRightIcon, LightbulbIcon } from '../../icons';
import { LabSettings } from '../../LabSettingsMenu';
import { BioLabLayout } from '../../bioLabTopicsView/BioLabLayout';
import SaveTheoryButton from '../../TopicTheoryView/SaveTheoryButton';

interface ChapterProps {
  labData: LabData;
  onComplete: () => void;
  onBack: () => void;
  step: number;
  setStep: (updater: number | ((s: number) => number)) => void;
  exercises: Exercise[];
  infoVisible: boolean;
  infoPlacement: 'side' | 'bottom';
  settings?: LabSettings;
}

type Allele = 'B' | 'b';
type Genotype = [Allele, Allele];

const TheoryPane: React.FC<{ exercise: Exercise; visual?: React.ReactNode }> = ({ exercise, visual }) => {
    const [isOpen, setIsOpen] = useState(true);
    if (!exercise?.theory) return null;
    const { title, content, analogy, application } = exercise.theory;

    return (
        <div className="p-4 bg-card rounded-lg border h-full space-y-4 flex flex-col">
            <div
                className="cursor-pointer w-full flex justify-between items-center text-lg font-bold text-card-foreground"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <span className="flex items-center gap-2">
                    <BookOpenText className="w-5 h-5 text-emerald-500" />
                    {title}
                </span>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <SaveTheoryButton theory={exercise?.theory || exercise} />
                    <ChevronDownIcon className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>
            {isOpen && (
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 animate-fade-in">
                    <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground space-y-4">
                        <div dangerouslySetInnerHTML={{ __html: content }} />

                        {analogy && (
                            <TheoryVisual 
                                analogyName={analogy} 
                                keywords={[title, content]} 
                            />
                        )}

                        {visual && (
                            <div className="my-6">
                                {visual}
                            </div>
                        )}
                        {analogy && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                <h4 className="font-bold text-foreground text-xs uppercase tracking-wide mb-1 flex items-center gap-2">
                                    <LightbulbIcon className="w-3 h-3 text-yellow-500" /> Analogy
                                </h4>
                                <p className="text-sm italic leading-relaxed">"{analogy}"</p>
                            </div>
                        )}
                        {application && (
                            <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                                <h4 className="font-bold text-foreground text-xs uppercase tracking-wide mb-1">Application</h4>
                                <p className="text-sm leading-relaxed">{application}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const MendelianVisual: React.FC<{
    parent1: Genotype;
    parent2: Genotype;
    showPunnett: boolean;
}> = ({ parent1, parent2, showPunnett }) => {
    const getEyeColor = (genotype: Genotype) => {
        return genotype.includes('B') ? 'bg-amber-700' : 'bg-blue-400';
    };

    return (
        <div className="w-full flex flex-col items-center justify-center min-h-[300px] bg-card/50 rounded-xl p-6">
            {!showPunnett ? (
                <div className="text-center text-muted-foreground">
                    <p>Adjust parents and click "Show Punnett Square" to see the results.</p>
                </div>
            ) : (
                <div className="flex justify-center animate-fade-in">
                    <div className="grid grid-cols-3 gap-2 bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                        <div className="w-16 h-8" />
                        <div className="w-16 h-8 flex items-center justify-center font-bold text-lg text-blue-600 dark:text-blue-400 border-b-2 border-blue-200">{parent2[0]}</div>
                        <div className="w-16 h-8 flex items-center justify-center font-bold text-lg text-blue-600 dark:text-blue-400 border-b-2 border-blue-200">{parent2[1]}</div>
                        <div className="w-16 h-16 flex items-center justify-center font-bold text-lg text-pink-600 dark:text-pink-400 border-r-2 border-pink-200">{parent1[0]}</div>
                        <div className={`w-16 h-16 rounded-lg ${getEyeColor([parent1[0], parent2[0]])} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                            {[parent1[0], parent2[0]].sort((a, b) => a === 'B' ? -1 : 1).join('')}
                        </div>
                        <div className={`w-16 h-16 rounded-lg ${getEyeColor([parent1[0], parent2[1]])} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                            {[parent1[0], parent2[1]].sort((a, b) => a === 'B' ? -1 : 1).join('')}
                        </div>
                        <div className="w-16 h-16 flex items-center justify-center font-bold text-lg text-pink-600 dark:text-pink-400 border-r-2 border-pink-200">{parent1[1]}</div>
                        <div className={`w-16 h-16 rounded-lg ${getEyeColor([parent1[1], parent2[0]])} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                            {[parent1[1], parent2[0]].sort((a, b) => a === 'B' ? -1 : 1).join('')}
                        </div>
                        <div className={`w-16 h-16 rounded-lg ${getEyeColor([parent1[1], parent2[1]])} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                            {[parent1[1], parent2[1]].sort((a, b) => a === 'B' ? -1 : 1).join('')}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const MendelianInteraction: React.FC<{
    exercise: Exercise;
    parent1: Genotype;
    setParent1: (g: Genotype) => void;
    parent2: Genotype;
    setParent2: (g: Genotype) => void;
    showPunnett: boolean;
    setShowPunnett: (show: boolean) => void;
    selectedOffspring: string | null;
    handlePunnettAnswer: (answer: string) => void;
    checkAnswer: () => void;
    feedback: { correct: boolean, text: string } | null;
    onComplete: () => void;
}> = ({ 
    exercise, parent1, setParent1, parent2, setParent2, showPunnett, setShowPunnett, 
    selectedOffspring, handlePunnettAnswer, checkAnswer, feedback, onComplete 
}) => {
    return (
        <div className="space-y-6 w-full">
            {/* Parent Controls */}
            <div className="flex items-center justify-center gap-8 bg-card/50 p-4 rounded-xl border">
                <div className="text-center group">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white font-bold text-lg shadow-lg mb-2 mx-auto">
                        {parent1.join('')}
                    </div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Mother</p>
                    <div className="flex gap-1 justify-center">
                        {(['B', 'b'] as Allele[]).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    const newParent = [...parent1] as Genotype;
                                    newParent[i] = newParent[i] === 'B' ? 'b' : 'B';
                                    setParent1(newParent.sort((a, b) => a === 'B' ? -1 : 1) as Genotype);
                                }}
                                className={`w-6 h-6 p-0 text-xs rounded-md ${parent1[i] === 'B' ? 'bg-emerald-600 text-white' : 'bg-card border border-border'}`}
                            >
                                {parent1[i]}
                            </button>
                        ))}
                    </div>
                </div>
                <span className="text-xl font-bold text-slate-300">×</span>
                <div className="text-center group">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg mb-2 mx-auto">
                        {parent2.join('')}
                    </div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Father</p>
                    <div className="flex gap-1 justify-center">
                        {(['B', 'b'] as Allele[]).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    const newParent = [...parent2] as Genotype;
                                    newParent[i] = newParent[i] === 'B' ? 'b' : 'B';
                                    setParent2(newParent.sort((a, b) => a === 'B' ? -1 : 1) as Genotype);
                                }}
                                className={`w-6 h-6 p-0 text-xs rounded-md ${parent2[i] === 'B' ? 'bg-emerald-600 text-white' : 'bg-card border border-border'}`}
                            >
                                {parent2[i]}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <button 
                onClick={() => setShowPunnett(!showPunnett)}
                className="w-full py-2 border border-emerald-200 text-sm hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-lg"
            >
                {showPunnett ? 'Hide' : 'Show'} Punnett Square
            </button>

            <div className="space-y-4">
                <p className="font-semibold text-lg">{exercise.question}</p>
                <div className="grid grid-cols-2 gap-4">
                    {exercise.options?.map((percent: string) => (
                        <button key={percent} onClick={() => handlePunnettAnswer(percent)} disabled={!!feedback} className={`py-4 text-lg rounded-lg border transition-all ${selectedOffspring === percent ? 'bg-gradient-genetics-accent text-primary-foreground font-semibold' : 'bg-card hover:border-primary/50'}`}>
                            {percent}
                        </button>
                    ))}
                </div>
                {!feedback && (
                    <button onClick={checkAnswer} disabled={!selectedOffspring} className="mt-4 w-full px-4 py-3 bg-gradient-genetics-accent text-primary-foreground font-semibold rounded-lg disabled:opacity-50 shadow-md hover:shadow-lg transition-all">
                        Check Answer
                    </button>
                )}
                {feedback && (
                    <div className={`mt-4 p-4 rounded-lg border-l-4 text-sm animate-fade-in ${feedback.correct ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>
                        {feedback.text}
                    </div>
                )}
                {feedback?.correct && (
                    <button onClick={onComplete} className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 shadow-lg animate-fade-in">
                        Finish Chapter <ChevronRightIcon className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
};

export const MendelianGenetics: React.FC<ChapterProps> = ({ labData, onComplete, onBack, exercises, infoVisible, infoPlacement, settings }) => {
    const [parent1, setParent1] = useState<Genotype>(['B', 'b']);
    const [parent2, setParent2] = useState<Genotype>(['B', 'b']);
    const [selectedOffspring, setSelectedOffspring] = useState<string | null>(null);
    const [showPunnett, setShowPunnett] = useState(false);
    const [feedback, setFeedback] = useState<{correct: boolean, text: string}|null>(null);

    const currentExercise = exercises[0];
    if (!currentExercise) return null;

    const handlePunnettAnswer = (answer: string) => {
        if(feedback) return;
        setSelectedOffspring(answer);
    };

    const checkAnswer = () => {
        const correct = selectedOffspring === currentExercise.answer;
        if(correct) {
            toast.success("Correct!");
            setFeedback({ correct: true, text: currentExercise.explanation || "Correct!" });
        } else {
            toast.error("Not quite right.");
            setFeedback({ correct: false, text: "Check the Punnett square again." });
        }
    };

    const VisualContent = (
        <MendelianVisual 
            parent1={parent1} 
            parent2={parent2} 
            showPunnett={showPunnett} 
        />
    );

    const InteractionContent = (
        <MendelianInteraction 
            exercise={currentExercise}
            parent1={parent1}
            setParent1={setParent1}
            parent2={parent2}
            setParent2={setParent2}
            showPunnett={showPunnett}
            setShowPunnett={setShowPunnett}
            selectedOffspring={selectedOffspring}
            handlePunnettAnswer={handlePunnettAnswer}
            checkAnswer={checkAnswer}
            feedback={feedback}
            onComplete={onComplete}
        />
    );

    return (
        <BioLabLayout
            title={currentExercise.title}
            prompt={currentExercise.prompt}
            visualContent={VisualContent}
            interactionContent={InteractionContent}
            theoryContent={<TheoryPane exercise={currentExercise} />}
            infoVisible={infoVisible}
            infoPlacement={infoPlacement}
            settings={settings}
        />
    );
};

export default MendelianGenetics;

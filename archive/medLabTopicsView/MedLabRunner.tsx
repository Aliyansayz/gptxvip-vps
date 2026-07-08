
import React, { useState, useEffect } from 'react';
import { LabData } from '../../types';
import { medLabTopicsRegistry } from '../medLabTopicsRegistry';
import { ChevronLeftIcon, ChevronRightIcon, PanelRightIcon, PanelBottomIcon, BookOpenText } from '../icons';
import FavoriteButton from '../FavoriteButton';
import { LabSettingsMenu, LabSettings, loadSavedSettings } from '../LabSettingsMenu';

interface MedLabRunnerProps {
    chapter: LabData;
    onBack: () => void;
    onComplete: () => void;
}

import { LabProvider } from '../LabContext';

const MedLabRunner: React.FC<MedLabRunnerProps> = ({ chapter, onBack, onComplete }) => {
    const [step, setStep] = useState(0);
    const [settings, setSettings] = useState<LabSettings>(loadSavedSettings());
    const [infoVisible, setInfoVisible] = useState(!settings.hideTheoryDefault);
    const [infoPlacement, setInfoPlacement] = useState<'side' | 'bottom'>('side');

    const labContextValue = {
        courseType: 'med' as const,
        labId: chapter.labComponentId,
        chapterTitle: chapter.chapter_title
    };

    // Effect to handle settings changes for theory visibility
    useEffect(() => {
        if (settings.disableTheory) {
            setInfoVisible(false);
        }
    }, [settings.disableTheory]);

    const LabComponent = medLabTopicsRegistry[chapter.labComponentId];

    if (!LabComponent) {
        return (
            <div className="w-full max-w-4xl mx-auto p-8 bg-card rounded-2xl shadow-xl">
                <h2 className="text-2xl font-bold text-destructive">Error: Lab Component Not Found</h2>
                <p>Component not found for lab ID: {chapter.labComponentId}</p>
                <button onClick={onBack} className="mt-4 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg">Back</button>
            </div>
        );
    }

    const totalSteps = chapter.interactive_questions.length;
    const isMultiStep = totalSteps > 1;

    const handlePrev = () => {
        if (step > 0) setStep(s => s - 1);
    };

    const handleNext = () => {
        if (step < totalSteps - 1) {
            setStep(s => s + 1);
        } else {
            onComplete();
        }
    };

    return (
        <LabProvider value={labContextValue}>
            <div className="w-full h-full flex flex-col">
                <div className="flex-1 overflow-y-auto custom-scrollbar w-full p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-cyan-500 uppercase tracking-widest mb-1">MedLabs Simulation</span>
                            <h2 className="text-4xl md:text-5xl font-heading tracking-wide text-foreground">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 bg-[size:200%_auto] animate-gradient">
                                    {chapter.chapter_title}
                                </span>
                            </h2>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <FavoriteButton 
                                id={chapter.labComponentId}
                                type="medlab"
                                title={chapter.chapter_title}
                                courseId={chapter.course}
                            />

                            <LabSettingsMenu settings={settings} onSettingsChange={setSettings} />

                            {!settings.disableTheory && (
                                <div className="flex items-center bg-card border rounded-lg p-1 shadow-sm">
                                    <button 
                                        onClick={() => setInfoVisible(!infoVisible)} 
                                        title={infoVisible ? "Hide Theory" : "Show Theory"}
                                        className={`p-2 rounded-md transition-colors ${infoVisible ? 'bg-cyan-500/10 text-cyan-600' : 'text-muted-foreground hover:bg-muted'}`}
                                    >
                                        <BookOpenText className="w-4 h-4" />
                                    </button>
                                    {infoVisible && (
                                        <>
                                            <div className="w-px h-4 bg-border mx-1" />
                                            <button 
                                                onClick={() => setInfoPlacement('side')}
                                                title="Side View" 
                                                className={`p-2 rounded-md transition-colors ${infoPlacement === 'side' ? 'bg-cyan-500/10 text-cyan-600' : 'text-muted-foreground hover:bg-muted'}`}
                                            >
                                                <PanelRightIcon className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => setInfoPlacement('bottom')} 
                                                title="Bottom View"
                                                className={`p-2 rounded-md transition-colors ${infoPlacement === 'bottom' ? 'bg-cyan-500/10 text-cyan-600' : 'text-muted-foreground hover:bg-muted'}`}
                                            >
                                                <PanelBottomIcon className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Question Visibility Control */}
                            {!settings.disableQuestion && (
                                <div className="flex items-center bg-card border rounded-lg p-1 shadow-sm">
                                    <button 
                                        onClick={() => setSettings(prev => ({ ...prev, hideQuestionDefault: !prev.hideQuestionDefault }))}
                                        title={settings.hideQuestionDefault ? "Show Question" : "Hide Question"}
                                        className={`p-2 rounded-md transition-colors ${!settings.hideQuestionDefault ? 'bg-cyan-500/10 text-cyan-600' : 'text-muted-foreground hover:bg-muted'}`}
                                    >
                                        <span className="font-bold text-xs">Q</span>
                                    </button>
                                </div>
                            )}

                            <button
                                onClick={onBack}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-secondary text-secondary-foreground rounded-lg hover:bg-muted transition-colors"
                            >
                                <ChevronLeftIcon className="w-4 h-4" />
                                Back
                            </button>
                        </div>
                    </div>

                    <div className="bg-card rounded-2xl shadow-xl border-t-4 border-cyan-500">
                        <LabComponent
                            labData={chapter}
                            exercises={chapter.interactive_questions}
                            step={step}
                            setStep={setStep}
                            onComplete={onComplete}
                            onBack={onBack}
                            infoVisible={infoVisible}
                            setInfoVisible={setInfoVisible}
                            infoPlacement={infoPlacement}
                            setInfoPlacement={setInfoPlacement}
                            settings={settings}
                        />
                    </div>

                    {isMultiStep && (
                        <div className="mt-8 flex justify-between items-center">
                            <button onClick={handlePrev} disabled={step === 0} className="px-6 py-2 bg-secondary rounded-lg disabled:opacity-50 flex items-center gap-2 transition-colors hover:bg-muted"><ChevronLeftIcon className="w-5 h-5"/> Previous</button>
                            <button onClick={handleNext} className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg flex items-center gap-2 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:shadow-none disabled:transform-none">
                                {step === totalSteps - 1 ? 'Finish Chapter' : 'Next Exercise'}
                                <ChevronRightIcon className="w-5 h-5"/>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </LabProvider>
    );
};

export default MedLabRunner;

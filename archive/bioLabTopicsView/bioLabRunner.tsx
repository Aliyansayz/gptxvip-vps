
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { LabData } from '../../types';
import { bioLabTopicsRegistry } from '../bioLabTopicsRegistry';
import { ChevronLeftIcon, ChevronRightIcon, PanelRightIcon, PanelBottomIcon, BookOpenText } from '../icons';
import FavoriteButton from '../FavoriteButton';
import { LabSettingsMenu, LabSettings, loadSavedSettings } from '../LabSettingsMenu';

interface BioLabRunnerProps {
    chapter: LabData;
    onBack: () => void;
    onComplete: () => void;
}

const courseColorSchemes: Record<string, { gradient: string; hoverShadow: string; }> = {
    'Cellular Biology': { gradient: 'bg-gradient-bio-accent', hoverShadow: 'hover:shadow-primary/40' },
    'genetics': { gradient: 'bg-gradient-genetics-accent', hoverShadow: 'hover:shadow-emerald-500/40' },
    'ecology': { gradient: 'bg-gradient-genetics-accent', hoverShadow: 'hover:shadow-emerald-500/40' },
};
const defaultScheme = { gradient: 'bg-gradient-bio-accent', hoverShadow: 'hover:shadow-primary/40' };


import { LabProvider } from '../LabContext';

const BioLabRunner: React.FC<BioLabRunnerProps> = ({ chapter, onBack, onComplete }) => {
    const [step, setStep] = useState(0);
    const [settings, setSettings] = useState<LabSettings>(loadSavedSettings());
    const [infoVisible, setInfoVisible] = useState(!settings.hideTheoryDefault);
    const [infoPlacement, setInfoPlacement] = useState<'side' | 'bottom'>('side');

    const labContextValue = {
        courseType: 'bio' as const,
        labId: chapter.labComponentId,
        chapterTitle: chapter.chapter_title
    };

    // Effect to handle settings changes for theory visibility
    useEffect(() => {
        if (settings.disableTheory) {
            setInfoVisible(false);
        }
    }, [settings.disableTheory]);

    const LabComponent = bioLabTopicsRegistry[chapter.labComponentId];

    if (!LabComponent) {
        return (
            <div className="w-full max-w-4xl mx-auto p-8 bg-card rounded-2xl shadow-xl">
                <h2 className="text-2xl font-bold text-destructive">Error: Lab Component Not Found</h2>
                <p>Component not found for lab ID: {chapter.labComponentId}</p>
                <p>This usually means the chapter component hasn't been created or registered in <strong>components/bioLabTopicsRegistry</strong>.</p>
                <button onClick={onBack} className="mt-4 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg">Back</button>
            </div>
        );
    }

    const totalSteps = chapter.interactive_questions.length;
    const isMultiStep = totalSteps > 1;
    const scheme = courseColorSchemes[chapter.course] || defaultScheme;

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
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 flex-shrink-0">
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-purple-500 uppercase tracking-widest mb-1">BioLabs Simulation</span>
                            <h2 className="text-4xl md:text-5xl font-heading tracking-wide text-foreground">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-600 to-purple-500 bg-[size:200%_auto] animate-gradient">
                                    {chapter.chapter_title}
                                </span>
                            </h2>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <FavoriteButton 
                                id={chapter.labComponentId}
                                type="lab"
                                title={chapter.chapter_title}
                                courseId={chapter.course}
                            />

                            <LabSettingsMenu settings={settings} onSettingsChange={setSettings} />

                            {/* Theory Pane Controls */}
                            {!settings.disableTheory && (
                                <div className="flex items-center bg-card border rounded-lg p-1 shadow-sm">
                                    <button 
                                        onClick={() => setInfoVisible(!infoVisible)} 
                                        title={infoVisible ? "Hide Theory" : "Show Theory"}
                                        className={`p-2 rounded-md transition-colors ${infoVisible ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
                                    >
                                        <BookOpenText className="w-4 h-4" />
                                    </button>
                                    {infoVisible && (
                                        <>
                                            <div className="w-px h-4 bg-border mx-1" />
                                            <button 
                                                onClick={() => setInfoPlacement('side')}
                                                title="Side View" 
                                                className={`p-2 rounded-md transition-colors ${infoPlacement === 'side' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
                                            >
                                                <PanelRightIcon className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => setInfoPlacement('bottom')} 
                                                title="Bottom View"
                                                className={`p-2 rounded-md transition-colors ${infoPlacement === 'bottom' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
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
                                        className={`p-2 rounded-md transition-colors ${!settings.hideQuestionDefault ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
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

                    <div className="bg-card rounded-2xl shadow-xl border-t-4 border-emerald-500">
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
                            <button onClick={handleNext} className={`px-6 py-3 ${scheme.gradient} text-primary-foreground font-semibold rounded-lg flex items-center gap-2 shadow-md transition-all duration-300 hover:shadow-lg ${scheme.hoverShadow} hover:-translate-y-0.5 disabled:opacity-50 disabled:saturate-50 disabled:shadow-none disabled:transform-none`}>
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

export default BioLabRunner;

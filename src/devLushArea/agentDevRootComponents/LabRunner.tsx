
import React, { useState } from 'react';
import { LabData } from '../../types';
import { bioLabTopicsRegistry } from './bioLabTopicsRegistry';
import { toast, Toaster } from 'sonner';
import { ChevronLeftIcon, BookOpenText, PanelRightIcon, PanelBottomIcon } from './icons';

interface LabRunnerProps {
    labData: LabData;
    onBack: () => void;
}

export const LabRunner: React.FC<LabRunnerProps> = ({ labData, onBack }) => {
    const [step, setStep] = useState(0);
    const [infoVisible, setInfoVisible] = useState(true);
    const [infoPlacement, setInfoPlacement] = useState<'side' | 'bottom'>('side');

    const LabComponent = bioLabTopicsRegistry[labData.labComponentId];

    if (!LabComponent) {
        return (
            <div className="text-center p-8 bg-red-500/10 text-red-400 rounded-lg">
                <h2 className="text-xl font-bold">Error</h2>
                <p>Lab component with ID "{labData.labComponentId}" not found.</p>
                <button onClick={onBack} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg">Go Back</button>
            </div>
        );
    }
    
    const handleComplete = () => {
        toast.success(`${labData.chapter_title} completed!`);
        setTimeout(() => {
            onBack();
        }, 1500);
    }
    
    return (
        <div className="h-full flex flex-col bg-slate-50 dark:bg-black">
            <Toaster richColors theme="dark" position="top-center" />
            
            {/* Lab Header & Controls */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card shrink-0 z-10">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onBack}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                        title="Back to Topics"
                    >
                        <ChevronLeftIcon className="w-5 h-5 text-muted-foreground" />
                    </button>
                    <div>
                        <h2 className="text-lg font-bold text-foreground leading-tight">{labData.chapter_title}</h2>
                        <p className="text-xs text-muted-foreground">{labData.course}</p>
                    </div>
                </div>

                <div className="flex items-center bg-muted/50 border rounded-lg p-1">
                    <button 
                        onClick={() => setInfoVisible(!infoVisible)} 
                        className={`p-1.5 px-3 rounded-md transition-all flex items-center gap-2 text-sm font-medium ${!infoVisible ? 'text-muted-foreground hover:text-foreground' : 'bg-background shadow-sm text-primary'}`}
                        title={infoVisible ? "Hide Theory" : "Show Theory"}
                    >
                        <BookOpenText className="w-4 h-4" />
                        <span className="hidden sm:inline">Theory</span>
                    </button>
                    
                    {infoVisible && (
                        <>
                            <div className="w-px h-4 bg-border mx-1" />
                            <button 
                                onClick={() => setInfoPlacement('side')}
                                className={`p-1.5 rounded-md transition-all ${infoPlacement === 'side' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                                title="Side View"
                            >
                                <PanelRightIcon className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => setInfoPlacement('bottom')}
                                className={`p-1.5 rounded-md transition-all ${infoPlacement === 'bottom' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                                title="Bottom View"
                            >
                                <PanelBottomIcon className="w-4 h-4" />
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar p-3 md:p-6 relative">
                <LabComponent 
                    labData={labData}
                    onComplete={handleComplete}
                    onBack={onBack}
                    step={step}
                    setStep={setStep}
                    exercises={labData.interactive_questions}
                    infoVisible={infoVisible}
                    setInfoVisible={setInfoVisible}
                    infoPlacement={infoPlacement}
                    setInfoPlacement={setInfoPlacement}
                />
            </div>
        </div>
    );
};

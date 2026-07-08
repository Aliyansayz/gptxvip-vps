import React, { useState, useEffect } from 'react';
import { LabSettings } from '../LabSettingsMenu';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface BioLabLayoutProps {
    title?: string;
    prompt?: string;
    visualContent?: React.ReactNode;
    interactionContent?: React.ReactNode;
    exerciseContent?: React.ReactNode; // Fallback
    theoryContent: React.ReactNode;
    infoVisible: boolean;
    infoPlacement: 'side' | 'bottom';
    settings?: LabSettings;
}

export const BioLabLayout: React.FC<BioLabLayoutProps> = ({ 
    title,
    prompt,
    visualContent,
    interactionContent,
    exerciseContent,
    theoryContent, 
    infoVisible, 
    infoPlacement,
    settings
}) => {
    const [questionExpanded, setQuestionExpanded] = useState(!settings?.hideQuestionDefault);

    useEffect(() => {
        if (settings?.hideQuestionDefault !== undefined) {
             setQuestionExpanded(!settings.hideQuestionDefault);
        }
    }, [settings?.hideQuestionDefault]);

    const Content = exerciseContent || (
        <div className="bg-card p-6 rounded-lg shadow-sm border h-full flex flex-col">
            {title && (
                <div className="flex items-center justify-between mb-2 flex-shrink-0">
                     <h3 className="font-heading text-3xl tracking-wider text-center flex-1">{title}</h3>
                     {!settings?.disableQuestion && (prompt || interactionContent) && (
                        <button 
                            onClick={() => setQuestionExpanded(!questionExpanded)}
                            className="p-1 hover:bg-muted rounded-full transition-colors"
                            title={questionExpanded ? "Hide Question" : "Show Question"}
                        >
                            {questionExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                     )}
                </div>
            )}

            {!settings?.disableQuestion && questionExpanded && prompt && (
                <p className="text-muted-foreground text-center animate-in fade-in slide-in-from-top-2 flex-shrink-0">{prompt}</p>
            )}

            <div className="flex-none min-h-0 flex flex-col justify-center">
                {visualContent}
            </div>

            {!settings?.disableQuestion && questionExpanded && interactionContent && (
                <div className="animate-in fade-in slide-in-from-top-2 flex-shrink-0 pt-4">
                    {interactionContent}
                </div>
            )}
        </div>
    );

    return (
        <div className="w-full h-full animate-fade-in">
            {infoVisible && infoPlacement === 'side' ? (
                <div className="grid lg:grid-cols-3 gap-4 lg:gap-6 h-full">
                    <div className="lg:col-span-2 w-full min-w-0 h-full">
                        {Content}
                    </div>
                    <aside className="lg:col-span-1 h-full overflow-hidden min-w-0">
                        {theoryContent}
                    </aside>
                </div>
            ) : (
                <div className="flex flex-col gap-4 lg:gap-6 w-full h-full">
                    <div className="w-full min-w-0 flex-1">
                        {Content}
                    </div>
                    {infoVisible && infoPlacement === 'bottom' && (
                        <div className="w-full min-w-0 h-fit">
                            {theoryContent}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

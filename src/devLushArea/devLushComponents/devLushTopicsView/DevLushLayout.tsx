import React, { useState, useEffect } from 'react';
import { LabSettings } from '../../agentDevRootComponents/LabSettingsMenu';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface DevLushLayoutProps {
    title?: string;
    prompt?: string;
    visualContent?: React.ReactNode;
    interactionContent?: React.ReactNode; // Questions, options, results
    exerciseContent?: React.ReactNode; // Alternative fallback
    theoryContent: React.ReactNode;
    infoVisible: boolean;
    infoPlacement: 'side' | 'bottom';
    settings?: LabSettings;
    compactVisual?: boolean;
}

export const DevLushLayout: React.FC<DevLushLayoutProps> = ({ 
    title,
    prompt,
    visualContent,
    interactionContent,
    exerciseContent,
    theoryContent, 
    infoVisible, 
    infoPlacement,
    settings,
    compactVisual = false
}) => {
    const [questionExpanded, setQuestionExpanded] = useState(!settings?.hideQuestionDefault);

    useEffect(() => {
        if (settings?.hideQuestionDefault !== undefined) {
             setQuestionExpanded(!settings.hideQuestionDefault);
        }
    }, [settings?.hideQuestionDefault]);

    const titleGradient = "from-indigo-500 via-purple-600 to-indigo-500";

    const containerStyle = {};

    const containerClasses = "relative flex min-h-[320px] min-w-0 max-w-full flex-col bg-white dark:bg-slate-900 lg:h-full lg:overflow-y-auto lg:overflow-x-hidden";

    const Content = exerciseContent || (
        <div className={containerClasses} style={containerStyle}>
            {title && (
                <div className="mb-2 flex flex-shrink-0 items-center justify-between gap-2">
                     <h3 className="min-w-0 flex-1 break-words text-center font-heading text-xl tracking-wider sm:text-2xl lg:text-3xl">
                          <span className={`text-transparent bg-clip-text bg-gradient-to-r ${titleGradient} bg-[size:200%_auto] animate-gradient font-bold`}>
                               {title}
                          </span>
                     </h3>
                     {!settings?.disableQuestion && (prompt || interactionContent) && (
                        <button 
                            type="button"
                            onClick={() => setQuestionExpanded(!questionExpanded)}
                            aria-label={questionExpanded ? "Hide action workspace" : "Show action workspace"}
                            aria-expanded={questionExpanded}
                            className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-400 dark:hover:bg-slate-800"
                            title={questionExpanded ? "Hide Action Workspace" : "Show Action Workspace"}
                        >
                            {questionExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                     )}
                </div>
            )}

            {!settings?.disableQuestion && questionExpanded && prompt && (
                <p className="text-slate-600 dark:text-slate-400 text-center animate-in fade-in slide-in-from-top-2 flex-shrink-0 text-sm italic">
                    {prompt}
                </p>
            )}

            <div className="flex min-h-0 min-w-0 flex-none flex-col justify-start">
                {visualContent}
            </div>

            {!settings?.disableQuestion && questionExpanded && interactionContent && (
                <div className="animate-in fade-in slide-in-from-top-2 flex-shrink-0 border-t border-slate-100 dark:border-slate-800">
                    {interactionContent}
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-full min-w-0 w-full animate-fade-in lg:h-full">
            {infoVisible && infoPlacement === 'side' ? (
                <div className="grid min-w-0 gap-4 lg:h-full lg:grid-cols-3 lg:gap-6">
                    <div className="min-w-0 w-full lg:col-span-2 lg:h-full">
                        {Content}
                    </div>
                    <aside className="min-w-0 lg:col-span-1 lg:h-full lg:overflow-y-auto">
                        {theoryContent}
                    </aside>
                </div>
            ) : (
                <div className="flex min-w-0 w-full flex-col gap-4 lg:h-full lg:gap-6">
                    <div className="min-w-0 w-full lg:min-h-0 lg:flex-1">
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

export default DevLushLayout;

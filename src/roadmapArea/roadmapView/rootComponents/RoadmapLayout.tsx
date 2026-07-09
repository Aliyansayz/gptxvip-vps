import React, { useState, useEffect } from 'react';
import { LabSettings } from '../../roadmapSharedComponents/LabSettingsMenu';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface RoadmapLayoutProps {
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

export const RoadmapLayout: React.FC<RoadmapLayoutProps> = ({ 
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

    const containerClasses = "bg-white dark:bg-slate-900 h-full flex flex-col relative overflow-hidden";

    const Content = exerciseContent || (
        <div className={containerClasses} style={containerStyle}>
            {title && (
                <div className="flex items-center justify-between mb-2 flex-shrink-0">
                     <h3 className="font-heading text-3xl tracking-wider text-center flex-1">
                          <span className={`text-transparent bg-clip-text bg-gradient-to-r ${titleGradient} bg-[size:200%_auto] animate-gradient font-bold`}>
                               {title}
                          </span>
                     </h3>
                     {!settings?.disableQuestion && (prompt || interactionContent) && (
                        <button 
                            onClick={() => setQuestionExpanded(!questionExpanded)}
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400"
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

            <div className={`flex-none min-h-0 flex flex-col justify-start`}>
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

export default RoadmapLayout;

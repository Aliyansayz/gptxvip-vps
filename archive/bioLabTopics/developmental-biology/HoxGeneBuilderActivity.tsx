import React, { useState } from 'react';
import { TheoryVisual } from '../../TheoryVisual';
import { LabData, Exercise } from '../../../types';
import { motion, AnimatePresence } from 'motion/react';

interface HoxGeneBuilderProps {
    labData: LabData;
    exercises: Exercise[];
    onComplete: () => void;
}

type SegmentId = 'head' | 'thorax' | 'abdomen';
type GeneId = 'hox1' | 'hox2' | 'hox3';

interface Gene {
    id: GeneId;
    name: string;
    color: string;
    target: SegmentId;
    structure: string;
    icon: string;
}

const GENES: Gene[] = [
    { id: 'hox1', name: 'Antennapedia', color: 'bg-red-500', target: 'head', structure: 'Antennae', icon: '📡' },
    { id: 'hox2', name: 'Ultrabithorax', color: 'bg-purple-500', target: 'thorax', structure: 'Wings & Legs', icon: '🪽' },
    { id: 'hox3', name: 'Abdominal-B', color: 'bg-blue-500', target: 'abdomen', structure: 'Posterior Segments', icon: '🐛' },
];

const HoxGeneBuilderActivity: React.FC<HoxGeneBuilderProps> = ({ onComplete }) => {
    const [activeGene, setActiveGene] = useState<Gene | null>(null);
    const [segments, setSegments] = useState<Record<SegmentId, Gene | null>>({
        head: null,
        thorax: null,
        abdomen: null
    });

    const handleGeneClick = (gene: Gene) => {
        setActiveGene(gene);
    };

    const handleSegmentClick = (segmentId: SegmentId) => {
        if (activeGene) {
            setSegments(prev => ({ ...prev, [segmentId]: activeGene }));
            setActiveGene(null);
        }
    };

    const handleReset = () => {
        setSegments({ head: null, thorax: null, abdomen: null });
        setActiveGene(null);
    };

    const isComplete = segments.head && segments.thorax && segments.abdomen;
    const isCorrect = 
        segments.head?.target === 'head' && 
        segments.thorax?.target === 'thorax' && 
        segments.abdomen?.target === 'abdomen';

    return (
        <div className="w-full flex flex-col items-center justify-center min-h-[600px] p-6">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Hox Gene Builder</h2>
                <p className="text-muted-foreground">Select a Hox gene and apply it to an embryo segment.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-12 w-full max-w-4xl">
                
                {/* Gene Palette */}
                <div className="flex-1 bg-card p-6 rounded-2xl shadow-sm border border-border">
                    <h3 className="font-semibold mb-4 text-center">Hox Genes</h3>
                    <div className="flex flex-col gap-4">
                        {GENES.map(gene => (
                            <button
                                key={gene.id}
                                onClick={() => handleGeneClick(gene)}
                                className={`p-4 rounded-xl flex items-center justify-between transition-all ${gene.color} text-white ${activeGene?.id === gene.id ? 'ring-4 ring-primary ring-offset-2 ring-offset-background scale-105' : 'hover:scale-105 opacity-90'}`}
                            >
                                <span className="font-bold">{gene.name}</span>
                                <span className="text-2xl">{gene.icon}</span>
                            </button>
                        ))}
                    </div>
                    {activeGene && (
                        <p className="text-sm text-center mt-4 text-muted-foreground animate-pulse">
                            Click a segment to apply {activeGene.name}...
                        </p>
                    )}
                </div>

                {/* Embryo Model */}
                <div className="flex-1 flex flex-col items-center justify-center gap-2">
                    <h3 className="font-semibold mb-4">Developing Embryo</h3>
                    
                    {(['head', 'thorax', 'abdomen'] as SegmentId[]).map((segmentId) => {
                        const appliedGene = segments[segmentId];
                        return (
                            <div 
                                key={segmentId}
                                onClick={() => handleSegmentClick(segmentId)}
                                className={`w-48 h-24 rounded-3xl border-4 border-dashed flex items-center justify-center cursor-pointer transition-all relative overflow-hidden
                                    ${activeGene ? 'border-primary/50 hover:border-primary hover:bg-primary/10' : 'border-border'}
                                    ${appliedGene ? appliedGene.color + ' border-transparent' : 'bg-muted/30'}
                                `}
                            >
                                <AnimatePresence mode="wait">
                                    {appliedGene ? (
                                        <motion.div
                                            key="filled"
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="text-white text-center"
                                        >
                                            <div className="text-3xl mb-1">{appliedGene.icon}</div>
                                            <div className="font-bold text-sm">{appliedGene.structure}</div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="empty"
                                            className="text-muted-foreground font-medium uppercase tracking-widest text-sm"
                                        >
                                            {segmentId}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Feedback & Controls */}
            <div className="mt-12 flex flex-col items-center gap-4">
                {isComplete && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl text-center font-bold ${isCorrect ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}
                    >
                        {isCorrect ? "Perfect! You've built a viable fruit fly." : "Mutation detected! The body plan is incorrect. Try again."}
                    </motion.div>
                )}

                <div className="flex gap-4">
                    <button 
                        onClick={handleReset}
                        className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-muted transition-colors"
                    >
                        Reset Embryo
                    </button>
                    {isComplete && isCorrect && (
                        <button 
                            onClick={onComplete}
                            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg hover:shadow-orange-500/40"
                        >
                            Complete Activity
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HoxGeneBuilderActivity;

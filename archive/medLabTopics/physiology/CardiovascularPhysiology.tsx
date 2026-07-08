import React from 'react';
import { Exercise, LabData } from '../../../types';
import { MedLabLayout } from '../../medLabTopicsView/MedLabLayout';
import { LabSettings } from '../../LabSettingsMenu';
import { PhysiologyPrimaryVisual } from './PhysiologyVisuals';
import { TheoryPane, PhysiologyInteraction, usePhysiologyInteraction } from './PhysiologyShared';

interface ChapterProps {
  labData: LabData;
  step: number;
  exercises: Exercise[];
  infoVisible: boolean;
  infoPlacement: 'side' | 'bottom';
  settings?: LabSettings;
}

export const CardiovascularPhysiology: React.FC<ChapterProps> = ({ labData, step, exercises, infoVisible, infoPlacement, settings }) => {
    const currentExercise = exercises[step];
    const { selectedAnswer, showResult, isCorrect, handleSelectAnswer } = usePhysiologyInteraction(currentExercise);

    if (!currentExercise) return null;

    const InteractionContent = (
        <PhysiologyInteraction 
            exercise={currentExercise} 
            selectedAnswer={selectedAnswer} 
            isCorrect={isCorrect} 
            showResult={showResult} 
            handleSelectAnswer={handleSelectAnswer} 
        />
    );

    const VisualContent = (
        <div className="flex items-center justify-center w-full h-full min-h-[300px] bg-slate-100 dark:bg-slate-900/20 rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner p-4">
            <PhysiologyPrimaryVisual componentId={currentExercise.componentId || 'cv-main-sim'} />
        </div>
    );

    return (
        <MedLabLayout
            title={labData.chapter_title || "Cardiovascular Physiology"}
            prompt={currentExercise.prompt || "Answer the following question:"}
            visualContent={VisualContent}
            interactionContent={InteractionContent}
            theoryContent={<TheoryPane theory={currentExercise.theory} />}
            infoVisible={infoVisible}
            infoPlacement={infoPlacement}
            settings={settings}
        />
    );
};

export default CardiovascularPhysiology;

import React from 'react';
import { TheoryVisual } from '../../TheoryVisual';
import { LabData, Exercise } from '../../../types';
import { PCRWalkthrough } from './PCRWalkthrough';

interface PCRWalkthroughActivityProps {
    labData: LabData;
    exercises: Exercise[];
    step: number;
    setStep: (step: number) => void;
    onComplete: () => void;
    onBack: () => void;
    infoVisible: boolean;
    setInfoVisible: (visible: boolean) => void;
    infoPlacement: 'side' | 'bottom';
    setInfoPlacement: (placement: 'side' | 'bottom') => void;
    settings: any;
}

const PCRWalkthroughActivity: React.FC<PCRWalkthroughActivityProps> = ({
    exercises,
    onComplete,
}) => {
    const currentExercise = exercises[0];

    if (!currentExercise) return null;

    return (
        <div className="w-full h-full p-6">
            <PCRWalkthrough exercise={currentExercise} onComplete={onComplete} />
        </div>
    );
};

export default PCRWalkthroughActivity;

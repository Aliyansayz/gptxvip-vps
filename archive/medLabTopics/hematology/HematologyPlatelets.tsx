import React from 'react';
import { Exercise } from '../../../types';
import { LabSettings } from '../../LabSettingsMenu';
import { HematologyLabBase } from './HematologyLabBase';
import { useBloodCells } from './HematologyVisuals';

interface ChapterProps {
    step: number;
    exercises: Exercise[];
    infoVisible: boolean;
    infoPlacement: 'side' | 'bottom';
    settings?: LabSettings;
}

export const HematologyPlatelets: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement, settings }) => {
    const exercise = exercises[step];
    const cells = useBloodCells(exercise?.pattern || 'normal');

    if (!exercise) return null;

    return (
        <HematologyLabBase
            exercise={exercise}
            cells={cells}
            infoVisible={infoVisible}
            infoPlacement={infoPlacement}
            settings={settings}
        />
    );
};

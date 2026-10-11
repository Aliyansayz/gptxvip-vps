
import React from 'react';
import { GeneIcon, Leaf, CellIcon, MicroscopeIcon, PillIcon, ActivityIcon, BabyIcon } from './icons';

export const CourseIcon: React.FC<{ course: string, className?: string }> = ({ course, className = 'w-6 h-6' }) => {
    switch (course.toLowerCase()) {
        case 'genetics':
            return <GeneIcon className={className} />;
        case 'ecology':
            return <Leaf className={className} />;
        case 'cellular biology':
            return <CellIcon className={className} />;
        case 'pathology':
            return <MicroscopeIcon className={className} />;
        case 'pharmacology':
            return <PillIcon className={className} />;
        case 'physiology':
            return <ActivityIcon className={className} />;
        case 'developmental biology':
            return <BabyIcon className={className} />;
        default:
            return <GeneIcon className={className} />; // Default icon
    }
};

import React, { createContext, useContext, ReactNode } from 'react';
import { CourseType } from '../roadmapView/types';

interface LabContextType {
    courseType: 'bio' | 'med' | CourseType;
    labId: string;
    chapterTitle: string;
}

const LabContext = createContext<LabContextType | undefined>(undefined);

export const LabProvider: React.FC<{ value: LabContextType; children: ReactNode }> = ({ value, children }) => {
    return <LabContext.Provider value={value}>{children}</LabContext.Provider>;
};

export const useLabContext = () => {
    const context = useContext(LabContext);
    return context;
};

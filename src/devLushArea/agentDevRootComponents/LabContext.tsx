import React, { createContext, useContext, ReactNode } from 'react';

interface LabContextType {
    courseType: 'bio' | 'med';
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

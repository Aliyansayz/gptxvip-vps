import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { SymptomDetailTemplate } from './SymptomDetailTemplate';
import symptomsDetailData from './symptoms_detail.json';

// Registry of symptom-specific lab components (empty for now, can be used for custom overrides)
const symptomComponents: Record<number, React.LazyExoticComponent<React.FC<any>>> = {};

interface Symptom {
  id: number;
  label: string;
  category: string;
  severity: string;
}

interface SymptomDetailPaneProps {
  symptom: Symptom | null;
  onSelectSymptom?: (id: number) => void;
}

export const SymptomDetailPane: React.FC<SymptomDetailPaneProps> = ({ 
  symptom,
  onSelectSymptom
}) => {
  if (!symptom) return null;

  const CustomComponent = symptomComponents[symptom.id];
  
  // Try to find the detail data in our local JSON
  const detailData = (symptomsDetailData as any[]).find(s => s.id === symptom.id);

  return (
    <div className="w-full mt-16 pt-16 border-t border-slate-200 dark:border-slate-800">
      <Suspense fallback={
        <div className="flex items-center justify-center p-20 border border-slate-100 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/50">
           <div className="flex flex-col items-center gap-3">
             <Loader2 className="animate-spin text-slate-400" size={24} />
             <span className="text-xs font-semibold text-slate-500 tracking-wide">Loading Theoretical Foundation...</span>
           </div>
        </div>
      }>
        {CustomComponent ? (
          <CustomComponent onSelectSymptom={onSelectSymptom} />
        ) : detailData ? (
          <SymptomDetailTemplate data={detailData} onSelectSymptom={onSelectSymptom} />
        ) : (
          <div className="p-12 text-center text-slate-500 italic">
            Detailed theoretical content for {symptom.label} is currently in development.
          </div>
        )}
      </Suspense>
    </div>
  );
};

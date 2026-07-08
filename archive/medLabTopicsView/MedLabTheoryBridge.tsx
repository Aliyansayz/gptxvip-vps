import React from 'react';
import { SavedTheory } from '../TheoryCollectionContext';
import { LightbulbIcon, Stethoscope } from 'lucide-react';

import { AntigenVisual, ElisaVisual, UniversalDonorVisual } from '../medLabTopics/clinical-lab/ImmunologyLab';
import { GramStainMechanismVisual, BacteriaShapesVisual } from '../medLabTopics/clinical-lab/MicrobiologyLab';
import { LemonadeAnalogy, BurglarAnalogyVisual } from '../medLabTopics/clinical-lab/UrinalysisLab';
import { TruckAnalogy, HbA1cAnalogyVisual } from '../medLabTopics/clinical-lab/BloodAnalysisLab';
import { AntibodyKeyVisual } from '../medLabTopics/clinical-lab/ToxicologyLab';

import { CameraAnalogy, RiverAnalogy, RoadAnalogy, DashboardAnalogy } from '../medLabTopics/point-of-care/POCTVisuals';
import { HematologyInfographic } from '../medLabTopics/hematology/HematologyVisuals';
import { CardiologyAnalogyVisual } from '../medLabTopics/cardiology/CardiologyVisuals';
import { PhysiologyAnalogyVisual } from '../medLabTopics/physiology/PhysiologyVisuals';
import { ToxicologyAnalogyVisual } from '../medLabTopics/toxicology/visuals/ToxicologyAnalogyVisuals';

interface MedLabTheoryBridgeProps {
  item: SavedTheory;
}

/**
 * MedLabTheoryBridge acts as the high-level bridge between Topic Theory 
 * and the particular medlabs theory component.
 * It automatically facilitates rendering HTML markdowns and graphics objects (SVGs etc.)
 * as they are rendered in the frontend, not just backend text.
 */
export const MedLabTheoryBridge: React.FC<MedLabTheoryBridgeProps> = ({ item }) => {
  const { content, analogy, application } = item.theory;

  const visual = (() => {
    const et = (item.exerciseTitle || '').toLowerCase();
    const tt = (item.theory.title || '').toLowerCase();
    const combined = `${et} ${tt}`;

    // Hematology
    const hematologyKeywords = ['hematology', 'blood smear', 'rbc', 'wbc', 'platelet', 'leukemia', 'lymphoma', 'aml', 'cll', 'anemia', 'sickle', 'schistocyte', 'hyperseg', 'thrombocytopenia', 'aplastic', 'artifact', 'target cell', 'infection', 'clumping'];
    if (item.labId?.includes('hematology') || hematologyKeywords.some(kw => combined.includes(kw))) {
      let pattern = 'normal';
      if (combined.includes('aml')) pattern = 'aml';
      else if (combined.includes('cll')) pattern = 'cll';
      else if (combined.includes('leukemia') || combined.includes('lymphoma')) pattern = 'leukemia';
      else if (combined.includes('sickle')) pattern = 'sickle';
      else if (combined.includes('target')) pattern = 'target';
      else if (combined.includes('schistocyte')) pattern = 'schistocyte';
      else if (combined.includes('infection')) pattern = 'infection';
      else if (combined.includes('hyperseg')) pattern = 'hyperseg';
      else if (combined.includes('clumping')) pattern = 'clumping';
      else if (combined.includes('thrombocytopenia')) pattern = 'thrombocytopenia';
      else if (combined.includes('aplastic')) pattern = 'aplastic';
      else if (combined.includes('artifact')) pattern = 'artifact';
      else if (combined.includes('anemia') && item.labId?.includes('hematology')) pattern = 'anemia';

      // If it's anemia but not hematology lab, let the Clinical Lab handle it below
      if (pattern !== 'normal' || item.labId?.includes('hematology') || hematologyKeywords.filter(k => k !== 'anemia').some(kw => combined.includes(kw))) {
        return <HematologyInfographic pattern={pattern} />;
      }
    }

    // Clinical Lab
    if (combined.includes('universal donor')) return <UniversalDonorVisual />;
    if (combined.includes('abo') || combined.includes('blood grouping')) return <AntigenVisual />;
    if (combined.includes('common pathogens') || combined.includes('bacteria shapes')) return <BacteriaShapesVisual />;
    if (combined.includes('gram stain')) return <GramStainMechanismVisual />;
    if (combined.includes('markers of infection') || combined.includes('leukocyte') || combined.includes('nitrite')) return <BurglarAnalogyVisual />;
    if (combined.includes('concentration') || combined.includes('specific gravity')) return <LemonadeAnalogy />;
    if (combined.includes('diabetes markers') || combined.includes('hba1c')) return <HbA1cAnalogyVisual />;
    if (combined.includes('anemia')) return <TruckAnalogy />;
    if (combined.includes('drug screen') || combined.includes('toxicology')) return <AntibodyKeyVisual />;
    if (combined.includes('elisa screening principle')) return <ElisaVisual isPositive={true} />;
    if (combined.includes('hbsag screening')) return <ElisaVisual isPositive={false} />;

    // Point of Care
    if (combined.includes('glucose') || combined.includes('glucometer')) return <CameraAnalogy />;
    if (combined.includes('rapid') || combined.includes('strep') || combined.includes('flu') || combined.includes('lateral flow')) return <RiverAnalogy />;
    if (combined.includes('coagulation') || combined.includes('pt/inr') || combined.includes('warfarin')) return <RoadAnalogy value={2.5} />;
    if (combined.includes('urinalysis') || combined.includes('dipstick')) return <DashboardAnalogy />;

    // Cardiology
    if (item.labId?.includes('cardio') || combined.includes('cardio') || combined.includes('cardiac') || combined.includes('heart') || combined.includes('ecg')) return <CardiologyAnalogyVisual title={item.theory.title} analogy={item.theory.analogy} />;

    // Physiology
    if (item.labId?.includes('physiology') || combined.includes('physiology')) return <PhysiologyAnalogyVisual title={item.theory.title} analogy={item.theory.analogy} />;

    // Toxicology (if not caught by AntibodyKeyVisual)
    if (item.labId?.includes('toxicology') || combined.includes('toxin') || combined.includes('overdose')) return <ToxicologyAnalogyVisual title={item.theory.title} analogy={item.theory.analogy} />;

    return null;
  })();

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <div className="text-foreground/90 leading-relaxed" dangerouslySetInnerHTML={{ __html: content }} />
      
      {visual && (
        <div className="my-6">
          {visual}
        </div>
      )}

      {(analogy || application) && <hr className="border-border opacity-50 my-6" />}

      
      {analogy && (
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-200 dark:border-yellow-800">
          <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2 uppercase tracking-wide">
            <LightbulbIcon className="w-4 h-4 text-yellow-500" />
            Analogy
          </h4>
          <p className="text-muted-foreground text-sm italic leading-relaxed">"{analogy}"</p>
        </div>
      )}
      
      {application && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800">
          <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2 uppercase tracking-wide">
            <Stethoscope className="w-4 h-4 text-blue-500" />
            Clinical Application
          </h4>
          <p className="text-muted-foreground text-sm leading-relaxed">{application}</p>
        </div>
      )}
    </div>
  );
};

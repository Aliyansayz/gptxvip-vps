import React from 'react';
import { SavedTheory } from '../TheoryCollectionContext';
import { LightbulbIcon, Stethoscope } from 'lucide-react';

import { OsmosisTheoryVisual, ActiveTransportTheoryVisual } from '../bioLabTopics/cellular-biology/CellularProcesses';
import { GlycolysisVisual, KrebsCycleVisual, ETCVisual } from '../bioLabTopics/cellular-biology/CellularRespiration';
import { CellCityVisual, PlantVsAnimalVisual } from '../bioLabTopics/cellular-biology/CellOrganelles';
import { FirstPassVisual, EnzymeInductionVisual } from '../bioLabTopics/pharmacology/DrugMetabolism';
import { ReceptorBindingVisual, AgonistAntagonistVisual, TherapeuticIndexVisual, ADMEVisual } from '../bioLabTopics/pharmacology/Pharmacology';
import { SynergyVisual, AntagonismVisual } from '../bioLabTopics/pharmacology/DrugInteractions';
import { EnergyPyramidVisual } from '../bioLabTopics/ecology/EnergyFlow';
import { FoldingFunnelVisual, StructureHierarchyTheoryVisual, DenaturationTheoryVisual, MassSpecTheoryVisual, GelTheoryVisual, WesternBlotTheoryVisual } from '../bioLabTopics/proteomics/ProteomicsLab';
import { DnaReplicationVisual, TranscriptionVisual, TranslationVisual } from '../bioLabTopics/genetics/DnaToProtein';
import { GramWallVisual, ShapeVisual } from '../bioLabTopics/microbiology/MicrobiologyLab';
import { ValveVisual } from '../bioLabTopics/physiology/HeartCirculation';
import { EnzymeLockVisual } from '../bioLabTopics/physiology/DigestiveSystem';
import { NegativeFeedbackVisual } from '../bioLabTopics/physiology/EndocrineSystem';
import { SlidingFilamentVisual, MotorUnitVisual } from '../bioLabTopics/physiology/MusclePhysiology';
import { FilterVisual } from '../bioLabTopics/physiology/RenalPhysiology';
import { DiffusionVisual, PressureVisual } from '../bioLabTopics/physiology/RespiratorySystem';
import { TheoryVisual } from '../TheoryVisual';

interface BioLabTheoryBridgeProps {
  item: SavedTheory;
}

/**
 * BioLabTheoryBridge acts as the high-level bridge between Topic Theory 
 * and the particular biolabs theory component.
 * It automatically facilitates rendering HTML markdowns and graphics objects (SVGs etc.)
 * as they are rendered in the frontend, not just backend text.
 */
export const BioLabTheoryBridge: React.FC<BioLabTheoryBridgeProps> = ({ item }) => {
  const { content, analogy, application } = item.theory;

  const visual = (() => {
    const et = (item.exerciseTitle || '').toLowerCase();
    const tt = (item.theory.title || '').toLowerCase();
    const combined = `${et} ${tt}`;

    if (combined.includes('osmosis')) return <OsmosisTheoryVisual />;
    if (combined.includes('active') || combined.includes('transport')) return <ActiveTransportTheoryVisual />;
    if (combined.includes('glycolysis')) return <GlycolysisVisual />;
    if (combined.includes('krebs')) return <KrebsCycleVisual />;
    if (combined.includes('electron') || combined.includes('etc')) return <ETCVisual />;
    if (combined.includes('city') || combined.includes('organelle')) return <CellCityVisual />;
    if (combined.includes('plant') || combined.includes('animal') || combined.includes('differences')) return <PlantVsAnimalVisual />;
    if (combined.includes('first pass')) return <FirstPassVisual />;
    if (combined.includes('enzyme induction')) return <EnzymeInductionVisual />;
    if (combined.includes('receptor')) return <ReceptorBindingVisual />;
    if (combined.includes('agonist')) return <AgonistAntagonistVisual />;
    if (combined.includes('therapeutic index')) return <TherapeuticIndexVisual />;
    if (combined.includes('adme')) return <ADMEVisual />;
    if (combined.includes('synergy')) return <SynergyVisual />;
    if (combined.includes('antagonism')) return <AntagonismVisual />;
    if (combined.includes('energy pyramid') || combined.includes('energy flow')) return <EnergyPyramidVisual />;
    if (combined.includes('folding funnel') || combined.includes('hydrophobic collapse')) return <FoldingFunnelVisual />;
    if (combined.includes('structure hierarchy') || combined.includes('levels of protein structure')) return <StructureHierarchyTheoryVisual />;
    if (combined.includes('denaturation')) return <DenaturationTheoryVisual />;
    if (combined.includes('mass spec')) return <MassSpecTheoryVisual />;
    if (combined.includes('gel')) return <GelTheoryVisual />;
    if (combined.includes('western blot')) return <WesternBlotTheoryVisual />;
    
    // Microbiology
    if (combined.includes('gram') || combined.includes('stain')) return <GramWallVisual />;
    if (combined.includes('shape') || combined.includes('morphology')) return <ShapeVisual />;

    // Physiology
    if (combined.includes('valve') || combined.includes('backflow')) return <ValveVisual />;
    if (combined.includes('enzyme lock') || combined.includes('substrate')) return <EnzymeLockVisual />;
    if (combined.includes('feedback') || combined.includes('thermostat')) return <NegativeFeedbackVisual />;
    if (combined.includes('filament') || combined.includes('sliding')) return <SlidingFilamentVisual />;
    if (combined.includes('motor unit') || combined.includes('recruitment')) return <MotorUnitVisual />;
    if (combined.includes('filter') || combined.includes('sieve') || combined.includes('renal')) return <FilterVisual />;
    if (combined.includes('diffusion') || combined.includes('gradient') || combined.includes('gas exchange')) return <DiffusionVisual />;
    if (combined.includes('boyle') || combined.includes('pressure')) return <PressureVisual />;

    // Genetics
    if (combined.includes('replication')) return <DnaReplicationVisual exercise={{ id: '1', componentId: 'dummy', concept_tested: 'dummy', question: 'dummy', answer: 'dummy', title: item.exerciseTitle, prompt: '', type: 'interactive' }} />;
    if (combined.includes('transcription')) return <TranscriptionVisual exercise={{ id: '1', componentId: 'dummy', concept_tested: 'dummy', question: 'dummy', answer: 'dummy', title: item.exerciseTitle, prompt: '', type: 'interactive' }} />;
    if (combined.includes('translation')) return <TranslationVisual exercise={{ id: '1', componentId: 'dummy', concept_tested: 'dummy', question: 'dummy', answer: 'dummy', title: item.exerciseTitle, prompt: '', type: 'interactive' }} />;

    // Developmental Biology & General Analogies
    const devBioKeywords = ['cleavage', 'division', 'expression', 'differentiation', 'morphogen', 'gradient', 'hox', 'body plan'];
    if (item.labId?.includes('developmental') || devBioKeywords.some(kw => combined.includes(kw))) {
      return <TheoryVisual analogyName={item.theory.title} keywords={[...devBioKeywords, ...combined.split(' ')]} />;
    }

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

      {analogy && (
          <TheoryVisual 
              analogyName={analogy} 
              keywords={[item.theory.title, content]} 
          />
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

import React from 'react';
import CoreConceptsHub from './bioLabTopicsHub';
import { ConceptCourse, LabData } from '../../types';

interface EnrichedConceptData extends ConceptCourse {
    chapters: LabData[];
}

interface HubProps {
  isManualLock: boolean;
  isEnergyDepleted: boolean;
  completedIds: Set<string | number>;
  // consumeEnergy: (id: string | number) => void;
  isChatBookOpen: boolean;
  setIsChatBookOpen: (isOpen: boolean) => void;
  onActivityStateChange: (isOpen: boolean) => void;
  onTopicChange?: (topic: string) => void;
  // FIX: Added missing properties to align with CoreConceptsHub's expected props and removed consumeEnergy.
  conceptTopics: EnrichedConceptData[];
  isLoading: boolean;
  onStartChapter: (chapter: LabData) => void;
  activeTopicId: string;
}

const CoreConcepts: React.FC<HubProps> = (props) => {
  return (
    <div className="flex-1 h-full">
      <CoreConceptsHub {...props} />
    </div>
  );
};

export default CoreConcepts;
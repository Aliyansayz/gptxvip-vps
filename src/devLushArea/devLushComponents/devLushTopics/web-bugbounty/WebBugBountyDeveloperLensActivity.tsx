import React from 'react';
import { Exercise } from '../../devLushTypes';

import { LabSettings } from '../../../agentDevRootComponents/LabSettingsMenu';
import ReadingActivity from '../shared/ReadingActivity';
import VulnerabilityPatcherActivity from './VulnerabilityPatcherActivity';

interface ChapterProps {
  step: number;
  exercises: Exercise[];
  infoVisible: boolean;
  infoPlacement: 'side' | 'bottom';
  settings?: LabSettings;
}

export const WebBugBountyDeveloperLensActivity: React.FC<ChapterProps> = (props) => {
  const question = props.exercises[props.step];

  if (question.componentId === 'vulnerability-patcher') {
    return <VulnerabilityPatcherActivity {...props} />;
  }

  // Fallback to reading
  return <ReadingActivity {...props} />;
};

export default WebBugBountyDeveloperLensActivity;

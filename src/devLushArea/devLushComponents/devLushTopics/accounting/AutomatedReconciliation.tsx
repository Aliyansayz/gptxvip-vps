import React from 'react';
import { Exercise } from '../../devLushTypes';

import { LabSettings } from '../../../agentDevRootComponents/LabSettingsMenu';
import BenfordsLawAudit from './BenfordsLawAudit';
import SemanticReconciliation from './SemanticReconciliation';

interface ChapterProps {
  step: number;
  exercises: Exercise[];
  infoVisible: boolean;
  infoPlacement: 'side' | 'bottom';
  settings?: LabSettings;
}

export const AutomatedReconciliation: React.FC<ChapterProps> = (props) => {
  const question = props.exercises[props.step];

  if (question.componentId === 'audit-ledger-1') {
    return <BenfordsLawAudit {...props} />;
  }

  if (question.componentId === 'audit-ledger-2') {
    return <SemanticReconciliation {...props} />;
  }

  return (
    <div className="p-8 text-center text-slate-500">
      Component not found for {question.componentId}
    </div>
  );
};

export default AutomatedReconciliation;

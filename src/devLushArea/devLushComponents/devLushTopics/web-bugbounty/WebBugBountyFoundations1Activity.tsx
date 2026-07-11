import React from 'react';
import { Exercise } from '../../devLushTypes';

import { LabSettings } from '../../../agentDevRootComponents/LabSettingsMenu';
import AttackSurfaceDiscovery from './AttackSurfaceDiscovery';
import AuthorizationTesting from './AuthorizationTesting';
import XssSandbox from './sandboxes/XssSandbox';
import CsrfSandbox from './sandboxes/CsrfSandbox';
import AuthFlawsSandbox from './sandboxes/AuthFlawsSandbox';
import RceSandbox from './sandboxes/RceSandbox';
import SsrfSandbox from './sandboxes/SsrfSandbox';
import LfiSandbox from './sandboxes/LfiSandbox';
import XxeSandbox from './sandboxes/XxeSandbox';
import DnsSandbox from './sandboxes/DnsSandbox';
import WhoisSandbox from './sandboxes/WhoisSandbox';

import { DevLushLayout } from '../../devLushTopicsView/DevLushLayout';
import { DevLushTheoryBridge } from '../../devLushTopicsView/DevLushTheoryBridge';
import SaveTheoryButton from '../../../agentDevRootComponents/TopicTheoryView/SaveTheoryButton';

interface ChapterProps {
  step: number;
  exercises: Exercise[];
  infoVisible: boolean;
  infoPlacement: 'side' | 'bottom';
  settings?: LabSettings;
}

export const WebBugBountyFoundations1Activity: React.FC<ChapterProps> = (props) => {
  const question = props.exercises[props.step];

  if (question.componentId === 'web-case-1') {
    return <AttackSurfaceDiscovery {...props} />;
  }

  if (question.componentId === 'web-case-2') {
    return <AuthorizationTesting {...props} />;
  }

  let SandboxComponent = null;
  if (question.componentId === 'web-case-3') SandboxComponent = <XssSandbox />;
  else if (question.componentId === 'web-case-4') SandboxComponent = <CsrfSandbox />;
  else if (question.componentId === 'web-case-5') SandboxComponent = <AuthFlawsSandbox />;
  else if (question.componentId === 'web-case-6') SandboxComponent = <RceSandbox />;
  else if (question.componentId === 'web-case-7') SandboxComponent = <SsrfSandbox />;
  else if (question.componentId === 'web-case-8') SandboxComponent = <LfiSandbox />;
  else if (question.componentId === 'web-case-9') SandboxComponent = <XxeSandbox />;
  else if (question.componentId === 'web-case-10') SandboxComponent = <DnsSandbox />;
  else if (question.componentId === 'web-case-11') SandboxComponent = <WhoisSandbox />;

  if (SandboxComponent) {
    const theoryData = question.theory || (question.theory_explanation ? {
      title: question.title || "Theory Concept",
      content: question.theory_explanation,
      analogy: question.real_world_analogy
    } : null);

    const theoryContent = theoryData ? (
      <div className="h-full flex flex-col">
        <div className="flex justify-end items-center mb-2">
          <SaveTheoryButton theory={theoryData} />
        </div>
        <div className="flex-1">
          <DevLushTheoryBridge item={{ labId: 'web-bugbounty-foundations-1', exerciseTitle: question.title, theory: theoryData }} />
        </div>
      </div>
    ) : null;

    return (
      <DevLushLayout
        title={question.title}
        prompt={question.prompt}
        exerciseContent={SandboxComponent}
        theoryContent={theoryContent}
        infoVisible={props.infoVisible && !!theoryData}
        infoPlacement={props.infoPlacement}
        settings={props.settings}
      />
    );
  }

  return (
    <div className="p-8 text-center text-slate-500">
      Component not found for {question.componentId}
    </div>
  );
};

export default WebBugBountyFoundations1Activity;

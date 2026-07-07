import React, { useState } from 'react';
import { Joyride, EventData, STATUS, Step } from 'react-joyride';

interface SastTutorialTourProps {
  run: boolean;
  onFinish: () => void;
}

export default function SastTutorialTour({ run, onFinish }: SastTutorialTourProps) {
  const [steps] = useState<Step[]>([
    {
      target: '.sast-dashboard-header',
      content: 'Welcome to the SAST Agent Workspace. This agent shifts security left by reviewing code before it reaches production.',
      placement: 'bottom',
      disableBeacon: true,
    } as any,
    {
      target: '#tutorial-pr-scan',
      content: 'Here you can see the results of Automated Code Review. The agent scans pull requests for vulnerabilities, like SQL Injection, and provides remediation advice.',
      placement: 'right',
    },
    {
      target: '#tutorial-tools',
      content: 'The agent relies on multiple tools: Automated Code Review, Secret Scanning, and Dependency Analysis to secure your codebase.',
      placement: 'left',
    },
    {
      target: '.tutorial-recap-button',
      content: 'If you ever need a quick refresher on how this workspace operates, click here to replay this tutorial.',
      placement: 'bottom',
    }
  ]);

  const handleJoyrideEvent = (data: EventData) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status as any)) {
      onFinish();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous={true}
      scrollToFirstStep={true}
      options={{
        showProgress: true,
      }}
      onEvent={handleJoyrideEvent}
      styles={{
        tooltip: {
          backgroundColor: '#ffffff',
          color: '#334155',
        },
        buttonPrimary: {
          backgroundColor: '#10b981',
        },
      }}
    />
  );
}

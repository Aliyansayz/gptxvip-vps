import React, { useState, useEffect } from 'react';
import { Joyride, EventData, STATUS, Step } from 'react-joyride';
import stepsData from './tutorialSteps.json';

interface ScannerTutorialTourProps {
  run: boolean;
  onFinish: () => void;
}

export default function ScannerTutorialTour({ run, onFinish }: ScannerTutorialTourProps) {
  const [steps, setSteps] = useState<Step[]>([]);

  useEffect(() => {
    // We can enhance the JSON data with Joyride's types if needed, 
    // but straight casting is usually fine for this simple structure.
    setSteps(stepsData as Step[]);
  }, []);

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
      options={{
        showProgress: true,
        buttons: ['back', 'primary', 'skip']
      }}
      onEvent={handleJoyrideEvent}
      styles={{
        tooltip: {
          backgroundColor: '#ffffff',
          color: '#334155',
        },
        tooltipContainer: {
          textAlign: 'left'
        },
        buttonPrimary: {
          backgroundColor: '#4f46e5',
          fontSize: '14px',
          borderRadius: '6px',
        },
        buttonBack: {
          color: '#64748b',
          fontSize: '14px',
        },
        buttonSkip: {
          color: '#64748b',
          fontSize: '14px',
        },
        overlay: {
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
        }
      }}
    />
  );
}

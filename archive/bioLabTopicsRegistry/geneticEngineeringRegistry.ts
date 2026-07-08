import React from 'react';
import GeneticEngineering from '../bioLabTopics/genetic-engineering/GeneticEngineering';
import PCRWalkthroughActivity from '../bioLabTopics/genetic-engineering/PCRWalkthroughActivity';

export const geneticEngineeringRegistry: Record<string, React.ComponentType<any>> = {
  'genetic-engineering': GeneticEngineering,
  'pcr-walkthrough': PCRWalkthroughActivity,
};

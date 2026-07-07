import React from 'react';
import { ReinforcementLearningOverviewActivity } from '../devLushTopics/reinforcement-learning/ReinforcementLearningOverviewActivity';
import { InvertedPendulum } from '../devLushTopics/reinforcement-learning/InvertedPendulum';
import { ProjectileLearner } from '../devLushTopics/reinforcement-learning/ProjectileLearner';

export const reinforcementLearningRegistry: Record<string, React.ComponentType<any>> = {
  mp_rl_overview: ReinforcementLearningOverviewActivity,
  mp_rl_pendulum: InvertedPendulum,
  mp_rl_projectile: ProjectileLearner,
};

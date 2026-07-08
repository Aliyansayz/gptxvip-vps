import React from 'react';
import OrchestratorActivity from '../devLushTopics/agentTypes/OrchestratorActivity';
import HandoffsActivity from '../devLushTopics/agentTypes/HandoffsActivity';
import SpecialistTeamsActivity from '../devLushTopics/agentTypes/SpecialistTeamsActivity';
import AsyncOrchestrationActivity from '../devLushTopics/agentTypes/AsyncOrchestrationActivity';
import CoordinationLayerActivity from '../devLushTopics/agentTypes/CoordinationLayerActivity';
import AgentReactPatternActivity from '../devLushTopics/agentTypes/AgentReactPatternActivity';
import AgentMemoryArchitecturesActivity from '../devLushTopics/agentTypes/AgentMemoryArchitecturesActivity';
import AgentHumanInTheLoopActivity from '../devLushTopics/agentTypes/AgentHumanInTheLoopActivity';
import AgentSequentialChainingActivity from '../devLushTopics/agentTypes/AgentSequentialChainingActivity';
import AgentParallelFanoutActivity from '../devLushTopics/agentTypes/AgentParallelFanoutActivity';
import AgentEvaluatorOptimizerActivity from '../devLushTopics/agentTypes/AgentEvaluatorOptimizerActivity';
import AgentOverviewActivity from '../devLushTopics/agentTypes/AgentOverviewActivity';
import AgentInnateLayerActivity from '../devLushTopics/agentTypes/AgentInnateLayerActivity';
import AgentWorkingStateActivity from '../devLushTopics/agentTypes/AgentWorkingStateActivity';
import AgentArchivalStorageActivity from '../devLushTopics/agentTypes/AgentArchivalStorageActivity';
import AgentExecutionLayerActivity from '../devLushTopics/agentTypes/AgentExecutionLayerActivity';
import AgentTypesMorphologyActivity from '../devLushTopics/agentTypes/AgentTypesMorphologyActivity';

export const agentTypesRegistry: Record<string, React.ComponentType<any>> = {
  'agent-overview-activity': AgentOverviewActivity,
  'agent-types-orchestrator': OrchestratorActivity,
  'agent-types-handoffs': HandoffsActivity,
  'agent-types-specialist-teams': SpecialistTeamsActivity,
  'agent-types-async-orchestration': AsyncOrchestrationActivity,
  'agent-types-coordination-layer': CoordinationLayerActivity,
  'agent-react-pattern': AgentReactPatternActivity,
  'agent-memory-architectures': AgentMemoryArchitecturesActivity,
  'agent-human-in-the-loop': AgentHumanInTheLoopActivity,
  'agent-sequential-chaining': AgentSequentialChainingActivity,
  'agent-parallel-fanout': AgentParallelFanoutActivity,
  'agent-evaluator-optimizer': AgentEvaluatorOptimizerActivity,
  'agent-innate-layer': AgentInnateLayerActivity,
  'agent-working-state': AgentWorkingStateActivity,
  'agent-archival-storage': AgentArchivalStorageActivity,
  'agent-execution-layer': AgentExecutionLayerActivity,
  'agent-types-morphology': AgentTypesMorphologyActivity
};

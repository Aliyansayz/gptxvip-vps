import React from 'react';
import VoiceAgentOverviewActivity from '../devLushTopics/voiceAgents/VoiceAgentOverviewActivity';
import VoiceAgentTypescriptActivity from '../devLushTopics/voiceAgents/VoiceAgentTypescriptActivity';
import VoiceAgentPythonActivity from '../devLushTopics/voiceAgents/VoiceAgentPythonActivity';

export const voiceAgentsRegistry: Record<string, React.ComponentType<any>> = {
  'voice-agent-overview': VoiceAgentOverviewActivity,
  'voice-agent-typescript': VoiceAgentTypescriptActivity,
  'voice-agent-python': VoiceAgentPythonActivity
};


import React from 'react';
import { NeuronSignaling } from '../bioLabTopics/neuroscience/NeuronSignaling';
import { SynapticTransmission } from '../bioLabTopics/neuroscience/SynapticTransmission';
import { SensorySystems } from '../bioLabTopics/neuroscience/SensorySystems';
import { MotorSystems } from '../bioLabTopics/neuroscience/MotorSystems';
import { Neuroplasticity } from '../bioLabTopics/neuroscience/Neuroplasticity';

export const neuroscienceRegistry: Record<string, React.ComponentType<any>> = {
  'neuron-signaling': NeuronSignaling,
  'neuro-synapse': SynapticTransmission,
  'neuro-sensory': SensorySystems,
  'neuro-motor': MotorSystems,
  'neuro-plasticity': Neuroplasticity,
};

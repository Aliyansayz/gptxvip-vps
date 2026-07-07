import React from 'react';
import { AnimalCellExplorer, PlantVsAnimalCell } from './bioLabTopics/cellular-biology/CellOrganelles';
import { OsmosisVisual, ActiveTransportVisual, FacilitatedDiffusionVisual } from './bioLabTopics/cellular-biology/CellularProcesses';
import { GlycolysisUI, KrebsCycleUI, ETCSimulationUI } from './bioLabTopics/cellular-biology/CellularRespiration';
import { DnaReplicationVisual, TranscriptionVisual, TranslationVisual } from './bioLabTopics/genetics/DnaToProtein';
import { DNAReplication } from './bioLabTopics/genetics/DNAReplication';
import { MendelianGenetics } from './bioLabTopics/genetics/MendelianGenetics';
import { EcosystemBalanceVisual } from './bioLabTopics/ecology/Ecology';

// A mapping from exercise componentId to the actual React component.
export const componentRegistry: Record<string, React.FC<any>> = {
    // Cellular Biology
    'osmosis_demo': OsmosisVisual,
    'active_transport_q': ActiveTransportVisual,
    'facilitated_diffusion_q': FacilitatedDiffusionVisual,
    'animal_cell_explorer': AnimalCellExplorer,
    'organelle_matching_game': AnimalCellExplorer, // Re-using as per comment
    'plant_vs_animal_cell': PlantVsAnimalCell,
    'glycolysis_drag_drop': GlycolysisUI,
    'krebs_cycle_visualizer': KrebsCycleUI,
    'etc_simulation': ETCSimulationUI,

    // Genetics
    'dna_replication_exercise': DnaReplicationVisual,
    'transcription_exercise': TranscriptionVisual,
    'translation_exercise': TranslationVisual,
    'dna_replication_build_activity': DNAReplication,
    'punnett_square_exercise': MendelianGenetics,

    // Ecology
    'ecosystem_simulation_exercise': EcosystemBalanceVisual,
    'energy_pyramid_exercise': EcosystemBalanceVisual,
};

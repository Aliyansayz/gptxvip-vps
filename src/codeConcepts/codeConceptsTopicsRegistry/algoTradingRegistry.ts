import React from "react";
import {
  AdaptiveTrendSignalExplorer,
  DirectionalStrengthExplorer,
  KMeansClusteringExplorer,
  PivotConfirmationExplorer,
  RangeAtrExplorer,
} from "../codeConceptsTopics/algo_trading/visuals";

export const algoTradingRegistry: Record<string, React.FC<any>> = {
  algo_range_atr_lab: RangeAtrExplorer,
  algo_adx_strength_lab: DirectionalStrengthExplorer,
  algo_pivot_confirmation_lab: PivotConfirmationExplorer,
  algo_kmeans_clustering_lab: KMeansClusteringExplorer,
  algo_adaptive_signal_lab: AdaptiveTrendSignalExplorer,
};

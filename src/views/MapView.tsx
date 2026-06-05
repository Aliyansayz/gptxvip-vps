import React from "react";
import { motion } from "motion/react";
import { DocumentationMap } from "../components/documentationTopics/DocumentationMap";
import { ProjectJourneyView } from "./ProjectJourneyView";

interface MapViewProps {
  activeSubTab: string;
}

export const MapView: React.FC<MapViewProps> = ({ activeSubTab }) => {
  return (
    <motion.div
      key={activeSubTab}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full ${activeSubTab === "project-journey" ? "h-full" : ""}`}
    >
      {activeSubTab === "doc-map" && (
        <div id="doc-map">
          <DocumentationMap />
        </div>
      )}
      {activeSubTab === "project-journey" && (
        <div id="project-journey" className="h-full">
          <ProjectJourneyView />
        </div>
      )}
    </motion.div>
  );
};

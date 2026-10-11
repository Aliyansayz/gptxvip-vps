import React from 'react';
import { motion } from 'motion/react';
import { DocumentationMap } from '../finhub/documentationTopics/DocumentationMap';

export const DocumentationMapView: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full h-full"
    >
      <DocumentationMap />
    </motion.div>
  );
};

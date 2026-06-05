import React from "react";
import { motion } from "motion/react";
import { CointegrationPage } from "../components/documentationTopics/CointegrationPage";

export const CointegrationView: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full"
    >
      <CointegrationPage />
    </motion.div>
  );
};

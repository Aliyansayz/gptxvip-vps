import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  Server,
  Loader2,
} from "lucide-react";
import { useTheoryCollections } from "../../../agentDevRootComponents/TheoryCollectionContext";
import {
  fetchDevLushLabsData,
  extractTheoriesFromDevLush,
} from "./importAutoTopics";
import { toast } from "sonner";

interface AutoImportModalProps {
  onClose: () => void;
}

const DevLushAutoImportModal: React.FC<AutoImportModalProps> = ({ onClose }) => {
  const { collections, addTheoryToCollection } = useTheoryCollections();
  const [targetCollectionId, setTargetCollectionId] = useState<string>("default");
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    if (!collections["default"] && Object.keys(collections).length > 0) {
      setTargetCollectionId(Object.keys(collections)[0]);
    }
  }, [collections]);

  const handleImport = async () => {
    setIsImporting(true);
    try {
      const results = await fetchDevLushLabsData();
      const theories = extractTheoriesFromDevLush(results);
      
      let importedCount = 0;
      theories.forEach((theory) => {
        addTheoryToCollection(targetCollectionId, theory);
        importedCount++;
      });

      toast.success(`Successfully imported ${importedCount} DevLush theories!`);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to import DevLush theories");
    } finally {
      setIsImporting(false);
    }
  };

  const collectionOptions = Object.values(collections);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-card w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-border flex flex-col max-h-[85vh]"
      >
        <div className="flex items-center justify-between p-5 border-b border-border bg-muted/30">
          <h2 className="text-xl font-heading font-semibold flex items-center gap-2">
            <Download className="w-5 h-5 text-indigo-500" />
            Auto-Import DevLush Theories
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto custom-scrollbar flex-1 flex flex-col gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Target Collection
            </label>
            <div className="relative">
              <select
                value={targetCollectionId}
                onChange={(e) => setTargetCollectionId(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow appearance-none cursor-pointer"
              >
                {collectionOptions.map((col) => (
                  <option key={col.id} value={col.id} className="bg-white dark:bg-slate-900 text-foreground">
                    {col.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Source Material
            </label>
            <div className="grid grid-cols-1 gap-3">
              <div className="p-4 rounded-xl border flex flex-col items-center justify-center gap-2 bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400">
                <Server className="w-6 h-6" />
                <span className="font-semibold">DevLush Agents Data</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-border bg-muted/20 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={isImporting}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isImporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isImporting ? "Importing..." : "Import Theories"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DevLushAutoImportModal;

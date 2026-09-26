import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  X,
  Download,
  CheckSquare,
  Square,
  Loader2,
} from "lucide-react";
import { useTheoryCollections } from "../TheoryCollectionContext";
import {
  devLushFiles,
  fetchLabsData,
  extractTheoriesFromLabs,
} from "./importAutoTopics";
import { toast } from "sonner";

interface AutoImportModalProps {
  onClose: () => void;
}

const AutoImportModal: React.FC<AutoImportModalProps> = ({ onClose }) => {
  const { collections, addTheoryToCollection } = useTheoryCollections();
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const [targetCollectionId, setTargetCollectionId] =
    useState<string>("default");

  const [selectedDevLushChapters, setSelectedDevLushChapters] = useState<string[]>([
    ...devLushFiles,
  ]);
  const [isImporting, setIsImporting] = useState(false);

  // Set first valid collection if default doesn't exist
  useEffect(() => {
    if (!collections["default"] && Object.keys(collections).length > 0) {
      setTargetCollectionId(Object.keys(collections)[0]);
    }
  }, [collections]);

  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const firstAction = dialogRef.current?.querySelector<HTMLElement>(
      'button:not([disabled]), select:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
    );
    firstAction?.focus();

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      if (opener?.isConnected) opener.focus();
    };
  }, []);

  const handleToggleChapter = (chapter: string) => {
    setSelectedDevLushChapters((prev) =>
      prev.includes(chapter)
        ? prev.filter((c) => c !== chapter)
        : [...prev, chapter],
    );
  };

  const handleToggleAll = () => {
    if (selectedDevLushChapters.length === devLushFiles.length) {
      setSelectedDevLushChapters([]);
    } else {
      setSelectedDevLushChapters([...devLushFiles]);
    }
  };

  const currentFiles = devLushFiles;
  const currentSelected = selectedDevLushChapters;
  const topicLabel = (topic: string) => topic
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const handleImport = async () => {
    if (currentSelected.length === 0) {
      toast.error("Please select at least one topic.");
      return;
    }
    if (!collections[targetCollectionId]) {
      toast.error("Choose an available collection before importing.");
      return;
    }

    setIsImporting(true);
    try {
      const results = await fetchLabsData(currentSelected);
      const collectedTheories = results.flatMap((result) => extractTheoriesFromLabs(result.labs));
      const uniqueTheories = new Map(
        collectedTheories.map((theory) => [`${theory.labId}\u0000${theory.exerciseTitle}`, theory]),
      );

      if (uniqueTheories.size === 0) {
        toast.info("The selected topics do not contain importable theories.");
        return;
      }

      const existingTheories = new Set(
        collections[targetCollectionId].items.map((theory) => `${theory.labId}\u0000${theory.exerciseTitle}`),
      );
      const newTheories = [...uniqueTheories.entries()]
        .filter(([key]) => !existingTheories.has(key))
        .map(([, theory]) => theory);

      if (newTheories.length === 0) {
        toast.info("All selected theories are already in this collection.");
        onClose();
        return;
      }

      newTheories.forEach((theory) => {
        addTheoryToCollection(targetCollectionId, theory);
      });

      toast.success(`Imported ${newTheories.length} new theories.`);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to import theories");
    } finally {
      setIsImporting(false);
    }
  };

  const collectionOptions = Object.values(collections);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auto-import-title"
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const focusable = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>(
              'button:not([disabled]), select:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
            ),
          );
          if (focusable.length === 0) {
            event.preventDefault();
            return;
          }
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-card w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-border flex flex-col max-h-[85vh]"
      >
        <div className="flex items-center justify-between p-5 border-b border-border bg-muted/30">
          <h2 id="auto-import-title" className="text-xl font-heading font-semibold flex items-center gap-2">
            <Download className="w-5 h-5 text-cyan-500" />
            Auto-Import Theories
          </h2>
          <button
            type="button"
            aria-label="Close auto-import dialog"
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto custom-scrollbar flex-1 flex flex-col gap-6">
          <div className="space-y-2">
            <label htmlFor="theory-import-target-collection" className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Target Collection
            </label>
            <select
              id="theory-import-target-collection"
              value={targetCollectionId}
              onChange={(e) => setTargetCollectionId(e.target.value)}
              disabled={collectionOptions.length === 0}
              className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow appearance-none cursor-pointer"
            >
              {collectionOptions.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name}
                </option>
              ))}
            </select>
            {collectionOptions.length === 0 && (
              <p role="status" className="text-sm text-amber-600 dark:text-amber-400">
                No collections are available. Close this dialog and create a collection first.
              </p>
            )}
          </div>



          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span id="theory-import-topics-label" className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Topics to Import
              </span>
              <button
                type="button"
                aria-pressed={currentSelected.length === currentFiles.length}
                onClick={handleToggleAll}
                className="text-xs font-medium text-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center gap-1"
              >
                {currentSelected.length === currentFiles.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>

            <div role="group" aria-labelledby="theory-import-topics-label" className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto custom-scrollbar p-2 bg-muted/30 border border-border rounded-lg">
              {currentFiles.map((chapter) => {
                const isSelected = currentSelected.includes(chapter);
                return (
                  <button
                    key={chapter}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => handleToggleChapter(chapter)}
                    className={`flex items-center gap-3 p-2.5 rounded-md text-left transition-colors ${isSelected ? "bg-muted hover:bg-muted/80" : "hover:bg-muted/50"}`}
                  >
                    <div
                      className={`text-cyan-500 flex-shrink-0 ${isSelected ? "" : "opacity-40"}`}
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </div>
                    <span
                      className={`text-sm truncate ${isSelected ? "font-medium text-foreground" : "text-muted-foreground"}`}
                    >
                      {topicLabel(chapter)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-border bg-muted/20 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={isImporting || currentSelected.length === 0 || collectionOptions.length === 0}
            className="flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

export default AutoImportModal;

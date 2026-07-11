import React, { useState } from "react";
import { useTheoryCollections } from "../../../agentDevRootComponents/TheoryCollectionContext";
import {
  Folder,
  Plus,
  Trash2,
  Edit2,
  ChevronRight,
  Library,
  Download,
} from "lucide-react";
import DevLushTheoryPaneGrid from "./DevLushTheoryPaneGrid";
import DevLushAutoImportModal from "./DevLushAutoImportModal";
import { AnimatePresence } from "framer-motion";

const TopicTheoryHub: React.FC = () => {
  const { collections, createCollection, deleteCollection, renameCollection } =
    useTheoryCollections();
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(
    null,
  );
  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [showAutoImport, setShowAutoImport] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCollectionName.trim()) {
      createCollection(newCollectionName.trim());
      setNewCollectionName("");
      setIsCreating(false);
    }
  };

  const handleRename = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    if (editName.trim()) {
      renameCollection(id, editName.trim());
      setEditingId(null);
    }
  };

  if (activeCollectionId && collections[activeCollectionId]) {
    return (
      <DevLushTheoryPaneGrid
        collection={collections[activeCollectionId]}
        onBack={() => setActiveCollectionId(null)}
      />
    );
  }

  const collectionList = Object.values(collections).sort(
    (a, b) => b.createdAt - a.createdAt,
  );

  return (
    <div className="w-full h-full flex flex-col p-6 md:p-10 overflow-y-auto custom-scrollbar">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-heading tracking-wide text-foreground flex items-center gap-4">
            <Library className="w-10 h-10 text-indigo-500" />
            DevLush{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-500 bg-[size:200%_auto] animate-gradient">
              Theory
            </span>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Your personal library of saved theories and analogies from DevLush Sandboxes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAutoImport(true)}
            className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground border border-border rounded-lg shadow-sm transition-all font-medium"
          >
            <Download className="w-5 h-5 text-indigo-500" />
            Auto Import
          </button>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md transition-all font-medium"
          >
            <Plus className="w-5 h-5" />
            New Collection
          </button>
        </div>
      </div>

      {isCreating && (
        <form
          onSubmit={handleCreate}
          className="mb-8 p-4 bg-card border border-border rounded-xl flex items-center gap-4 shadow-sm"
        >
          <Folder className="w-6 h-6 text-indigo-500" />
          <input
            type="text"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            placeholder="Collection Name (e.g., Security Agents)"
            className="flex-1 bg-transparent border-none focus:ring-0 text-foreground text-lg outline-none"
            autoFocus
          />
          <button
            type="button"
            onClick={() => setIsCreating(false)}
            className="px-4 py-2 text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!newCollectionName.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
          >
            Create
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {collectionList.map((collection) => (
          <div
            key={collection.id}
            className="group bg-card border border-border rounded-2xl p-6 hover:border-indigo-500/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.15)] transition-all duration-300 flex flex-col cursor-pointer relative"
            onClick={() => {
              if (editingId !== collection.id) {
                setActiveCollectionId(collection.id);
              }
            }}
          >
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingId(collection.id);
                  setEditName(collection.name);
                }}
                className="p-1.5 text-muted-foreground hover:text-indigo-400 bg-background/80 rounded-md backdrop-blur-sm"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              {collection.id !== "default" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCollection(collection.id);
                  }}
                  className="p-1.5 text-muted-foreground hover:text-destructive bg-background/80 rounded-md backdrop-blur-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 text-indigo-500">
              <Folder className="w-6 h-6" />
            </div>

            {editingId === collection.id ? (
              <form
                onSubmit={(e) => handleRename(collection.id, e)}
                onClick={(e) => e.stopPropagation()}
                className="mt-auto"
              >
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-background border border-border rounded px-2 py-1 text-foreground mb-2"
                  autoFocus
                  onBlur={(e) => handleRename(collection.id, e)}
                />
              </form>
            ) : (
              <h3 className="text-xl font-semibold text-foreground mb-1 group-hover:text-indigo-400 transition-colors line-clamp-2">
                {collection.name}
              </h3>
            )}

            <p className="text-sm text-muted-foreground mt-auto flex items-center justify-between">
              <span>{collection.items.length} saved theories</span>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all" />
            </p>
          </div>
        ))}
      </div>

      {collectionList.length === 0 && !isCreating && (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
          <Library className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-2xl font-semibold text-foreground mb-2">
            No Collections Yet
          </h3>
          <p className="text-muted-foreground max-w-md">
            Create a collection to start saving your favorite theories and
            agentic applications from DevLush.
          </p>
        </div>
      )}

      <AnimatePresence>
        {showAutoImport && (
          <DevLushAutoImportModal onClose={() => setShowAutoImport(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TopicTheoryHub;

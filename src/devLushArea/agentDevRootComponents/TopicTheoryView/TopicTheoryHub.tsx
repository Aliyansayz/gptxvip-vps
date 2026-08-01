import React, { useState } from "react";
import { useTheoryCollections } from "../TheoryCollectionContext";
import {
  Folder,
  Plus,
  Trash2,
  Edit2,
  ChevronRight,
  Library,
  Download,
} from "lucide-react";
import TheoryPaneGrid from "./TheoryPaneGrid";
import AutoImportModal from "./AutoImportModal";

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
      <TheoryPaneGrid
        collection={collections[activeCollectionId]}
        onBack={() => setActiveCollectionId(null)}
      />
    );
  }

  const collectionList = Object.values(collections).sort(
    (a, b) => b.createdAt - a.createdAt,
  );

  return (
    <div className="w-full h-full flex flex-col p-6 md:p-10 overflow-y-auto custom-scrollbar relative bg-slate-50 dark:bg-black">
      
      {/* Premium SVG Abstract Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-30 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen">
        <svg className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] animate-spin-slow" style={{ animationDuration: '120s' }} viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="theoryGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="currentColor" className="text-cyan-500" stopOpacity="0.1" />
              <stop offset="50%" stopColor="currentColor" className="text-sky-400" stopOpacity="0.05" />
              <stop offset="100%" stopColor="currentColor" className="text-indigo-500" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#theoryGrad)" />
          <g className="text-cyan-600 dark:text-cyan-400" opacity="0.15">
            <path d="M 0 500 Q 250 250, 500 500 T 1000 500" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M 0 600 Q 250 350, 500 600 T 1000 600" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="500" cy="500" r="200" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="10 10" />
            <circle cx="500" cy="500" r="300" fill="none" stroke="currentColor" strokeWidth="0.2" strokeDasharray="5 5" />
          </g>
        </svg>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 relative z-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-heading tracking-wide text-foreground flex items-center gap-4">
            <Library className="w-10 h-10 text-cyan-500" />
            Topic{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-sky-400 to-cyan-500 bg-[size:200%_auto] animate-gradient">
              Theory
            </span>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Your personal library of saved theories, analogies, and clinical
            applications.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAutoImport(true)}
            className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground border border-border rounded-lg shadow-sm transition-all font-medium"
          >
            <Download className="w-5 h-5 text-cyan-500" />
            Auto Import
          </button>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg shadow-md transition-all font-medium"
          >
            <Plus className="w-5 h-5" />
            New Collection
          </button>
        </div>
      </div>

      {isCreating && (
        <form
          onSubmit={handleCreate}
          className="mb-10 p-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-4 shadow-xl relative z-10"
        >
          <Folder className="w-6 h-6 text-cyan-500" />
          <input
            type="text"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            placeholder="Collection Name (e.g., Cardiology Favorites)"
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
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg disabled:opacity-50"
          >
            Create
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 relative z-10">
        {collectionList.map((collection) => (
          <div
            key={collection.id}
            className="group bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:border-cyan-500/50 hover:shadow-[0_8px_30px_rgb(6,182,212,0.15)] transition-all duration-500 flex flex-col cursor-pointer relative overflow-hidden"
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
                className="p-1.5 text-muted-foreground hover:text-cyan-400 bg-background/80 rounded-md backdrop-blur-sm"
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

            {/* Decorative Card Glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-sky-400 rounded-3xl opacity-0 group-hover:opacity-5 blur-xl transition-opacity duration-500 pointer-events-none" />

            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/10 to-sky-400/10 dark:from-cyan-500/20 dark:to-sky-400/20 rounded-2xl flex items-center justify-center mb-5 text-cyan-500 border border-cyan-500/20 group-hover:scale-110 transition-transform duration-500">
              <Folder className="w-7 h-7" />
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
              <h3 className="text-xl font-semibold text-foreground mb-1 group-hover:text-cyan-400 transition-colors line-clamp-2">
                {collection.name}
              </h3>
            )}

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-auto flex items-center justify-between font-medium">
              <span>{collection.items.length} saved theories</span>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all" />
            </p>
          </div>
        ))}
      </div>

      {collectionList.length === 0 && !isCreating && (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-10 relative z-10">
          <Library className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-2xl font-semibold text-foreground mb-2">
            No Collections Yet
          </h3>
          <p className="text-muted-foreground max-w-md">
            Create a collection to start saving your favorite theories,
            analogies, and clinical applications from DevLush Agents.
          </p>
        </div>
      )}

      {showAutoImport && (
        <AutoImportModal onClose={() => setShowAutoImport(false)} />
      )}
    </div>
  );
};

export default TopicTheoryHub;

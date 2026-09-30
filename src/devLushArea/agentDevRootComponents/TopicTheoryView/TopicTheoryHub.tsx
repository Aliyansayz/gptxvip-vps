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
import { SavedTheory } from "../TheoryCollectionContext";
import { StatePanel } from "../../../shared/components/StatePanel";

const TopicTheoryHub: React.FC<{ onOpenSource?: (item: SavedTheory) => void }> = ({ onOpenSource }) => {
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
        onOpenSource={onOpenSource}
      />
    );
  }

  const collectionList = Object.values(collections).sort(
    (a, b) => b.createdAt - a.createdAt,
  );

  return (
    <div className="relative flex h-full w-full flex-col overflow-y-auto bg-slate-50 p-4 pb-20 custom-scrollbar dark:bg-black sm:p-6 md:p-10">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 relative z-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-300">Agent Labs · saved reference</p>
          <h1 className="mt-2 flex items-center gap-3 font-heading text-3xl tracking-wide text-foreground sm:text-4xl"><Library className="h-8 w-8 text-cyan-600" /> Topic Theory</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">These are your saved theory notes, organized by collection. Open a source lesson from a note when that lesson is still available.</p>
          <p className="mt-2 text-xs font-medium text-muted-foreground">{collectionList.length} collections · {collectionList.reduce((count, collection) => count + collection.items.length, 0)} saved notes</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAutoImport(true)}
            className="flex min-h-11 items-center gap-2 rounded-lg border border-border bg-muted px-4 font-medium text-foreground transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
          >
            <Download className="w-5 h-5 text-cyan-500" />
            Auto Import
          </button>
          <button
            onClick={() => setIsCreating(true)}
            className="flex min-h-11 items-center gap-2 rounded-lg bg-cyan-700 px-4 font-medium text-white transition-colors hover:bg-cyan-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
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

      <div className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {collectionList.map((collection) => (
          <div
            key={collection.id}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-cyan-500/50 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
              <button
                type="button"
                aria-label={`Rename ${collection.name}`}
                onClick={(e) => {
                  setEditingId(collection.id);
                  setEditName(collection.name);
                }}
                className="p-1.5 text-muted-foreground hover:text-cyan-400 bg-background/80 rounded-md backdrop-blur-sm"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              {collection.id !== "default" && (
                <button
                  type="button"
                  aria-label={`Delete ${collection.name}`}
                  onClick={(e) => {
                    deleteCollection(collection.id);
                  }}
                  className="p-1.5 text-muted-foreground hover:text-destructive bg-background/80 rounded-md backdrop-blur-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Decorative Card Glow */}
            <div className="sr-only">Saved collection</div>

            {editingId === collection.id ? (
              <>
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/10 to-sky-400/10 dark:from-cyan-500/20 dark:to-sky-400/20 rounded-2xl flex items-center justify-center mb-5 text-cyan-500 border border-cyan-500/20">
                  <Folder className="w-7 h-7" />
                </div>
                <form onSubmit={(e) => handleRename(collection.id, e)} className="mt-auto w-full">
                  <input
                    type="text"
                    aria-label={`Collection name for ${collection.name}`}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-background border border-border rounded px-2 py-1 text-foreground mb-2"
                    autoFocus
                    onBlur={(e) => handleRename(collection.id, e)}
                  />
                </form>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-auto flex items-center justify-between font-medium">
                  <span>{collection.items.length} saved theories</span>
                </p>
              </>
            ) : (
              <button
                type="button"
                aria-label={`Open ${collection.name}, ${collection.items.length} saved theories`}
                onClick={() => setActiveCollectionId(collection.id)}
                className="flex min-h-full w-full flex-1 flex-col items-start text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-500 focus-visible:outline-offset-2 rounded-xl"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-600">
                  <Folder className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-1 group-hover:text-cyan-400 transition-colors line-clamp-2">
                  {collection.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-auto flex w-full items-center justify-between font-medium">
                  <span>{collection.items.length} saved theories</span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all" />
                </p>
              </button>
            )}
          </div>
        ))}
      </div>

      {collectionList.length === 0 && !isCreating && (
        <StatePanel title="No theory collections yet" description="Create a collection, then save a theory note from an available Agent Labs or Agentic Roles lesson." actionLabel="Create collection" onAction={() => setIsCreating(true)} />
      )}

      {showAutoImport && (
        <AutoImportModal onClose={() => setShowAutoImport(false)} />
      )}
    </div>
  );
};

export default TopicTheoryHub;

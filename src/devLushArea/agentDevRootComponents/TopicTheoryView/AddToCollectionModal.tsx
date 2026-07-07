import React, { useState } from 'react';
import { useTheoryCollections } from '../TheoryCollectionContext';
import { FolderPlus, X, CheckCircle2 } from 'lucide-react';
import { Theory } from '../../../types';

interface AddToCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  theoryData: {
    labId: string;
    chapterTitle: string;
    exerciseTitle: string;
    courseType: 'bio' | 'med';
    theory: Theory;
  };
}

const AddToCollectionModal: React.FC<AddToCollectionModalProps> = ({ isOpen, onClose, theoryData }) => {
  const { collections, createCollection, addTheoryToCollection } = useTheoryCollections();
  const [newCollectionName, setNewCollectionName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [savedTo, setSavedTo] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = (collectionId: string) => {
    addTheoryToCollection(collectionId, theoryData);
    setSavedTo(collectionId);
    setTimeout(() => {
      setSavedTo(null);
      onClose();
    }, 1500);
  };

  const handleCreateAndSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCollectionName.trim()) {
      const newId = createCollection(newCollectionName.trim());
      handleSave(newId);
      setNewCollectionName('');
      setIsCreating(false);
    }
  };

  const collectionList = Object.values(collections).sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-2xl font-heading tracking-wide text-foreground flex items-center gap-2">
            <FolderPlus className="w-6 h-6 text-cyan-500" />
            Save Theory
          </h2>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <p className="text-sm text-muted-foreground mb-4">
            Select a collection to save <strong>{theoryData.theory.title}</strong>
          </p>

          {isCreating ? (
            <form onSubmit={handleCreateAndSave} className="mb-6">
              <input
                type="text"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="New Collection Name..."
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground mb-3 focus:ring-2 focus:ring-cyan-500/50 outline-none"
                autoFocus
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setIsCreating(false)} className="flex-1 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors">Cancel</button>
                <button type="submit" disabled={!newCollectionName.trim()} className="flex-1 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors disabled:opacity-50">Create & Save</button>
              </div>
            </form>
          ) : (
            <button 
              onClick={() => setIsCreating(true)}
              className="w-full mb-6 py-3 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:text-cyan-500 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all flex items-center justify-center gap-2"
            >
              <FolderPlus className="w-5 h-5" />
              Create New Collection
            </button>
          )}

          <div className="space-y-2">
            {collectionList.map(collection => (
              <button
                key={collection.id}
                onClick={() => handleSave(collection.id)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${
                  savedTo === collection.id 
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-600 dark:text-emerald-400' 
                    : 'bg-background border-border hover:border-cyan-500/50 hover:bg-cyan-500/5 text-foreground'
                }`}
              >
                <span className="font-medium truncate pr-4">{collection.name}</span>
                {savedTo === collection.id ? (
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">{collection.items.length}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCollectionModal;

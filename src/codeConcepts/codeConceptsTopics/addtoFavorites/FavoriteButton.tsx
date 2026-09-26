import React, { useState, useRef, useEffect } from 'react';
import { Heart, Plus, FolderPlus, Check, X } from 'lucide-react';
import { useFavorites } from './FavoritesContext';
import { InteractiveQuestion } from '../../../types';

interface FavoriteButtonProps {
  concept: InteractiveQuestion;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ concept }) => {
  const { collections, addCollection, addToCollection, removeFromCollection, isFavorite } = useFavorites();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  const favorited = isFavorite(concept.componentId);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsCreating(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleCollection = (collectionId: string, isInCollection: boolean) => {
    if (isInCollection) {
      removeFromCollection(collectionId, concept.componentId);
    } else {
      addToCollection(collectionId, concept);
    }
  };

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCollectionName.trim()) {
      addCollection(newCollectionName.trim());
      setNewCollectionName('');
      setIsCreating(false);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`p-2 rounded-full transition-colors ${favorited ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/30' : 'text-zinc-400 hover:text-rose-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
        title="Save to Favorites"
      >
        <Heart className="w-5 h-5" fill={favorited ? 'currentColor' : 'none'} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-50 overflow-hidden text-sm">
          <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800">
            <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center justify-between">
              Save to Collection
              <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-zinc-600"><X className="w-4 h-4" /></button>
            </h4>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {collections.map(c => {
              const isInCollection = c.items.some(i => i.componentId === concept.componentId);
              return (
                <button
                  key={c.id}
                  onClick={() => handleToggleCollection(c.id, isInCollection)}
                  className="w-full text-left px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/50 transition-colors"
                >
                  <span className="truncate pr-2 text-zinc-700 dark:text-zinc-300">{c.name}</span>
                  {isInCollection && <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
          
          <div className="p-3 bg-zinc-50 dark:bg-zinc-950/30">
            {isCreating ? (
              <form onSubmit={handleCreateCollection} className="flex flex-col gap-2">
                <input
                  type="text"
                  autoFocus
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="Collection name..."
                  className="w-full px-3 py-1.5 text-sm rounded bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 py-1.5 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-700">Create</button>
                  <button type="button" onClick={() => setIsCreating(false)} className="flex-1 py-1.5 bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded text-xs font-semibold hover:bg-zinc-300 dark:hover:bg-zinc-600">Cancel</button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setIsCreating(true)}
                className="w-full flex items-center justify-center gap-2 py-2 text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded transition-colors"
              >
                <FolderPlus className="w-4 h-4" />
                New Collection
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

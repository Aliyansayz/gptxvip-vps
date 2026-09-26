import React, { createContext, useContext, useState, useEffect } from 'react';
import { InteractiveQuestion } from '../../../types';

export interface Collection {
  id: string;
  name: string;
  items: InteractiveQuestion[];
}

interface FavoritesContextType {
  collections: Collection[];
  addCollection: (name: string) => void;
  addToCollection: (collectionId: string, concept: InteractiveQuestion) => void;
  removeFromCollection: (collectionId: string, conceptId: string) => void;
  isFavorite: (conceptId: string) => boolean;
}

const defaultCollections: Collection[] = [
  { id: 'default', name: 'Saved Activities', items: [] }
];

const readSavedCollections = (): Collection[] => {
  try {
    const stored = window.localStorage.getItem('code_concepts_favorites');
    if (!stored) return defaultCollections;
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return defaultCollections;
    const valid = parsed.flatMap((collection): Collection[] => {
      if (!collection || typeof collection !== 'object') return [];
      const value = collection as Partial<Collection>;
      if (typeof value.id !== 'string' || typeof value.name !== 'string' || !Array.isArray(value.items)) return [];
      const items = value.items.filter((item): item is InteractiveQuestion =>
        !!item && typeof item === 'object' &&
        typeof (item as InteractiveQuestion).componentId === 'string' &&
        typeof (item as InteractiveQuestion).type === 'string');
      return [{ id: value.id, name: value.name, items }];
    });
    return valid.length ? valid : defaultCollections;
  } catch {
    return defaultCollections;
  }
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collections, setCollections] = useState<Collection[]>(readSavedCollections);

  useEffect(() => {
    try {
      window.localStorage.setItem('code_concepts_favorites', JSON.stringify(collections));
    } catch {
      // Saved items remain usable for this session when browser storage is unavailable.
    }
  }, [collections]);

  const addCollection = (name: string) => {
    setCollections(prev => [...prev, { id: Date.now().toString(), name, items: [] }]);
  };

  const addToCollection = (collectionId: string, concept: InteractiveQuestion) => {
    setCollections(prev => prev.map(c => {
      if (c.id === collectionId) {
        if (!c.items.find(i => i.componentId === concept.componentId)) {
          return { ...c, items: [...c.items, concept] };
        }
      }
      return c;
    }));
  };

  const removeFromCollection = (collectionId: string, conceptId: string) => {
    setCollections(prev => prev.map(c => {
      if (c.id === collectionId) {
        return { ...c, items: c.items.filter(i => i.componentId !== conceptId) };
      }
      return c;
    }));
  };

  const isFavorite = (conceptId: string) => {
    return collections.some(c => c.items.some(i => i.componentId === conceptId));
  };

  return (
    <FavoritesContext.Provider value={{ collections, addCollection, addToCollection, removeFromCollection, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used within a FavoritesProvider");
  return context;
};

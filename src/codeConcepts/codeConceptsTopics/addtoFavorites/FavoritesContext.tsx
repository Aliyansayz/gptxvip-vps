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

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collections, setCollections] = useState<Collection[]>(() => {
    try {
      const stored = localStorage.getItem('code_concepts_favorites');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error("Error reading favorites", e);
    }
    return defaultCollections;
  });

  useEffect(() => {
    localStorage.setItem('code_concepts_favorites', JSON.stringify(collections));
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

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theory } from './types';

export interface SavedTheory {
  id: string; // unique id for the saved item
  labId: string;
  chapterTitle: string;
  exerciseTitle: string;
  courseType: 'bio' | 'med' | 'devLush' | 'roadmap';
  theory: Theory;
  savedAt: number;
}

export interface TheoryCollection {
  id: string;
  name: string;
  items: SavedTheory[];
  createdAt: number;
}

interface TheoryCollectionContextType {
  collections: Record<string, TheoryCollection>;
  createCollection: (name: string) => string;
  deleteCollection: (id: string) => void;
  renameCollection: (id: string, newName: string) => void;
  addTheoryToCollection: (collectionId: string, theory: Omit<SavedTheory, 'id' | 'savedAt'>) => void;
  removeTheoryFromCollection: (collectionId: string, theoryId: string) => void;
}

const TheoryCollectionContext = createContext<TheoryCollectionContextType | undefined>(undefined);

export const TheoryCollectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [collections, setCollections] = useState<Record<string, TheoryCollection>>(() => {
    try {
      const saved = window.localStorage.getItem('theoryCollections');
      if (saved && saved.trim() !== '') {
        const parsed: unknown = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          const validEntries = Object.entries(parsed).flatMap(([id, value]): Array<[string, TheoryCollection]> => {
            if (!value || typeof value !== 'object') return [];
            const collection = value as Partial<TheoryCollection>;
            if (typeof collection.name !== 'string' || !Array.isArray(collection.items)) return [];
            const items = collection.items.filter((item) =>
              !!item && typeof item === 'object' &&
              typeof item.id === 'string' && typeof item.labId === 'string' &&
              typeof item.exerciseTitle === 'string');
            return [[id, { id, name: collection.name, items, createdAt: Number(collection.createdAt) || Date.now() }]];
          });
          if (validEntries.length) return Object.fromEntries(validEntries);
        }
      }
    } catch {
      // Use an empty in-memory collection when browser storage is disabled or malformed.
    }
    // Default collection
    return {
      'default': {
        id: 'default',
        name: 'My Favorites',
        items: [],
        createdAt: Date.now()
      }
    };
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('theoryCollections', JSON.stringify(collections));
    } catch {
      // Saved theories remain available for this session when browser storage is unavailable.
    }
  }, [collections]);

  const createCollection = (name: string) => {
    const id = `col_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setCollections(prev => ({
      ...prev,
      [id]: {
        id,
        name,
        items: [],
        createdAt: Date.now()
      }
    }));
    return id;
  };

  const deleteCollection = (id: string) => {
    setCollections(prev => {
      const newCols = { ...prev };
      delete newCols[id];
      return newCols;
    });
  };

  const renameCollection = (id: string, newName: string) => {
    setCollections(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        name: newName
      }
    }));
  };

  const addTheoryToCollection = (collectionId: string, theory: Omit<SavedTheory, 'id' | 'savedAt'>) => {
    const newTheory: SavedTheory = {
      ...theory,
      id: `th_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      savedAt: Date.now()
    };

    setCollections(prev => {
      const col = prev[collectionId];
      if (!col) return prev;
      
      // Check if already exists to prevent duplicates
      const exists = col.items.some(item => 
        item.labId === theory.labId && item.exerciseTitle === theory.exerciseTitle
      );
      if (exists) return prev;

      return {
        ...prev,
        [collectionId]: {
          ...col,
          items: [...col.items, newTheory]
        }
      };
    });
  };

  const removeTheoryFromCollection = (collectionId: string, theoryId: string) => {
    setCollections(prev => {
      const col = prev[collectionId];
      if (!col) return prev;
      return {
        ...prev,
        [collectionId]: {
          ...col,
          items: col.items.filter(item => item.id !== theoryId)
        }
      };
    });
  };

  return (
    <TheoryCollectionContext.Provider value={{
      collections,
      createCollection,
      deleteCollection,
      renameCollection,
      addTheoryToCollection,
      removeTheoryFromCollection
    }}>
      {children}
    </TheoryCollectionContext.Provider>
  );
};

export const useTheoryCollections = () => {
  const context = useContext(TheoryCollectionContext);
  if (context === undefined) {
    throw new Error('useTheoryCollections must be used within a TheoryCollectionProvider');
  }
  return context;
};

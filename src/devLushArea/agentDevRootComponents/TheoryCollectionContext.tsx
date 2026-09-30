import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theory } from './types';

export interface SavedTheory {
  id: string; // unique id for the saved item
  labId: string;
  chapterTitle: string;
  exerciseTitle: string;
  courseType: 'bio' | 'med' | 'devLush' | 'agenticRoles' | 'roadmap';
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
    let saved: string | null = null;
    try {
      saved = localStorage.getItem('theoryCollections');
    } catch {
      // Keep an in-memory collection if browser storage is disabled.
    }
    if (saved && saved.trim() !== '') {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse theory collections', e);
      }
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
      localStorage.setItem('theoryCollections', JSON.stringify(collections));
    } catch {
      // Collection editing remains available for this session.
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

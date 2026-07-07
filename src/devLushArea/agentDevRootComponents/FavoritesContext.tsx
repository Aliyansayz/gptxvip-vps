
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export type FavoriteItemType = 'lab' | 'medlab';

export interface FavoriteItem {
    id: string; // The componentId or labComponentId
    type: FavoriteItemType;
    title: string;
    courseId: string; // e.g., 'cardiology', 'genetics'
    collection: string;
    timestamp: number;
}

interface FavoritesContextType {
    favorites: FavoriteItem[];
    collections: string[];
    addFavorite: (item: Omit<FavoriteItem, 'timestamp' | 'collection'>, collection?: string) => void;
    removeFavorite: (id: string) => void;
    createCollection: (name: string) => void;
    deleteCollection: (name: string) => void;
    moveItem: (id: string, newCollection: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
    const [collections, setCollections] = useState<string[]>(['Favorites']); // Default collection

    // Load from localStorage on mount
    useEffect(() => {
        const storedFavs = localStorage.getItem('life_labs_favorites');
        const storedCols = localStorage.getItem('life_labs_collections');

        if (storedFavs && storedFavs.trim() !== '') {
            try {
                setFavorites(JSON.parse(storedFavs));
            } catch (e) {
                console.error('Failed to parse favorites', e);
            }
        }

        if (storedCols && storedCols.trim() !== '') {
            try {
                setCollections(JSON.parse(storedCols));
            } catch (e) {
                console.error('Failed to parse collections', e);
            }
        }
    }, []);

    // Save to localStorage whenever state changes
    useEffect(() => {
        localStorage.setItem('life_labs_favorites', JSON.stringify(favorites));
    }, [favorites]);

    useEffect(() => {
        localStorage.setItem('life_labs_collections', JSON.stringify(collections));
    }, [collections]);

    const addFavorite = (item: Omit<FavoriteItem, 'timestamp' | 'collection'>, collection: string = 'Favorites') => {
        setFavorites(prev => {
            if (prev.some(i => i.id === item.id)) {
                toast.info('Item already in favorites!');
                return prev;
            }
            const newItem: FavoriteItem = {
                ...item,
                timestamp: Date.now(),
                collection
            };
            toast.success(`Saved to ${collection}`);
            return [...prev, newItem];
        });
    };

    const removeFavorite = (id: string) => {
        setFavorites(prev => {
            const newItems = prev.filter(i => i.id !== id);
            if (newItems.length !== prev.length) {
                toast.info('Item removed from favorites');
            }
            return newItems;
        });
    };

    const createCollection = (name: string) => {
        const trimmedName = name.trim();
        if (!trimmedName) return;
        setCollections(prev => {
            if (prev.includes(trimmedName)) {
                toast.error('Collection already exists');
                return prev;
            }
            toast.success(`Collection "${trimmedName}" created`);
            return [...prev, trimmedName];
        });
    };

    const deleteCollection = (name: string) => {
        if (name === 'Favorites') {
            toast.error('Cannot delete default collection');
            return;
        }
        setCollections(prev => prev.filter(c => c !== name));
        setFavorites(prev => prev.map(item =>
            item.collection === name ? { ...item, collection: 'Favorites' } : item
        ));
        toast.info(`Collection "${name}" deleted. Items moved to Favorites.`);
    };

    const moveItem = (id: string, newCollection: string) => {
        setFavorites(prev => prev.map(item =>
            item.id === id ? { ...item, collection: newCollection } : item
        ));
        toast.success(`Moved to ${newCollection}`);
    };

    return (
        <FavoritesContext.Provider value={{
            favorites,
            collections,
            addFavorite,
            removeFavorite,
            createCollection,
            deleteCollection,
            moveItem
        }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};


import React, { useState } from 'react';
import { useFavorites, FavoriteItemType } from './FavoritesContext';
import { StarIcon, StarFilledIcon, FolderPlusIcon, CheckIcon } from './icons';

interface FavoriteButtonProps {
    id: string;
    type: FavoriteItemType;
    title: string;
    courseId: string;
    menuAlign?: 'left' | 'right';
    menuDirection?: 'up' | 'down';
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
    id,
    type,
    title,
    courseId,
    menuAlign = 'right',
    menuDirection = 'down'
}) => {
    const { favorites, collections, addFavorite, removeFavorite, createCollection } = useFavorites();
    const [isOpen, setIsOpen] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState('');
    const [showNewInput, setShowNewInput] = useState(false);

    const isFav = favorites.some(item => item.id === id);

    const handleSave = (collection: string) => {
        addFavorite({ id, type, title, courseId }, collection);
        setIsOpen(false);
    };

    const handleCreateAndSave = () => {
        if (newCollectionName.trim()) {
            createCollection(newCollectionName.trim());
            handleSave(newCollectionName.trim());
            setNewCollectionName('');
            setShowNewInput(false);
        }
    };

    if (isFav) {
        return (
            <button
                onClick={() => removeFavorite(id)}
                className="p-2 rounded-lg bg-yellow-100 text-yellow-600 border border-yellow-200 hover:bg-yellow-200 transition-colors"
                title="Remove from Favorites"
            >
                <StarFilledIcon className="w-5 h-5" />
            </button>
        );
    }

    const alignmentClass = menuAlign === 'left' ? 'left-0' : 'right-0';
    const directionClass = menuDirection === 'down' ? 'top-full mt-2' : 'bottom-full mb-2';

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg bg-muted text-muted-foreground border border-border hover:bg-muted/80 hover:text-foreground transition-colors"
                title="Add to Favorites"
            >
                <StarIcon className="w-5 h-5" />
            </button>

            {isOpen && (
                <div className={`absolute ${alignmentClass} ${directionClass} w-56 bg-card border border-border rounded-xl shadow-xl z-50 animate-fade-in overflow-hidden`}>
                    <div className="p-3 border-b border-border bg-muted/30">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Save to Collection</p>
                    </div>
                    <div className="max-h-48 overflow-y-auto py-1 custom-scrollbar">
                        {collections.map(col => (
                            <button
                                key={col}
                                onClick={() => handleSave(col)}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center justify-between group text-foreground"
                            >
                                <span>{col}</span>
                                <CheckIcon className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        ))}
                    </div>
                    <div className="p-2 border-t border-border bg-muted/10">
                        {showNewInput ? (
                            <div className="flex gap-1">
                                <input
                                    autoFocus
                                    type="text"
                                    className="flex-1 bg-background border border-border rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-primary text-foreground"
                                    placeholder="Collection name..."
                                    value={newCollectionName}
                                    onChange={(e) => setNewCollectionName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCreateAndSave()}
                                />
                                <button
                                    onClick={handleCreateAndSave}
                                    className="p-1 rounded bg-primary text-primary-foreground"
                                >
                                    <CheckIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowNewInput(true)}
                                className="w-full text-left px-2 py-1.5 text-xs text-primary hover:bg-primary/10 rounded flex items-center gap-2 transition-colors font-medium"
                            >
                                <FolderPlusIcon className="w-3.5 h-3.5" />
                                Create New Collection
                            </button>
                        )}
                    </div>
                    <div className="bg-muted p-1 flex justify-end">
                        <button onClick={() => setIsOpen(false)} className="text-[10px] text-muted-foreground hover:text-foreground px-2">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FavoriteButton;

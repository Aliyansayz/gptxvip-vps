
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
                type="button"
                onClick={() => removeFavorite(id)}
                aria-label={`Remove ${title} from favorites`}
                className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-yellow-200 bg-yellow-100 text-yellow-600 transition-colors hover:bg-yellow-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
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
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={`Save ${title} to favorites`}
                aria-expanded={isOpen}
                className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
                                type="button"
                                onClick={() => handleSave(col)}
                                className="group flex min-h-11 w-full items-center justify-between px-4 py-2 text-left text-sm text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
                                    aria-label="New favorites collection name"
                                    className="min-h-11 min-w-0 flex-1 rounded border border-border bg-background px-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary"
                                    placeholder="Collection name..."
                                    value={newCollectionName}
                                    onChange={(e) => setNewCollectionName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCreateAndSave()}
                                />
                                <button
                                    type="button"
                                    onClick={handleCreateAndSave}
                                    aria-label="Create collection and save lab"
                                    className="flex min-h-11 min-w-11 items-center justify-center rounded bg-primary text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                >
                                    <CheckIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setShowNewInput(true)}
                                className="flex min-h-11 w-full items-center gap-2 rounded px-2 text-left text-xs font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                                <FolderPlusIcon className="w-3.5 h-3.5" />
                                Create New Collection
                            </button>
                        )}
                    </div>
                    <div className="bg-muted p-1 flex justify-end">
                        <button type="button" onClick={() => setIsOpen(false)} className="min-h-11 rounded px-3 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FavoriteButton;

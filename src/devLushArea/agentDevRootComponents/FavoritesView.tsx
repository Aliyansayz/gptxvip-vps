
import React, { useState } from 'react';
import { useFavorites, FavoriteItem } from './FavoritesContext';
import { StarIcon, TrashIcon, FolderPlusIcon, PlayIcon, ChevronRightIcon, ClockIcon } from './icons';

interface FavoritesViewProps {
    onLaunch: (type: 'lab' | 'medlab', labId: string) => void;
}

const FavoritesView: React.FC<FavoritesViewProps> = ({ onLaunch }) => {
    const { favorites, collections, createCollection, deleteCollection, removeFavorite, moveItem } = useFavorites();
    const [activeCollection, setActiveCollection] = useState<string>('All');
    const [isCreating, setIsCreating] = useState(false);
    const [newColName, setNewColName] = useState('');

    const filteredItems = activeCollection === 'All'
        ? favorites
        : favorites.filter(item => item.collection === activeCollection);

    const handleCreate = () => {
        if (newColName.trim()) {
            createCollection(newColName.trim());
            setNewColName('');
            setIsCreating(false);
        }
    };

    const handleLaunch = (item: FavoriteItem) => {
        onLaunch(item.type, item.id);
    };

    return (
        <div className="flex-1 flex h-full overflow-hidden bg-background">
            {/* Sidebar for Collections */}
            <aside className="w-72 border-r border-border bg-card/30 flex flex-col">
                <div className="p-6 border-b border-border">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                        <StarIcon className="w-6 h-6 text-yellow-500" />
                        Favorites
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    <button
                        onClick={() => setActiveCollection('All')}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeCollection === 'All' ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-muted text-muted-foreground'}`}
                    >
                        <span className="font-semibold">All Items</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${activeCollection === 'All' ? 'bg-white/20' : 'bg-muted-foreground/10'}`}>
                            {favorites.length}
                        </span>
                    </button>

                    <div className="pt-4 pb-2 text-xs font-bold text-muted-foreground uppercase tracking-widest px-4">Collections</div>

                    {collections.map(col => (
                        <div key={col} className="group relative">
                            <button
                                onClick={() => setActiveCollection(col)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeCollection === col ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-muted text-muted-foreground'}`}
                            >
                                <span className="font-semibold truncate pr-6">{col}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${activeCollection === col ? 'bg-white/20' : 'bg-muted-foreground/10'}`}>
                                    {favorites.filter(i => i.collection === col).length}
                                </span>
                            </button>
                            {col !== 'Favorites' && activeCollection !== col && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); deleteCollection(col); }}
                                    className="absolute right-12 top-1/2 -translate-y-1/2 p-1.5 opacity-0 group-hover:opacity-100 hover:text-destructive transition-all"
                                    title="Delete collection"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-border">
                    {isCreating ? (
                        <div className="space-y-2 animate-fade-in-down">
                            <input
                                autoFocus
                                type="text"
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                                placeholder="Collection name..."
                                value={newColName}
                                onChange={(e) => setNewColName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                            />
                            <div className="flex gap-2">
                                <button onClick={handleCreate} className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg text-sm font-semibold hover:brightness-110 transition-all">Create</button>
                                <button onClick={() => setIsCreating(false)} className="px-3 py-2 rounded-lg text-sm border border-border hover:bg-muted text-muted-foreground">Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsCreating(true)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 hover:scale-[1.02] transition-all"
                        >
                            <FolderPlusIcon className="w-5 h-5" />
                            <span className="font-semibold">New Collection</span>
                        </button>
                    )}
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-10 bg-muted/20 custom-scrollbar">
                <div className="max-w-5xl mx-auto">
                    <header className="mb-10 flex items-end justify-between">
                        <div>
                            <h1 className="text-4xl font-black text-foreground tracking-tight flex items-center gap-3">
                                {activeCollection}
                                <span className="text-xl font-medium text-muted-foreground ml-2">/ {filteredItems.length} items</span>
                            </h1>
                            <p className="text-muted-foreground mt-2 text-lg">Your curated list of simulations and labs.</p>
                        </div>
                    </header>

                    {filteredItems.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredItems.map(item => (
                                <div key={item.id} className="group bg-card border border-border rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
                                    <div className="p-6 flex-1">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${item.type === 'medlab' ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'}`}>
                                                {item.type === 'medlab' ? 'MedCush' : 'BioLab'}
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                <ClockIcon className="w-3 h-3" />
                                                {new Date(item.timestamp).toLocaleDateString()}
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">{item.title}</h3>
                                        
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                                            <span className="capitalize font-medium">{item.courseId.replace(/-/g, ' ')}</span>
                                        </div>
                                    </div>

                                    <div className="px-6 py-4 bg-muted/30 border-t border-border flex items-center justify-between">
                                        <div className="flex gap-2">
                                            <select
                                                value={item.collection}
                                                onChange={(e) => moveItem(item.id, e.target.value)}
                                                className="bg-transparent text-xs border-none p-0 font-medium outline-none hover:text-primary text-muted-foreground cursor-pointer focus:ring-0 w-24 truncate"
                                            >
                                                {collections.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => removeFavorite(item.id)}
                                                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                                                title="Remove"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleLaunch(item)}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg font-bold text-xs hover:brightness-110 transition-all shadow-md active:scale-95"
                                            >
                                                <PlayIcon className="w-3 h-3" />
                                                Launch
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-32 bg-card rounded-3xl border-2 border-dashed border-border">
                            <div className="inline-block p-6 bg-muted rounded-full mb-6">
                                <StarIcon className="w-12 h-12 text-muted-foreground/30" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">No favorites yet</h2>
                            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                                Browse labs and click the star icon to save them here.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default FavoritesView;

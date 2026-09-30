
import React, { useState } from 'react';
import { useFavorites, FavoriteItem } from './FavoritesContext';
import { StarIcon, TrashIcon, FolderPlusIcon, PlayIcon, ChevronRightIcon, ClockIcon } from './icons';
import { AgentLabsMobileLearningNav } from './AgentLabsMobileLearningNav';
import devLushChaptersRaw from '../devLushComponents/data';
import { agenticRoleDefinitions } from '../agenticRoles/data';
import { cppTradingHFTData } from '../../roadmapArea/roadmapTopics/C++_Trading_HFT';
import { StatePanel } from '../../shared/components/StatePanel';

const isAvailableFavorite = (item: FavoriteItem): boolean => {
    if (item.type === 'devlush_lab') return devLushChaptersRaw.some(chapter => chapter.labComponentId === item.id);
    if (item.type === 'agentic_role_lab') return agenticRoleDefinitions.some(role => role.id === item.courseId && role.chapters.some(chapter => chapter.labComponentId === item.id));
    return cppTradingHFTData.chapters.some(chapter => (item.type === 'roadmap_reading' ? chapter.readingComponentId : chapter.labComponentId) === item.id);
};

interface FavoritesViewProps {
    onLaunch: (item: FavoriteItem) => void;
    onBrowseTopics?: () => void;
    onSearchTopics?: () => void;
}

const FavoritesView: React.FC<FavoritesViewProps> = ({ onLaunch, onBrowseTopics, onSearchTopics }) => {
    const { favorites, collections, createCollection, deleteCollection, removeFavorite, moveItem } = useFavorites();
    const [activeCollection, setActiveCollection] = useState<string>('All');
    const [isCreating, setIsCreating] = useState(false);
    const [newColName, setNewColName] = useState('');

    const filteredItems = activeCollection === 'All'
        ? favorites
        : favorites.filter(item => item.collection === activeCollection);
    const staleItems = filteredItems.filter(item => !isAvailableFavorite(item));

    const handleCreate = () => {
        if (newColName.trim()) {
            createCollection(newColName.trim());
            setNewColName('');
            setIsCreating(false);
        }
    };

    const handleDeleteCollection = (name: string) => {
        deleteCollection(name);
        if (activeCollection === name) setActiveCollection('All');
    };

    const handleLaunch = (item: FavoriteItem) => {
        onLaunch(item);
    };

    return (
        <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-background pb-[calc(4.25rem+env(safe-area-inset-bottom))] lg:flex-row lg:pb-0">
            {/* Sidebar for Collections */}
            <aside className="flex max-h-56 w-full shrink-0 flex-col border-b border-border bg-card/30 lg:max-h-none lg:w-72 lg:border-b-0 lg:border-r">
                <div className="p-6 border-b border-border">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                        <StarIcon className="w-6 h-6 text-yellow-500" />
                        Favorites
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    <button
                        type="button"
                        onClick={() => setActiveCollection('All')}
                        aria-pressed={activeCollection === 'All'}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${activeCollection === 'All' ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-muted text-muted-foreground'}`}
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
                                type="button"
                                onClick={() => setActiveCollection(col)}
                                aria-pressed={activeCollection === col}
                                className={`w-full flex items-center justify-between px-4 pr-14 py-3 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${activeCollection === col ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-muted text-muted-foreground'}`}
                            >
                                <span className="font-semibold truncate pr-6">{col}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${activeCollection === col ? 'bg-white/20' : 'bg-muted-foreground/10'}`}>
                                    {favorites.filter(i => i.collection === col).length}
                                </span>
                            </button>
                            {col !== 'Favorites' && (
                                <button
                                    type="button"
                                    onClick={() => handleDeleteCollection(col)}
                                    className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground opacity-100 transition-all hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
                                    aria-label={`Delete ${col} collection`}
                                    title={`Delete ${col} collection`}
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-border">
                    {isCreating ? (
                        <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }} className="space-y-2 animate-fade-in-down">
                            <input
                                autoFocus
                                type="text"
                                aria-label="Collection name"
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                                placeholder="Collection name..."
                                required
                                value={newColName}
                                onChange={(e) => setNewColName(e.target.value)}
                            />
                            <div className="flex gap-2">
                                <button type="submit" disabled={!newColName.trim()} className="min-h-11 flex-1 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:brightness-110 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">Create</button>
                                <button type="button" onClick={() => { setIsCreating(false); setNewColName(''); }} className="min-h-11 px-3 rounded-lg text-sm border border-border hover:bg-muted text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Cancel</button>
                            </div>
                        </form>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsCreating(true)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 hover:scale-[1.02] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                            <FolderPlusIcon className="w-5 h-5" />
                            <span className="font-semibold">New Collection</span>
                        </button>
                    )}
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="min-h-0 flex-1 overflow-y-auto bg-muted/20 p-4 custom-scrollbar sm:p-6 lg:p-10">
                <div className="max-w-5xl mx-auto">
                    <header className="mb-8 flex flex-col gap-2 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="flex items-center gap-3 text-2xl font-black tracking-tight text-foreground sm:text-4xl">
                                {activeCollection}
                                <span className="text-xl font-medium text-muted-foreground ml-2">/ {filteredItems.length} items</span>
                            </h1>
                            <p className="text-muted-foreground mt-2 text-lg">Your curated list of simulations and labs.</p>
                        </div>
                    </header>

                    {staleItems.length > 0 && <StatePanel eyebrow="Saved list maintenance" title={`${staleItems.length} saved item${staleItems.length === 1 ? '' : 's'} no longer open`} description="These entries point to lessons that are no longer in the current curriculum. Remove an unavailable entry below, or browse the current topics for a replacement." tone="warning" actionLabel="Browse current topics" onAction={onBrowseTopics} className="mb-6" />}
                    {filteredItems.length > 0 ? (
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            {filteredItems.map(item => (
                                <div key={item.id} className="group bg-card border border-border rounded-2xl shadow-sm transition-colors hover:border-primary/40 overflow-hidden flex flex-col">
                                    <div className="p-6 flex-1">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${item.type !== 'devlush_lab' ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'}`}>
                                                {item.type === 'roadmap_reading' ? 'Roadmap Reading' : item.type === 'roadmap_lab' ? 'Roadmap Lab' : item.type === 'agentic_role_lab' ? 'Agentic Role Lab' : 'Agent Lab'}
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                <ClockIcon className="w-3 h-3" />
                                                {new Date(item.timestamp).toLocaleDateString()}
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">{item.title}</h3>
                                        {!isAvailableFavorite(item) && <p className="mt-2 text-sm font-semibold text-amber-700 dark:text-amber-300">Unavailable in the current curriculum</p>}
                                        
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                                            <span className="capitalize font-medium">{item.courseId.replace(/-/g, ' ')}</span>
                                        </div>
                                    </div>

                                    <div className="px-6 py-4 bg-muted/30 border-t border-border flex items-center justify-between">
                                        <div className="flex gap-2">
                                            <select
                                                value={item.collection}
                                                onChange={(e) => moveItem(item.id, e.target.value)}
                                                aria-label={`Move ${item.title} to collection`}
                                                className="bg-transparent text-xs border-none p-0 font-medium outline-none hover:text-primary text-muted-foreground cursor-pointer focus-visible:ring-2 focus-visible:ring-primary w-24 truncate"
                                            >
                                                {collections.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => removeFavorite(item.id)}
                                                className="flex h-11 w-11 items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                                aria-label={`Remove ${item.title} from favorites`}
                                                title={`Remove ${item.title}`}
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleLaunch(item)}
                                                disabled={!isAvailableFavorite(item)}
                                                className="flex min-h-11 items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg font-bold text-xs hover:brightness-110 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <PlayIcon className="w-3 h-3" />
                                                {isAvailableFavorite(item) ? 'Open lesson' : 'Unavailable'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <StatePanel title={activeCollection === 'All' ? 'No saved lessons yet' : `No lessons in ${activeCollection}`} description="Browse an available topic and save a chapter to collect it here." actionLabel="Browse topics" onAction={onBrowseTopics} />
                    )}
                </div>
            </main>
            {onBrowseTopics && onSearchTopics && (
                <AgentLabsMobileLearningNav
                    activeTab="saved"
                    savedCount={favorites.length}
                    onLearn={onBrowseTopics}
                    onSearch={onSearchTopics}
                    onSaved={() => {}}
                />
            )}
        </div>
    );
};

export default FavoritesView;

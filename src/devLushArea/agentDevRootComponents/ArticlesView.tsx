
import React from 'react';
import { BookOpenText } from './icons';

const ArticleCard: React.FC<{ title: string; description: string; category: string; onBrowseTopics: () => void }> = ({ title, description, category, onBrowseTopics }) => (
    <div className="bg-gradient-to-br from-card via-card to-muted/30 border border-border rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
        <div className="relative z-10">
            <span className="text-xs font-bold tracking-wider text-primary uppercase">{category}</span>
            <h3 className="text-xl font-heading tracking-wider text-card-foreground mt-2">{title}</h3>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{description}</p>
            <button
                type="button"
                onClick={onBrowseTopics}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
                Browse Agent Labs topics
            </button>
        </div>
    </div>
);

export const ArticlesView: React.FC<{ onBrowseTopics: () => void }> = ({ onBrowseTopics }) => {
    return (
        <div className="h-full w-full overflow-y-auto custom-scrollbar p-6 md:p-12 bg-background">
            <div className="max-w-5xl mx-auto">
                <header className="text-center mb-16">
                    <div className="inline-block p-4 bg-card rounded-2xl shadow-sm border border-border/50 mb-6">
                        <BookOpenText className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-5xl font-heading tracking-wide text-foreground">Articles</h1>
                    <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
                        These are topic previews; full article pages are not published yet. Browse Agent Labs topics for available interactive learning.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ArticleCard
                        category="Cellular Biology"
                        title="The Endosymbiotic Theory: How Eukaryotes Evolved"
                        description="Explore the fascinating hypothesis that mitochondria and chloroplasts were once free-living prokaryotic organisms."
                        onBrowseTopics={onBrowseTopics}
                    />
                    <ArticleCard
                        category="Genetics"
                        title="CRISPR-Cas9: A Revolution in Gene Editing"
                        description="A deep dive into the technology that allows scientists to make precise changes to DNA, and its ethical implications."
                        onBrowseTopics={onBrowseTopics}
                    />
                    <ArticleCard
                        category="Ecology"
                        title="Keystone Species: The Unsung Heroes of Ecosystems"
                        description="Learn how certain species have a disproportionately large effect on their environment relative to their abundance."
                        onBrowseTopics={onBrowseTopics}
                    />
                    <ArticleCard
                        category="Genetics"
                        title="Epigenetics: Beyond the DNA Sequence"
                        description="Discover how your behaviors and environment can cause changes that affect the way your genes work."
                        onBrowseTopics={onBrowseTopics}
                    />
                </div>
            </div>
        </div>
    );
};

import { Link } from 'react-router';
import { BookOpenText, ArrowRight } from 'lucide-react';
import { agentLabTopics } from '../agentLabsData';

export const ArticlesView = ({ onBrowseTopics }: { onBrowseTopics: () => void }) => (
    <main className="h-full w-full overflow-y-auto bg-background px-4 py-8 sm:px-6 md:py-12">
        <div className="mx-auto max-w-5xl">
            <header className="mb-8 max-w-2xl">
                <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary"><BookOpenText className="h-4 w-4" /> Reference</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">Articles</h1>
                <p className="mt-3 leading-7 text-muted-foreground">Full article pages are not published in this section. These topic previews point to Agent Labs lessons that are available now.</p>
            </header>
            <div role="status" className="mb-8 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">Preview index · {agentLabTopics.length} topics · no full articles published here</div>
            <div className="grid gap-4 sm:grid-cols-2">
                {agentLabTopics.map((topic) => <article key={topic.slug} className="flex flex-col rounded-2xl border border-border bg-card p-5 sm:p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{topic.family} · topic preview</p>
                    <h2 className="mt-2 text-xl font-bold text-card-foreground">{topic.title}</h2>
                    <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">{topic.outcome}</p>
                    <Link to={`/lab/${topic.slug}`} className="mt-5 inline-flex min-h-11 items-center gap-2 self-start rounded-xl border border-primary/30 px-4 text-sm font-semibold text-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Open the interactive lesson <ArrowRight className="h-4 w-4" /></Link>
                </article>)}
            </div>
            <button type="button" onClick={onBrowseTopics} className="mt-8 inline-flex min-h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">Browse all Agent Labs topics</button>
        </div>
    </main>
);

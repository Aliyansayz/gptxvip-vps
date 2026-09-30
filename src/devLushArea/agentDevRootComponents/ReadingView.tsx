import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ArrowLeft, BookOpenText } from 'lucide-react';
import { readingContent } from '../../data/readingContent';
import { StatePanel } from '../../shared/components/StatePanel';

const topicKeys = Object.keys(readingContent);
const topicTitle = (key: string) => key.replace(/[-_]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

export const ReadingView = ({ onBrowseTopics }: { onBrowseTopics: () => void }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state && typeof location.state === 'object' ? location.state as Record<string, unknown> : {};
    const requestedKey = typeof state.devLushReadingTopic === 'string' ? state.devLushReadingTopic : null;
    const selectedKey = requestedKey && topicKeys.includes(requestedKey) ? requestedKey : null;
    const [readingProgress, setReadingProgress] = useState(0);
    const topicButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
    const lastSelectedKey = useRef<string | null>(selectedKey);

    useEffect(() => {
        setReadingProgress(0);
        if (!selectedKey && lastSelectedKey.current) {
            const key = lastSelectedKey.current;
            window.requestAnimationFrame(() => topicButtonRefs.current[key]?.focus());
        }
        lastSelectedKey.current = selectedKey;
    }, [location.key, selectedKey]);

    const openTopic = (key: string) => {
        navigate(`${location.pathname}${location.search}`, { state: { ...state, devLushView: 'reading', devLushReadingTopic: key } });
    };
    const returnToIndex = () => {
        if (window.history.state?.idx > 0) navigate(-1);
        else {
            const nextState = { ...state };
            delete nextState.devLushReadingTopic;
            navigate(`${location.pathname}${location.search}`, { replace: true, state: nextState });
        }
    };

    if (selectedKey) {
        const sections = Object.values(readingContent[selectedKey]);
        return (
            <div className="h-full overflow-y-auto bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white" onScroll={(event) => {
                const scroller = event.currentTarget;
                const distance = scroller.scrollHeight - scroller.clientHeight;
                setReadingProgress(distance > 0 ? Math.min(100, Math.round(scroller.scrollTop / distance * 100)) : 100);
            }}>
                <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/95">
                    <div className="mx-auto flex max-w-[46rem] items-center gap-4">
                        <button type="button" onClick={returnToIndex} aria-label="Back to Reading Library" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:border-slate-700 dark:text-slate-200"><ArrowLeft className="h-5 w-5" /></button>
                        <div className="min-w-0 flex-1"><p className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-300">Reading Library · {sections.length} sections</p><h1 className="truncate text-xl font-bold">{topicTitle(selectedKey)}</h1></div>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-300">{readingProgress}% read</span>
                    </div>
                    <div role="progressbar" aria-label="Reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={readingProgress} className="mx-auto mt-3 h-1 max-w-[46rem] overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"><div className="h-full bg-cyan-600 transition-[width] duration-150 motion-reduce:transition-none" style={{ width: `${readingProgress}%` }} /></div>
                </header>
                <main className="mx-auto max-w-[46rem] space-y-8 px-4 py-8 pb-24 sm:py-12">
                    {sections.map((section, index) => <section key={`${section.title}-${index}`} aria-labelledby={`reading-section-${index}`} className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-300">Section {index + 1} of {sections.length}</p><h2 id={`reading-section-${index}`} className="mt-2 scroll-mt-28 text-2xl font-bold tracking-tight">{section.title}</h2><p className="mt-4 whitespace-pre-line text-base leading-8 text-slate-700 dark:text-slate-300">{section.content}</p></section>)}
                    <button type="button" onClick={returnToIndex} className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:border-slate-700 dark:text-slate-200">Back to Reading Library</button>
                </main>
            </div>
        );
    }

    return (
        <main className="h-full overflow-y-auto bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 sm:py-12">
            <div className="mx-auto max-w-5xl">
                <header className="mb-8"><p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-300"><BookOpenText className="h-4 w-4" /> Reference</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">Reading Library</h1><p className="mt-2 max-w-2xl leading-7 text-slate-600 dark:text-slate-300">Published reading entries appear here. Agent Labs topics are available now for interactive learning.</p></header>
                {topicKeys.length === 0 ? <StatePanel title="No reading material is published yet" description="The Reading Library has no entries. Open an Agent Labs topic for an available interactive lesson." actionLabel="Browse Agent Labs topics" onAction={onBrowseTopics} /> : <div className="grid gap-4 sm:grid-cols-2">{topicKeys.map((key) => <button key={key} type="button" ref={(node) => { topicButtonRefs.current[key] = node; }} onClick={() => openTopic(key)} className="min-h-32 rounded-2xl border border-slate-200 bg-white p-5 text-left transition-[border-color,box-shadow] duration-200 hover:border-cyan-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:border-slate-800 dark:bg-slate-900"><p className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-300">{Object.keys(readingContent[key]).length} sections</p><h2 className="mt-2 text-xl font-bold text-slate-950 dark:text-white">{topicTitle(key)}</h2></button>)}</div>}
            </div>
        </main>
    );
};

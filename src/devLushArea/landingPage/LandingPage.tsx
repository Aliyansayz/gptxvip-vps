import React from 'react';
import { ArrowRight, Layers3, Play, Search } from 'lucide-react';
import { agentLabTopics } from '../agentLabsData';
import { getAgentLabTopicHref } from '../agentLabsData';
import AgentTopicPreview from '../components/AgentTopicPreview';
// Extension pinned to out-resolve the case-insensitive match on `agenticRoleUseCases.ts`.
import { AgenticRoleUseCases } from './AgenticRoleUseCases.tsx';

interface LandingPageProps {
    onOpenTopics?: () => void;
    onOpenTheory?: () => void;
    onOpenSearch?: () => void;
    onOpenRole?: (roleId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenTopics = () => undefined, onOpenTheory = () => undefined, onOpenSearch = () => undefined, onOpenRole = () => undefined }) => (
    <div className="h-full w-full overflow-y-auto bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-20">
            <div className="max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">Agent Labs</p>
                <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Learn the system by running the system.</h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400 sm:text-lg">Choose one focused topic, open its interactive lab, and inspect the assumptions behind each result. Theory and context stay close without competing with the experiment.</p>
                <div className="mt-8 flex flex-wrap gap-3">
                    <a href={getAgentLabTopicHref(agentLabTopics[0].slug)} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-zinc-950 transition-colors hover:bg-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2"><Play className="h-4 w-4 fill-current" /> Start the first lesson</a>
                    <button onClick={onOpenTopics} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-700">Explore topics</button>
                    <button onClick={onOpenTheory} className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-700"><Layers3 className="h-4 w-4" /> Browse theory</button>
                    <button onClick={onOpenSearch} className="inline-flex items-center gap-2 rounded-xl border border-transparent px-4 py-3 text-sm font-semibold text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"><Search className="h-4 w-4" /> Search labs</button>
                </div>
                <div className="mt-8 flex max-w-2xl flex-col gap-3 rounded-2xl border border-cyan-500/30 bg-cyan-50/70 p-5 sm:flex-row sm:items-center sm:justify-between dark:bg-cyan-950/20">
                    <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-300">Recommended first lesson · interactive</p><p className="mt-1 font-semibold">{agentLabTopics[0].chapterTitle}</p><p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{agentLabTopics[0].outcome}</p></div>
                    <a href={getAgentLabTopicHref(agentLabTopics[0].slug)} className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-bold text-cyan-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:text-cyan-300">Open lesson <ArrowRight className="h-4 w-4" /></a>
                </div>
            </div>
        </section>

        <AgenticRoleUseCases onOpenRole={onOpenRole} />

        <section className="border-y border-zinc-200 bg-white/70 dark:border-zinc-800 dark:bg-zinc-900/40" aria-labelledby="topic-grid-heading">
            <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
                <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">Start with a real topic</p><h2 id="topic-grid-heading" className="mt-2 text-2xl font-bold tracking-tight">What do you want to understand?</h2></div><span className="text-sm text-zinc-500">{agentLabTopics.length} focused paths</span></div>
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {agentLabTopics.map((topic) => <AgentTopicPreview key={topic.slug} topic={topic} compact />)}
                </div>
            </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-4 px-5 py-12 sm:grid-cols-3 sm:px-8 sm:py-16">
            {[['01', 'Choose', 'Start from a topic, not a feature wall.'], ['02', 'Run', 'Interact with the model and observe the state.'], ['03', 'Inspect', 'Open theory, source context, and next steps.']].map(([number, title, body]) => <div key={number} className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"><span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">{number}</span><h3 className="mt-5 font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">{body}</p></div>)}
        </section>
    </div>
);

export default LandingPage;

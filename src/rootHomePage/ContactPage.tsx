import React, { useEffect } from 'react';
import { Clock, Mail, MessageSquare, Send } from 'lucide-react';
import { ContactForm } from '../shared/components/ContactForm';
import { Logo } from '../shared/components/Logo';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Reveal, RevealGroup, RevealItem } from '../shared/components/Reveal';

/** Single source for the owner address so no surface can hard-code a stale one. */
export const CONTACT_EMAIL = 'aliyan@gptx.vip';

const EXPECTATIONS = [
    { Icon: Clock, title: 'Reply within a day', body: 'Questions about a lesson or a bug in a tool are answered fastest, usually the same working day.' },
    { Icon: MessageSquare, title: 'Project adaptations', body: 'Describe the surface you want to reuse and the outcome you need. A short paragraph is enough to start.' },
    { Icon: Send, title: 'What to include', body: 'Share the page or tool you were on and what you expected to happen. That gets you a precise answer.' },
];

interface ContactPageProps {
    onNavigateFinhub?: () => void;
    onNavigateCodeConcepts?: () => void;
    onNavigateBlogs?: () => void;
    onNavigateAgentWorkspace?: () => void;
    onNavigateSoftware?: () => void;
    /** Keeps the navbar "Contact" action on this page without a reload. */
    onNavigateContact?: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigateFinhub, onNavigateCodeConcepts, onNavigateBlogs, onNavigateSoftware, onNavigateContact, onNavigateAgentWorkspace }) => {
    // The root shell owns the document title; each surface only asserts its own.
    useEffect(() => {
        const previousTitle = document.title;
        document.title = 'Contact — GPTX.VIP';
        return () => {
            document.title = previousTitle;
        };
    }, []);

    return (
        <div className="premium-surface flex min-h-screen flex-col bg-paper text-ink selection:bg-accent-200 selection:text-ink">
            <Navbar
                variant="glass"
                onNavigateFinhub={onNavigateFinhub || (() => window.location.assign('/finhub'))}
                onNavigateCodeConcepts={onNavigateCodeConcepts || (() => window.location.assign('/code_concepts/general'))}
                onNavigateAgentWorkspace={onNavigateAgentWorkspace}
                onNavigateAgents={() => window.location.assign('/agents')}
                onNavigateProjectSurfaces={() => window.location.assign('/agents/templates')}
                onNavigateBlogs={onNavigateBlogs || (() => window.location.assign('/blogs'))}
                onNavigateSoftware={onNavigateSoftware}
                onBookDemo={onNavigateContact || (() => window.location.assign('/contact'))}
            />

            <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-14 sm:px-8 sm:py-20">
                <header className="max-w-2xl">
                    <Reveal from="none" duration={0.5}>
                        <div className="glass-panel-light mb-6 inline-flex items-center gap-2 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600">
                            <span className="accent-fill-gradient h-1.5 w-1.5 rounded-full" />
                            Contact
                        </div>
                    </Reveal>
                    <Reveal duration={0.7} delay={0.06}>
                        <h1 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.04em] text-slate-950">
                            Tell me what you are <span className="accent-text-gradient-ink">building.</span>
                        </h1>
                    </Reveal>
                    <Reveal duration={0.65} delay={0.14}>
                        <p className="mt-6 text-[1.0625rem] leading-8 text-slate-600">
                            One form reaches the site owner directly. Ask about a lesson, report something broken in a tool,
                            or describe an adaptation you want to make. Prefer your own client? Write to{' '}
                            <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-slate-900 underline decoration-accent-400 decoration-2 underline-offset-4 transition-colors hover:text-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600">
                                {CONTACT_EMAIL}
                            </a>
                            .
                        </p>
                    </Reveal>
                </header>

                <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
                    <RevealGroup className="contents" stagger={0.09}>
                        <RevealItem className="order-2 lg:order-1" distance={22}>
                            <ul className="space-y-5">
                                {EXPECTATIONS.map(({ Icon, title, body }) => (
                                    <li key={title} className="group flex gap-4 border-t border-ink/10 pt-5">
                                        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded bg-accent-100 text-accent-700 transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none">
                                            <Icon className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                        <div>
                                            <h2 className="font-display text-base font-bold tracking-[-0.02em] text-slate-950">{title}</h2>
                                            <p className="mt-1.5 text-sm leading-6 text-slate-600">{body}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-8 flex items-center gap-3 border-t border-ink/10 pt-6">
                                <Logo size="sm" variant="icon-only" />
                                <p className="flex flex-col text-xs text-slate-500">
                                    <span className="font-bold uppercase tracking-[0.16em]">Direct line</span>
                                    <a href={`mailto:${CONTACT_EMAIL}`} className="mt-1 inline-flex w-fit items-center gap-2 font-mono text-sm text-slate-800 underline decoration-ink/20 underline-offset-4 transition-colors hover:text-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600">
                                        <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                                        {CONTACT_EMAIL}
                                    </a>
                                </p>
                            </div>
                        </RevealItem>

                        <RevealItem index={1} className="order-1 lg:order-2" distance={22} duration={0.6}>
                            <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/[0.07] motion-reduce:transform-none sm:p-9">
                                <ContactForm
                                    variant="full"
                                    tone="light"
                                    accent="warm"
                                    title="Send a message"
                                    description="Nothing is stored in the browser and nothing is shared with a third party."
                                    subject="Contact from GPTX.VIP"
                                />
                            </div>
                        </RevealItem>
                    </RevealGroup>
                </div>
            </main>

            <Footer
                accent="warm"
                onNavigateFinhub={onNavigateFinhub || (() => window.location.assign('/finhub'))}
                onNavigateCodeConcepts={onNavigateCodeConcepts || (() => window.location.assign('/code_concepts/general'))}
                onNavigateAgentWorkspace={onNavigateAgentWorkspace}
                onNavigateDevLush={() => window.location.assign('/agents')}
                onNavigateProjectSurfaces={() => window.location.assign('/agents/templates')}
                onNavigateBlogs={onNavigateBlogs || (() => window.location.assign('/blogs'))}
            />
        </div>
    );
};

export default ContactPage;

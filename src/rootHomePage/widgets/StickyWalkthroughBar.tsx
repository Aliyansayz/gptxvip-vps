import React, { useEffect, useState } from 'react';
import { ArrowRight, Layers, X } from 'lucide-react';
import { ContactForm } from '../../shared/components/ContactForm';

export interface StickyWalkthroughBarProps {
  activeSurface: string | null;
  defaultMessage: string;
  contactSectionId?: string;
  onClearSurface?: () => void;
}

export const StickyWalkthroughBar: React.FC<StickyWalkthroughBarProps> = ({
  activeSurface,
  defaultMessage,
  contactSectionId = 'contact-section',
  onClearSurface,
}) => {
  const [pastHero, setPastHero] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setPastHero(window.scrollY > 520);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const target = document.getElementById(contactSectionId);
    if (!target || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => setContactVisible(entry.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [contactSectionId]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDrawerOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [drawerOpen]);

  const showPill = pastHero && !contactVisible && !drawerOpen;

  return (
    <>
      {/* Floating Contextual Conversion Bar */}
      <div
        aria-hidden={!showPill}
        className={`fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-md items-center justify-between gap-3 rounded-2xl border border-[#2DD4BF]/35 bg-[#0B131E]/95 px-4 py-2.5 text-white shadow-[0_18px_48px_rgba(7,13,23,0.48)] backdrop-blur-xl transition-[opacity,transform] duration-200 ease-out sm:inset-x-auto sm:right-6 sm:bottom-6 sm:max-w-none ${
          showPill
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#2DD4BF]/15 text-[#5EEAD4]">
            <Layers className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-white">
              {activeSurface ? (
                activeSurface
              ) : (
                <>
                  <span className="sm:hidden">Custom Builds</span>
                  <span className="hidden sm:inline">Custom Systems &amp; Agents</span>
                </>
              )}
            </p>
            <p className="hidden truncate text-[11px] text-slate-300 sm:block">
              Direct builder reply · 15-min walkthrough
            </p>
          </div>
        </div>

        <button
          type="button"
          tabIndex={showPill ? 0 : -1}
          onClick={() => setDrawerOpen(true)}
          className="inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-gradient-to-r from-[#5EEAD4] to-[#38BDF8] px-4 py-2.5 text-xs font-bold text-[#0B131E] transition-[filter,transform] duration-150 ease-out hover:brightness-105 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <span className="sm:hidden">Book Demo</span>
          <span className="hidden sm:inline">Book Walkthrough</span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* Lightweight Accessible Lead Modal */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#0B131E]/75 p-4 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="walkthrough-modal-title"
          onClick={(event) => {
            if (event.target === event.currentTarget) setDrawerOpen(false);
          }}
        >
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 text-[#0F172A] shadow-2xl sm:p-7">
            <div className="mb-4 flex items-start justify-between gap-3 border-b border-slate-200 pb-3.5">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#0D9488]">
                  Project Surface Walkthrough
                </p>
                <h3
                  id="walkthrough-modal-title"
                  className="mt-1 text-lg font-bold text-[#0F172A]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Book a 15-min Architecture Walkthrough
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="flex h-11 w-11 min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#0F172A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
                aria-label="Close walkthrough modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <ContactForm
              variant="full"
              inquiryMode="project"
              tone="light"
              accent="soc"
              subject="Book a 15-Min Architecture Walkthrough"
              submitLabel="Request Walkthrough"
              defaultMessage={defaultMessage}
              surfaceContext={activeSurface}
              onClearSurfaceContext={onClearSurface}
              onSuccess={() => {
                window.setTimeout(() => setDrawerOpen(false), 1200);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default StickyWalkthroughBar;

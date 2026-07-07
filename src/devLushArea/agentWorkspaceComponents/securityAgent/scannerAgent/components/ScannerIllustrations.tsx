import React from 'react';

export const SvgEmptyState = ({ title, message }: { title: string; message: string }) => (
  <div className="flex flex-col items-center justify-center text-center p-8">
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-6">
      <circle cx="100" cy="100" r="80" fill="#EEF2FF" />
      <path d="M100 40V160M40 100H160" stroke="#C7D2FE" strokeWidth="4" strokeDasharray="12 12" />
      <rect x="75" y="75" width="50" height="50" rx="12" fill="#4F46E5" />
      <circle cx="100" cy="100" r="10" fill="#FFFFFF" />
      <path d="M75 75L125 125M125 75L75 125" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.5" />
      <circle cx="140" cy="60" r="15" fill="#818CF8" fillOpacity="0.8" />
      <circle cx="60" cy="140" r="20" fill="#38BDF8" fillOpacity="0.6" />
    </svg>
    <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-sm text-slate-500 max-w-md">{message}</p>
  </div>
);

export const SvgTheoryIllustration = () => (
  <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-6">
    <rect x="40" y="40" width="160" height="160" rx="24" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="4" />
    <path d="M80 80H160M80 120H140M80 160H120" stroke="#94A3B8" strokeWidth="8" strokeLinecap="round" />
    <rect x="150" y="110" width="40" height="40" rx="8" fill="#6366F1" />
    <path d="M162 130L168 136L178 124" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

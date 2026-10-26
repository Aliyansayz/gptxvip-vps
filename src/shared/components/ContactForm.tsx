import React, { useState } from 'react';
import { Mail, Send, Loader2, FileText, Download, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export type ContactFormVariant = 'full' | 'compact' | 'lead-magnet';

/**
 * Controls the form's own palette.
 *
 * The site shell keeps `<html class="dark">` on permanently, so a
 * `dark:`-prefixed form would render its dark treatment inside light cards and
 * lose every heading. Tone is therefore explicit: pick the ground the form
 * actually sits on.
 */
export type ContactFormTone = 'light' | 'dark';

/**
 * Accent ramp for the interactive parts.
 *
 * `warm` is the premium landing/contact surface ramp (`accent-*` tokens).
 * `emerald` is the analytics/Finhub ramp. `cyan` is the Agent catalog ramp.
 * The form must never sit next to a surface that speaks a different accent —
 * that mismatch is what made the button read as "not part of this page".
 */
export type ContactFormAccent = 'warm' | 'emerald' | 'cyan' | 'indigo';

interface ContactFormProps {
  variant?: ContactFormVariant;
  /** Required: the ground this form is placed on. */
  tone?: ContactFormTone;
  accent?: ContactFormAccent;
  title?: string;
  description?: string;
  /** Email subject line. `full` prepends it as the first option of the picker. */
  subject?: string;
  onSuccess?: () => void;
  className?: string;
  /** Pre-filled email for lead magnet variant */
  defaultEmail?: string;
  /** Pre-filled industry for lead magnet variant */
  defaultIndustry?: string;
}

/**
 * Web3Forms access key. This is a client-side, write-only key: it only scopes
 * submissions to this inbox and is safe to ship in the browser bundle.
 * Set `VITE_WEB3FORMS_KEY` to override without a code change.
 */
const ACCESS_KEY = (import.meta.env?.VITE_WEB3FORMS_KEY as string | undefined)
  || 'dcc5f92a-158b-4cf1-b828-49514f651a6f';
const API_URL = 'https://api.web3forms.com/submit';

const SUBJECT_OPTIONS = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'lesson', label: 'Lesson/Course Question' },
  { value: 'technical', label: 'Technical Issue' },
  { value: 'partnership', label: 'Partnership/Business' },
  { value: 'feedback', label: 'Feedback/Suggestion' },
  { value: 'other', label: 'Other' },
];

const INDUSTRY_OPTIONS = [
  'Equity Valuation & Accounting',
  'Ecommerce & DTC Brands',
  'Corporate Legal & IP',
  'Supply Chain & Logistics',
  'Enterprise Cybersecurity',
  'Other',
];

type Status = { state: 'success' | 'error'; message: string } | null;

/*
 * Field geometry is shared; only ink and fill change per tone. Keeping the
 * shape in one constant is what stops the light and dark forms from drifting
 * apart when one of them is restyled.
 */
const FIELD = 'w-full rounded-xl border px-4 py-3 text-sm transition-[border-color,box-shadow,background-color] duration-200 focus:outline-none focus-visible:outline-none';
const LABEL = 'mb-2 block text-[0.6875rem] font-bold uppercase tracking-[0.14em]';
const SUBMIT_BASE = 'group flex w-full cursor-pointer items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-[transform,box-shadow,background-color,filter] duration-200 focus:outline-none focus-visible:outline-none active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transform-none';

type Surface = {
  label: string;
  field: string;
  fieldOnIcon: string;
  title: string;
  description: string;
  button: string;
  finePrint: string;
  success: string;
  error: string;
};

/** Focus/hover ink per accent ramp, split by ground so the ring stays visible. */
const accents: Record<ContactFormAccent, { light: string; dark: string }> = {
  warm: { light: 'focus:border-accent-500 focus:shadow-[0_0_0_4px_var(--color-accent-500,0.14)]', dark: 'focus:border-accent-400 focus:shadow-[0_0_0_4px_rgba(245,118,79,0.22)]' },
  emerald: { light: 'focus:border-emerald-500 focus:shadow-[0_0_0_4px_rgba(16,185,129,0.16)]', dark: 'focus:border-emerald-400 focus:shadow-[0_0_0_4px_rgba(52,211,153,0.2)]' },
  cyan: { light: 'focus:border-cyan-500 focus:shadow-[0_0_0_4px_rgba(6,182,212,0.16)]', dark: 'focus:border-cyan-400 focus:shadow-[0_0_0_4px_rgba(34,211,238,0.2)]' },
  indigo: { light: 'focus:border-indigo-500 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.16)]', dark: 'focus:border-indigo-400 focus:shadow-[0_0_0_4px_rgba(129,140,248,0.2)]' },
};

const buttons: Record<ContactFormAccent, { light: string; dark: string }> = {
  warm: {
    light: 'accent-fill-gradient text-white shadow-lg shadow-accent-600/25 hover:brightness-110 focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2',
    dark: 'bg-accent-600 text-white hover:bg-accent-500 focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
  },
  emerald: {
    light: 'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2',
    dark: 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
  },
  cyan: {
    light: 'bg-cyan-600 text-white hover:bg-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2',
    dark: 'bg-cyan-500 text-zinc-950 hover:bg-cyan-400 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
  },
  indigo: {
    light: 'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2',
    dark: 'bg-indigo-500 text-white hover:bg-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
  },
};

const surfaces: Record<ContactFormTone, Record<ContactFormAccent, Surface>> = {
  light: {
    warm: {
      label: `${LABEL} text-ink/70`,
      field: '',
      fieldOnIcon: 'text-ink/40',
      title: 'text-slate-950',
      description: 'text-slate-600',
      button: '',
      finePrint: 'text-slate-500',
      success: 'border-emerald-300 bg-emerald-50 text-emerald-800',
      error: 'border-red-300 bg-red-50 text-red-700',
    },
    emerald: {
      label: `${LABEL} text-slate-700`,
      field: '',
      fieldOnIcon: 'text-slate-400',
      title: 'text-slate-900',
      description: 'text-slate-600',
      button: '',
      finePrint: 'text-slate-500',
      success: 'border-emerald-300 bg-emerald-50 text-emerald-800',
      error: 'border-red-300 bg-red-50 text-red-700',
    },
    cyan: {
      label: `${LABEL} text-slate-700`,
      field: '',
      fieldOnIcon: 'text-slate-400',
      title: 'text-slate-900',
      description: 'text-slate-600',
      button: '',
      finePrint: 'text-slate-500',
      success: 'border-emerald-300 bg-emerald-50 text-emerald-800',
      error: 'border-red-300 bg-red-50 text-red-700',
    },
    indigo: {
      label: `${LABEL} text-slate-700`,
      field: '',
      fieldOnIcon: 'text-slate-400',
      title: 'text-slate-900',
      description: 'text-slate-600',
      button: '',
      finePrint: 'text-slate-500',
      success: 'border-emerald-300 bg-emerald-50 text-emerald-800',
      error: 'border-red-300 bg-red-50 text-red-700',
    },
  },
  dark: {
    warm: {
      label: `${LABEL} text-slate-300`,
      field: '',
      fieldOnIcon: 'text-slate-500',
      title: 'text-white',
      description: 'text-slate-300',
      button: '',
      finePrint: 'text-slate-400',
      success: 'border-emerald-800 bg-emerald-950/50 text-emerald-300',
      error: 'border-red-900 bg-red-950/50 text-red-300',
    },
    emerald: {
      label: `${LABEL} text-slate-300`,
      field: '',
      fieldOnIcon: 'text-slate-500',
      title: 'text-white',
      description: 'text-slate-300',
      button: '',
      finePrint: 'text-slate-400',
      success: 'border-emerald-800 bg-emerald-950/50 text-emerald-300',
      error: 'border-red-900 bg-red-950/50 text-red-300',
    },
    cyan: {
      label: `${LABEL} text-slate-300`,
      field: '',
      fieldOnIcon: 'text-slate-500',
      title: 'text-white',
      description: 'text-slate-300',
      button: '',
      finePrint: 'text-slate-400',
      success: 'border-emerald-800 bg-emerald-950/50 text-emerald-300',
      error: 'border-red-900 bg-red-950/50 text-red-300',
    },
    indigo: {
      label: `${LABEL} text-slate-300`,
      field: '',
      fieldOnIcon: 'text-slate-500',
      title: 'text-white',
      description: 'text-slate-300',
      button: '',
      finePrint: 'text-slate-400',
      success: 'border-emerald-800 bg-emerald-950/50 text-emerald-300',
      error: 'border-red-900 bg-red-950/50 text-red-300',
    },
  },
};

/** Field fill + resting border per tone, appended to the shared FIELD shape. */
/** Accent ink for the leading title icon, matching the button ramp. */
const accentInk: Record<ContactFormAccent, string> = {
  warm: 'text-accent-600',
  emerald: 'text-emerald-600',
  cyan: 'text-cyan-600',
  indigo: 'text-indigo-600',
};

const fieldFill: Record<ContactFormTone, string> = {
  light: 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 hover:border-slate-400',
  dark: 'border-white/12 bg-black/25 text-slate-100 placeholder:text-slate-500 hover:border-white/25',
};

const selectChevron = 'appearance-none bg-no-repeat pr-10';
const SELECT_CHEVRON_SVG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%2394a3b8' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 8 4 4 4-4'/%3E%3C/svg%3E\")";
const selectChevronStyle: React.CSSProperties = {
  backgroundImage: SELECT_CHEVRON_SVG,
  backgroundPosition: 'right 0.85rem center',
  backgroundSize: '1.1rem 1.1rem',
};


export const ContactForm: React.FC<ContactFormProps> = ({
  variant = 'full',
  tone = 'dark',
  accent = 'emerald',
  title,
  description,
  subject: defaultSubject = 'Contact from GPTX.VIP',
  onSuccess,
  className = '',
  defaultEmail = '',
  defaultIndustry = 'Equity Valuation & Accounting',
}) => {
  const skin = { ...surfaces[tone][accent], field: '', button: '' };
  const fieldClass = `${FIELD} ${fieldFill[tone]} ${accents[accent][tone]}`;
  const submitClass = `${SUBMIT_BASE} ${buttons[accent][tone]}`;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  // Bots fill hidden fields; a non-empty value means the submission is dropped.
  const [honeypot, setHoneypot] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: defaultEmail,
    subject: defaultSubject,
    message: '',
    industry: defaultIndustry,
  });

  // `full` renders a picker, so the caller's context line has to be selectable
  // or the select would silently fall back to its first option.
  const subjectOptions = SUBJECT_OPTIONS.some((option) => option.value === defaultSubject)
    ? SUBJECT_OPTIONS
    : [{ value: defaultSubject, label: defaultSubject }, ...SUBJECT_OPTIONS];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || honeypot) return;

    setIsSubmitting(true);
    setStatus(null);

    const submitData = new FormData();
    submitData.append('access_key', ACCESS_KEY);
    submitData.append('subject', formData.subject || defaultSubject);
    submitData.append('from_name', formData.name || 'GPTX.VIP visitor');
    submitData.append('email', formData.email);
    submitData.append('message', formData.message);
    if (variant === 'lead-magnet' && formData.industry) {
      submitData.append('industry', formData.industry);
    }

    try {
      const response = await fetch(API_URL, { method: 'POST', body: submitData });
      const data = await response.json().catch(() => ({}));

      if (data.success) {
        setStatus({ state: 'success', message: 'Thanks — your message is on its way. We usually reply within a day.' });
        toast.success('Message sent successfully!');
        setFormData(prev => ({
          ...prev,
          name: '',
          email: variant === 'lead-magnet' ? defaultEmail : '',
          message: '',
          subject: defaultSubject,
        }));
        onSuccess?.();
      } else {
        const message = data.message || 'We could not send your message. Please try again or email us directly.';
        setStatus({ state: 'error', message });
        toast.error(message);
      }
    } catch {
      setStatus({ state: 'error', message: 'Network error. Check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusBanner = status && (
    <p
      role={status.state === 'error' ? 'alert' : 'status'}
      aria-live="polite"
      className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${status.state === 'error' ? skin.error : skin.success}`}
    >
      {status.state === 'error'
        ? <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />}
      <span>{status.message}</span>
    </p>
  );

  const hiddenTrap = (
    <div className="absolute h-0 w-0 overflow-hidden opacity-0" aria-hidden="true">
      <label htmlFor={`cf-company-${variant}`}>Company (leave blank)</label>
      <input
        id={`cf-company-${variant}`}
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        value={honeypot}
        onChange={(event) => setHoneypot(event.target.value)}
      />
    </div>
  );

  const submitButton = (label: string, Icon: React.ComponentType<{ className?: string }>) => (
    <button type="submit" disabled={isSubmitting} className={submitClass}>
      {isSubmitting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          <span>Sending...</span>
        </>
      ) : (
        <>
          <Icon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none" aria-hidden="true" />
          <span>{label}</span>
        </>
      )}
    </button>
  );

  if (variant === 'lead-magnet') {
    return (
      <form onSubmit={handleSubmit} className={`space-y-4 ${className}`} noValidate>
        {title && (
          <h3 className={`flex items-center gap-2 text-base font-bold sm:text-lg ${skin.title}`}>
            <FileText className={`h-4 w-4 ${accentInk[accent]}`} aria-hidden="true" />
            <span>{title}</span>
          </h3>
        )}
        {description && <p className={`text-xs ${skin.description}`}>{description}</p>}
        {hiddenTrap}

        <div>
          <label htmlFor="cf-lead-email" className={skin.label}>Work Email Address</label>
          <div className="relative">
            <Mail className={`pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${skin.fieldOnIcon}`} aria-hidden="true" />
            <input
              type="email"
              name="email"
              id="cf-lead-email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@enterprise.com"
              className={`${fieldClass} pl-11`}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <label htmlFor="cf-industry" className={skin.label}>Primary Industry Focus</label>
          <select
            name="industry"
            id="cf-industry"
            value={formData.industry}
            onChange={handleChange}
            className={`${fieldClass} ${selectChevron}`}
            style={selectChevronStyle}
            disabled={isSubmitting}
          >
            {INDUSTRY_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={isSubmitting} className={submitClass}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>Download Free Whitepaper</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>

        <p className={`text-center text-[10px] ${skin.finePrint}`}>
          Zero spam guarantee. Unsubscribe anytime with 1 click.
        </p>
        {statusBanner}
      </form>
    );
  }

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className={`space-y-4 ${className}`} noValidate>
        {title && <h4 className={`text-sm font-semibold ${skin.title}`}>{title}</h4>}
        {description && <p className={`text-xs ${skin.description}`}>{description}</p>}
        {hiddenTrap}

        <div>
          <label htmlFor="cf-compact-email" className={skin.label}>Email</label>
          <div className="relative">
            <Mail className={`pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${skin.fieldOnIcon}`} aria-hidden="true" />
            <input
              type="email"
              name="email"
              id="cf-compact-email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className={`${fieldClass} pl-11`}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <label htmlFor="cf-compact-message" className={skin.label}>Message</label>
          <textarea
            name="message"
            id="cf-compact-message"
            required
            value={formData.message}
            onChange={handleChange}
            placeholder="Brief message..."
            rows={3}
            className={`${fieldClass} min-h-[96px] resize-none`}
            disabled={isSubmitting}
          />
        </div>

        {submitButton('Send', Send)}
        {statusBanner}
      </form>
    );
  }

  // Full variant
  return (
    <form onSubmit={handleSubmit} className={`space-y-3.5 ${className}`} noValidate>
      {title && (
        <div className="mb-1">
          <h3 className={`text-base sm:text-lg font-bold ${skin.title}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h3>
          {description && <p className={`mt-0.5 text-xs sm:text-sm ${skin.description}`}>{description}</p>}
        </div>
      )}
      {hiddenTrap}

      <fieldset className="grid gap-3 sm:grid-cols-2">
        <legend className="sr-only">Contact Details</legend>
        <div>
          <label htmlFor="cf-name" className={skin.label}>Name</label>
          <input
            type="text"
            name="name"
            id="cf-name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            autoComplete="name"
            className={`${fieldClass} min-h-[44px]`}
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="cf-full-email" className={skin.label}>Email Address</label>
          <div className="relative">
            <Mail className={`pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${skin.fieldOnIcon}`} aria-hidden="true" />
            <input
              type="email"
              name="email"
              id="cf-full-email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@company.com"
              autoComplete="email"
              inputMode="email"
              className={`${fieldClass} pl-11 min-h-[44px]`}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="sr-only">Message Inquiries</legend>
        <div>
          <label htmlFor="cf-subject" className={skin.label}>Subject / Inquiry Type</label>
          <select
            name="subject"
            id="cf-subject"
            value={formData.subject}
            onChange={handleChange}
            className={`${fieldClass} ${selectChevron} min-h-[44px]`}
            style={selectChevronStyle}
            disabled={isSubmitting}
          >
            {subjectOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="cf-message" className={skin.label}>Message</label>
          <textarea
            name="message"
            id="cf-message"
            required
            value={formData.message}
            onChange={handleChange}
            placeholder="How can we help your team?"
            rows={4}
            className={`${fieldClass} min-h-[110px] resize-none`}
            disabled={isSubmitting}
          />
        </div>
      </fieldset>

      <div className="pt-1">
        {submitButton('Send Message', Send)}
      </div>
      {statusBanner}
    </form>
  );
};

export default ContactForm;

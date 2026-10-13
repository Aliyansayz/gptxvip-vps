import React, { useState } from 'react';
import { Mail, Send, Loader2, CheckCircle2, AlertCircle, FileText, Download, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export type ContactFormVariant = 'full' | 'compact' | 'lead-magnet';

interface ContactFormProps {
  variant?: ContactFormVariant;
  title?: string;
  description?: string;
  subject?: string;
  onSuccess?: () => void;
  className?: string;
  /** Pre-filled email for lead magnet variant */
  defaultEmail?: string;
  /** Pre-filled industry for lead magnet variant */
  defaultIndustry?: string;
}

const ACCESS_KEY = 'dcc5f92a-158b-4cf1-b828-49514f651a6f';
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

export const ContactForm: React.FC<ContactFormProps> = ({
  variant = 'full',
  title,
  description,
  subject: defaultSubject = 'Contact from GPTX.VIP',
  onSuccess,
  className = '',
  defaultEmail = '',
  defaultIndustry = 'Equity Valuation & Accounting',
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: defaultEmail,
    subject: defaultSubject,
    message: '',
    industry: defaultIndustry,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submitData = new FormData();
    submitData.append('access_key', ACCESS_KEY);
    submitData.append('subject', formData.subject || defaultSubject);
    
    if (formData.name) submitData.append('from_name', formData.name);
    if (formData.email) submitData.append('email', formData.email);
    if (formData.message) submitData.append('message', formData.message);
    if (formData.industry && variant === 'lead-magnet') submitData.append('industry', formData.industry);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: submitData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Message sent successfully!');
        setFormData(prev => ({ ...prev, name: '', email: variant === 'lead-magnet' ? defaultEmail : '', message: '', subject: defaultSubject }));
        onSuccess?.();
      } else {
        toast.error(data.message || 'Failed to send message. Please try again.');
      }
    } catch {
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const baseStyles = {
    form: 'space-y-4',
    label: 'block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1',
    input: 'w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all',
    textarea: 'w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none min-h-[100px]',
    select: 'w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all',
    button: 'w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2',
    error: 'text-sm text-red-600 dark:text-red-400',
  };

  if (variant === 'lead-magnet') {
    return (
      <form onSubmit={handleSubmit} className={baseStyles.form} noValidate>
        {title && (
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-500" />
            <span>{title}</span>
          </h3>
        )}
        {description && <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>}
        
        <div>
          <label htmlFor="email" className={baseStyles.label}>Work Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              name="email"
              id="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@enterprise.com"
              className={`${baseStyles.input} pl-9`}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <label htmlFor="industry" className={baseStyles.label}>Primary Industry Focus</label>
          <select
            name="industry"
            id="industry"
            value={formData.industry}
            onChange={handleChange}
            className={baseStyles.select}
            disabled={isSubmitting}
          >
            {INDUSTRY_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={isSubmitting} className={baseStyles.button}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download Free Whitepaper</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center">
          Zero spam guarantee. Unsubscribe anytime with 1 click.
        </p>
      </form>
    );
  }

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className={`${baseStyles.form} ${className}`} noValidate>
        {title && <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h4>}
        {description && <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>}
        
        <div>
          <label htmlFor="email" className={baseStyles.label}>Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              name="email"
              id="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className={`${baseStyles.input} pl-9`}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className={baseStyles.label}>Message</label>
          <textarea
            name="message"
            id="message"
            required
            value={formData.message}
            onChange={handleChange}
            placeholder="Brief message..."
            rows={3}
            className={baseStyles.textarea}
            disabled={isSubmitting}
          />
        </div>

        <button type="submit" disabled={isSubmitting} className={baseStyles.button}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Send</span>
            </>
          )}
        </button>
      </form>
    );
  }

  // Full variant
  return (
    <form onSubmit={handleSubmit} className={`${baseStyles.form} ${className}`} noValidate>
      {title && (
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
          {description && <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{description}</p>}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className={baseStyles.label}>Name</label>
          <input
            type="text"
            name="name"
            id="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            className={baseStyles.input}
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="email" className={baseStyles.label}>Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              name="email"
              id="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className={`${baseStyles.input} pl-9`}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="subject" className={baseStyles.label}>Subject</label>
        <select
          name="subject"
          id="subject"
          value={formData.subject}
          onChange={handleChange}
          className={baseStyles.select}
          disabled={isSubmitting}
        >
          {SUBJECT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className={baseStyles.label}>Message</label>
        <textarea
          name="message"
          id="message"
          required
          value={formData.message}
          onChange={handleChange}
          placeholder="Your message..."
          rows={5}
          className={baseStyles.textarea}
          disabled={isSubmitting}
        />
      </div>

      <button type="submit" disabled={isSubmitting} className={baseStyles.button}>
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Sending...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Send Message</span>
          </>
        )}
      </button>
    </form>
  );
};
import React, { useCallback, useEffect, useState } from 'react';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Download,
  Globe,
  Inbox,
  Loader2,
  Mail,
  MessageSquare,
  RefreshCw,
  Save,
  Search,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import type {
  ContactLeadDto,
  LeadPriority,
  LeadStatus,
} from '../shared/cmsContracts';
import { cmsApiClient } from '../services/cmsApiClient';

interface AdminLeadsPanelProps {
  onLeadsChanged?: () => void;
}

const LEAD_STATUSES: { value: LeadStatus; label: string; badge: string }[] = [
  { value: 'new', label: 'New', badge: 'bg-sky-500/15 text-sky-300 border-sky-500/30' },
  { value: 'contacted', label: 'Contacted', badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' },
  { value: 'qualified', label: 'Qualified', badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  { value: 'proposal', label: 'Proposal', badge: 'bg-violet-500/15 text-violet-300 border-violet-500/30' },
  { value: 'won', label: 'Won', badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  { value: 'archived', label: 'Archived', badge: 'bg-zinc-800 text-zinc-400 border-zinc-700' },
  { value: 'spam', label: 'Spam', badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30' },
];

const LEAD_PRIORITIES: { value: LeadPriority; label: string; dot: string }[] = [
  { value: 'urgent', label: 'Urgent', dot: 'bg-rose-500' },
  { value: 'high', label: 'High', dot: 'bg-amber-400' },
  { value: 'medium', label: 'Medium', dot: 'bg-sky-400' },
  { value: 'low', label: 'Low', dot: 'bg-zinc-500' },
];

function statusStyle(status: LeadStatus): string {
  return (
    LEAD_STATUSES.find((s) => s.value === status)?.badge ??
    'bg-zinc-800 text-zinc-300 border-zinc-700'
  );
}

function priorityDot(priority: LeadPriority): string {
  return LEAD_PRIORITIES.find((p) => p.value === priority)?.dot ?? 'bg-zinc-500';
}

function variantLabel(variant: string): string {
  if (variant === 'lead-magnet') return 'Whitepaper Lead';
  if (variant === 'compact') return 'Footer Contact';
  return 'Contact Page';
}

export const AdminLeadsPanel: React.FC<AdminLeadsPanelProps> = ({
  onLeadsChanged,
}) => {
  const [leads, setLeads] = useState<ContactLeadDto[]>([]);
  const [summary, setSummary] = useState({
    total: 0,
    newCount: 0,
    contactedCount: 0,
    qualifiedCount: 0,
    wonCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [variantFilter, setVariantFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [savingLead, setSavingLead] = useState(false);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    try {
      const data = await cmsApiClient.listAdminLeads({
        status: statusFilter,
        priority: priorityFilter,
        sourceVariant: variantFilter,
        search: searchQuery.trim() || undefined,
      });
      setLeads(data.leads);
      setSummary(data.summary);
      setSelectedLeadId((prev) => {
        if (prev && data.leads.some((l) => l.id === prev)) return prev;
        return data.leads[0]?.id ?? null;
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter, variantFilter, searchQuery]);

  useEffect(() => {
    void loadLeads();
  }, [loadLeads]);

  const selectedLead = leads.find((l) => l.id === selectedLeadId) ?? null;

  useEffect(() => {
    setNotesDraft(selectedLead?.adminNotes ?? '');
  }, [selectedLead?.id, selectedLead?.adminNotes]);

  const handlePatchLead = async (
    id: string,
    patch: { status?: LeadStatus; priority?: LeadPriority; adminNotes?: string }
  ) => {
    setSavingLead(true);
    try {
      const updated = await cmsApiClient.updateLead(id, patch);
      setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)));
      toast.success('Lead updated');
      void loadLeads();
      onLeadsChanged?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update lead');
    } finally {
      setSavingLead(false);
    }
  };

  const handleDeleteLead = async (lead: ContactLeadDto) => {
    if (!window.confirm(`Delete lead from ${lead.email}? This cannot be undone.`)) {
      return;
    }
    try {
      await cmsApiClient.deleteLead(lead.id);
      toast.success('Lead deleted');
      await loadLeads();
      onLeadsChanged?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete lead');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & KPI Strip */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#d8ff38]">
              Lead Generation · Contact Inbox
            </div>
            <h2 className="mt-1 font-display text-xl font-bold text-white">
              Website Submissions &amp; Pipeline
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void loadLeads()}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:border-zinc-700 cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <a
              href="/api/admin/leads/export"
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#d8ff38] px-4 py-2 text-xs font-bold text-[#101014] hover:bg-[#c6f028]"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Export CSV</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            { label: 'Total Leads', value: summary.total, accent: 'text-white' },
            { label: 'New / Unread', value: summary.newCount, accent: 'text-sky-400' },
            { label: 'Contacted', value: summary.contactedCount, accent: 'text-indigo-400' },
            { label: 'Qualified', value: summary.qualifiedCount, accent: 'text-amber-300' },
            { label: 'Won', value: summary.wonCount, accent: 'text-emerald-400' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-3.5"
            >
              <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                {stat.label}
              </div>
              <div className={`mt-1 font-display text-2xl font-extrabold tabular-nums ${stat.accent}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by lead status"
            className="min-h-[38px] rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-xs font-semibold text-zinc-200 focus:border-[#d8ff38] focus:outline-none"
          >
            <option value="all">All Statuses</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            aria-label="Filter by priority"
            className="min-h-[38px] rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-xs font-semibold text-zinc-200 focus:border-[#d8ff38] focus:outline-none"
          >
            <option value="all">All Priorities</option>
            {LEAD_PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>

          <select
            value={variantFilter}
            onChange={(e) => setVariantFilter(e.target.value)}
            aria-label="Filter by source form"
            className="min-h-[38px] rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-xs font-semibold text-zinc-200 focus:border-[#d8ff38] focus:outline-none"
          >
            <option value="all">All Form Sources</option>
            <option value="full">Contact Page</option>
            <option value="compact">Footer Contact</option>
            <option value="lead-magnet">Whitepaper Lead Magnet</option>
          </select>
        </div>

        <div className="relative w-full lg:w-72">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, email, message…"
            className="min-h-[38px] w-full rounded-xl border border-zinc-800 bg-zinc-950 pl-10 pr-4 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-[#d8ff38] focus:outline-none"
          />
        </div>
      </div>

      {/* Master-Detail CRM Inbox */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-zinc-400 gap-2 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading leads…</span>
        </div>
      ) : leads.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-950/60 px-6 py-16 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-zinc-400">
            <Inbox className="h-6 w-6" aria-hidden="true" />
          </div>
          <h3 className="font-display text-lg font-bold text-white">
            No contact submissions yet
          </h3>
          <p className="mx-auto max-w-md text-xs text-zinc-400">
            Whenever a visitor submits the Contact page, homepage lead form, footer form, or Whitepaper download form, their inquiry appears right here in real time.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-12">
          {/* Left Lead List */}
          <div className="space-y-2 lg:col-span-5 max-h-[680px] overflow-y-auto pr-1">
            {leads.map((lead) => {
              const isSelected = lead.id === selectedLead?.id;
              return (
                <button
                  key={lead.id}
                  type="button"
                  onClick={() => setSelectedLeadId(lead.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-[#d8ff38]/60 bg-zinc-900'
                      : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${priorityDot(lead.priority)}`}
                        title={`Priority: ${lead.priority}`}
                      />
                      <span className="truncate text-sm font-bold text-white">
                        {lead.name}
                      </span>
                    </div>
                    <span
                      className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusStyle(lead.status)}`}
                    >
                      {lead.status}
                    </span>
                  </div>

                  <div className="mt-1 truncate font-mono text-[11px] text-zinc-400">
                    {lead.email}
                  </div>
                  <div className="mt-2 truncate text-xs font-semibold text-zinc-200">
                    {lead.subject}
                  </div>
                  {lead.message && (
                    <p className="mt-1 line-clamp-2 text-xs text-zinc-400">
                      {lead.message}
                    </p>
                  )}

                  <div className="mt-3 flex items-center justify-between text-[10px] text-zinc-500">
                    <span>{variantLabel(lead.sourceVariant)}</span>
                    <span className="tabular-nums">
                      {new Date(lead.createdAt).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Lead Inspector */}
          {selectedLead && (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-800 pb-5">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-xl font-bold text-white">
                      {selectedLead.name}
                    </h3>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusStyle(selectedLead.status)}`}
                    >
                      {selectedLead.status}
                    </span>
                  </div>
                  <a
                    href={`mailto:${selectedLead.email}?subject=${encodeURIComponent(`Re: ${selectedLead.subject}`)}`}
                    className="inline-flex items-center gap-1.5 font-mono text-xs text-[#d8ff38] hover:underline"
                  >
                    <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{selectedLead.email}</span>
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${selectedLead.email}?subject=${encodeURIComponent(`Re: ${selectedLead.subject}`)}`}
                    onClick={() => {
                      if (selectedLead.status === 'new') {
                        void handlePatchLead(selectedLead.id, { status: 'contacted' });
                      }
                    }}
                    className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-[#d8ff38] px-3.5 py-1.5 text-xs font-bold text-[#101014] hover:bg-[#c6f028]"
                  >
                    <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Reply via Email</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => void handleDeleteLead(selectedLead)}
                    title="Delete lead"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-rose-500/40 hover:text-rose-400 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Metadata Pills */}
              <div className="grid gap-3 sm:grid-cols-2 text-xs">
                <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-3.5">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                    <MessageSquare className="h-3 w-3" />
                    <span>Subject</span>
                  </div>
                  <div className="mt-1 font-semibold text-zinc-100">
                    {selectedLead.subject}
                  </div>
                </div>

                <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-3.5">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                    <Clock className="h-3 w-3" />
                    <span>Received</span>
                  </div>
                  <div className="mt-1 font-semibold text-zinc-100 tabular-nums">
                    {new Date(selectedLead.createdAt).toLocaleString()}
                  </div>
                </div>

                {selectedLead.industry && (
                  <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-3.5">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                      <Briefcase className="h-3 w-3" />
                      <span>Industry Focus</span>
                    </div>
                    <div className="mt-1 font-semibold text-zinc-100">
                      {selectedLead.industry}
                    </div>
                  </div>
                )}

                <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-3.5">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                    <Globe className="h-3 w-3" />
                    <span>Capture Source</span>
                  </div>
                  <div className="mt-1 font-semibold text-zinc-100">
                    {variantLabel(selectedLead.sourceVariant)}
                    {selectedLead.sourcePage ? (
                      <span className="ml-1.5 font-mono text-[11px] text-zinc-400">
                        ({selectedLead.sourcePage})
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Message Body */}
              <div className="space-y-2">
                <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Inquiry Message
                </div>
                <div className="whitespace-pre-wrap rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm leading-relaxed text-zinc-200">
                  {selectedLead.message || '(No message text provided — lead magnet download request)'}
                </div>
              </div>

              {/* Pipeline Controls */}
              <div className="grid gap-3 sm:grid-cols-2 border-t border-zinc-800 pt-5">
                <div>
                  <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Pipeline Stage
                  </label>
                  <select
                    value={selectedLead.status}
                    disabled={savingLead}
                    onChange={(e) =>
                      void handlePatchLead(selectedLead.id, {
                        status: e.target.value as LeadStatus,
                      })
                    }
                    className="min-h-[42px] w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 text-xs font-semibold text-white focus:border-[#d8ff38] focus:outline-none"
                  >
                    {LEAD_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Lead Priority
                  </label>
                  <select
                    value={selectedLead.priority}
                    disabled={savingLead}
                    onChange={(e) =>
                      void handlePatchLead(selectedLead.id, {
                        priority: e.target.value as LeadPriority,
                      })
                    }
                    className="min-h-[42px] w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 text-xs font-semibold text-white focus:border-[#d8ff38] focus:outline-none"
                  >
                    {LEAD_PRIORITIES.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Internal Notes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Internal CRM Notes
                  </label>
                  {selectedLead.contactedAt && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                      Contacted {new Date(selectedLead.contactedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <textarea
                  rows={3}
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  placeholder="Add call notes, follow-up dates, pricing context, or next steps…"
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 p-3.5 text-xs leading-relaxed text-zinc-100 placeholder:text-zinc-500 focus:border-[#d8ff38] focus:outline-none"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={savingLead}
                    onClick={() =>
                      void handlePatchLead(selectedLead.id, {
                        adminNotes: notesDraft,
                      })
                    }
                    className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-zinc-100 px-4 py-1.5 text-xs font-bold text-zinc-950 hover:bg-white disabled:opacity-50 cursor-pointer"
                  >
                    <Save className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Save Notes</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

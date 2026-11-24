import React, { useCallback, useEffect, useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  ExternalLink,
  History,
  Inbox,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  PenSquare,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import type {
  AdminOverviewStatsDto,
  AdminSessionUser,
} from '../shared/cmsContracts';
import { cmsApiClient } from '../services/cmsApiClient';
import { AdminLoginGate } from './AdminLoginGate';
import { AdminBlogPanel } from './AdminBlogPanel';
import { AdminLeadsPanel } from './AdminLeadsPanel';

type AdminTab = 'overview' | 'blog' | 'leads' | 'audit';

export const AdminDashboardApp: React.FC = () => {
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<AdminSessionUser | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [overview, setOverview] = useState<AdminOverviewStatsDto | null>(null);
  const [loadingOverview, setLoadingOverview] = useState(false);
  const [startNewArticle, setStartNewArticle] = useState(false);

  useEffect(() => {
    document.title = 'Admin Studio — GPTX.VIP';
    cmsApiClient
      .getAuthMe()
      .then((res) => {
        setUser(res.authenticated ? res.user : null);
      })
      .catch(() => setUser(null))
      .finally(() => setAuthLoading(false));
  }, []);

  const refreshOverview = useCallback(async () => {
    setLoadingOverview(true);
    try {
      const data = await cmsApiClient.getAdminOverview();
      setOverview(data);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to load dashboard overview'
      );
    } finally {
      setLoadingOverview(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      void refreshOverview();
    }
  }, [user, refreshOverview]);

  const handleLogout = async () => {
    await cmsApiClient.logoutAdmin();
    setUser(null);
    setOverview(null);
    toast.success('Signed out of Admin Studio');
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090b] text-zinc-400 gap-2 text-sm">
        <Loader2 className="h-4 w-4 animate-spin text-[#d8ff38]" />
        <span>Checking admin session…</span>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Toaster position="top-center" />
        <AdminLoginGate
          onAuthenticated={(loggedInUser) => {
            setUser(loggedInUser);
            toast.success(`Welcome back, ${loggedInUser.displayName}`);
          }}
        />
      </>
    );
  }

  const navItems: {
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    {
      id: 'blog',
      label: 'Blog & Articles',
      icon: BookOpen,
      badge: overview?.blog.total,
    },
    {
      id: 'leads',
      label: 'Contact Leads',
      icon: Inbox,
      badge: overview?.leads.newCount,
    },
    { id: 'audit', label: 'Audit Log', icon: History },
  ];

  return (
    <div className="premium-surface min-h-screen bg-[#09090b] text-zinc-100">
      <Toaster position="top-center" />

      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-800/90 bg-[#09090b]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen((v) => !v)}
              aria-label="Toggle admin navigation"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-200 lg:hidden cursor-pointer"
            >
              {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>

            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#d8ff38] text-[#101014]">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <div className="font-display text-sm font-bold leading-none text-white">
                  GPTX.VIP Admin
                </div>
                <div className="mt-1 font-mono text-[10px] text-zinc-400">
                  {user.email}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('blog');
                setStartNewArticle(true);
              }}
              className="hidden sm:inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-[#d8ff38] px-3.5 py-1.5 text-xs font-bold text-[#101014] hover:bg-[#c6f028] active:scale-[0.96] cursor-pointer"
            >
              <PenSquare className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Write Article</span>
            </button>

            <a
              href="/blog"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:border-zinc-700 hover:text-white"
            >
              <span>/blog</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>

            <a
              href="/"
              className="hidden md:inline-flex min-h-[38px] items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:border-zinc-700 hover:text-white"
            >
              <span>Website</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>

            <button
              type="button"
              onClick={() => void handleLogout()}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-400 hover:border-rose-500/40 hover:text-rose-300 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row">
        {/* Sidebar */}
        <aside
          className={`${
            mobileNavOpen ? 'block' : 'hidden'
          } lg:block shrink-0 ${
            sidebarCollapsed ? 'lg:w-[74px]' : 'lg:w-64'
          } transition-[width] duration-200`}
        >
          <div className="sticky top-22 rounded-3xl border border-zinc-800 bg-zinc-950 p-3 space-y-2">
            <div className="flex items-center justify-between px-2 pb-2 border-b border-zinc-800/80">
              {!sidebarCollapsed && (
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">
                  Workspace
                </span>
              )}
              <button
                type="button"
                onClick={() => setSidebarCollapsed((c) => !c)}
                aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                className="hidden lg:inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-white cursor-pointer mx-auto lg:mx-0"
              >
                {sidebarCollapsed ? (
                  <PanelLeftOpen className="h-4 w-4" />
                ) : (
                  <PanelLeftClose className="h-4 w-4" />
                )}
              </button>
            </div>

            <nav className="space-y-1" aria-label="Admin sections">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileNavOpen(false);
                    }}
                    className={`flex min-h-[42px] w-full items-center justify-between gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#d8ff38] text-[#101014] font-bold'
                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <Icon className="h-4 w-4 shrink-0" />
                      {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </span>
                    {!sidebarCollapsed &&
                      typeof item.badge === 'number' &&
                      item.badge > 0 && (
                        <span
                          className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold tabular-nums ${
                            active
                              ? 'bg-[#101014]/15 text-[#101014]'
                              : item.id === 'leads'
                                ? 'bg-sky-500/20 text-sky-300'
                                : 'bg-zinc-800 text-zinc-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Active Panel */}
        <main className="min-w-0 flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Hero Welcome */}
              <div className="flex flex-col gap-4 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#d8ff38]">
                    Cloudflare Workers · D1 · R2
                  </div>
                  <h1 className="mt-1 font-display text-2xl font-bold text-white">
                    Command Center
                  </h1>
                  <p className="mt-1 text-xs text-zinc-400">
                    Publish Medium-grade articles to <code className="text-zinc-200">/blog</code> and manage incoming website lead inquiries in one place.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('blog');
                      setStartNewArticle(true);
                    }}
                    className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#d8ff38] px-4 py-2 text-xs font-bold text-[#101014] hover:bg-[#c6f028] cursor-pointer"
                  >
                    <PenSquare className="h-3.5 w-3.5" />
                    <span>Write Article</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('leads')}
                    className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-100 hover:border-zinc-700 cursor-pointer"
                  >
                    <Inbox className="h-3.5 w-3.5" />
                    <span>Review Leads</span>
                  </button>
                </div>
              </div>

              {/* KPI Bento Row */}
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <KpiCard
                  label="Published Articles"
                  value={overview?.blog.published ?? 0}
                  sub={`${overview?.blog.drafts ?? 0} drafts waiting`}
                  accent="text-emerald-400"
                />
                <KpiCard
                  label="New Unread Leads"
                  value={overview?.leads.newCount ?? 0}
                  sub={`${overview?.leads.last7Days ?? 0} submitted in last 7d`}
                  accent="text-sky-400"
                />
                <KpiCard
                  label="Total Leads Captured"
                  value={overview?.leads.total ?? 0}
                  sub={`${overview?.leads.qualifiedCount ?? 0} qualified / proposal`}
                  accent="text-[#d8ff38]"
                />
                <KpiCard
                  label="Won Deals"
                  value={overview?.leads.wonCount ?? 0}
                  sub={`${overview?.leads.contactedCount ?? 0} contacted`}
                  accent="text-violet-400"
                />
              </div>

              {/* Recent Leads & Recent Articles Split */}
              <div className="grid gap-6 lg:grid-cols-2">
                <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-base font-bold text-white">
                      Latest Contact Leads
                    </h2>
                    <button
                      type="button"
                      onClick={() => setActiveTab('leads')}
                      className="text-xs font-semibold text-[#d8ff38] hover:underline cursor-pointer"
                    >
                      Open inbox →
                    </button>
                  </div>

                  {loadingOverview && !overview ? (
                    <div className="py-8 text-center text-xs text-zinc-500">Loading…</div>
                  ) : (overview?.recentLeads.length ?? 0) === 0 ? (
                    <p className="py-8 text-center text-xs text-zinc-500">
                      No submissions yet. Test the Contact page to see leads arrive here!
                    </p>
                  ) : (
                    <div className="space-y-2.5">
                      {overview?.recentLeads.map((lead) => (
                        <button
                          key={lead.id}
                          type="button"
                          onClick={() => setActiveTab('leads')}
                          className="flex w-full items-start justify-between gap-3 rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-3.5 text-left hover:border-zinc-700 cursor-pointer"
                        >
                          <div className="min-w-0">
                            <div className="truncate text-xs font-bold text-white">
                              {lead.name}{' '}
                              <span className="font-mono font-normal text-zinc-400">
                                ({lead.email})
                              </span>
                            </div>
                            <div className="mt-0.5 truncate text-xs text-zinc-400">
                              {lead.subject}
                            </div>
                          </div>
                          <span className="shrink-0 rounded-full bg-zinc-800 px-2 py-0.5 font-mono text-[10px] uppercase text-zinc-300">
                            {lead.status}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </section>

                <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-base font-bold text-white">
                      Recent Blog Articles
                    </h2>
                    <button
                      type="button"
                      onClick={() => setActiveTab('blog')}
                      className="text-xs font-semibold text-[#d8ff38] hover:underline cursor-pointer"
                    >
                      Manage all →
                    </button>
                  </div>

                  {(overview?.recentPosts.length ?? 0) === 0 ? (
                    <p className="py-8 text-center text-xs text-zinc-500">
                      No articles yet. Click Write Article to start publishing on /blog.
                    </p>
                  ) : (
                    <div className="space-y-2.5">
                      {overview?.recentPosts.map((post) => (
                        <button
                          key={post.id}
                          type="button"
                          onClick={() => setActiveTab('blog')}
                          className="flex w-full items-start justify-between gap-3 rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-3.5 text-left hover:border-zinc-700 cursor-pointer"
                        >
                          <div className="min-w-0">
                            <div className="truncate text-xs font-bold text-white">
                              {post.title}
                            </div>
                            <div className="mt-0.5 truncate font-mono text-[11px] text-zinc-500">
                              /blog/{post.slug} · {post.readingTimeMinutes} min read
                            </div>
                          </div>
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase ${
                              post.status === 'published'
                                ? 'bg-emerald-500/15 text-emerald-300'
                                : 'bg-amber-500/15 text-amber-300'
                            }`}
                          >
                            {post.status}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            </div>
          )}

          {activeTab === 'blog' && (
            <AdminBlogPanel
              defaultAuthorName={user.displayName}
              startCreating={startNewArticle}
              onCreatedHandled={() => setStartNewArticle(false)}
              onArticlesChanged={() => void refreshOverview()}
            />
          )}

          {activeTab === 'leads' && (
            <AdminLeadsPanel onLeadsChanged={() => void refreshOverview()} />
          )}

          {activeTab === 'audit' && (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#d8ff38]" />
                <h2 className="font-display text-lg font-bold text-white">
                  Recent Admin Audit Trail
                </h2>
              </div>

              {(overview?.recentAuditLogs.length ?? 0) === 0 ? (
                <p className="py-10 text-center text-xs text-zinc-500">
                  No audit events recorded yet.
                </p>
              ) : (
                <div className="divide-y divide-zinc-800/80">
                  {overview?.recentAuditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between text-xs"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-zinc-900 px-2 py-0.5 font-mono text-[11px] font-bold text-[#d8ff38]">
                          {log.action}
                        </span>
                        <span className="text-zinc-300">{log.adminEmail}</span>
                        <span className="font-mono text-[11px] text-zinc-500">
                          {log.resourceType}
                          {log.resourceId ? `:${log.resourceId.slice(0, 8)}` : ''}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-zinc-500 tabular-nums">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const KpiCard: React.FC<{
  label: string;
  value: number;
  sub: string;
  accent: string;
}> = ({ label, value, sub, accent }) => (
  <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
    <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">
      {label}
    </div>
    <div className={`mt-2 font-display text-3xl font-extrabold tabular-nums ${accent}`}>
      {value}
    </div>
    <div className="mt-1 text-xs text-zinc-500">{sub}</div>
  </div>
);

export default AdminDashboardApp;

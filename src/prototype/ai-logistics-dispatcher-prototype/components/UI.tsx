import type { LucideIcon } from 'lucide-react';

export function Badge({ value }: { value: string }) {
  return <span className={`badge badge-${value.toLowerCase().replace(/ /g, '_')}`}>{value.replace(/_/g, ' ')}</span>;
}

export function MetricCard({ label, value, icon: Icon, tone = 'blue' }: { label: string; value: string | number; icon: LucideIcon; tone?: 'blue' | 'green' | 'orange' }) {
  return <section className="metric-card"><div className="metric-top"><span className={`metric-icon ${tone}`}><Icon size={20} /></span><span className="metric-label">{label}</span></div><strong>{value}</strong></section>;
}

export function formatTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

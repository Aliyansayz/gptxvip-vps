import type { LucideIcon } from 'lucide-react';
import { Sparkline } from '../../shared/controls';

export function Badge({ value }: { value: string }) {
  return <span className={`badge badge-${value.toLowerCase().replace(/ /g, '_')}`}>{value.replace(/_/g, ' ')}</span>;
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  tone = 'blue',
  sparkline = [12, 18, 15, 24, 20, 28],
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: 'blue' | 'green' | 'orange';
  sparkline?: number[];
}) {
  const color = tone === 'green' ? '#10b981' : tone === 'orange' ? '#f59e0b' : '#3b82f6';
  return (
    <section className="metric-card">
      <div className="metric-top">
        <span className={`metric-icon ${tone}`}><Icon size={18} /></span>
        <span className="metric-label">{label}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '6px' }}>
        <strong style={{ fontSize: '24px', letterSpacing: '-0.5px', color: '#182b46' }}>{value}</strong>
        <Sparkline data={sparkline} color={color} width={60} height={24} />
      </div>
    </section>
  );
}

export function formatTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

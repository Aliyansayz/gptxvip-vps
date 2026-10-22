import { useEffect, useState, type CSSProperties } from 'react';
import { AlertTriangle, ClipboardList, LayoutDashboard, Map, Route, Settings, Truck, Users, Plus, ArrowLeft } from 'lucide-react';
import { SystemButton, TextField, tokenStyles } from '../../components/designSystem';
import { Badge, MetricCard, formatTime } from './components/UI';
import { MapCanvas } from './components/MapCanvas';
import { assignJob, createJob, decideRecommendation, getBootstrap, resetDemoData, updateException, updateJobStatus } from './lib/api';
import type { BootstrapData, DeliveryJob } from './types';
import './styles.css';

const navigation = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'jobs', label: 'Dispatch board', icon: ClipboardList },
  { id: 'routes', label: 'Route planner', icon: Map },
  { id: 'drivers', label: 'Drivers', icon: Users },
  { id: 'fleet', label: 'Fleet', icon: Truck },
  { id: 'exceptions', label: 'Exceptions', icon: AlertTriangle },
  { id: 'settings', label: 'Approvals & settings', icon: Settings },
] as const;
type Page = typeof navigation[number]['id'];

export default function LogisticsPrototype() {
  const [data, setData] = useState<BootstrapData | null>(null);
  const [page, setPage] = useState<Page>('dashboard');
  const [query, setQuery] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    getBootstrap().then(snapshot => { if (active) setData(snapshot); })
      .catch(reason => { if (active) setError(String(reason)); });
    return () => { active = false; };
  }, []);

  async function perform(action: () => Promise<unknown>): Promise<boolean> {
    setBusy(true);
    setError('');
    try {
      await action();
      setData(await getBootstrap());
      return true;
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to update demo data.');
      return false;
    } finally { setBusy(false); }
  }

  const handleExit = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.assign('/templates');
    }
  };

  if (!data) return <div className="logistics-prototype boot-screen" role={error ? 'alert' : 'status'}>{error || 'Preparing your local prototype…'}</div>;
  const jobs = data.jobs.filter(job => `${job.reference} ${job.customer} ${job.region}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="logistics-prototype" style={{ ...tokenStyles, "--ds-canvas": "#ffffff", "--ds-text": "#182b46", "--ds-raised": "#f1f5f9", "--ds-borderStrong": "#cbd5e1", "--ds-border": "#e2e8f0" } as CSSProperties}>
      <div className="app-shell">
        <aside className="sidebar">
          <div className="brand-lockup"><span className="brand-mark"><Route size={20} /></span><span className="brand-wordmark"><strong>dispatch<span>os</span></strong><small>LOGISTICS CONTROL</small></span></div>
          <nav className="primary-nav" aria-label="Logistics navigation">
            {navigation.map(item => <button key={item.id} className={`nav-item${page === item.id ? ' active' : ''}`} aria-label={item.label} aria-current={page === item.id ? 'page' : undefined} onClick={() => setPage(item.id)}><item.icon size={18} /><span>{item.label}</span></button>)}
          </nav>
          <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
            <button
              type="button"
              onClick={handleExit}
              className="nav-item"
              style={{ width: '100%', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              title="Exit to surfaces showcase"
            >
              <ArrowLeft size={16} />
              <span>Exit to Surfaces</span>
            </button>
          </div>
        </aside>
        <main className="main-panel">
          <header className="topbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <strong>Northstar Logistics</strong>
              <span className="prototype-status">Demo · saved in this browser</span>
            </div>
            <button
              type="button"
              onClick={handleExit}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#182b46',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                transition: 'all 0.15s ease'
              }}
              title="Exit prototype and return to templates"
            >
              <ArrowLeft size={14} />
              <span>Exit Dashboard</span>
            </button>
          </header>
          <div className="page-content">
            <div className="page-heading"><div><span className="page-overline">LOCAL PROTOTYPE</span><h1>{navigation.find(item => item.id === page)?.label}</h1><p>Coordinate deliveries, fleet readiness and agent approvals.</p></div><SystemButton onClick={() => setCreating(true)}><Plus size={16} /> New delivery</SystemButton></div>
            {error && <p className="inline-error" role="alert">{error}</p>}
            <fieldset disabled={busy} className="prototype-workspace" aria-busy={busy}>
              {page === 'dashboard' && <>
                <div className="metric-grid">
                  <MetricCard label="Active deliveries" value={data.metrics.activeJobs} icon={ClipboardList} sparkline={[14, 20, 18, 26, 24, 30]} />
                  <MetricCard label="Available drivers" value={data.metrics.availableDrivers} icon={Users} tone="green" sparkline={[8, 12, 10, 15, 14, 18]} />
                  <MetricCard label="At risk" value={data.metrics.atRisk} icon={AlertTriangle} tone="orange" sparkline={[5, 7, 6, 8, 4, 3]} />
                  <MetricCard label="On-time rate" value={`${data.metrics.onTimeRate}%`} icon={Truck} sparkline={[92, 94, 91, 95, 96, 97.4]} />
                </div>
                <div className="prototype-columns"><section className="card"><h2>Delivery network</h2><MapCanvas stops={data.routes.flatMap(route => route.stops)} /></section><section className="card"><h2>Agent recommendations</h2><Recommendations data={data} perform={perform} /></section></div>
                <JobTable jobs={jobs.slice(0, 6)} data={data} perform={perform} />
              </>}
              {page === 'jobs' && <><TextField label="Search deliveries" placeholder="Reference, customer or region" value={query} onChange={event => setQuery(event.target.value)} /><JobTable jobs={jobs} data={data} perform={perform} /></>}
              {page === 'routes' && data.routes.map(route => <section className="card prototype-section" key={route.id}><h2>{route.name}</h2><p>{route.driverName} · {route.distanceKm} km · {route.stops.length} stops</p><MapCanvas stops={route.stops} /><ol>{route.stops.map(stop => <li key={stop.id}>{stop.customer} · {stop.address} · {formatTime(stop.eta)}</li>)}</ol></section>)}
              {page === 'drivers' && <div className="prototype-columns">{data.drivers.map(driver => <section key={driver.id} className="card prototype-section"><h2>{driver.name}</h2><Badge value={driver.status} /><p>{driver.region} · {driver.jobs} jobs · Shift ends {driver.shiftEnd}</p><p>{driver.skills.join(', ')}</p></section>)}</div>}
              {page === 'fleet' && <div className="prototype-columns">{data.vehicles.map(vehicle => <section key={vehicle.id} className="card prototype-section"><h2>{vehicle.registration}</h2><Badge value={vehicle.status} /><p>{vehicle.type} · {vehicle.depot}</p><p>{vehicle.weightCapacity} kg capacity · {vehicle.maintenance}</p></section>)}</div>}
              {page === 'exceptions' && data.exceptions.map(exception => <section className="card prototype-section" key={exception.id}><h2>{exception.reference} · {exception.type}</h2><Badge value={exception.status} /><p>{exception.description}</p>{exception.status !== 'resolved' && <SystemButton size="sm" onClick={() => void perform(() => updateException(exception.id, 'resolved', 'Reviewed in prototype workspace'))}>Resolve exception</SystemButton>}{exception.resolutionNote && <p>{exception.resolutionNote}</p>}</section>)}
              {page === 'settings' && <><section className="card prototype-section"><h2>Agent approvals</h2><Recommendations data={data} perform={perform} /></section><section className="card prototype-section"><h2>Demo data</h2><p>Deliveries and changes stay in this browser. Routes and agent actions use sample data.</p><SystemButton variant="secondary" onClick={() => { if (window.confirm('Restore sample deliveries and clear saved proof media?')) void perform(resetDemoData); }}>Reset demo data</SystemButton></section><section className="card prototype-section"><h2>Recent activity</h2>{data.audit.slice(0, 10).map(item => <p key={item.id}>{item.summary} · {formatTime(item.createdAt)}</p>)}</section></>}
            </fieldset>
          </div>
        </main>
      </div>
      {creating && <DeliveryForm busy={busy} onClose={() => setCreating(false)} onSubmit={async body => { if (await perform(() => createJob(body))) setCreating(false); }} error={error} />}
    </div>
  );
}

type Action = (action: () => Promise<unknown>) => Promise<boolean>;
function Recommendations({ data, perform }: { data: BootstrapData; perform: Action }) {
  const pending = data.recommendations.filter(item => item.status === 'pending');
  return pending.length ? pending.map(item => <div key={item.id} className="prototype-recommendation"><h3>{item.title}</h3><p>{item.detail}</p><p>{item.impact}</p><div className="detail-actions"><SystemButton size="sm" onClick={() => void perform(() => decideRecommendation(item.id, 'approved'))}>Approve</SystemButton><SystemButton size="sm" variant="secondary" onClick={() => void perform(() => decideRecommendation(item.id, 'rejected'))}>Reject</SystemButton></div></div>) : <p>No pending recommendations.</p>;
}

function JobTable({ jobs, data, perform }: { jobs: DeliveryJob[]; data: BootstrapData; perform: Action }) {
  return <section className="card prototype-section"><h2>Delivery jobs</h2><div className="table-wrap"><table className="data-table"><thead><tr><th>Reference</th><th>Customer</th><th>Region</th><th>Status</th><th>ETA</th><th>Driver / action</th></tr></thead><tbody>{jobs.map(job => <tr key={job.id}><td>{job.reference}</td><td>{job.customer}</td><td>{job.region}</td><td><Badge value={job.status} /></td><td>{formatTime(job.eta)}</td><td>{job.driverName || 'Unassigned'}{!['delivered', 'cancelled'].includes(job.status) && <select aria-label={`Assign driver for ${job.reference}`} value="" onChange={event => { const driverId = event.target.value; if (driverId) void perform(() => assignJob(job.id, driverId)); }}><option value="">Assign driver…</option>{data.drivers.filter(driver => driver.id !== job.driverId).map(driver => <option value={driver.id} key={driver.id}>{driver.name}</option>)}</select>}{job.status === 'assigned' && <SystemButton size="sm" onClick={() => void perform(() => updateJobStatus(job.id, 'en_route'))}>Start delivery</SystemButton>}</td></tr>)}</tbody></table>{!jobs.length && <p>No deliveries match your search.</p>}</div></section>;
}

function DeliveryForm({ onSubmit, onClose, busy, error }: { onSubmit: (body: Partial<DeliveryJob>) => Promise<void>; onClose: () => void; busy: boolean; error: string }) {
  return <div className="modal-backdrop"><section className="modal prototype-section" role="dialog" aria-modal="true" aria-labelledby="delivery-heading"><h2 id="delivery-heading">New delivery</h2><form onSubmit={event => { event.preventDefault(); const fields = new FormData(event.currentTarget); void onSubmit(Object.fromEntries(fields) as Partial<DeliveryJob>); }}><div className="prototype-form">{[['customer', 'Customer'], ['pickup', 'Pickup address'], ['dropoff', 'Drop-off address'], ['region', 'Region']].map(([name, label]) => <TextField key={name} name={name} label={label} required autoFocus={name === 'customer'} />)}<TextField name="windowStart" label="Window starts" type="datetime-local" required /><TextField name="windowEnd" label="Window ends" type="datetime-local" required /></div>{error && <p role="alert">{error}</p>}<div className="detail-actions"><SystemButton type="submit" loading={busy}>Create delivery</SystemButton><SystemButton variant="secondary" disabled={busy} onClick={onClose}>Cancel</SystemButton></div></form></section></div>;
}

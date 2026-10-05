import type { AnalyticsData, AuditRecord, BootstrapData, DeliveryJob, DispatchException, DispatchRoute, Driver, JobStatus, NotificationRecord, Priority, Recommendation, Role, RouteStop, SessionUser, Severity, Vehicle } from '../types';

const STORAGE_KEY = 'dispatchos-prototype:state:v1';
const MEDIA_DB = 'dispatchos-prototype-media-v1';
const MEDIA_STORE = 'proof';
const now = () => new Date().toISOString();
const shiftMinutes = (minutes: number) => new Date(Date.now() + minutes * 60_000).toISOString();
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(status: number, message: string, details?: unknown) { super(message); this.status = status; this.details = details; }
}

type JobEvent = { id: string; eventType: string; source: string; details: Record<string, unknown>; createdAt: string };
type EtaChange = { previousEta: string; nextEta: string; source: string; actorId?: string; createdAt: string };
type Assignment = { driverId: string; vehicleId: string; createdAt: string };
type StoredProof = { recipient: string; note: string; deliveredAt: string; collectionAmount: number; photoAvailable: boolean; signatureAvailable: boolean };
type PrototypeStore = {
  version: 1;
  bootstrap: BootstrapData;
  jobRoutes: Record<string, string>;
  events: Record<string, JobEvent[]>;
  etaHistory: Record<string, EtaChange[]>;
  assignments: Record<string, Assignment[]>;
  proofs: Record<string, StoredProof>;
};
type PodMedia = { photoDataUrl?: string; signatureDataUrl?: string };
export type JobDetail = { job: DeliveryJob; events: JobEvent[]; etaHistory: EtaChange[]; proof?: StoredProof & PodMedia; assignments: Assignment[] };
let memoryStore: PrototypeStore | null = null;

const initialMetrics: BootstrapData['metrics'] = { activeJobs: 0, availableDrivers: 0, atRisk: 0, late: 0, completedToday: 0, onTimeRate: 0, averageDelay: 0, utilization: 0 };
const regions = ['North', 'North', 'East', 'Central', 'South', 'East', 'Central', 'South', 'North', 'East', 'South', 'Central'];
const addresses = ['21 King Street', '88 Lake Avenue', '14 Cedar Lane', '53 Market Road', '120 Harbor Way', '7 Summit Plaza', '39 Willow Drive', '62 Pine Street', '91 Atlas Court', '4 Orchard Road', '75 River Walk', '18 Union Square'];
const customers = ['Northstar Market', 'Bluebird Pharmacy', 'Cedar & Co.', 'Evergreen Foods', 'Metro Office', 'Harbor Supply', 'Brighton Clinic', 'Oak & Iron', 'Summit Retail', 'Willow Grocer', 'Pine Street Books', 'Atlas Workshop'];
const statuses: JobStatus[] = ['en_route', 'assigned', 'delayed', 'assigned', 'unassigned', 'delayed', 'unassigned', 'delivered', 'assigned', 'failed_attempt', 'unassigned', 'delivered'];
const priorities: Priority[] = ['urgent', 'high', 'high', 'normal', 'normal', 'urgent', 'low', 'normal', 'high', 'high', 'normal', 'normal'];
const driverIds: Array<string | undefined> = ['drv-001', 'drv-001', 'drv-004', 'drv-002', undefined, 'drv-004', undefined, 'drv-003', 'drv-005', 'drv-001', undefined, 'drv-002'];
const driverSpecs: Driver[] = [
  { id: 'drv-001', name: 'Alex Rivera', initials: 'AR', status: 'en_route', region: 'North', skills: ['Fragile', 'Express'], shiftEnd: '17:30', jobs: 3, capacity: 82, phone: '+1 555 0101', vehicleId: 'veh-001', currentRouteId: 'rt-001' },
  { id: 'drv-002', name: 'Maria Santos', initials: 'MS', status: 'available', region: 'North', skills: ['Standard', 'Cold chain'], shiftEnd: '18:00', jobs: 1, capacity: 46, phone: '+1 555 0102', vehicleId: 'veh-002' },
  { id: 'drv-003', name: 'James Wilson', initials: 'JW', status: 'available', region: 'East', skills: ['Heavy', 'Standard'], shiftEnd: '19:00', jobs: 0, capacity: 18, phone: '+1 555 0103', vehicleId: 'veh-003' },
  { id: 'drv-004', name: 'Priya Kapoor', initials: 'PK', status: 'at_risk', region: 'Central', skills: ['Express', 'Fragile'], shiftEnd: '16:45', jobs: 4, capacity: 91, phone: '+1 555 0104', vehicleId: 'veh-004', currentRouteId: 'rt-002' },
  { id: 'drv-005', name: 'Daniel Brooks', initials: 'DB', status: 'available', region: 'South', skills: ['Standard'], shiftEnd: '18:30', jobs: 2, capacity: 62, phone: '+1 555 0105', vehicleId: 'veh-005' },
];
const vehicleSpecs: Vehicle[] = [
  { id: 'veh-001', registration: 'AB12 CDE', type: 'Van (L)', weightCapacity: 1500, volumeCapacity: 12, fuel: 'Diesel', status: 'On route', maintenance: 'Good', depot: 'North Hub', driverId: 'drv-001' },
  { id: 'veh-002', registration: 'GH34 IJK', type: 'Van (M)', weightCapacity: 900, volumeCapacity: 8, fuel: 'Electric', status: 'Available', maintenance: 'Good', depot: 'North Hub', driverId: 'drv-002' },
  { id: 'veh-003', registration: 'LM56 NOP', type: 'Truck (M)', weightCapacity: 4200, volumeCapacity: 27, fuel: 'Diesel', status: 'Available', maintenance: 'Service due', depot: 'East Depot', driverId: 'drv-003' },
  { id: 'veh-004', registration: 'QR78 STU', type: 'Van (L)', weightCapacity: 1500, volumeCapacity: 12, fuel: 'Hybrid', status: 'On route', maintenance: 'Good', depot: 'Central Hub', driverId: 'drv-004' },
  { id: 'veh-005', registration: 'VW90 XYZ', type: 'Reefer Van', weightCapacity: 1100, volumeCapacity: 10, fuel: 'Diesel', status: 'Available', maintenance: 'Good', depot: 'South Depot', driverId: 'drv-005' },
];

function makeSeed(): PrototypeStore {
  const user: SessionUser = { id: 'usr-prototype', name: 'Alex Morgan', email: 'prototype@dispatch.local', role: 'admin', driverId: 'drv-001' };
  const vehicles = clone(vehicleSpecs);
  const drivers = clone(driverSpecs);
  const jobs: DeliveryJob[] = customers.map((customer, index) => {
    const status = statuses[index]!;
    const driverId = driverIds[index];
    const closed = status === 'delivered' || status === 'failed_attempt';
    const start = shiftMinutes(closed ? -125 + index * 3 : 15 + index * 4);
    const end = shiftMinutes(closed ? -85 + index * 5 : 55 + index * 5);
    const eta = shiftMinutes(status === 'delayed' ? 22 + index : 12 + index * 2);
    const driver = drivers.find((item) => item.id === driverId);
    const vehicleId = driver?.vehicleId;
    return {
      id: `job-${String(index + 1).padStart(3, '0')}`, reference: `D-${118 + index}`, customer,
      contact: `${['Jamie', 'Robin', 'Charlie', 'Drew'][index % 4]} ${['R.', 'M.', 'K.', 'T.'][index % 4]}`,
      phone: `+1 555 02${String(index).padStart(2, '0')}`, pickup: 'North Hub, 10 Depot Road', dropoff: addresses[index]!, region: regions[index]!, status,
      priority: priorities[index]!, serviceType: index % 4 === 0 ? 'Express' : 'Standard', windowStart: start, windowEnd: end, eta,
      ...(driverId ? { driverId, driverName: driver?.name } : {}), ...(vehicleId ? { vehicleId, vehicleName: vehicles.find((item) => item.id === vehicleId)?.registration } : {}),
      weight: 3 + (index % 4) * 2, volume: Number((0.08 + (index % 3) * 0.04).toFixed(2)), instructions: index % 3 === 0 ? 'Call on arrival' : '',
      updatedAt: shiftMinutes(index), latitude: 40.71 + index * 0.011, longitude: -74.01 + index * 0.014,
    };
  });
  const routes: DispatchRoute[] = [
    { id: 'rt-001', name: 'North · Morning run', driverId: 'drv-001', driverName: 'Alex Rivera', vehicleId: 'veh-001', vehicleName: 'AB12 CDE', status: 'in_progress', region: 'North', distanceKm: 28.4, etaEnd: shiftMinutes(68), stops: [] },
    { id: 'rt-002', name: 'Central · Express loop', driverId: 'drv-004', driverName: 'Priya Kapoor', vehicleId: 'veh-004', vehicleName: 'QR78 STU', status: 'at_risk', region: 'Central', distanceKm: 36.8, etaEnd: shiftMinutes(103), stops: [] },
    { id: 'rt-003', name: 'East · Afternoon run', driverId: 'drv-003', driverName: 'James Wilson', vehicleId: 'veh-003', vehicleName: 'LM56 NOP', status: 'planned', region: 'East', distanceKm: 22.2, etaEnd: shiftMinutes(140), stops: [] },
  ];
  const jobRoutes: Record<string, string> = { 'job-001': 'rt-001', 'job-002': 'rt-001', 'job-010': 'rt-001', 'job-003': 'rt-002', 'job-006': 'rt-002' };
  const stopSpecs: Array<[string, string[]]> = [['rt-001', ['job-001', 'job-002', 'job-010']], ['rt-002', ['job-003', 'job-006']], ['rt-003', ['job-008', 'job-011']]];
  for (const [routeId, ids] of stopSpecs) {
    const route = routes.find((item) => item.id === routeId)!;
    for (const [jobIndex, jobId] of ids.entries()) {
      const job = jobs.find((item) => item.id === jobId)!;
      const sequence = route.stops.length + 1;
      route.stops.push(
        { id: `seed-${routeId}-${jobId}-pickup`, jobId, reference: job.reference, customer: job.customer, address: job.pickup, region: job.region, kind: 'pickup', sequence, status: 'completed', eta: shiftMinutes(-48 + jobIndex * 10), latitude: 40.71, longitude: -74.01 },
        { id: `seed-${routeId}-${jobId}-dropoff`, jobId, reference: job.reference, customer: job.customer, address: job.dropoff, region: job.region, kind: 'dropoff', sequence: sequence + 1, status: jobIndex === 0 ? 'completed' : jobIndex === 1 ? 'next' : 'upcoming', eta: shiftMinutes(8 - jobIndex * 22), latitude: job.latitude, longitude: job.longitude },
      );
    }
  }
  const exceptions: DispatchException[] = [
    { id: 'exc-001', jobId: 'job-003', reference: 'D-120', customer: 'Cedar & Co.', type: 'traffic_disruption', severity: 'high', status: 'open', description: 'Road closure on the planned corridor adds an estimated 22 minutes.', reportedAt: shiftMinutes(-8), owner: 'Dispatch Supervisor' },
    { id: 'exc-002', jobId: 'job-006', reference: 'D-123', customer: 'Harbor Supply', type: 'delay_risk', severity: 'medium', status: 'open', description: 'The driver is running behind the promised delivery window.', reportedAt: shiftMinutes(-23), owner: 'Dispatcher' },
    { id: 'exc-003', jobId: 'job-010', reference: 'D-127', customer: 'Willow Grocer', type: 'failed_attempt', severity: 'medium', status: 'open', description: 'Customer was unavailable at the delivery address.', reportedAt: shiftMinutes(-42), owner: 'Customer Service' },
  ];
  const recommendations: Recommendation[] = [
    { id: 'rec-001', jobId: 'job-003', reference: 'D-120', kind: 'reroute', title: 'Reroute Central loop via 8th Avenue', detail: 'Avoids the reported closure and protects the next two delivery windows.', impact: '+18 min recovered · +1.4 km', severity: 'high', status: 'pending', action: 'resequence', createdAt: shiftMinutes(-7) },
    { id: 'rec-002', jobId: 'job-006', reference: 'D-123', kind: 'reassign', title: 'Send a nearby available driver', detail: 'Daniel is 2.1 km away with compatible capacity and a clear shift window.', impact: 'ETA improves by 24 min', severity: 'medium', status: 'pending', action: 'reassign', createdAt: shiftMinutes(-16) },
  ];
  const notifications: NotificationRecord[] = [
    { id: 'ntf-001', jobId: 'job-001', reference: 'D-118', channel: 'SMS', trigger: 'ETA updated', recipient: '+1 555 0200', status: 'sent', sentAt: shiftMinutes(-5) },
    { id: 'ntf-002', jobId: 'job-008', reference: 'D-125', channel: 'Email', trigger: 'Delivery completed', recipient: 'contact@example.demo', status: 'sent', sentAt: shiftMinutes(-18) },
  ];
  const audit: AuditRecord[] = [{ id: 'seed-audit-init', actor: 'Alex Morgan', role: 'admin', action: 'system_initialized', entity: 'System', summary: 'Local demonstration workspace created', createdAt: shiftMinutes(-300) }];
  const assignments: Record<string, Assignment[]> = {};
  for (const job of jobs) if (job.driverId && jobRoutes[job.id]) assignments[job.id] = [{ driverId: job.driverId, vehicleId: job.vehicleId!, createdAt: shiftMinutes(-80) }];
  return {
    version: 1, jobRoutes, events: {
      'job-001': [{ id: 'seed-evt-001', eventType: 'driver_started_route', source: 'driver_app', details: { eta: '10:24' }, createdAt: shiftMinutes(-40) }],
      'job-003': [{ id: 'seed-evt-002', eventType: 'delay_risk_detected', source: 'agent', details: { minutes: 22 }, createdAt: shiftMinutes(-8) }],
    }, etaHistory: {}, assignments,
    proofs: {
      'job-008': { recipient: jobs[7]!.contact, note: 'Delivered to recipient at the front desk.', deliveredAt: shiftMinutes(-70), collectionAmount: 0, photoAvailable: false, signatureAvailable: false },
      'job-012': { recipient: jobs[11]!.contact, note: 'Delivered to recipient at the front desk.', deliveredAt: shiftMinutes(-9), collectionAmount: 0, photoAvailable: false, signatureAvailable: false },
    },
    bootstrap: {
      user, jobs, drivers, vehicles, routes, exceptions, recommendations, notifications, audit,
      agent: { mode: 'recommendation', automaticAllowlist: ['eta_refresh'] }, metrics: initialMetrics,
    },
  };
}

function readStore(): PrototypeStore {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PrototypeStore;
      if (parsed.version === 1 && parsed.bootstrap?.jobs && parsed.bootstrap?.routes) { memoryStore = parsed; return clone(parsed); }
    }
  } catch { /* Browser storage can be unavailable; keep a usable in-memory demo. */ }
  if (memoryStore) return clone(memoryStore);
  memoryStore = makeSeed();
  writeStore(memoryStore);
  return clone(memoryStore);
}

function writeStore(store: PrototypeStore) {
  memoryStore = clone(store);
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); } catch { /* Continue with this tab's in-memory prototype state. */ }
}

function changed<T>(action: (store: PrototypeStore) => T): T {
  const store = readStore();
  const result = action(store);
  writeStore(store);
  return clone(result);
}

function addAudit(store: PrototypeStore, action: string, entity: string, summary: string) {
  store.bootstrap.audit.unshift({ id: crypto.randomUUID(), actor: 'Alex Morgan', role: 'admin', action, entity, summary, createdAt: now() });
  store.bootstrap.audit = store.bootstrap.audit.slice(0, 50);
}

function addEvent(store: PrototypeStore, jobId: string, eventType: string, details: Record<string, unknown> = {}, source = 'dispatcher') {
  (store.events[jobId] ??= []).unshift({ id: crypto.randomUUID(), eventType, source, details, createdAt: now() });
}

function addNotification(store: PrototypeStore, job: DeliveryJob, trigger: string) {
  const recipient = job.phone || job.contact;
  store.bootstrap.notifications.unshift({ id: crypto.randomUUID(), jobId: job.id, reference: job.reference, channel: recipient.includes('@') ? 'Email' : 'SMS', trigger, recipient, status: 'queued', sentAt: now() });
  store.bootstrap.notifications = store.bootstrap.notifications.slice(0, 50);
}

function calculateMetrics(jobs: DeliveryJob[], drivers: Driver[], proofs: Record<string, StoredProof>): BootstrapData['metrics'] {
  const open = jobs.filter((job) => !['delivered', 'cancelled'].includes(job.status));
  const delivered = jobs.filter((job) => job.status === 'delivered');
  const completedToday = delivered.filter((job) => proofs[job.id]?.deliveredAt?.slice(0, 10) === new Date().toISOString().slice(0, 10)).length;
  const onTime = delivered.filter((job) => !proofs[job.id] || proofs[job.id]!.deliveredAt <= job.windowEnd).length;
  const delays = jobs.filter((job) => ['delayed', 'escalated'].includes(job.status)).map((job) => Math.max(10, Math.round((new Date(job.eta).getTime() - new Date(job.windowEnd).getTime()) / 60_000)));
  const activeDrivers = Math.max(1, drivers.length);
  return {
    activeJobs: open.length, availableDrivers: drivers.filter((driver) => driver.status === 'available').length,
    atRisk: jobs.filter((job) => ['delayed', 'escalated'].includes(job.status)).length,
    late: open.filter((job) => new Date(job.windowEnd).getTime() < Date.now()).length, completedToday,
    onTimeRate: delivered.length ? Math.round(onTime / delivered.length * 100) : 100,
    averageDelay: delays.length ? Math.round(delays.reduce((sum, item) => sum + item, 0) / delays.length) : 0,
    utilization: Math.min(100, Math.round(open.filter((job) => job.driverId).length / activeDrivers * 100)),
  };
}

function currentBootstrap(store = readStore()): BootstrapData {
  const data = store.bootstrap;
  data.metrics = calculateMetrics(data.jobs, data.drivers, store.proofs);
  return clone(data);
}

function requireJob(store: PrototypeStore, jobId: string): DeliveryJob {
  const job = store.bootstrap.jobs.find((item) => item.id === jobId);
  if (!job) throw new ApiError(404, 'Delivery job not found.');
  return job;
}

function findRoute(store: PrototypeStore, routeId: string): DispatchRoute {
  const route = store.bootstrap.routes.find((item) => item.id === routeId);
  if (!route) throw new ApiError(404, 'Route not found.');
  return route;
}

function localDistance(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }) {
  const x = (a.latitude - b.latitude) * 111;
  const y = (a.longitude - b.longitude) * 85;
  return Math.hypot(x, y);
}

function proposeStops(route: DispatchRoute) {
  const fixed = route.stops.filter((stop) => ['completed', 'reassigned'].includes(stop.status));
  const remaining = route.stops.filter((stop) => !['completed', 'reassigned'].includes(stop.status));
  const ordered: RouteStop[] = [];
  let point = { latitude: 40.71, longitude: -74.01 };
  while (remaining.length) {
    const eligible = remaining.filter((stop) => stop.kind === 'pickup' || fixed.some((item) => item.jobId === stop.jobId && item.kind === 'pickup') || ordered.some((item) => item.jobId === stop.jobId && item.kind === 'pickup'));
    const candidates = (eligible.length ? eligible : remaining).sort((a, b) => localDistance(a, point) - localDistance(b, point));
    const next = candidates[0]!;
    remaining.splice(remaining.indexOf(next), 1);
    ordered.push(next);
    point = next;
  }
  let cursor = 0;
  const proposal = route.stops.map((stop, index) => ({ ...(fixed.includes(stop) ? stop : ordered[cursor++]!), proposedSequence: index + 1 }));
  const depot = { latitude: 40.71, longitude: -74.01 };
  const before = route.stops.reduce((sum, stop, index, all) => sum + localDistance(index ? all[index - 1]! : depot, stop), 0);
  const after = proposal.reduce((sum, stop, index) => sum + localDistance(index ? proposal[index - 1]! : depot, stop), 0);
  const ratio = before > 0 ? after / before : 1;
  const afterKm = Number((route.distanceKm * ratio).toFixed(1));
  return { proposal, beforeKm: route.distanceKm, afterKm, savedKm: Number((route.distanceKm - afterKm).toFixed(1)) };
}

export async function getBootstrap() { return currentBootstrap(); }

export async function getJobDetail(jobId: string): Promise<JobDetail> {
  const store = readStore();
  const job = requireJob(store, jobId);
  const proof = store.proofs[jobId];
  const media = proof?.photoAvailable || proof?.signatureAvailable ? await readMedia(jobId) : undefined;
  return {
    job: clone(job), events: clone(store.events[jobId] ?? []), etaHistory: clone(store.etaHistory[jobId] ?? []),
    proof: proof ? { ...clone(proof), ...(media ?? {}) } : undefined, assignments: clone(store.assignments[jobId] ?? []),
  };
}

export async function createJob(body: Partial<DeliveryJob>) {
  const start = new Date(String(body.windowStart ?? ''));
  const end = new Date(String(body.windowEnd ?? ''));
  if (!body.customer?.trim() || !body.pickup?.trim() || !body.dropoff?.trim() || !body.region?.trim()) throw new ApiError(400, 'Customer, pickup, drop-off and region are required.');
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start) throw new ApiError(400, 'Enter a valid delivery window.');
  const job = changed((store) => {
    const id = crypto.randomUUID();
    const created: DeliveryJob = {
      id, reference: `D-${Date.now()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`, customer: body.customer!.trim(),
      contact: body.contact?.trim() || 'Customer contact', phone: body.phone?.trim() || '', pickup: body.pickup!.trim(), dropoff: body.dropoff!.trim(),
      region: body.region!.trim(), status: 'unassigned', priority: body.priority ?? 'normal', serviceType: body.serviceType ?? 'Standard',
      windowStart: start.toISOString(), windowEnd: end.toISOString(), eta: start.toISOString(), weight: Number(body.weight) || 0, volume: Number(body.volume) || 0,
      instructions: body.instructions ?? '', updatedAt: now(), latitude: body.latitude ?? 40.71, longitude: body.longitude ?? -74.01,
    };
    store.bootstrap.jobs.unshift(created);
    addEvent(store, id, 'job_created', { reference: created.reference });
    addAudit(store, 'job_created', 'Delivery job', `Created ${created.reference}`);
    return created;
  });
  return job;
}

const allowedTransitions: Record<string, string[]> = {
  unassigned: ['planned', 'assigned', 'cancelled'], planned: ['assigned', 'cancelled'], assigned: ['en_route', 'delayed', 'cancelled', 'unassigned'],
  en_route: ['delivered', 'failed_attempt', 'delayed', 'escalated'], delayed: ['en_route', 'assigned', 'failed_attempt', 'cancelled', 'escalated'],
  failed_attempt: ['assigned', 'cancelled', 'escalated'], escalated: ['assigned', 'en_route', 'cancelled'], delivered: [], cancelled: [],
};

export async function updateJobStatus(jobId: string, status: string, extra: Record<string, unknown> = {}) {
  const next = status as JobStatus;
  let podMedia: PodMedia | undefined;
  if (next === 'delivered') {
    podMedia = {
      ...(typeof extra.photoDataUrl === 'string' && extra.photoDataUrl ? { photoDataUrl: extra.photoDataUrl } : {}),
      ...(typeof extra.signatureDataUrl === 'string' && extra.signatureDataUrl ? { signatureDataUrl: extra.signatureDataUrl } : {}),
    };
    if (podMedia.photoDataUrl || podMedia.signatureDataUrl) await writeMedia(jobId, podMedia);
  }
  return changed((store) => {
    const job = requireJob(store, jobId);
    if (!allowedTransitions[job.status]?.includes(next)) throw new ApiError(409, `Cannot move a job from ${job.status} to ${next}.`);
    const previous = job.status;
    job.status = next;
    job.updatedAt = now();
    if (next === 'delivered') {
      store.proofs[jobId] = {
        recipient: String(extra.recipient ?? job.contact), note: String(extra.note ?? ''), deliveredAt: now(),
        collectionAmount: Math.max(0, Number(extra.collectionAmount) || 0), photoAvailable: Boolean(podMedia?.photoDataUrl), signatureAvailable: Boolean(podMedia?.signatureDataUrl),
      };
      for (const route of store.bootstrap.routes) for (const stop of route.stops) if (stop.jobId === jobId) stop.status = 'completed';
    }
    if (['delayed', 'failed_attempt', 'escalated'].includes(next)) {
      const severity: Severity = next === 'escalated' ? 'high' : 'medium';
      store.bootstrap.exceptions.unshift({ id: crypto.randomUUID(), jobId, reference: job.reference, customer: job.customer, type: next, severity, status: 'open', description: String(extra.note ?? `Job marked ${next.replace('_', ' ')}.`), reportedAt: now(), owner: 'Dispatch' });
    }
    addEvent(store, jobId, 'status_changed', { from: previous, to: next }, store.bootstrap.user.role === 'driver' ? 'driver_app' : 'prototype');
    addAudit(store, 'job_status_changed', 'Delivery job', `${job.reference}: ${previous} → ${next}`);
    addNotification(store, job, next === 'delivered' ? 'Delivery completed' : next === 'failed_attempt' ? 'Failed attempt' : `Status: ${next.replace('_', ' ')}`);
    return job;
  });
}

export async function updateJobEta(jobId: string, eta: string) {
  const date = new Date(eta);
  if (!Number.isFinite(date.getTime())) throw new ApiError(400, 'Enter a valid ETA.');
  return changed((store) => {
    const job = requireJob(store, jobId), previousEta = job.eta;
    job.eta = date.toISOString(); job.updatedAt = now();
    (store.etaHistory[jobId] ??= []).unshift({ previousEta, nextEta: job.eta, source: 'dispatcher', actorId: store.bootstrap.user.id, createdAt: now() });
    addEvent(store, jobId, 'eta_updated', { previousEta, nextEta: job.eta });
    addAudit(store, 'eta_updated', 'Delivery job', `Updated ETA for ${job.reference}`);
    addNotification(store, job, 'ETA updated');
    return job;
  });
}

export async function assignJob(jobId: string, driverId: string, vehicleId?: string, confirmWarnings = false) {
  const preview = readStore();
  const job = requireJob(preview, jobId);
  const driver = preview.bootstrap.drivers.find((item) => item.id === driverId);
  if (!driver) throw new ApiError(404, 'Driver not found.');
  const vehicle = preview.bootstrap.vehicles.find((item) => item.id === (vehicleId || driver.vehicleId));
  if (!vehicle) throw new ApiError(400, 'Choose a vehicle for this assignment.');
  if (['delivered', 'cancelled'].includes(job.status)) throw new ApiError(409, 'Closed jobs cannot be assigned.');
  if (job.driverId === driver.id) throw new ApiError(409, 'This delivery is already assigned to that driver.');
  const warnings: string[] = [];
  if (driver.status !== 'available' && driver.id !== job.driverId) warnings.push('Driver is not marked available');
  if (!['Available', 'On route', 'Assigned'].includes(vehicle.status) && vehicle.id !== job.vehicleId) warnings.push('Vehicle is not marked available');
  if (vehicle.driverId && vehicle.driverId !== driver.id && vehicle.id !== job.vehicleId) warnings.push('Vehicle is currently assigned to another driver');
  if (job.weight > vehicle.weightCapacity) warnings.push('Package weight exceeds vehicle capacity');
  if (job.volume > vehicle.volumeCapacity) warnings.push('Package volume exceeds vehicle capacity');
  if (vehicle.maintenance !== 'Good') warnings.push('Vehicle maintenance requires attention');
  if (driver.region !== job.region && driver.region !== 'North') warnings.push(`Driver is based in ${driver.region}, while this job is in ${job.region}`);
  if (driver.jobs >= 5) warnings.push('Driver is already carrying five active jobs');
  if (job.serviceType === 'Express' && !driver.skills.some((skill) => skill.toLowerCase() === 'express')) warnings.push('Driver has no Express skill on record');
  if (new Date(job.windowEnd).getHours() > Number(driver.shiftEnd.split(':')[0])) warnings.push('Delivery window ends after the driver shift');
  if (warnings.length && !confirmWarnings) throw new ApiError(409, 'Review the assignment warnings before confirming.', { warnings });
  const routeId = changed((store) => {
    const currentJob = requireJob(store, jobId);
    const selectedDriver = store.bootstrap.drivers.find((item) => item.id === driverId)!;
    const selectedVehicle = store.bootstrap.vehicles.find((item) => item.id === vehicle.id)!;
    const beforeDriverId = currentJob.driverId;
    const oldRouteId = store.jobRoutes[jobId];
    if (oldRouteId && oldRouteId !== selectedDriver.currentRouteId) {
      const oldRoute = store.bootstrap.routes.find((item) => item.id === oldRouteId);
      oldRoute?.stops.forEach((stop) => { if (stop.jobId === jobId && stop.status !== 'completed') stop.status = 'reassigned'; });
    }
    let route = store.bootstrap.routes.find((item) => item.id === selectedDriver.currentRouteId && !['completed', 'replanned', 'cancelled'].includes(item.status) && item.vehicleId === selectedVehicle.id);
    if (!route) {
      route = { id: crypto.randomUUID(), name: `${currentJob.region} · Ad hoc route`, driverId: selectedDriver.id, driverName: selectedDriver.name, vehicleId: selectedVehicle.id, vehicleName: selectedVehicle.registration, status: 'planned', region: currentJob.region, distanceKm: 0, etaEnd: currentJob.windowEnd, stops: [] };
      store.bootstrap.routes.push(route);
      selectedDriver.currentRouteId = route.id;
    }
    if (beforeDriverId) {
      const previousDriver = store.bootstrap.drivers.find((item) => item.id === beforeDriverId);
      if (previousDriver) { previousDriver.jobs = Math.max(0, previousDriver.jobs - 1); previousDriver.capacity = Math.max(10, previousDriver.capacity - 12); if (!previousDriver.jobs) previousDriver.status = 'available'; }
      const oldVehicle = store.bootstrap.vehicles.find((item) => item.id === currentJob.vehicleId);
      if (oldVehicle && oldVehicle.id !== selectedVehicle.id && !store.bootstrap.jobs.some((item) => item.id !== jobId && item.vehicleId === oldVehicle.id && !['delivered', 'cancelled'].includes(item.status))) { oldVehicle.status = 'Available'; oldVehicle.driverId = undefined; }
    }
    currentJob.status = 'assigned'; currentJob.driverId = selectedDriver.id; currentJob.driverName = selectedDriver.name;
    currentJob.vehicleId = selectedVehicle.id; currentJob.vehicleName = selectedVehicle.registration; currentJob.updatedAt = now();
    store.jobRoutes[jobId] = route.id;
    selectedDriver.status = 'assigned'; selectedDriver.vehicleId = selectedVehicle.id; selectedDriver.currentRouteId = route.id; selectedDriver.jobs += 1; selectedDriver.capacity = Math.min(100, selectedDriver.capacity + 12);
    selectedVehicle.status = 'Assigned'; selectedVehicle.driverId = selectedDriver.id;
    const sequence = Math.max(0, ...route.stops.map((stop) => stop.sequence)) + 1;
    route.stops.push(
      { id: crypto.randomUUID(), jobId, reference: currentJob.reference, customer: currentJob.customer, address: currentJob.pickup, region: currentJob.region, kind: 'pickup', sequence, status: 'upcoming', eta: currentJob.windowStart, latitude: 40.71, longitude: -74.01 },
      { id: crypto.randomUUID(), jobId, reference: currentJob.reference, customer: currentJob.customer, address: currentJob.dropoff, region: currentJob.region, kind: 'dropoff', sequence: sequence + 1, status: 'upcoming', eta: currentJob.eta, latitude: currentJob.latitude, longitude: currentJob.longitude },
    );
    (store.assignments[jobId] ??= []).unshift({ driverId: selectedDriver.id, vehicleId: selectedVehicle.id, createdAt: now() });
    addEvent(store, jobId, 'job_assigned', { driver: selectedDriver.name, vehicle: selectedVehicle.registration });
    addAudit(store, 'job_assigned', 'Delivery job', `Assigned ${currentJob.reference} to ${selectedDriver.name}`);
    addNotification(store, currentJob, 'Delivery dispatched');
    return route.id;
  });
  return { job: readStore().bootstrap.jobs.find((item) => item.id === jobId)!, routeId, warnings };
}

export async function updateDriver(id: string, body: Partial<Driver>) {
  return changed((store) => {
    const driver = store.bootstrap.drivers.find((item) => item.id === id);
    if (!driver) throw new ApiError(404, 'Driver not found.');
    Object.assign(driver, body);
    addAudit(store, 'driver_updated', 'Driver', `Updated readiness for ${driver.name}`);
    return driver;
  });
}

export async function updateVehicle(id: string, body: Partial<Vehicle>) {
  return changed((store) => {
    const vehicle = store.bootstrap.vehicles.find((item) => item.id === id);
    if (!vehicle) throw new ApiError(404, 'Vehicle not found.');
    Object.assign(vehicle, body);
    addAudit(store, 'vehicle_updated', 'Vehicle', `Updated ${vehicle.registration}`);
    return vehicle;
  });
}

export async function optimizeRoute(id: string) {
  const route = findRoute(readStore(), id);
  const { proposal, beforeKm, afterKm, savedKm } = proposeStops(route);
  return { routeId: id, proposal: proposal.map((stop) => ({ id: stop.id, proposedSequence: stop.proposedSequence, reference: stop.reference, customer: stop.customer })), beforeKm, afterKm, savedKm, method: 'Prototype straight-line distance estimate; traffic data is not connected' };
}

export async function applyRoutePlan(id: string, stopIds: string[]) {
  return changed((store) => {
    const route = findRoute(store, id);
    if (stopIds.length !== route.stops.length || new Set(stopIds).size !== route.stops.length || route.stops.some((stop) => !stopIds.includes(stop.id))) throw new ApiError(409, 'The stop list changed. Recalculate the route proposal.');
    if (route.stops.some((stop, index) => ['completed', 'reassigned'].includes(stop.status) && stopIds[index] !== stop.id)) throw new ApiError(409, 'Completed or reassigned stops cannot be moved.');
    const positions = new Map(stopIds.map((stopId, index) => [stopId, index]));
    for (const stop of route.stops.filter((item) => item.kind === 'dropoff')) {
      const pickup = route.stops.find((item) => item.jobId === stop.jobId && item.kind === 'pickup');
      if (pickup && positions.get(pickup.id)! > positions.get(stop.id)!) throw new ApiError(409, 'A pickup must remain before its delivery stop.');
    }
    route.stops = stopIds.map((stopId, index) => ({ ...route.stops.find((stop) => stop.id === stopId)!, sequence: index + 1 }));
    addAudit(store, 'route_resequenced', 'Dispatch route', `Reordered ${stopIds.length} stops`);
    return route;
  });
}

export async function createException(body: { jobId: string; type: string; severity: string; description: string }) {
  return changed((store) => {
    const job = requireJob(store, body.jobId);
    const severity: Severity = ['low', 'medium', 'high'].includes(body.severity) ? body.severity as Severity : 'medium';
    const item: DispatchException = { id: crypto.randomUUID(), jobId: job.id, reference: job.reference, customer: job.customer, type: body.type, severity, status: 'open', description: body.description, reportedAt: now(), owner: 'Dispatcher' };
    store.bootstrap.exceptions.unshift(item);
    if (severity === 'high') job.status = 'escalated';
    else if (severity === 'medium' && ['delay_risk', 'traffic_disruption'].includes(body.type)) job.status = 'delayed';
    if (severity === 'low' && store.bootstrap.agent.mode === 'automatic' && store.bootstrap.agent.automaticAllowlist.includes('eta_refresh')) {
      const previousEta = job.eta; job.eta = shiftMinutes((new Date(job.eta).getTime() - Date.now()) / 60_000 + 10);
      (store.etaHistory[job.id] ??= []).unshift({ previousEta, nextEta: job.eta, source: 'agent:automatic_safe_policy', actorId: store.bootstrap.user.id, createdAt: now() });
      addAudit(store, 'safe_eta_refresh', 'Delivery job', `Applied low-severity ETA refresh to ${job.reference}`);
    }
    addEvent(store, job.id, 'exception_reported', { type: body.type, severity });
    addAudit(store, 'exception_reported', 'Exception', `Reported ${body.type} on ${job.reference}`);
    if (severity !== 'low') store.bootstrap.recommendations.unshift({ id: crypto.randomUUID(), jobId: job.id, reference: job.reference, kind: body.type === 'traffic_disruption' ? 'reroute' : 'review', title: severity === 'high' ? 'Supervisor review required' : 'Review delivery plan', detail: body.description, impact: 'Review route and affected delivery windows', severity, status: 'pending', action: 'review', createdAt: now() });
    return item;
  });
}

export async function updateException(id: string, status: string, note = '') {
  return changed((store) => {
    const item = store.bootstrap.exceptions.find((exception) => exception.id === id);
    if (!item) throw new ApiError(404, 'Exception not found.');
    if (!['open', 'in_review', 'escalated', 'resolved'].includes(status)) throw new ApiError(400, 'Invalid exception state.');
    if (status === 'resolved' && !note.trim()) throw new ApiError(400, 'Add a resolution note before closing this exception.');
    item.status = status;
    if (status === 'resolved') { item.resolvedAt = now(); item.resolvedBy = store.bootstrap.user.name; item.resolutionNote = note.trim(); }
    addAudit(store, 'exception_updated', 'Exception', `${item.type} marked ${status}`);
    return item;
  });
}

export async function decideRecommendation(id: string, decision: 'approved' | 'rejected', note = '') {
  return changed((store) => {
    const item = store.bootstrap.recommendations.find((recommendation) => recommendation.id === id);
    if (!item) throw new ApiError(404, 'Recommendation not found.');
    if (item.status !== 'pending') throw new ApiError(409, 'This recommendation has already been reviewed.');
    item.status = decision;
    if (decision === 'approved' && item.action === 'resequence' && item.jobId) {
      const routeId = store.jobRoutes[item.jobId], route = routeId && store.bootstrap.routes.find((candidate) => candidate.id === routeId);
      if (route) { const proposed = proposeStops(route).proposal; route.stops = proposed.map((stop) => ({ ...stop, sequence: stop.proposedSequence })); }
    }
    addAudit(store, `recommendation_${decision}`, 'Agent recommendation', `${item.title} ${decision}${note ? `: ${note}` : ''}`);
    return item;
  });
}

export async function updateAgentSettings(mode: 'recommendation' | 'approval' | 'automatic', automaticAllowlist: string[]) {
  if (!['recommendation', 'approval', 'automatic'].includes(mode)) throw new ApiError(400, 'Choose a valid agent mode.');
  return changed((store) => {
    store.bootstrap.agent = { mode, automaticAllowlist: mode === 'automatic' ? automaticAllowlist.filter((item) => item === 'eta_refresh') : automaticAllowlist };
    addAudit(store, 'agent_policy_updated', 'Agent policy', `Changed agent mode to ${mode}`);
    return store.bootstrap.agent;
  });
}

export async function getAnalytics(from: string, to: string, region = 'all'): Promise<AnalyticsData> {
  const store = readStore();
  const start = new Date(`${from}T00:00:00`), end = new Date(`${to}T23:59:59.999`);
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || start > end) throw new ApiError(400, 'Choose a valid date range.');
  const jobs = store.bootstrap.jobs.filter((job) => new Date(job.windowStart) >= start && new Date(job.windowStart) <= end && (region === 'all' || job.region === region));
  const byRegion = new Map<string, DeliveryJob[]>();
  for (const job of jobs) byRegion.set(job.region, [...(byRegion.get(job.region) ?? []), job]);
  const statuses = new Map<string, number>();
  for (const job of jobs) statuses.set(job.status, (statuses.get(job.status) ?? 0) + 1);
  return {
    metrics: calculateMetrics(jobs, store.bootstrap.drivers, store.proofs),
    regions: [...byRegion].map(([name, rows]) => ({ region: name, total: rows.length, delivered: rows.filter((job) => job.status === 'delivered').length })),
    statuses: [...statuses].map(([status, count]) => ({ status, count })), jobs: clone(jobs), dateRange: { from, to, region },
  };
}

export async function resetDemoData() {
  await clearMedia();
  memoryStore = makeSeed();
  writeStore(memoryStore);
}

function openMediaDb(): Promise<IDBDatabase> {
  if (typeof indexedDB === 'undefined') return Promise.reject(new Error('This browser does not support IndexedDB for local proof-of-delivery media.'));
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(MEDIA_DB, 1);
    request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains(MEDIA_STORE)) request.result.createObjectStore(MEDIA_STORE); };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('Could not open local proof-of-delivery storage.'));
  });
}

async function writeMedia(jobId: string, media: PodMedia) {
  const db = await openMediaDb();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(MEDIA_STORE, 'readwrite');
    transaction.objectStore(MEDIA_STORE).put(media, jobId);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(new Error('Could not save proof-of-delivery media in this browser.'));
    transaction.onabort = () => reject(new Error('Proof-of-delivery media save was cancelled.'));
  });
  db.close();
}

async function readMedia(jobId: string): Promise<PodMedia | undefined> {
  const db = await openMediaDb();
  const media = await new Promise<PodMedia | undefined>((resolve, reject) => {
    const request = db.transaction(MEDIA_STORE, 'readonly').objectStore(MEDIA_STORE).get(jobId);
    request.onsuccess = () => resolve(request.result as PodMedia | undefined);
    request.onerror = () => reject(new Error('Could not load proof-of-delivery media from this browser.'));
  });
  db.close();
  return media;
}

async function clearMedia() {
  if (typeof indexedDB === 'undefined') return;
  try {
    const db = await openMediaDb();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(MEDIA_STORE, 'readwrite');
      transaction.objectStore(MEDIA_STORE).clear();
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(new Error('Could not clear local proof-of-delivery media.'));
      transaction.onabort = () => reject(new Error('Could not clear local proof-of-delivery media.'));
    });
    db.close();
  } catch (error) { throw error instanceof Error ? error : new Error('Could not clear local proof-of-delivery media.'); }
}

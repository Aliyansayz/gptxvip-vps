export type Role = 'admin' | 'supervisor' | 'dispatcher' | 'driver' | 'customer_service' | 'fleet_manager' | 'viewer';
export type JobStatus = 'unassigned' | 'planned' | 'assigned' | 'en_route' | 'delivered' | 'failed_attempt' | 'delayed' | 'cancelled' | 'escalated';
export type Priority = 'low' | 'normal' | 'high' | 'urgent';
export type Severity = 'low' | 'medium' | 'high';

export interface SessionUser { id: string; name: string; email: string; role: Role; driverId?: string }
export interface DeliveryJob {
  id: string; reference: string; customer: string; contact: string; phone: string;
  pickup: string; dropoff: string; region: string; status: JobStatus; priority: Priority;
  serviceType: string; windowStart: string; windowEnd: string; eta: string;
  driverId?: string; driverName?: string; vehicleId?: string; vehicleName?: string;
  weight: number; volume: number; instructions: string; updatedAt: string;
  latitude: number; longitude: number;
}
export interface Driver { id: string; name: string; initials: string; status: string; region: string; skills: string[]; shiftEnd: string; jobs: number; capacity: number; phone: string; vehicleId?: string; currentRouteId?: string }
export interface Vehicle { id: string; registration: string; type: string; weightCapacity: number; volumeCapacity: number; fuel: string; status: string; maintenance: string; depot: string; driverId?: string }
export interface RouteStop { id: string; jobId: string; reference: string; customer: string; address: string; region: string; kind: 'pickup' | 'dropoff'; sequence: number; status: string; eta: string; latitude: number; longitude: number }
export interface DispatchRoute { id: string; name: string; driverId: string; driverName: string; vehicleId: string; vehicleName: string; status: string; region: string; stops: RouteStop[]; distanceKm: number; etaEnd: string }
export interface DispatchException { id: string; jobId: string; reference: string; customer: string; type: string; severity: Severity; status: string; description: string; reportedAt: string; owner: string; resolvedAt?: string; resolvedBy?: string; resolutionNote?: string }
export interface Recommendation { id: string; jobId?: string; reference?: string; kind: string; title: string; detail: string; impact: string; severity: Severity; status: string; action: string; createdAt: string }
export interface NotificationRecord { id: string; jobId: string; reference: string; channel: string; trigger: string; recipient: string; status: string; sentAt: string }
export interface AuditRecord { id: string; actor: string; role: string; action: string; entity: string; summary: string; createdAt: string }
export interface BootstrapData {
  user: SessionUser; jobs: DeliveryJob[]; drivers: Driver[]; vehicles: Vehicle[];
  routes: DispatchRoute[]; exceptions: DispatchException[]; recommendations: Recommendation[];
  notifications: NotificationRecord[]; audit: AuditRecord[];
  agent: { mode: 'recommendation' | 'approval' | 'automatic'; automaticAllowlist: string[] };
  metrics: { activeJobs: number; availableDrivers: number; atRisk: number; late: number; completedToday: number; onTimeRate: number; averageDelay: number; utilization: number };
}
export interface AnalyticsData {
  metrics: BootstrapData['metrics'];
  regions: Array<{ region: string; total: number; delivered: number }>;
  statuses: Array<{ status: string; count: number }>;
  jobs: DeliveryJob[];
  dateRange: { from: string; to: string; region: string };
}

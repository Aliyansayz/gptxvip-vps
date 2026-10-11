import { useMemo } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import type { RouteStop } from '../types';

export function MapCanvas({ stops, compact = false }: { stops: RouteStop[]; compact?: boolean }) {
  const points = useMemo(() => {
    if (!stops.length) return [];
    const latitudes = stops.map((stop) => stop.latitude);
    const longitudes = stops.map((stop) => stop.longitude);
    const minLat = Math.min(...latitudes), maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes), maxLng = Math.max(...longitudes);
    return stops.map((stop, index) => ({
      ...stop,
      x: 72 + ((stop.longitude - minLng) / Math.max(maxLng - minLng, 0.02)) * 340,
      y: 40 + ((maxLat - stop.latitude) / Math.max(maxLat - minLat, 0.02)) * 180,
      index,
    }));
  }, [stops]);
  const path = points.map((point, index) => `${index ? 'L' : 'M'} ${point.x} ${point.y}`).join(' ');

  return <div className={`map-canvas${compact ? ' map-compact' : ''}`} aria-label="Schematic route overview">
    <div className="map-grid" />
    <svg viewBox="0 0 500 260" role="img" aria-label={`${stops.length} planned delivery stops shown on a schematic route map`}>
      <path className="map-road map-road-a" d="M0 72 C120 30 172 126 257 77 S388 31 520 82" />
      <path className="map-road map-road-b" d="M31 0 C75 74 128 94 100 280 M290 0 C240 78 350 154 295 280 M450 0 C365 96 451 188 420 280" />
      <path className="map-route-shadow" d={path} />
      <path className="map-route" d={path} />
      {points.map((point) => <g key={point.id} transform={`translate(${point.x} ${point.y})`}>
        <circle className={point.status === 'completed' ? 'map-stop-done' : 'map-stop'} r="12" />
        <text className="map-stop-number" textAnchor="middle" dy="4">{point.sequence}</text>
      </g>)}
      {!points.length && <text className="map-empty-label" x="250" y="130" textAnchor="middle">No route stops</text>}
    </svg>
    <span className="map-label map-label-north">NORTH DISTRICT</span>
    <span className="map-label map-label-center">CENTRAL AVE.</span>
    <div className="map-overlay"><span><Navigation size={13} /> Schematic route</span><span>{stops.length} stops <MapPin size={13} /></span></div>
  </div>;
}

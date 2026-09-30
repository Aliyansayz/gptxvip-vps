interface SourceStatusProps {
  source: string;
  freshness?: string;
  confidence?: string;
  sample?: boolean;
}

/** Show provenance beside the value it qualifies. Never infer a live connection. */
export default function SourceStatus({ source, freshness, confidence, sample = true }: SourceStatusProps) {
  return (
    <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-[11px] leading-4 text-slate-500" aria-label="Finding provenance">
      <span className={`rounded-full px-2 py-0.5 font-semibold ${sample ? 'bg-amber-50 text-amber-800' : 'bg-emerald-50 text-emerald-800'}`}>{sample ? 'Example data' : 'Connected data'}</span>
      <span>Source: {source}</span>
      {freshness && <span>· {freshness}</span>}
      {confidence && <span>· Confidence: {confidence}</span>}
    </div>
  );
}

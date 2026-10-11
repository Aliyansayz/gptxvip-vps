import { getPrototypeUrl, prototypes, type PrototypeId } from './registry';

export default function PrototypePreview({ id }: { id: PrototypeId }) {
  return <iframe src={getPrototypeUrl(id)} title={`${prototypes[id].title} interactive prototype`} loading="lazy" className="h-full w-full border-0 bg-slate-50" />;
}

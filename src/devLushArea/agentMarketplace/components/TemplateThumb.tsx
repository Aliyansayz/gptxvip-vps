import type { Template } from "@/data/templates";
import PrototypePreview from "../../../prototype/PrototypePreview";
import { prototypes } from "../../../prototype/registry";

/** Catalog cards show the actual app; details load its isolated interactive workspace. */
export default function TemplateThumb({
  template,
  interactive = false,
}: {
  template: Template;
  interactive?: boolean;
}) {
  if (interactive)
    return (
      <div className="h-[720px] w-full overflow-hidden sm:h-[800px]">
        <PrototypePreview id={template.prototype} />
      </div>
    );
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-50">
      <img
        src={prototypes[template.prototype].screenshot}
        alt={`${template.name} running dashboard`}
        loading="lazy"
        className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.025]"
      />
      <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-emerald-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Interactive demo
      </span>
    </div>
  );
}

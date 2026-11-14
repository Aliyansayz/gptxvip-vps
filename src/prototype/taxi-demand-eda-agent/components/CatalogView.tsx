import React from "react";
import { ArrowRight, Car, Database, Play } from "lucide-react";
import { textOverlays } from "../themeSettings";

interface CatalogViewProps {
  recordCount: number;
  onLoadTaxiDataset: () => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  recordCount,
  onLoadTaxiDataset,
}) => {
  return (
    <div className="space-y-6">
      <div className="taxi-card bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="inline-flex items-center gap-2 text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full text-xs font-semibold border border-indigo-100 mb-3">
          <Database size={14} />
          <span>Sanctioned Dataset Registry</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          {textOverlays.catalog.title}
        </h2>
        <p className="text-sm text-slate-500 mt-1.5 max-w-2xl">
          {textOverlays.catalog.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div
          onClick={onLoadTaxiDataset}
          className="taxi-card bg-white border-2 border-indigo-600 rounded-2xl p-6 shadow-sm relative flex flex-col justify-between cursor-pointer hover:shadow-md transition-all group"
        >
          <div>
            <div className="flex items-start justify-between gap-2 mb-4">
              <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-700 border border-indigo-100">
                <Car size={20} />
              </div>
              <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
                {textOverlays.catalog.taxiStatusBadge}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-1.5 group-hover:text-indigo-700 transition-colors">
              {textOverlays.catalog.taxiDemandTitle}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {textOverlays.catalog.taxiDemandDesc}
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500">
              {recordCount} Rows • 11 Columns
            </span>
            <span className="text-indigo-700 font-bold flex items-center gap-1">
              <Play size={12} />
              Open Workspace
              <ArrowRight size={13} />
            </span>
          </div>
        </div>

        <div className="taxi-card bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-4">
              <div className="p-2.5 bg-slate-100 rounded-xl text-slate-600 border border-slate-200">
                <Database size={20} />
              </div>
              <span className="text-[10px] font-mono bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full font-semibold">
                {textOverlays.catalog.micromobilityBadge}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-1.5">
              {textOverlays.catalog.micromobilityTitle}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {textOverlays.catalog.micromobilityDesc}
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Est. 5,400 Rows</span>
            <span>Q4 Integration</span>
          </div>
        </div>

        <div className="taxi-card bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-4">
              <div className="p-2.5 bg-slate-100 rounded-xl text-slate-600 border border-slate-200">
                <Database size={20} />
              </div>
              <span className="text-[10px] font-mono bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5 rounded-full font-semibold">
                {textOverlays.catalog.shuttlesBadge}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-1.5">
              {textOverlays.catalog.shuttlesTitle}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {textOverlays.catalog.shuttlesDesc}
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Est. 3,200 Rows</span>
            <span>Queue Roadmap</span>
          </div>
        </div>
      </div>
    </div>
  );
};

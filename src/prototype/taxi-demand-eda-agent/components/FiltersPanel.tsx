import React from "react";
import { Calendar, CloudRain, Filter, RotateCcw } from "lucide-react";
import type { FilterState } from "../types";
import { colors, textOverlays } from "../themeSettings";

interface FiltersPanelProps {
  filters: FilterState;
  setFilters: (next: FilterState) => void;
  totalCount: number;
  filteredCount: number;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
  filters,
  setFilters,
  totalCount,
  filteredCount,
}) => {
  const seasons = ["All", "Winter", "Spring", "Summer", "Autumn"];
  const weathers = ["All", "Clear", "Cloudy", "Rainy", "Snowy"];
  const dayTypes: Array<FilterState["dayType"]> = [
    "All",
    "Workdays",
    "Holidays",
  ];

  const isFiltered =
    filters.season !== "All" ||
    filters.weather !== "All" ||
    filters.dayType !== "All";

  const handleReset = () => {
    setFilters({ season: "All", weather: "All", dayType: "All" });
  };

  return (
    <div
      className={`taxi-card ${colors.bg.card} border ${colors.border.card} rounded-2xl p-6 shadow-sm mb-6`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-700">
            <Filter size={16} />
          </div>
          <h3 className={`text-sm font-bold ${colors.text.title}`}>
            {textOverlays.filtersPanel.title}
          </h3>
        </div>
        {isFiltered && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-slate-600 hover:text-indigo-700 flex items-center gap-1.5 font-semibold px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-indigo-200 transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            {textOverlays.filtersPanel.resetLabel}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-2.5 flex items-center gap-1.5">
            <Calendar size={12} className="text-indigo-600" />
            {textOverlays.filtersPanel.seasonLabel}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {seasons.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFilters({ ...filters, season: s })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                  filters.season === s
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-2.5 flex items-center gap-1.5">
            <CloudRain size={12} className="text-sky-600" />
            {textOverlays.filtersPanel.weatherLabel}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {weathers.map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setFilters({ ...filters, weather: w })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                  filters.weather === w
                    ? "bg-sky-600 border-sky-600 text-white shadow-sm"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-2.5 flex items-center gap-1.5">
            <Calendar size={12} className="text-rose-600" />
            {textOverlays.filtersPanel.calendarLabel}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {dayTypes.map((dt) => (
              <button
                key={dt}
                type="button"
                onClick={() => setFilters({ ...filters, dayType: dt })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                  filters.dayType === dt
                    ? "bg-rose-600 border-rose-600 text-white shadow-sm"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {dt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <span>
          {textOverlays.filtersPanel.showingTextPrefix}
          <span className="font-mono font-bold text-slate-900">
            {filteredCount}
          </span>
          {textOverlays.filtersPanel.showingTextMiddle}
          <span className="font-mono text-slate-700 font-medium">
            {totalCount}
          </span>
          {textOverlays.filtersPanel.showingTextSuffix}
        </span>
        {isFiltered && (
          <span className="text-[11px] bg-indigo-50 border border-indigo-200 text-indigo-700 px-2.5 py-0.5 rounded-full font-semibold">
            {textOverlays.filtersPanel.filtersActiveLabel}
          </span>
        )}
      </div>
    </div>
  );
};

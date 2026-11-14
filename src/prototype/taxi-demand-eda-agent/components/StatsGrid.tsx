import React, { useMemo } from "react";
import { Car, Clock, DollarSign, Flame } from "lucide-react";
import type { RideRecord } from "../types";
import { computeKpiStats } from "../workflow/edaEngine";
import { textOverlays, widgets } from "../themeSettings";

interface StatsGridProps {
  records: RideRecord[];
  filteredRecords: RideRecord[];
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  records,
  filteredRecords,
}) => {
  const stats = useMemo(
    () => computeKpiStats(filteredRecords, records),
    [filteredRecords, records],
  );

  const isPositiveHoliday = stats.holidayDifference > 0;
  const holidayColor = isPositiveHoliday ? "text-rose-600" : "text-emerald-600";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
      <div
        id={widgets.stats.totalRides.id}
        className="taxi-card bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-slate-300 transition-colors relative overflow-hidden"
      >
        <div
          className={`absolute top-0 left-0 right-0 h-1 ${widgets.stats.totalRides.topBarColor}`}
        />
        <div className="flex items-start justify-between">
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold">
              {textOverlays.statsGrid.volumeTitle}
            </p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1.5 font-mono">
              {stats.totalRides.toLocaleString()}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Across {stats.activeIntervals} active intervals
            </p>
          </div>
          <div className="p-2.5 bg-cyan-50 border border-cyan-100 rounded-xl text-cyan-700">
            <Car size={20} />
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs text-emerald-700 font-medium">
          <span>{textOverlays.statsGrid.volumeBadge}</span>
        </div>
      </div>

      <div
        id={widgets.stats.avgFare.id}
        className="taxi-card bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-slate-300 transition-colors relative overflow-hidden"
      >
        <div
          className={`absolute top-0 left-0 right-0 h-1 ${widgets.stats.avgFare.topBarColor}`}
        />
        <div className="flex items-start justify-between">
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold">
              {textOverlays.statsGrid.fareTitle}
            </p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1.5 font-mono">
              ${stats.avgFare.toFixed(2)}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {textOverlays.statsGrid.fareSubtitle}
            </p>
          </div>
          <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-700">
            <DollarSign size={20} />
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs text-emerald-700 font-medium">
          <span>{textOverlays.statsGrid.fareBadge}</span>
        </div>
      </div>

      <div
        id={widgets.stats.avgDuration.id}
        className="taxi-card bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-slate-300 transition-colors relative overflow-hidden"
      >
        <div
          className={`absolute top-0 left-0 right-0 h-1 ${widgets.stats.avgDuration.topBarColor}`}
        />
        <div className="flex items-start justify-between">
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold">
              {textOverlays.statsGrid.durationTitle}
            </p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1.5 font-mono">
              {stats.avgDuration.toFixed(1)}{" "}
              <span className="text-sm font-sans font-normal text-slate-400">
                min
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {textOverlays.statsGrid.durationSubtitle}
            </p>
          </div>
          <div className="p-2.5 bg-sky-50 border border-sky-100 rounded-xl text-sky-700">
            <Clock size={20} />
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs text-slate-500 font-medium">
          <span>{textOverlays.statsGrid.durationBadge}</span>
        </div>
      </div>

      <div
        id={widgets.stats.holidayPremium.id}
        className="taxi-card bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-slate-300 transition-colors relative overflow-hidden"
      >
        <div
          className={`absolute top-0 left-0 right-0 h-1 ${widgets.stats.holidayPremium.topBarColor}`}
        />
        <div className="flex items-start justify-between">
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold">
              {textOverlays.statsGrid.holidayTitle}
            </p>
            <h3 className={`text-3xl font-bold mt-1.5 font-mono ${holidayColor}`}>
              {isPositiveHoliday ? "+" : ""}
              {stats.holidayDifference.toFixed(1)}%
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {textOverlays.statsGrid.holidaySubtitle}
            </p>
          </div>
          <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-700">
            <Flame size={20} />
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-medium">
          <span
            className={
              isPositiveHoliday ? "text-rose-600" : "text-slate-500"
            }
          >
            {isPositiveHoliday
              ? textOverlays.statsGrid.holidayBadgeHigh
              : textOverlays.statsGrid.holidayBadgeDefault}
          </span>
        </div>
      </div>
    </div>
  );
};

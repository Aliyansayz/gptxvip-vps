import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Database, Search } from "lucide-react";
import type { RideRecord } from "../types";
import { colors, textOverlays } from "../themeSettings";

interface DataTableProps {
  records: RideRecord[];
}

export const DataTable: React.FC<DataTableProps> = ({ records }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const searchedRecords = useMemo(() => {
    if (!searchTerm.trim()) return records;
    const term = searchTerm.toLowerCase();
    return records.filter(
      (r) =>
        r.season.toLowerCase().includes(term) ||
        r.weatherCondition.toLowerCase().includes(term) ||
        r.dayOfWeek.toLowerCase().includes(term) ||
        r.month.toLowerCase().includes(term) ||
        r.trafficLevel.toLowerCase().includes(term) ||
        (r.holiday && "holiday".includes(term)),
    );
  }, [records, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(searchedRecords.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const currentRecords = searchedRecords.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  const weatherBadge = (w: RideRecord["weatherCondition"]) => {
    if (w === "Clear") return colors.status.clear;
    if (w === "Rainy") return colors.status.rainy;
    if (w === "Snowy") return colors.status.snowy;
    return colors.status.default;
  };

  const trafficBadge = (t: RideRecord["trafficLevel"]) => {
    if (t === "Low") return colors.status.trafficLow;
    if (t === "Medium") return colors.status.trafficMedium;
    return colors.status.trafficHigh;
  };

  return (
    <div
      className={`taxi-card ${colors.bg.card} border ${colors.border.card} rounded-2xl overflow-hidden shadow-sm`}
    >
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-700">
            <Database size={16} />
          </div>
          <h3 className={`text-base font-bold ${colors.text.title}`}>
            {textOverlays.dataTable.title}
          </h3>
        </div>
        <div className="relative w-full sm:w-72">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            size={15}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={textOverlays.dataTable.searchPlaceholder}
            aria-label={textOverlays.dataTable.searchPlaceholder}
            className="taxi-search-input w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr
              className={`border-b border-slate-200 ${colors.bg.tableHeader} text-[11px] font-mono uppercase tracking-wider text-slate-500`}
            >
              <th className="py-3.5 px-4 font-semibold">Timestamp / Day</th>
              <th className="py-3.5 px-4 font-semibold">Season</th>
              <th className="py-3.5 px-4 font-semibold">Holiday</th>
              <th className="py-3.5 px-4 font-semibold text-right">Rides</th>
              <th className="py-3.5 px-4 font-semibold text-right">Avg Fare</th>
              <th className="py-3.5 px-4 font-semibold text-right">Duration</th>
              <th className="py-3.5 px-4 font-semibold">Weather</th>
              <th className="py-3.5 px-4 font-semibold">Traffic</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {currentRecords.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-8 text-center text-slate-400 text-sm"
                >
                  {textOverlays.dataTable.noRecords}
                </td>
              </tr>
            ) : (
              currentRecords.map((rec) => {
                const wb = weatherBadge(rec.weatherCondition);
                const tb = trafficBadge(rec.trafficLevel);
                return (
                  <tr
                    key={rec.id}
                    className={`${colors.bg.tableRowHover} transition-colors`}
                  >
                    <td className="py-3 px-4 font-mono text-slate-800 whitespace-nowrap">
                      {rec.timestamp}{" "}
                      <span className="text-slate-400 font-sans ml-1">
                        ({rec.dayOfWeek.slice(0, 3)})
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {rec.season}
                    </td>
                    <td className="py-3 px-4">
                      {rec.holiday ? (
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full border ${colors.status.holidayActive.bg} ${colors.status.holidayActive.text} ${colors.status.holidayActive.border}`}
                        >
                          HOLIDAY
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">
                          Workday
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-right font-bold text-slate-900">
                      {rec.ridesCount}
                    </td>
                    <td className="py-3 px-4 font-mono text-right text-emerald-700 font-medium">
                      ${rec.averageFare.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 font-mono text-right text-slate-600">
                      {rec.averageDuration.toFixed(0)}m
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full border ${wb.bg} ${wb.text} ${wb.border}`}
                      >
                        {rec.weatherCondition}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full border ${tb.bg} ${tb.text} ${tb.border}`}
                      >
                        {rec.trafficLevel}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          {textOverlays.dataTable.showingPrefix}
          <span className="font-mono font-bold text-slate-800">
            {searchedRecords.length === 0 ? 0 : (safePage - 1) * pageSize + 1}
          </span>
          {textOverlays.dataTable.showingMiddle}
          <span className="font-mono font-bold text-slate-800">
            {Math.min(safePage * pageSize, searchedRecords.length)}
          </span>
          {textOverlays.dataTable.showingOf}
          <span className="font-mono font-bold text-slate-800">
            {searchedRecords.length}
          </span>
          {textOverlays.dataTable.showingSuffix}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={safePage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            aria-label="Previous table page"
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="font-mono px-2 font-medium text-slate-700">
            {textOverlays.dataTable.pagePrefix}
            {safePage}
            {textOverlays.dataTable.pageOf}
            {totalPages}
          </span>
          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            aria-label="Next table page"
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

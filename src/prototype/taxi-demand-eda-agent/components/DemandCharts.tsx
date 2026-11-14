import React, { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RideRecord } from "../types";
import { computeChartSeries } from "../workflow/edaEngine";
import { colors, textOverlays } from "../themeSettings";

interface DemandChartsProps {
  filteredRecords: RideRecord[];
}

export const DemandCharts: React.FC<DemandChartsProps> = ({
  filteredRecords,
}) => {
  const [activeTab, setActiveTab] = useState<"hourly" | "seasonal">("hourly");

  const { hourlyData, seasonalData, weatherData } = useMemo(
    () => computeChartSeries(filteredRecords),
    [filteredRecords],
  );

  return (
    <div className="space-y-6 mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className={`lg:col-span-2 taxi-card ${colors.bg.card} border ${colors.border.card} rounded-2xl p-6 shadow-sm flex flex-col`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <h3 className={`text-lg font-bold ${colors.text.title}`}>
                {textOverlays.demandCharts.distributionsTitle}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {textOverlays.demandCharts.distributionsDesc}
              </p>
            </div>
            <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start">
              <button
                type="button"
                onClick={() => setActiveTab("hourly")}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === "hourly"
                    ? colors.themeToggleActive
                    : colors.themeToggleInactive
                }`}
              >
                {textOverlays.demandCharts.workdayHolidayToggle}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("seasonal")}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === "seasonal"
                    ? colors.themeToggleActive
                    : colors.themeToggleInactive
                }`}
              >
                {textOverlays.demandCharts.seasonalSpeedsToggle}
              </button>
            </div>
          </div>

          <div className="h-[300px] w-full">
            {filteredRecords.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                {textOverlays.demandCharts.noMatchingRecords}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                {activeTab === "hourly" ? (
                  <AreaChart
                    data={hourlyData}
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="taxiColorHol"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#e11d48"
                          stopOpacity={0.28}
                        />
                        <stop
                          offset="95%"
                          stopColor="#e11d48"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="taxiColorWork"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#4f46e5"
                          stopOpacity={0.28}
                        />
                        <stop
                          offset="95%"
                          stopColor="#4f46e5"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#cbd5e1"
                      strokeOpacity={0.5}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="hour"
                      stroke="#64748b"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderColor: "#e2e8f0",
                        color: "#0f172a",
                        borderRadius: "10px",
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: "8px", fontSize: "12px" }} />
                    <Area
                      type="monotone"
                      dataKey="Holidays/Weekends"
                      stroke="#e11d48"
                      fillOpacity={1}
                      fill="url(#taxiColorHol)"
                      strokeWidth={2.5}
                    />
                    <Area
                      type="monotone"
                      dataKey="Standard Workdays"
                      stroke="#4f46e5"
                      fillOpacity={1}
                      fill="url(#taxiColorWork)"
                      strokeWidth={2.5}
                    />
                  </AreaChart>
                ) : (
                  <AreaChart
                    data={hourlyData}
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#cbd5e1"
                      strokeOpacity={0.5}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="hour"
                      stroke="#64748b"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderColor: "#e2e8f0",
                        color: "#0f172a",
                        borderRadius: "10px",
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: "8px", fontSize: "12px" }} />
                    <Area
                      type="monotone"
                      dataKey="Summer"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      fillOpacity={0.14}
                      strokeWidth={2.2}
                    />
                    <Area
                      type="monotone"
                      dataKey="Winter"
                      stroke="#0ea5e9"
                      fill="#0ea5e9"
                      fillOpacity={0.14}
                      strokeWidth={2.2}
                    />
                    <Area
                      type="monotone"
                      dataKey="Spring"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.12}
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="Autumn"
                      stroke="#a855f7"
                      fill="#a855f7"
                      fillOpacity={0.12}
                      strokeWidth={2}
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div
          className={`taxi-card ${colors.bg.card} border ${colors.border.card} rounded-2xl p-6 shadow-sm flex flex-col`}
        >
          <div className="mb-5">
            <h3 className={`text-lg font-bold ${colors.text.title}`}>
              {textOverlays.demandCharts.dynamicsTitle}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {textOverlays.demandCharts.dynamicsDesc}
            </p>
          </div>
          <div className="h-[300px] w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={seasonalData}
                margin={{ top: 10, right: 0, left: -16, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#cbd5e1"
                  strokeOpacity={0.5}
                  vertical={false}
                />
                <XAxis
                  dataKey="season"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  stroke="#4f46e5"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#10b981"
                  fontSize={12}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    color: "#0f172a",
                    borderRadius: "10px",
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: "8px", fontSize: "12px" }} />
                <Bar
                  yAxisId="left"
                  dataKey="Avg Demand (Rides/Hr)"
                  fill="#4f46e5"
                  radius={[6, 6, 0, 0]}
                  barSize={26}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="Avg Fare ($)"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#10b981" }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div
        className={`taxi-card ${colors.bg.card} border ${colors.border.card} rounded-2xl p-6 shadow-sm`}
      >
        <div className="mb-5">
          <h3 className={`text-lg font-bold ${colors.text.title}`}>
            {textOverlays.demandCharts.frictionTitle}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {textOverlays.demandCharts.frictionDesc}
          </p>
        </div>
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weatherData}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#cbd5e1"
                strokeOpacity={0.5}
                vertical={false}
              />
              <XAxis
                dataKey="weather"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                yAxisId="left"
                stroke="#d97706"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#0284c7"
                fontSize={12}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#e2e8f0",
                  color: "#0f172a",
                  borderRadius: "10px",
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "8px", fontSize: "12px" }} />
              <Bar
                yAxisId="left"
                dataKey="Trip Duration (Mins)"
                fill="#f59e0b"
                radius={[6, 6, 0, 0]}
                barSize={30}
              />
              <Bar
                yAxisId="right"
                dataKey="Average Fare Size ($)"
                fill="#0284c7"
                radius={[6, 6, 0, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

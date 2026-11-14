import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  Download,
  FileSpreadsheet,
  RefreshCw,
  Upload,
} from "lucide-react";
import { Shell, Button, csv, useDemo } from "../shared";
import type { FilterState, RideRecord, WorkspaceTab } from "./types";
import { seed, validate } from "./data/sampleTaxiData";
import { parseCSV } from "./utils/csvParser";
import { filterRideRecords } from "./workflow/edaEngine";
import { textOverlays } from "./themeSettings";
import { StatsGrid } from "./components/StatsGrid";
import { FiltersPanel } from "./components/FiltersPanel";
import { DemandCharts } from "./components/DemandCharts";
import { AgentCopilot } from "./components/AgentCopilot";
import { DataTable } from "./components/DataTable";
import { HomeView } from "./components/HomeView";
import { AgentTypesView } from "./components/AgentTypesView";
import { CatalogView } from "./components/CatalogView";
import { LogicflowView } from "./components/LogicflowView";
import "./styles.css";

const TABS: WorkspaceTab[] = [
  "Platform Home",
  "Agent Directory",
  "Taxi Workspace",
  "Data Catalog",
  "Logicflow & Code",
];

export default function App() {
  const { state, setState, reset } = useDemo(
    "taxi-demand-eda-agent",
    seed,
    validate,
  );
  const [view, setView] = useState<WorkspaceTab>("Platform Home");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const filteredRecords = useMemo<RideRecord[]>(
    () => filterRideRecords(state.records, state.filters),
    [state.records, state.filters],
  );

  const setFilters = (filters: FilterState) => {
    setState((prev) => ({ ...prev, filters }));
  };

  const setSelectedAgentId = (selectedAgentId: string) => {
    setState((prev) => ({ ...prev, selectedAgentId }));
  };

  const processFile = (file: File) => {
    setUploadError(null);
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setUploadError(textOverlays.workspace.uploadErrorCsvOnly);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = String(event.target?.result ?? "");
        const { records: parsed, errors } = parseCSV(text);
        if (parsed.length === 0) {
          setUploadError(errors[0] || textOverlays.workspace.uploadErrorParse);
          return;
        }
        setState((prev) => ({
          ...prev,
          records: parsed,
          csvString: text,
          fileName: file.name,
          filters: { season: "All", weather: "All", dayType: "All" },
        }));
      } catch {
        setUploadError(textOverlays.workspace.uploadErrorParse);
      }
    };
    reader.onerror = () => setUploadError(textOverlays.workspace.uploadErrorReader);
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  const handleExportCsv = () => {
    const exportRows = filteredRecords.map((r) => ({
      id: r.id,
      timestamp: r.timestamp,
      month: r.month,
      hour: r.hour,
      season: r.season,
      holiday: r.holiday,
      dayOfWeek: r.dayOfWeek,
      ridesCount: r.ridesCount,
      averageFare: r.averageFare,
      averageDuration: r.averageDuration,
      weatherCondition: r.weatherCondition,
      trafficLevel: r.trafficLevel,
    }));
    csv("taxi-demand-filtered-ledger.csv", exportRows);
  };

  const navigateToAgent = (agentId?: string) => {
    if (agentId) setSelectedAgentId(agentId);
    setView("Agent Directory");
  };

  return (
    <Shell
      slug="taxi-demand-eda-agent"
      title={textOverlays.header.title}
      subtitle={textOverlays.header.subtitle}
      accent="#4f46e5"
      tabs={TABS}
      view={view}
      onView={(next) => setView(next as WorkspaceTab)}
      onReset={() => {
        setUploadError(null);
        reset();
      }}
      actions={
        view === "Taxi Workspace" ? (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setUploadError(null);
                reset();
              }}
            >
              <RefreshCw size={14} />
              <span>{textOverlays.workspace.resetButton}</span>
            </Button>
            <Button variant="primary" size="sm" onClick={handleExportCsv}>
              <Download size={14} />
              <span>{textOverlays.workspace.exportButton}</span>
            </Button>
          </div>
        ) : null
      }
    >
      {view === "Platform Home" && (
        <HomeView
          onNavigateTaxi={() => setView("Taxi Workspace")}
          onNavigateAgents={navigateToAgent}
          onNavigateLogicflow={() => setView("Logicflow & Code")}
          recordCount={state.records.length}
        />
      )}

      {view === "Agent Directory" && (
        <AgentTypesView
          selectedAgentId={state.selectedAgentId}
          onSelectAgent={setSelectedAgentId}
          onLaunchTaxi={() => setView("Taxi Workspace")}
        />
      )}

      {view === "Taxi Workspace" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            <div className="lg:col-span-7 taxi-card bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                    {textOverlays.workspace.activeDatasetLabel}
                  </span>
                  <div className="flex items-center gap-2.5 mt-1.5">
                    <FileSpreadsheet className="text-indigo-700" size={20} />
                    <h2 className="text-lg font-bold text-slate-900 break-all">
                      {state.fileName}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {state.records.length}{" "}
                    {textOverlays.workspace.intervalParsedSuffix}
                  </p>
                </div>
                <span className="text-[11px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full font-semibold">
                  {textOverlays.header.badge}
                </span>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
                {textOverlays.workspace.narrative}
              </div>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`lg:col-span-5 relative rounded-2xl border-2 border-dashed p-6 flex flex-col items-center justify-center text-center transition-colors shadow-sm ${
                isDragging
                  ? "border-indigo-500 bg-indigo-50/70"
                  : "border-slate-300 bg-white hover:border-indigo-400"
              }`}
            >
              <input
                type="file"
                accept=".csv"
                onChange={handleFileInput}
                aria-label="Upload Taxi Demand CSV file"
                className="taxi-file-input"
              />
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-700 mb-3">
                <Upload size={20} />
              </div>
              <p className="text-sm font-bold text-slate-800">
                {textOverlays.workspace.uploadHelper}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {textOverlays.workspace.uploadOrClick}
              </p>
              {uploadError && (
                <div className="mt-3 text-xs text-rose-700 flex items-center gap-1.5 font-semibold">
                  <AlertCircle size={14} />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>
          </div>

          <FiltersPanel
            filters={state.filters}
            setFilters={setFilters}
            totalCount={state.records.length}
            filteredCount={filteredRecords.length}
          />

          <StatsGrid
            records={state.records}
            filteredRecords={filteredRecords}
          />

          <AgentCopilot
            records={state.records}
            filteredRecords={filteredRecords}
          />

          <DemandCharts filteredRecords={filteredRecords} />

          <DataTable records={filteredRecords} />
        </div>
      )}

      {view === "Data Catalog" && (
        <CatalogView
          recordCount={state.records.length}
          onLoadTaxiDataset={() => {
            reset();
            setView("Taxi Workspace");
          }}
        />
      )}

      {view === "Logicflow & Code" && (
        <LogicflowView
          records={state.records}
          filteredRecords={filteredRecords}
        />
      )}
    </Shell>
  );
}

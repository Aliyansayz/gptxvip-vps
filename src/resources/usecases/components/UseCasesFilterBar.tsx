import React from 'react';
import { Search, X, LayoutGrid, List } from 'lucide-react';
import { IndustryType, ServiceType, INDUSTRIES, SERVICES } from '../types';

interface UseCasesFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedIndustry: IndustryType;
  onSelectIndustry: (industry: IndustryType) => void;
  selectedService: ServiceType;
  onSelectService: (service: ServiceType) => void;
  viewMode: 'grid' | 'list';
  onToggleViewMode: (mode: 'grid' | 'list') => void;
  totalCount: number;
  filteredCount: number;
  onClearFilters: () => void;
}

export const UseCasesFilterBar: React.FC<UseCasesFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedIndustry,
  onSelectIndustry,
  selectedService,
  onSelectService,
  viewMode,
  onToggleViewMode,
  totalCount,
  filteredCount,
  onClearFilters,
}) => {
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedIndustry !== 'All' ||
    selectedService !== 'All';

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      {/* Top row: Search bar + View mode toggles */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by client, industry, challenge, or technology (e.g. Vireon, Real Estate, SIEM, ZTNA)..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-9 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0D9488] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* View mode toggle + Clear */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 mr-2 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Reset Filters
            </button>
          )}

          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
            <button
              onClick={() => onToggleViewMode('grid')}
              className={`rounded p-1.5 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              title="Grid view"
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => onToggleViewMode('list')}
              className={`rounded p-1.5 transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              title="List view"
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Middle row: Industry filter pills */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Filter by Industry
          </span>
          <span className="text-xs text-slate-400">
            Showing {filteredCount} of {totalCount} case studies
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {INDUSTRIES.map((industry) => {
            const isActive = selectedIndustry === industry;
            return (
              <button
                key={industry}
                onClick={() => onSelectIndustry(industry)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-slate-950 text-white shadow-sm font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {industry}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom row: Service / Solution filter pills */}
      <div className="pt-2 border-t border-slate-100">
        <div className="mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Filter by Solution
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SERVICES.map((service) => {
            const isActive = selectedService === service;
            return (
              <button
                key={service}
                onClick={() => onSelectService(service)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#0D9488] text-white shadow-sm font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {service}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UseCasesFilterBar;

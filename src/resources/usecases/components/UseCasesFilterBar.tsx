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
    <div
      className="space-y-4 rounded-xl border border-[#e9e9ec] bg-[#f5f5f7] p-5"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Top row: Search bar + View mode toggles */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#343edb]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search use cases by topic (e.g. Contracts, Legal, GDPR, Security, Real Estate)..."
            className="w-full rounded-full border border-[#d8d8e0] bg-white pl-11 pr-9 py-2.5 text-xs sm:text-sm text-[#101014] placeholder:text-[#777780] focus:border-[#343edb] focus:outline-none focus:ring-2 focus:ring-[#343edb]/15"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#777780] hover:text-[#101014]"
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
              className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#343edb] border border-[#e9e9ec] hover:border-[#343edb] transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Reset Filters
            </button>
          )}

          <div className="inline-flex rounded-full border border-[#d8d8e0] bg-white p-1">
            <button
              onClick={() => onToggleViewMode('grid')}
              className={`rounded-full p-1.5 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-[#343edb] text-white'
                  : 'text-[#777780] hover:text-[#101014]'
              }`}
              title="Grid view"
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => onToggleViewMode('list')}
              className={`rounded-full p-1.5 transition-colors ${
                viewMode === 'list'
                  ? 'bg-[#343edb] text-white'
                  : 'text-[#777780] hover:text-[#101014]'
              }`}
              title="List view"
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Industry filter pills */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#777780]">
            Department / Industry
          </span>
          <span className="text-xs text-[#777780]">
            Showing <strong className="text-[#101014]">{filteredCount}</strong> of {totalCount} use cases
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {INDUSTRIES.map((industry) => {
            const isActive = selectedIndustry === industry;
            return (
              <button
                key={industry}
                onClick={() => onSelectIndustry(industry)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#101014] text-white shadow-xs'
                    : 'bg-white text-[#555560] border border-[#e9e9ec] hover:border-[#343edb] hover:text-[#101014]'
                }`}
              >
                {industry}
              </button>
            );
          })}
        </div>
      </div>

      {/* Service / Solution filter pills */}
      <div className="pt-2 border-t border-[#e9e9ec]">
        <div className="mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#777780]">
            Capability Focus
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SERVICES.map((service) => {
            const isActive = selectedService === service;
            return (
              <button
                key={service}
                onClick={() => onSelectService(service)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#343edb] text-white shadow-xs'
                    : 'bg-white text-[#555560] border border-[#e9e9ec] hover:border-[#343edb] hover:text-[#101014]'
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

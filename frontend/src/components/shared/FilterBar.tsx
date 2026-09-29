import React from 'react';
import { Search, X } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  filterOptions?: { label: string; value: string; count?: number }[];
  children?: React.ReactNode;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search records...',
  activeFilter,
  onFilterChange,
  filterOptions,
  children,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full pl-9 pr-8 py-2 text-sm text-slate-200 placeholder-slate-600 rounded-lg transition-colors focus:outline-none"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.09)',
          }}
          onFocus={(e) => {
            (e.target as HTMLInputElement).style.borderColor = 'rgba(0,112,243,0.50)';
            (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(0,112,243,0.08)';
          }}
          onBlur={(e) => {
            (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.09)';
            (e.target as HTMLInputElement).style.boxShadow = 'none';
          }}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin pb-0.5">
        {filterOptions && onFilterChange && (
          <div
            className="flex items-center gap-1 p-1 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            {filterOptions.map((opt) => {
              const isActive = activeFilter === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => onFilterChange(opt.value)}
                  className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-all duration-150 ${
                    isActive
                      ? 'text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.05]'
                  }`}
                  style={
                    isActive
                      ? { background: 'linear-gradient(135deg, #0059c2, #0070f3)', boxShadow: '0 2px 8px rgba(0,112,243,0.25)' }
                      : {}
                  }
                >
                  {opt.label}
                  {opt.count !== undefined && (
                    <span
                      className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] tabular-nums ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-white/[0.06] text-slate-500'
                      }`}
                    >
                      {opt.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

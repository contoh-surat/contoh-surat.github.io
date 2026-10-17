import React from 'react';
import { JobStats } from '../types';

interface StatsGridProps {
  stats: JobStats;
  onFilterByStatus?: (status: string) => void;
  activeFilter?: string;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  stats,
  onFilterByStatus,
  activeFilter = 'ALL',
}) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {/* 1. Total Keyword */}
      <button
        type="button"
        onClick={() => onFilterByStatus && onFilterByStatus('ALL')}
        className={`flex flex-col justify-between p-4 rounded-xl border text-left transition-colors cursor-pointer ${
          activeFilter === 'ALL'
            ? 'border-blue-600 bg-blue-50/50 shadow-sm'
            : 'border-slate-200 bg-white hover:border-slate-300'
        }`}
      >
        <span className="text-xs font-medium text-slate-500">Total Kueri</span>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
            {stats.total.toLocaleString()}
          </span>
          <span className="text-xs text-slate-400">kw</span>
        </div>
        <span className="mt-1 text-[11px] text-slate-400">
          {stats.completed > 0 ? `${Math.round(stats.progressPercent)}% selesai` : 'Menunggu antrean'}
        </span>
      </button>

      {/* 2. Selesai Diproses */}
      <div className="flex flex-col justify-between p-4 rounded-xl border border-slate-200 bg-white">
        <span className="text-xs font-medium text-slate-500">Selesai Diperiksa</span>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
            {stats.completed.toLocaleString()}
          </span>
          <span className="text-xs text-slate-400">/ {stats.total}</span>
        </div>
        <span className="mt-1 text-[11px] text-slate-400">
          {stats.inProgress > 0 ? `${stats.inProgress} sedang aktif` : 'Status stabil'}
        </span>
      </div>

      {/* 3. AI DETECTED (Merah Mutlak) */}
      <button
        type="button"
        onClick={() => onFilterByStatus && onFilterByStatus('AI_DETECTED')}
        className={`flex flex-col justify-between p-4 rounded-xl border text-left transition-colors cursor-pointer ${
          activeFilter === 'AI_DETECTED'
            ? 'border-rose-600 bg-rose-50 shadow-sm'
            : 'border-rose-200 bg-rose-50/40 hover:border-rose-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-rose-700">AI detected</span>
          <span className="h-2 w-2 rounded-full bg-rose-600" />
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-2xl font-bold tracking-tight text-rose-700 font-mono tabular-nums">
            {stats.aiDetected.toLocaleString()}
          </span>
          <span className="text-xs text-rose-600/70">
            {stats.completed > 0 ? `(${Math.round((stats.aiDetected / stats.completed) * 100)}%)` : ''}
          </span>
        </div>
        <span className="mt-1 text-[11px] text-rose-600">Rangkuman AI muncul</span>
      </button>

      {/* 4. AI AMAN (Hijau Mutlak) */}
      <button
        type="button"
        onClick={() => onFilterByStatus && onFilterByStatus('AI_SAFE')}
        className={`flex flex-col justify-between p-4 rounded-xl border text-left transition-colors cursor-pointer ${
          activeFilter === 'AI_SAFE'
            ? 'border-emerald-600 bg-emerald-50 shadow-sm'
            : 'border-emerald-200 bg-emerald-50/40 hover:border-emerald-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-emerald-700">AI aman</span>
          <span className="h-2 w-2 rounded-full bg-emerald-600" />
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-2xl font-bold tracking-tight text-emerald-700 font-mono tabular-nums">
            {stats.aiSafe.toLocaleString()}
          </span>
          <span className="text-xs text-emerald-600/70">
            {stats.completed > 0 ? `(${Math.round((stats.aiSafe / stats.completed) * 100)}%)` : ''}
          </span>
        </div>
        <span className="mt-1 text-[11px] text-emerald-600">SERP organik murni</span>
      </button>

      {/* 5. Belum Dapat Dipastikan (UNKNOWN - Amber) */}
      <button
        type="button"
        onClick={() => onFilterByStatus && onFilterByStatus('UNKNOWN')}
        className={`flex flex-col justify-between p-4 rounded-xl border text-left transition-colors cursor-pointer ${
          activeFilter === 'UNKNOWN'
            ? 'border-amber-600 bg-amber-50 shadow-sm'
            : 'border-amber-200 bg-amber-50/40 hover:border-amber-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-amber-800">Belum pasti</span>
          <span className="h-2 w-2 rounded-full bg-amber-500" />
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-2xl font-bold tracking-tight text-amber-800 font-mono tabular-nums">
            {stats.unknown.toLocaleString()}
          </span>
        </div>
        <span className="mt-1 text-[11px] text-amber-700">Bukti belum cukup</span>
      </button>

      {/* 6. Gagal / Error */}
      <button
        type="button"
        onClick={() => onFilterByStatus && onFilterByStatus('FAILED')}
        className={`flex flex-col justify-between p-4 rounded-xl border text-left transition-colors cursor-pointer ${
          activeFilter === 'FAILED'
            ? 'border-slate-500 bg-slate-100 shadow-sm'
            : 'border-slate-200 bg-slate-50 hover:border-slate-300'
        }`}
      >
        <span className="text-xs font-medium text-slate-600">Gagal / Timeout</span>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-2xl font-bold tracking-tight text-slate-700 font-mono tabular-nums">
            {stats.failed.toLocaleString()}
          </span>
          <span className="text-xs text-slate-500">kw</span>
        </div>
        <span className="mt-1 text-[11px] text-slate-500">Dapat diulang</span>
      </button>
    </div>
  );
};

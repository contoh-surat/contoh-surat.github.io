import React from 'react';
import { JobStatus, JobStats } from '../types';

interface QueueControlBarProps {
  status: JobStatus;
  stats: JobStats;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
  onRetryFailed: () => void;
  onExportCsv: () => void;
  onReset: () => void;
  disabledStart?: boolean;
}

export const QueueControlBar: React.FC<QueueControlBarProps> = ({
  status,
  stats,
  onStart,
  onPause,
  onResume,
  onCancel,
  onRetryFailed,
  onExportCsv,
  onReset,
  disabledStart = false,
}) => {
  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {status === 'idle' && (
            <button
              type="button"
              onClick={onStart}
              disabled={disabledStart}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors cursor-pointer whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              <span>Mulai Pemeriksaan</span>
            </button>
          )}

          {status === 'running' && (
            <>
              <button
                type="button"
                onClick={onPause}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>Jeda Antrean</span>
              </button>

              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Batalkan</span>
              </button>
            </>
          )}

          {status === 'paused' && (
            <>
              <button
                type="button"
                onClick={onResume}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                <span>Lanjutkan</span>
              </button>

              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Batalkan</span>
              </button>
            </>
          )}

          {stats.failed > 0 && status !== 'running' && (
            <button
              type="button"
              onClick={onRetryFailed}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Ulangi {stats.failed} Gagal</span>
            </button>
          )}

          {/* Export CSV */}
          <button
            type="button"
            onClick={onExportCsv}
            disabled={stats.completed === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors cursor-pointer whitespace-nowrap"
          >
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Ekspor CSV</span>
          </button>

          {/* Reset / New Check */}
          {(status === 'completed' || status === 'cancelled' || stats.completed > 0) && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>Pemeriksaan Baru</span>
            </button>
          )}
        </div>

        {/* Right: Progress and ETA */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs text-slate-600">
          {/* Progress Bar Container */}
          <div className="w-full sm:w-48 lg:w-56 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-medium text-slate-700">Progres Antrean</span>
              <span className="font-mono tabular-nums font-semibold text-slate-900">
                {Math.round(stats.progressPercent)}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full transition-all duration-300 ${
                  status === 'running'
                    ? 'bg-blue-600'
                    : status === 'paused'
                    ? 'bg-amber-500'
                    : status === 'completed'
                    ? 'bg-emerald-500'
                    : 'bg-slate-400'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, stats.progressPercent))}%` }}
              />
            </div>
          </div>

          {/* Timing details */}
          <div className="flex items-center gap-3 text-[11px] font-mono tabular-nums text-slate-500">
            <div>
              <span>Durasi: </span>
              <span className="font-semibold text-slate-700">{formatTime(stats.elapsedSeconds)}</span>
            </div>
            {stats.estimatedRemainingSeconds !== undefined && stats.estimatedRemainingSeconds > 0 && status === 'running' && (
              <>
                <span aria-hidden="true">·</span>
                <div>
                  <span>Sisa: ~</span>
                  <span className="font-semibold text-slate-700">{formatTime(stats.estimatedRemainingSeconds)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { CheckItem, DetectionStatus } from '../types';

interface ResultTableProps {
  items: CheckItem[];
  onInspectItem: (item: CheckItem) => void;
  onRerunItem?: (item: CheckItem) => void;
  onExportCsv?: () => void;
  onExportFilteredCsv?: (filtered: CheckItem[]) => void;
  activeStatusFilter?: string;
  onStatusFilterChange?: (status: string) => void;
}

export const ResultTable: React.FC<ResultTableProps> = ({
  items,
  onInspectItem,
  onRerunItem,
  onExportCsv,
  onExportFilteredCsv,
  activeStatusFilter = 'ALL',
  onStatusFilterChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'index' | 'keyword' | 'status' | 'checkedAt'>('index');
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(25);

  // Filter items based on status and search query
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Status filter
      if (activeStatusFilter !== 'ALL') {
        if (activeStatusFilter === 'FAILED') {
          if (item.status !== 'FAILED' && item.status !== 'UNSUPPORTED') return false;
        } else if (item.status !== activeStatusFilter) {
          return false;
        }
      }

      // Keyword search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const kwMatch = item.keyword.toLowerCase().includes(query);
        const evidenceMatch = item.evidenceSummary?.toLowerCase().includes(query);
        if (!kwMatch && !evidenceMatch) return false;
      }

      return true;
    });
  }, [items, activeStatusFilter, searchQuery]);

  // Sort items
  const sortedItems = useMemo(() => {
    const list = [...filteredItems];
    list.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'index') {
        cmp = a.index - b.index;
      } else if (sortField === 'keyword') {
        cmp = a.keyword.localeCompare(b.keyword);
      } else if (sortField === 'status') {
        cmp = a.status.localeCompare(b.status);
      } else if (sortField === 'checkedAt') {
        const timeA = a.checkedAt ? new Date(a.checkedAt).getTime() : 0;
        const timeB = b.checkedAt ? new Date(b.checkedAt).getTime() : 0;
        cmp = timeA - timeB;
      }
      return sortAsc ? cmp : -cmp;
    });
    return list;
  }, [filteredItems, sortField, sortAsc]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(sortedItems.length / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const paginatedItems = useMemo(() => {
    const startIdx = (validCurrentPage - 1) * pageSize;
    return sortedItems.slice(startIdx, startIdx + pageSize);
  }, [sortedItems, validCurrentPage, pageSize]);

  const handleSort = (field: 'index' | 'keyword' | 'status' | 'checkedAt') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const getStatusBadge = (status: DetectionStatus) => {
    switch (status) {
      case 'AI_DETECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-rose-50 text-rose-700 border border-rose-200">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
            AI detected
          </span>
        );
      case 'AI_SAFE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            AI aman
          </span>
        );
      case 'UNKNOWN':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-amber-50 text-amber-800 border border-amber-200">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Belum dapat dipastikan
          </span>
        );
      case 'UNSUPPORTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-purple-50 text-purple-700 border border-purple-200">
            Tidak didukung
          </span>
        );
      case 'FAILED':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-700 border border-slate-200">
            Gagal / Pending
          </span>
        );
    }
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return '-';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-xs">
      {/* Table Toolbar */}
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <svg
            className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari kata kunci atau bukti..."
            className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-600 focus:outline-hidden"
          />
        </div>

        {/* Filter Tabs & Export */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Segmented Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
            <button
              onClick={() => onStatusFilterChange && onStatusFilterChange('ALL')}
              className={`px-2.5 py-1 font-medium rounded transition-colors cursor-pointer ${
                activeStatusFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({items.length})
            </button>
            <button
              onClick={() => onStatusFilterChange && onStatusFilterChange('AI_DETECTED')}
              className={`px-2.5 py-1 font-medium rounded transition-colors cursor-pointer ${
                activeStatusFilter === 'AI_DETECTED'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-rose-700 hover:bg-rose-100/50'
              }`}
            >
              AI detected
            </button>
            <button
              onClick={() => onStatusFilterChange && onStatusFilterChange('AI_SAFE')}
              className={`px-2.5 py-1 font-medium rounded transition-colors cursor-pointer ${
                activeStatusFilter === 'AI_SAFE'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-700 hover:bg-emerald-100/50'
              }`}
            >
              AI aman
            </button>
            <button
              onClick={() => onStatusFilterChange && onStatusFilterChange('UNKNOWN')}
              className={`px-2.5 py-1 font-medium rounded transition-colors cursor-pointer ${
                activeStatusFilter === 'UNKNOWN'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-amber-800 hover:bg-amber-100/50'
              }`}
            >
              Belum pasti
            </button>
          </div>

          {/* Export Filtered button */}
          {onExportFilteredCsv && filteredItems.length > 0 && (
            <button
              type="button"
              onClick={() => onExportFilteredCsv(filteredItems)}
              title="Ekspor hanya hasil yang sedang difilter"
              className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              Ekspor Filtered ({filteredItems.length})
            </button>
          )}
        </div>
      </div>

      {/* Main Table Viewport */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <th
                onClick={() => handleSort('index')}
                className="py-3 px-4 w-12 cursor-pointer hover:text-slate-900 select-none"
              >
                # {sortField === 'index' && (sortAsc ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('keyword')}
                className="py-3 px-4 min-w-[200px] cursor-pointer hover:text-slate-900 select-none"
              >
                Kata Kunci {sortField === 'keyword' && (sortAsc ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('status')}
                className="py-3 px-4 w-36 cursor-pointer hover:text-slate-900 select-none"
              >
                Status AI {sortField === 'status' && (sortAsc ? '↑' : '↓')}
              </th>
              <th className="py-3 px-4 w-32">Target SERP</th>
              <th
                onClick={() => handleSort('checkedAt')}
                className="py-3 px-4 w-24 cursor-pointer hover:text-slate-900 select-none"
              >
                Waktu {sortField === 'checkedAt' && (sortAsc ? '↑' : '↓')}
              </th>
              <th className="py-3 px-4 min-w-[240px]">Ringkasan Bukti</th>
              <th className="py-3 px-4 w-28 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 mb-2">
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-slate-600">Tidak ada data kueri yang cocok.</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {searchQuery ? 'Coba ubah kata pencarian Anda.' : 'Masukkan kata kunci di atas dan mulai pemeriksaan.'}
                  </p>
                </td>
              </tr>
            ) : (
              paginatedItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* # */}
                  <td className="py-2.5 px-4 font-mono tabular-nums text-slate-400 text-[11px]">
                    {item.index}
                  </td>

                  {/* Keyword */}
                  <td className="py-2.5 px-4 font-medium text-slate-900">
                    <span className="font-mono text-xs">{item.keyword}</span>
                  </td>

                  {/* Status */}
                  <td className="py-2.5 px-4 whitespace-nowrap">
                    {getStatusBadge(item.status)}
                  </td>

                  {/* Target SERP */}
                  <td className="py-2.5 px-4 whitespace-nowrap text-slate-600 text-[11px]">
                    <div>
                      <span className="font-semibold text-slate-800">{item.country.toUpperCase()}</span>
                      <span className="text-slate-400"> · </span>
                      <span>{item.language}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 capitalize">{item.device}</div>
                  </td>

                  {/* Checked Time */}
                  <td className="py-2.5 px-4 whitespace-nowrap font-mono tabular-nums text-slate-500 text-[11px]">
                    {formatTime(item.checkedAt)}
                  </td>

                  {/* Evidence Summary */}
                  <td className="py-2.5 px-4 text-slate-600">
                    <p className="line-clamp-2 text-[11px] leading-relaxed">
                      {item.evidenceSummary || (item.status === 'FAILED' ? item.errorMessage : 'Menunggu respons...')}
                    </p>
                  </td>

                  {/* Actions */}
                  <td className="py-2.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Inspect Modal Trigger */}
                      <button
                        type="button"
                        onClick={() => onInspectItem(item)}
                        title="Periksa detail bukti respons"
                        className="p-1 text-slate-500 hover:text-blue-600 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>

                      {/* Manual Google Search link */}
                      <a
                        href={item.googleSearchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Buka pencarian Google resmi untuk verifikasi manual"
                        className="p-1 text-slate-500 hover:text-blue-600 rounded hover:bg-slate-100 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>

                      {/* Rerun failed */}
                      {item.status === 'FAILED' && onRerunItem && (
                        <button
                          type="button"
                          onClick={() => onRerunItem(item)}
                          title="Ulangi pemeriksaan kata kunci ini"
                          className="p-1 text-slate-500 hover:text-blue-600 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-t border-slate-200 text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <span>
            Menampilkan <strong className="font-mono tabular-nums text-slate-900">{sortedItems.length > 0 ? (validCurrentPage - 1) * pageSize + 1 : 0}</strong> -{' '}
            <strong className="font-mono tabular-nums text-slate-900">{Math.min(validCurrentPage * pageSize, sortedItems.length)}</strong> dari{' '}
            <strong className="font-mono tabular-nums text-slate-900">{sortedItems.length}</strong> kueri
          </span>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">·</span>
            <label className="text-[11px] text-slate-500">Baris per halaman:</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded border border-slate-300 bg-white py-0.5 px-1.5 text-xs text-slate-800"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {/* Page Nav */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={validCurrentPage <= 1}
            onClick={() => setCurrentPage(1)}
            className="px-2 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed text-xs cursor-pointer"
          >
            «
          </button>
          <button
            type="button"
            disabled={validCurrentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed text-xs cursor-pointer"
          >
            Sebelumnya
          </button>
          <span className="px-2 font-mono tabular-nums text-xs font-semibold text-slate-800">
            {validCurrentPage} / {totalPages}
          </span>
          <button
            type="button"
            disabled={validCurrentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed text-xs cursor-pointer"
          >
            Berikutnya
          </button>
          <button
            type="button"
            disabled={validCurrentPage >= totalPages}
            onClick={() => setCurrentPage(totalPages)}
            className="px-2 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed text-xs cursor-pointer"
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
};

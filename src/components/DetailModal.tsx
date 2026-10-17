import React from 'react';
import { CheckItem } from '../types';

interface DetailModalProps {
  item: CheckItem | null;
  onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AI_DETECTED':
        return 'bg-rose-50 border-rose-200 text-rose-700';
      case 'AI_SAFE':
        return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case 'UNKNOWN':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      default:
        return 'bg-slate-100 border-slate-200 text-slate-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'AI_DETECTED':
        return 'AI detected';
      case 'AI_SAFE':
        return 'AI aman';
      case 'UNKNOWN':
        return 'Belum dapat dipastikan';
      case 'UNSUPPORTED':
        return 'Tidak didukung';
      default:
        return 'Gagal / Pending';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Detail Pemeriksaan SERP #{item.index}
            </div>
            <h3 className="mt-1 text-base font-bold text-slate-900 font-mono">
              {item.keyword}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-4 space-y-4 text-xs text-slate-700">
          {/* Status Banner */}
          <div className={`p-3.5 rounded-lg border ${getStatusColor(item.status)}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider">
                Status Keputusan: {getStatusLabel(item.status)}
              </span>
              <span className="font-mono text-[11px]">{item.status}</span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed">
              {item.evidenceSummary}
            </p>
          </div>

          {/* Parameters Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200/80">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Target Negara</span>
              <p className="font-semibold text-slate-800">{item.countryName} ({item.country.toUpperCase()})</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Bahasa (hl)</span>
              <p className="font-semibold text-slate-800">{item.languageName}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Perangkat</span>
              <p className="font-semibold text-slate-800 capitalize">{item.device}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Latensi / Waktu</span>
              <p className="font-semibold text-slate-800 font-mono tabular-nums">
                {item.latencyMs !== undefined ? `${item.latencyMs} ms` : '-'}
              </p>
            </div>
          </div>

          {/* AI Overview Snippet if available */}
          {item.evidenceDetails?.snippet && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-900 uppercase tracking-wider">
                Cuplikan Sintesis AI Overview
              </span>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-slate-800 text-xs leading-relaxed">
                {item.evidenceDetails.snippet}
              </div>
            </div>
          )}

          {/* AI Overview References/Citations if available */}
          {item.evidenceDetails?.references && item.evidenceDetails.references.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-900 uppercase tracking-wider">
                Sumber Referensi Web yang Dikutip AI ({item.evidenceDetails.references.length})
              </span>
              <div className="space-y-2">
                {item.evidenceDetails.references.map((ref, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-slate-200 p-2.5 bg-white text-xs hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-blue-600 line-clamp-1">{ref.title}</span>
                      {ref.source && (
                        <span className="text-[10px] text-slate-400 shrink-0 ml-2">{ref.source}</span>
                      )}
                    </div>
                    {ref.snippet && (
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{ref.snippet}</p>
                    )}
                    {ref.link && (
                      <a
                        href={ref.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-slate-400 hover:text-blue-600 underline block mt-1 truncate"
                      >
                        {ref.link}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technical Diagnostics */}
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-[11px] text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span>Provider SERP:</span>
              <span className="font-mono font-semibold uppercase">{item.provider}</span>
            </div>
            {item.checkedAt && (
              <div className="flex justify-between">
                <span>Timestamp Pemeriksaan:</span>
                <span className="font-mono">{new Date(item.checkedAt).toLocaleString('id-ID')}</span>
              </div>
            )}
            {item.evidenceDetails?.triggerType && (
              <div className="flex justify-between">
                <span>Jenis Pemicu AI:</span>
                <span className="font-semibold">{item.evidenceDetails.triggerType}</span>
              </div>
            )}
            {item.evidenceDetails?.rawIndicators && (
              <div className="flex justify-between">
                <span>Indikator Teknis:</span>
                <span className="font-mono text-slate-500">{item.evidenceDetails.rawIndicators.join(', ')}</span>
              </div>
            )}
          </div>

          {/* Verification Disclaimer */}
          <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-3 text-xs text-blue-900 leading-relaxed">
            <strong className="font-semibold">Catatan Verifikasi Independen:</strong> Tautan verifikasi di bawah membuka halaman pencarian Google resmi. Perhatikan bahwa hasil Google dinamis dan dapat berbeda berdasarkan personalisasi akun Anda, cache lokasi ISP, dan eksperimen algoritma Google.
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <a
            href={item.googleSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span>Buka Google Search untuk Verifikasi Manual</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

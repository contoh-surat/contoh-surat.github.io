import React from 'react';

interface NotFoundProps {
  onNavigate: (path: string) => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ onNavigate }) => {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 lg:px-8 text-center space-y-6">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 font-mono text-2xl font-black">
        404
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
          Tautan yang Anda tuju mungkin telah berpindah lokasi, dihapus, atau terjadi kesalahan pengetikan alamat URL.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          Kembali ke Beranda
        </button>

        <button
          type="button"
          onClick={() => onNavigate('/checker')}
          className="px-4 py-2.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          Buka Alat Checker
        </button>
      </div>
    </div>
  );
};

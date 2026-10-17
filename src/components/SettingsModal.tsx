import React, { useState } from 'react';
import { ApiConfig, SerpProvider } from '../types';

interface SettingsModalProps {
  config: ApiConfig;
  onSave: (newConfig: ApiConfig) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  config,
  onSave,
  onClose,
}) => {
  const [provider, setProvider] = useState<SerpProvider>(config.provider);
  const [apiKey, setApiKey] = useState<string>(config.apiKey || '');
  const [customEndpoint, setCustomEndpoint] = useState<string>(config.customEndpoint || '');
  const [concurrency, setConcurrency] = useState<number>(config.concurrency || 2);
  const [useServerProxy, setUseServerProxy] = useState<boolean>(config.useServerProxy ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mode = provider === 'demo' ? 'DEMO' : apiKey ? 'INTEGRATION_CONFIGURED' : 'DEMO';
    onSave({
      provider,
      apiKey: apiKey.trim(),
      customEndpoint: customEndpoint.trim() || undefined,
      concurrency,
      mode,
      useServerProxy,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Pengaturan Integrasi SERP & Mesin Antrean
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Konfigurasikan penyedia data Google SERP untuk pemeriksaan live atau gunakan mode demo.
            </p>
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

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          {/* Provider Selection */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1.5">
              Pilih Mesin / Provider SERP
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setProvider('demo')}
                className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                  provider === 'demo'
                    ? 'border-blue-600 bg-blue-50/60'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">Mode Demo & Simulasi</span>
                  <span className="text-[10px] bg-blue-100 text-blue-700 font-mono px-1.5 py-0.5 rounded">
                    Gratis / Built-in
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Uji coba instan tanpa API key. Menggunakan data realistis bahasa Indonesia & Inggris dengan tanda [DEMO].
                </p>
              </button>

              <button
                type="button"
                onClick={() => setProvider('serpapi')}
                className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                  provider === 'serpapi'
                    ? 'border-blue-600 bg-blue-50/60'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">SerpApi (Live SERP)</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono px-1.5 py-0.5 rounded">
                    Rekomendasi
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Mendukung parsing modul `ai_overview` resmi Google untuk Indonesia (ID) & global.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setProvider('valueserp')}
                className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                  provider === 'valueserp'
                    ? 'border-blue-600 bg-blue-50/60'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">ValueSERP / SearchApi</span>
                  <span className="text-[10px] bg-slate-100 text-slate-700 font-mono px-1.5 py-0.5 rounded">
                    Live SERP
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Mendukung parsing blok SGE/AI Overview untuk kueri desktop dan seluler.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setProvider('custom')}
                className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                  provider === 'custom'
                    ? 'border-blue-600 bg-blue-50/60'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">Custom SERP Endpoint</span>
                  <span className="text-[10px] bg-slate-100 text-slate-700 font-mono px-1.5 py-0.5 rounded">
                    Enterprise
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Hubungkan proxy internal atau adaptor scraping kustom milik perusahaan Anda.
                </p>
              </button>
            </div>
          </div>

          {/* API Key Input (if not demo) */}
          {provider !== 'demo' && (
            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-800">
                API Key {provider === 'serpapi' ? 'SerpApi' : provider === 'valueserp' ? 'ValueSERP' : 'Layanan'}
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Masukkan API Key Anda..."
                className="w-full rounded-lg border border-slate-300 p-2 text-xs font-mono text-slate-800 focus:border-blue-600 focus:outline-hidden"
              />
              <p className="text-[11px] text-slate-500">
                Kunci Anda dikirim melalui server proxy aman di memori sesi tanpa disimpan permanen ke database publik.
              </p>
            </div>
          )}

          {/* Custom Endpoint URL (if custom) */}
          {provider === 'custom' && (
            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-800">
                Custom Endpoint URL
              </label>
              <input
                type="url"
                value={customEndpoint}
                onChange={(e) => setCustomEndpoint(e.target.value)}
                placeholder="https://api.yourcompany.com/v1/serp"
                className="w-full rounded-lg border border-slate-300 p-2 text-xs font-mono text-slate-800 focus:border-blue-600 focus:outline-hidden"
              />
            </div>
          )}

          {/* Concurrency Settings */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-800">
                Batas Concurrency (Permintaan Paralel)
              </label>
              <span className="font-mono tabular-nums font-bold text-blue-600 text-sm">
                {concurrency} permintaan sekaligus
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={concurrency}
              onChange={(e) => setConcurrency(Number(e.target.value))}
              className="w-full cursor-pointer accent-blue-600"
            />
            <p className="text-[11px] text-slate-500">
              Disarankan 2-3 untuk mencegah rate-limiting atau blokir IP dari penyedia SERP.
            </p>
          </div>

          {/* Server Proxy Option */}
          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200/80">
            <input
              type="checkbox"
              id="serverProxyToggle"
              checked={useServerProxy}
              onChange={(e) => setUseServerProxy(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="serverProxyToggle" className="text-xs text-slate-700 cursor-pointer">
              <strong>Gunakan Server Proxy Backend (/api/check)</strong>
              <div className="text-[11px] text-slate-500">
                Mencegah kebocoran API Key di devtools browser dan menyelesaikan isu CORS.
              </div>
            </label>
          </div>

          {/* Security Notice */}
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-amber-900 text-[11px] leading-relaxed">
            <strong>Keamanan Kredensial:</strong> Kami tidak pernah mencatat atau membagikan API key Anda. Dalam mode Demo, tidak ada permintaan keluar ke API pihak ketiga berbayar.
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
            >
              Simpan Pengaturan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

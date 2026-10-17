import React, { useState, useEffect } from 'react';
import { ApiConfig } from '../types';

interface ServiceStatusProps {
  onNavigate: (path: string) => void;
  apiConfig: ApiConfig;
  onOpenSettings: () => void;
}

export const ServiceStatus: React.FC<ServiceStatusProps> = ({
  onNavigate,
  apiConfig,
  onOpenSettings,
}) => {
  const [serverHealth, setServerHealth] = useState<{ status: string; timestamp?: string } | null>(null);
  const [pingLatency, setPingLatency] = useState<number | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      const start = performance.now();
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          const data = await res.json();
          setServerHealth(data);
          setPingLatency(Math.round(performance.now() - start));
        } else {
          setServerHealth({ status: 'error' });
        }
      } catch {
        // Static hosting fallback
        setServerHealth({ status: 'static_standalone_mode', timestamp: new Date().toISOString() });
        setPingLatency(Math.round(performance.now() - start));
      }
    };
    checkHealth();
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumb & Header */}
      <div>
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <button onClick={() => onNavigate('/')} className="hover:text-blue-600 cursor-pointer">
            Beranda
          </button>
          <span aria-hidden="true">/</span>
          <span className="text-slate-900 font-medium">Status & Diagnostik SERP</span>
        </div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Status Layanan & Diagnostik Adapter
        </h1>
        <p className="mt-2 text-xs text-slate-600 leading-relaxed">
          Pemantauan kesehatan server proxy, adapter penyedia SERP, latensi antrean, dan panduan kuota operasional.
        </p>
      </div>

      {/* Top Health Metric Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Status Server Backend
          </span>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-base font-bold text-slate-900">
              {serverHealth?.status === 'ok'
                ? 'Operasional Aktif (Express Proxy)'
                : 'Mode Statis / Mandiri'}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400 font-mono">
            Ping: {pingLatency !== null ? `${pingLatency} ms` : 'Mengukur...'}
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Mode Operasional Aktif
          </span>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                apiConfig.mode === 'LIVE_VERIFIED'
                  ? 'bg-blue-600'
                  : apiConfig.mode === 'INTEGRATION_CONFIGURED'
                  ? 'bg-emerald-500'
                  : 'bg-amber-500'
              }`}
            />
            <span className="text-base font-bold text-slate-900 font-mono">
              {apiConfig.mode}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Provider: <strong className="uppercase text-slate-700">{apiConfig.provider}</strong>
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Batas Konkurensi Antrean
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {apiConfig.concurrency}
            </span>
            <span className="text-xs text-slate-500">worker paralel</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Proxy Server: {apiConfig.useServerProxy ? 'Aktif (Aman)' : 'Nonaktif'}
          </p>
        </div>
      </div>

      {/* Provider Adapter Table */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Daftar Adapter SERP & Kompatibilitas Fitur AI Overview
          </h2>
          <button
            onClick={onOpenSettings}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            Konfigurasikan di Sini →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="py-2.5 px-3">Adapter / Layanan</th>
                <th className="py-2.5 px-3">Status Konfigurasi</th>
                <th className="py-2.5 px-3">Dukungan AI Overview</th>
                <th className="py-2.5 px-3">Target Google Indonesia</th>
                <th className="py-2.5 px-3">Model Biaya / Kuota</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-900">
                  Built-in Demo Engine
                </td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Siap Digunakan
                  </span>
                </td>
                <td className="py-3 px-3">Tersedia (Simulasi Realistis)</td>
                <td className="py-3 px-3">Didukung Penuh (ID & Global)</td>
                <td className="py-3 px-3 font-mono">Gratis (Tanpa Kuota)</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-900">
                  SerpApi Adapter
                </td>
                <td className="py-3 px-3">
                  {apiConfig.provider === 'serpapi' && apiConfig.apiKey ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      Terkonfigurasi
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                      Menunggu API Key
                    </span>
                  )}
                </td>
                <td className="py-3 px-3">Objek `ai_overview` Resmi</td>
                <td className="py-3 px-3">Didukung (gl=id, hl=id)</td>
                <td className="py-3 px-3 font-mono">1 kueri = 1 credit</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-900">
                  ValueSERP / SearchApi
                </td>
                <td className="py-3 px-3">
                  {apiConfig.provider === 'valueserp' && apiConfig.apiKey ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      Terkonfigurasi
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                      Menunggu API Key
                    </span>
                  )}
                </td>
                <td className="py-3 px-3">Blok SGE / AI Module</td>
                <td className="py-3 px-3">Didukung</td>
                <td className="py-3 px-3 font-mono">Tergantung Paket</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-900">
                  Custom Endpoint
                </td>
                <td className="py-3 px-3">
                  {apiConfig.provider === 'custom' && apiConfig.customEndpoint ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      Custom URL Aktif
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                      Belum Diatur
                    </span>
                  )}
                </td>
                <td className="py-3 px-3">Sesuai Format JSON Anda</td>
                <td className="py-3 px-3">Sesuai Endpoint</td>
                <td className="py-3 px-3 font-mono">Infrastruktur Sendiri</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Operational Advice */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-xs text-slate-700 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">
          Pertimbangan Biaya & Estimasi Pemrosesan 1.000 Keyword
        </h3>
        <p className="leading-relaxed">
          Memproses 1.000 keyword secara riil melalui layanan SERP berbayar membutuhkan sekitar 1.000 request kredit. Pada kecepatan 2 request per detik (concurrency 2), pekerjaan 1.000 keyword selesai dalam kurun waktu sekitar 8 hingga 12 menit secara aman tanpa risiko pemblokiran IP.
        </p>
        <p className="leading-relaxed">
          Jika Anda baru mencoba fitur antrean atau ingin menguji alur ekspor CSV, gunakan <strong>Mode Demo</strong> yang 100% bebas biaya dan aman.
        </p>
      </div>
    </div>
  );
};

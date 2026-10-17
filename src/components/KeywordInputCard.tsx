import React, { useState, useMemo, useRef } from 'react';
import { COUNTRY_OPTIONS, LANGUAGE_OPTIONS } from '../data/geoPresets';
import { DeviceType } from '../types';

interface KeywordInputCardProps {
  onQueueReady: (
    keywords: string[],
    country: string,
    language: string,
    device: DeviceType
  ) => void;
  isProcessing: boolean;
  selectedCountry: string;
  selectedLanguage: string;
  selectedDevice: DeviceType;
  onChangeCountry: (country: string) => void;
  onChangeLanguage: (language: string) => void;
  onChangeDevice: (device: DeviceType) => void;
}

const SAMPLE_KEYWORDS = [
  'cara membuat paspor online 2026',
  'apa itu google ai overview',
  'resep rendang padang asli daging sapi',
  'gejala asam lambung naik ke dada',
  'perbedaan sge dan ai overview',
  'what is retrieval augmented generation',
  'login klik bca individual',
  'tokopedia promo ramadhan',
  'beli sepatu running nike original',
  'harga tiket pesawat jakarta bali',
  'bengkel mobil matic terdekat',
  'tips merawat baterai mobil listrik',
  'how to rank in google ai overview',
  'rumus menghitung luas trapesium',
  'jadwal puasa ramadhan 2026 indonesia',
];

export const KeywordInputCard: React.FC<KeywordInputCardProps> = ({
  onQueueReady,
  isProcessing,
  selectedCountry,
  selectedLanguage,
  selectedDevice,
  onChangeCountry,
  onChangeLanguage,
  onChangeDevice,
}) => {
  const [rawText, setRawText] = useState<string>('');
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse lines, deduplicate, calculate stats
  const { validKeywords, duplicatesCount, emptyLinesCount, isOverLimit } = useMemo(() => {
    const lines = rawText.split('\n');
    const seen = new Set<string>();
    const valid: string[] = [];
    let duplicates = 0;
    let empty = 0;

    for (const rawLine of lines) {
      const trimmed = rawLine.trim();
      if (!trimmed) {
        empty++;
        continue;
      }
      const normalized = trimmed.toLowerCase();
      if (seen.has(normalized)) {
        duplicates++;
      } else {
        seen.add(normalized);
        valid.push(trimmed);
      }
    }

    return {
      validKeywords: valid,
      duplicatesCount: duplicates,
      emptyLinesCount: empty,
      isOverLimit: valid.length > 1000,
    };
  }, [rawText]);

  const handleLoadSample = () => {
    setRawText(SAMPLE_KEYWORDS.join('\n'));
    setFileError(null);
  };

  const handleClear = () => {
    setRawText('');
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
      setFileError('Format file harus .csv atau .txt');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) {
        setFileError('File kosong');
        return;
      }

      // If CSV, extract first column or lines
      const rows = content.split(/\r?\n/);
      const extracted: string[] = [];

      for (const row of rows) {
        if (!row.trim()) continue;
        // Simple CSV parse: get first cell or strip quotes
        let firstCell = row.split(',')[0].trim();
        if (firstCell.startsWith('"') && firstCell.endsWith('"')) {
          firstCell = firstCell.slice(1, -1).replace(/""/g, '"');
        }
        // Filter out header like "keyword" or "kata kunci" if detected
        if (
          extracted.length === 0 &&
          ['keyword', 'keywords', 'kata kunci', 'query', 'kueri'].includes(
            firstCell.toLowerCase()
          )
        ) {
          continue;
        }
        if (firstCell) {
          extracted.push(firstCell);
        }
      }

      setRawText(extracted.join('\n'));
    };

    reader.onerror = () => {
      setFileError('Gagal membaca file');
    };

    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validKeywords.length === 0 || isOverLimit || isProcessing) return;
    onQueueReady(validKeywords, selectedCountry, selectedLanguage, selectedDevice);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Top Header & Fast Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Input Kata Kunci SERP
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Maksimal 1.000 kata kunci per batch (satu kueri per baris atau unggah CSV).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLoadSample}
              disabled={isProcessing}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
            >
              Muat Contoh (15 KW)
            </button>

            <label className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer inline-flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span>Impor CSV</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                disabled={isProcessing}
                className="hidden"
              />
            </label>

            {rawText && (
              <button
                type="button"
                onClick={handleClear}
                disabled={isProcessing}
                className="px-2 py-1.5 text-xs text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
              >
                Hapus
              </button>
            )}
          </div>
        </div>

        {fileError && (
          <div className="rounded-lg bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-700">
            {fileError}
          </div>
        )}

        {/* Textarea */}
        <div className="relative">
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            disabled={isProcessing}
            rows={6}
            placeholder={`Masukkan daftar keyword di sini (satu per baris)...
Contoh:
cara membuat paspor online 2026
apa itu google ai overview
resep rendang padang asli
login bca individual`}
            className="w-full rounded-lg border border-slate-300 p-3 text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-hidden disabled:bg-slate-50 transition-colors"
          />
        </div>

        {/* Live Counters */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-3">
            <span className="font-medium text-slate-900">
              Valid: <strong className="font-mono tabular-nums text-blue-600">{validKeywords.length}</strong> / 1.000
            </span>
            {duplicatesCount > 0 && (
              <>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-slate-500">
                  {duplicatesCount} duplikat dibuang
                </span>
              </>
            )}
            {emptyLinesCount > 0 && (
              <>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-slate-500">
                  {emptyLinesCount} baris kosong
                </span>
              </>
            )}
          </div>

          {isOverLimit && (
            <div className="text-rose-600 font-semibold text-xs">
              Maksimal 1.000 kata kunci! Kurangi {validKeywords.length - 1000} kata kunci.
            </div>
          )}
        </div>

        {/* Search Parameters: Country, Language, Device */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 bg-slate-50 p-3 rounded-lg border border-slate-200/80">
          {/* Target Country */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Negara Target Pencarian (gl)
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => onChangeCountry(e.target.value)}
              disabled={isProcessing}
              className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
            >
              {COUNTRY_OPTIONS.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Target Language */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Bahasa Antarmuka (hl)
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => onChangeLanguage(e.target.value)}
              disabled={isProcessing}
              className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
            >
              {LANGUAGE_OPTIONS.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* Device Type */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Jenis Perangkat SERP
            </label>
            <div className="flex rounded-md border border-slate-300 bg-white p-0.5">
              <button
                type="button"
                onClick={() => onChangeDevice('desktop')}
                disabled={isProcessing}
                className={`flex-1 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                  selectedDevice === 'desktop'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Desktop
              </button>
              <button
                type="button"
                onClick={() => onChangeDevice('mobile')}
                disabled={isProcessing}
                className={`flex-1 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                  selectedDevice === 'mobile'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mobile
              </button>
            </div>
          </div>
        </div>

        {/* Submit to Queue Button */}
        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={validKeywords.length === 0 || isOverLimit || isProcessing}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <span>Muat {validKeywords.length} Kata Kunci ke Antrean</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

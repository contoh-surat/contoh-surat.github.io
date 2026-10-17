import React from 'react';
import { FAQ_ITEMS } from '../data/faqs';
import { BLOG_ARTICLES } from '../data/blogArticles';

interface HomeProps {
  onNavigate: (path: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-12 text-center lg:text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Audit SERP Generatif Berkecepatan Tinggi
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Ketahui Apakah Google Menampilkan{' '}
              <span className="text-blue-600">AI Overview</span> pada Kata Kunci Anda
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Alat diagnostik profesional untuk memeriksa hingga 1.000 keyword sekaligus. Dapatkan kepastian apakah kueri pencarian Anda memicu ringkasan AI sintetis atau tetap aman di hasil organik klasik.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 justify-center lg:justify-start">
              <button
                type="button"
                onClick={() => onNavigate('/checker')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <span>Buka Checker 1.000 Keyword</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/blog')}
                className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Baca Panduan SEO AI
              </button>
            </div>

            {/* Micro proof */}
            <div className="pt-4 flex flex-wrap items-center gap-6 justify-center lg:justify-start text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Mendukung Google Indonesia (gl=id) & Global</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Ekspor CSV Kebal Formula Injection</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Mode Demo Siap Pakai</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Card: Mini Live Preview Mockup */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500" />
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[11px] font-mono text-slate-400">SERP Diagnostic Engine</span>
              </div>

              {/* Sample Result Items */}
              <div className="space-y-3">
                <div className="p-3 rounded-lg border border-rose-200 bg-rose-50/50">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-slate-900">
                      cara membuat paspor online 2026
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                      AI detected
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-600 line-clamp-2">
                    Rangkuman sintesis Google Gemini muncul dengan 4 kartu rujukan website resmi.
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/50">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-slate-900">
                      login klik bca individual
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                      AI aman
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-600">
                    Hasil organik murni. Tidak ada modul AI yang memotong alur klik pengguna.
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/50">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-slate-900">
                      jadwal puasa ramadhan 2026
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      Belum pasti
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-600">
                    Respons memerlukan verifikasi manual karena variasi waktu peluncuran.
                  </p>
                </div>
              </div>

              {/* Button to checker */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onNavigate('/checker')}
                  className="w-full py-2 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer text-center"
                >
                  Coba Periksa Daftar Keyword Anda Sendiri →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Keunggulan Utama */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Mengapa Pemantauan AI Overview Begitu Kritis?
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            AI Overview mengubah struktur klik Google secara radikal. Berikut alasan Anda memerlukan audit berkala:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mb-4 font-bold">
              01
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-2">
              Lindungi Anggaran Konten Anda
            </h3>
            <p className="text-xs leading-relaxed text-slate-600">
              Jangan membuang jutaan rupiah untuk memproduksi artikel pada keyword yang telah disapu bersih oleh ringkasan instan AI Overview. Fokuskan tenaga tim pada kueri yang terbukti *AI-Safe*.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mb-4 font-bold">
              02
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-2">
              Rebut Posisi Kartu Sitasi AI
            </h3>
            <p className="text-xs leading-relaxed text-slate-600">
              Pada kueri yang memunculkan AI Overview, ketahui persis domain mana yang dijadikan rujukan rujukan Google. Tiru format data mereka agar artikel Anda muncul di etalase AI teratas.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mb-4 font-bold">
              03
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-2">
              Audit Massal Tanpa Batas 1.000 KW
            </h3>
            <p className="text-xs leading-relaxed text-slate-600">
              Menguji kata kunci satu per satu secara manual memakan waktu berhari-hari dan bias oleh riwayat peramban pribadi. Gunakan antrean batch otomatis dengan ekspor CSV profesional.
            </p>
          </div>
        </div>
      </section>

      {/* Cara Kerja Sistem */}
      <section className="bg-slate-50 py-12 border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Alur Kerja 4 Langkah Sederhana
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Dari daftar mentah menjadi laporan audit terstruktur dalam hitungan menit.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-lg bg-white border border-slate-200 text-left">
              <div className="text-xs font-mono font-bold text-blue-600 mb-2">LANGKAH 1</div>
              <h4 className="text-sm font-semibold text-slate-900 mb-1">Input Kata Kunci</h4>
              <p className="text-xs text-slate-500">
                Tempel hingga 1.000 baris kueri atau unggah file spreadsheet CSV Anda. Sistem otomatis membuang duplikat.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-white border border-slate-200 text-left">
              <div className="text-xs font-mono font-bold text-blue-600 mb-2">LANGKAH 2</div>
              <h4 className="text-sm font-semibold text-slate-900 mb-1">Pilih Target Geografis</h4>
              <p className="text-xs text-slate-500">
                Tentukan negara (misal Indonesia google.co.id), bahasa antarmuka, dan tipe perangkat (desktop/mobile).
              </p>
            </div>

            <div className="p-5 rounded-lg bg-white border border-slate-200 text-left">
              <div className="text-xs font-mono font-bold text-blue-600 mb-2">LANGKAH 3</div>
              <h4 className="text-sm font-semibold text-slate-900 mb-1">Proses Antrean Terkendali</h4>
              <p className="text-xs text-slate-500">
                Mesin antrean mengirim permintaan secara asinkron dengan kontrol konkurensi aman untuk mencegah rate limit.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-white border border-slate-200 text-left">
              <div className="text-xs font-mono font-bold text-blue-600 mb-2">LANGKAH 4</div>
              <h4 className="text-sm font-semibold text-slate-900 mb-1">Analisis & Ekspor CSV</h4>
              <p className="text-xs text-slate-500">
                Periksa bukti sintesis per baris dan unduh berkas CSV siap olah yang kompatibel dengan Excel dan Google Sheets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Blog Articles Preview */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Artikel & Riset SEO AI Terkini
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Panduan mendalam yang ditulis oleh praktisi teknis mengenai strategi menghadapi mesin pencari modern.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/blog')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            Lihat Semua Artikel ({BLOG_ARTICLES.length}) →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BLOG_ARTICLES.slice(0, 3).map((art) => (
            <div
              key={art.id}
              onClick={() => onNavigate(`/blog/${art.slug}`)}
              className="p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                  <span className="text-blue-600 font-semibold">{art.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{art.readingTime}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 line-clamp-2 mb-2 hover:text-blue-600 transition-colors">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {art.summary}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-mono">{art.publishedAt}</span>
                <span className="text-blue-600 font-medium">Baca Selengkapnya →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Jawaban lugas dan transparan mengenai kapabilitas dan akurasi platform.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.slice(0, 4).map((faq, idx) => (
            <details
              key={idx}
              className="group rounded-xl border border-slate-200 bg-white p-4 transition-colors"
            >
              <summary className="flex cursor-pointer items-center justify-between text-xs font-semibold text-slate-900">
                <span>{faq.question}</span>
                <span className="transition-transform group-open:rotate-180 text-slate-400">
                  ↓
                </span>
              </summary>
              <p className="mt-3 text-xs leading-relaxed text-slate-600 border-t border-slate-100 pt-3">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => onNavigate('/faq')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            Lihat Halaman FAQ Lengkap →
          </button>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-slate-900 p-8 sm:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Siap Mengaudit Kata Kunci Organik Anda?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-xs sm:text-sm text-slate-300 leading-relaxed">
            Gunakan Google AI Overview Checker sekarang juga secara instan melalui mode demo bawaan atau sambungkan provider SERP langsung Anda.
          </p>
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => onNavigate('/checker')}
              className="px-6 py-3 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl shadow-md transition-all cursor-pointer"
            >
              Buka Workstation Checker Sekarang
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

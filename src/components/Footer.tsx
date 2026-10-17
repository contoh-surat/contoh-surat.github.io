import React from 'react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-600">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Brand and Mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
                AI
              </div>
              <span className="text-base font-semibold text-slate-900">
                Google AI Overview Checker
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              Platform diagnostik hasil pencarian profesional untuk memantau kemunculan sintesis kecerdasan buatan Google SERP pada skala masif hingga 1.000 kata kunci per batch.
            </p>
            <div className="text-xs text-slate-400">
              Independen · Non-afiliasi Google LLC · Dirancang untuk Tim SEO
            </div>
          </div>

          {/* Navigasi Utama */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Navigasi Aplikasi
            </div>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('/')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left"
                >
                  Beranda
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/checker')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left"
                >
                  Alat Checker (1.000 KW)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/status')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left"
                >
                  Status Layanan & Latensi
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/faq')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left"
                >
                  Tanya Jawab (FAQ)
                </button>
              </li>
            </ul>
          </div>

          {/* Edukasi & Artikel */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Edukasi & Riset SEO
            </div>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('/blog')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left"
                >
                  Semua Artikel Blog
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/blog/mengenal-google-ai-overview-panduan-lengkap')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left line-clamp-1"
                >
                  Mengenal Google AI Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/blog/dampak-ai-overview-terhadap-ctr-dan-trafik-organik')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left line-clamp-1"
                >
                  Dampak AI Terhadap CTR
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/blog/cara-memeriksa-kemunculan-ai-overview-pada-ribuan-keyword')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left line-clamp-1"
                >
                  Cara Cek Ribuan Keyword
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/blog/optimalisasi-konten-muncul-sebagai-sumber-referensi-ai')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left line-clamp-1"
                >
                  Optimalisasi Sumber Sitasi
                </button>
              </li>
            </ul>
          </div>

          {/* Legalitas & Kontak */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Kebijakan & Informasi
            </div>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left"
                >
                  Tentang Kami
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left"
                >
                  Hubungi Dukungan
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/disclaimer')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left"
                >
                  Disclaimer & Batasan Tanggung Jawab
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/privacy')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left"
                >
                  Kebijakan Privasi
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/terms')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left"
                >
                  Syarat & Ketentuan Layanan
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Hairline divider & disclaimer */}
        <div className="mt-10 border-t border-slate-200 pt-6">
          <p className="text-xs leading-relaxed text-slate-400">
            <strong>Penafian Merek Dagang:</strong> Google, Google Search, Google AI Overview, dan SGE adalah merek dagang terdaftar milik Google LLC. Aplikasi ini merupakan perangkat lunak analisis independen pihak ketiga yang memanfaatkan antarmuka SERP terstruktur dan tidak didukung, disponsori, atau berafiliasi secara resmi dengan Google LLC.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              &copy; {new Date().getFullYear()} Google AI Overview Checker. Seluruh hak cipta dilindungi undang-undang.
            </div>
            <div className="flex items-center gap-3">
              <span>Produksi Terverifikasi</span>
              <span aria-hidden="true">·</span>
              <span>Versi 1.0.0</span>
              <span aria-hidden="true">·</span>
              <span>RFC-4180 CSV Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

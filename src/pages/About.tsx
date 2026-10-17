import React from 'react';

interface AboutProps {
  onNavigate: (path: string) => void;
}

export const About: React.FC<AboutProps> = ({ onNavigate }) => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      {/* Breadcrumb & Title */}
      <div>
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <button onClick={() => onNavigate('/')} className="hover:text-blue-600 cursor-pointer">
            Beranda
          </button>
          <span aria-hidden="true">/</span>
          <span className="text-slate-900 font-medium">Tentang Kami</span>
        </div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Tentang Google AI Overview Checker
        </h1>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          Inisiatif riset independen dan instrumen rekayasa perangkat lunak untuk transparansi hasil pencarian di era Search Generative Experience.
        </p>
      </div>

      {/* Main Content */}
      <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed text-slate-700 space-y-6">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">Misi Kami</h2>
          <p>
            Lanskap optimasi mesin pencari (SEO) sedang mengalami pergeseran tektonik terbesar dalam 25 tahun terakhir sejak Google memperkenalkan sintesis generatif langsung di halaman SERP. Bagi jutaan pemilik website, penerbit berita, kreator konten, dan agensi digital di Indonesia dan dunia, ketidakpastian mengenai kapan dan bagaimana AI Overview muncul menciptakan risiko bisnis yang nyata.
          </p>
          <p>
            Misi kami adalah menghadirkan instrumen audit teknis yang transparan, objektif, dan dapat diandalkan secara skala masif, memungkinkan para profesional menganalisis dampak nyata SERP tanpa harus bergantung pada spekulasi, tebakan manual, atau data buatan yang tidak terverifikasi.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">Prinsip Rekayasa Perangkat Lunak</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h3 className="text-xs font-bold text-slate-900 mb-1">Objektivitas Bukti Mutlak</h3>
              <p className="text-xs text-slate-600">
                Kami menerapkan aturan status ketat: status <em>AI aman</em> hanya diberikan jika respons SERP valid membuktikan ketiadaan modul AI. Respons yang terputus atau tidak lengkap diklasifikasikan secara jujur sebagai <em>Belum dapat dipastikan</em>.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h3 className="text-xs font-bold text-slate-900 mb-1">Keamanan Data & Privasi</h3>
              <p className="text-xs text-slate-600">
                Kueri pencarian bisnis Anda adalah aset bernilai tinggi. Kami tidak pernah menyimpan daftar keyword Anda di basis data publik, tidak menjual data penelusuran, dan melindungi berkas ekspor dari celah formula injection.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h3 className="text-xs font-bold text-slate-900 mb-1">Skalabilitas 1.000 Kata Kunci</h3>
              <p className="text-xs text-slate-600">
                Arsitektur antrean asinkron kami dirancang untuk menangani beban kerja berat hingga 1.000 keyword dengan kontrol konkurensi cerdas, mencegah pemblokiran rate limit dari penyedia data.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h3 className="text-xs font-bold text-slate-900 mb-1">Keterbukaan Multi-Provider</h3>
              <p className="text-xs text-slate-600">
                Pengguna memiliki fleksibilitas penuh untuk memanfaatkan adapter SerpApi, ValueSERP, atau endpoint internal khusus, di samping mode simulasi demo bawaan untuk pengujian instan.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">Independensi dan Penafian</h2>
          <p>
            Platform ini sepenuhnya independen dan dikembangkan oleh praktisi rekayasa data serta SEO teknis. Kami tidak memiliki afiliasi korporat resmi dengan Google LLC atau Alphabet Inc. Seluruh pengujian SERP dilakukan melalui protokol antarmuka resmi terstruktur demi menjaga kepatuhan dan integritas ekosistem digital.
          </p>
        </section>

        {/* CTA */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">Ada pertanyaan atau butuh integrasi API khusus?</span>
          <button
            onClick={() => onNavigate('/contact')}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
          >
            Hubungi Tim Teknis Kami
          </button>
        </div>
      </div>
    </div>
  );
};

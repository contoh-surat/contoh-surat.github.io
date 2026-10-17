import React from 'react';

interface TermsProps {
  onNavigate: (path: string) => void;
}

export const Terms: React.FC<TermsProps> = ({ onNavigate }) => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      <div>
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <button onClick={() => onNavigate('/')} className="hover:text-blue-600 cursor-pointer">
            Beranda
          </button>
          <span aria-hidden="true">/</span>
          <span className="text-slate-900 font-medium">Syarat & Ketentuan</span>
        </div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Syarat & Ketentuan Layanan
        </h1>
        <p className="mt-2 text-xs text-slate-500">
          Pedoman penggunaan yang adil, batasan kapasitas, dan tanggung jawab pengguna.
        </p>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed text-slate-700 space-y-6">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Penerimaan Ketentuan</h2>
          <p>
            Dengan mengakses atau menggunakan aplikasi Google AI Overview Checker, Anda menyatakan setuju untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak menyetujui salah satu bagian dari ketentuan ini, Anda dipersilakan untuk tidak menggunakan aplikasi.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Kebijakan Penggunaan yang Wajar (Fair Use)</h2>
          <p>
            Aplikasi ini dirancang untuk praktisi SEO, pemilik bisnis, dan peneliti web. Demi menjaga stabilitas performa bagi seluruh pengguna:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Batas maksimum pemeriksaan dalam satu sesi adalah <strong>1.000 kata kunci</strong>.</li>
            <li>Dilarang keras meluncurkan serangan distributed denial-of-service (DDoS), eksploitasi konkurensi tak berizin, atau rekayasa balik (reverse engineering) yang merugikan infrastruktur.</li>
            <li>Pengguna bertanggung jawab penuh atas biaya atau kuota API key pihak ketiga yang digunakan dalam pengaturan personal.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Larangan Penyalahgunaan</h2>
          <p>
            Anda dilarang menggunakan platform untuk memproses kata kunci yang melanggar hukum yang berlaku di Republik Indonesia atau yurisdiksi tempat Anda beroperasi, termasuk namun tidak terbatas pada konten perjudian ilegal, penipuan, malware, atau eksploitasi data pribadi tanpa hak.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Pembatasan Tanggung Jawab</h2>
          <p>
            Layanan disediakan "sebagaimana adanya" (*as is*) tanpa jaminan ketersediaan tanpa henti atau kesempurnaan data tanpa cacat. Pengembang tidak bertanggung jawab atas kerugian finansial, penurunan trafik, kehilangan data, atau konsekuensi bisnis apa pun yang timbul akibat keputusan yang diambil berdasarkan hasil laporan pemeriksaan platform ini.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">5. Perubahan Layanan</h2>
          <p>
            Kami berhak untuk mengubah, memperbarui algoritma deteksi, menyesuaikan antarmuka adapter, atau menghentikan sebagian fitur sementara waktu demi perbaikan teknis tanpa pemberitahuan sebelumnya.
          </p>
        </section>
      </div>
    </div>
  );
};

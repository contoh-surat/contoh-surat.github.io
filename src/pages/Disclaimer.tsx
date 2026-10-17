import React from 'react';

interface DisclaimerProps {
  onNavigate: (path: string) => void;
}

export const Disclaimer: React.FC<DisclaimerProps> = ({ onNavigate }) => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      <div>
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <button onClick={() => onNavigate('/')} className="hover:text-blue-600 cursor-pointer">
            Beranda
          </button>
          <span aria-hidden="true">/</span>
          <span className="text-slate-900 font-medium">Disclaimer</span>
        </div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Penafian Hukum & Batasan Tanggung Jawab
        </h1>
        <p className="mt-2 text-xs text-slate-500">
          Pernyataan resmi mengenai sifat dinamis hasil pencarian Google dan independensi perangkat lunak.
        </p>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed text-slate-700 space-y-6">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Penafian Merek Dagang Google LLC</h2>
          <p>
            Nama "Google", "Google Search", "Google AI Overview", "SGE", dan "Gemini" adalah merek dagang dan hak cipta terdaftar milik <strong>Google LLC / Alphabet Inc</strong>. Penggunaan istilah-istilah ini di dalam situs semata-mata bersifat deskriptif (nominative fair use) untuk menerangkan fungsi teknis alat dalam menganalisis hasil pencarian yang dihasilkan oleh mesin pencari tersebut.
          </p>
          <p>
            Aplikasi ini merupakan produk rekayasa perangkat lunak mandiri dan independen, <strong>tidak berafiliasi, tidak didukung, dan tidak disponsori secara resmi oleh Google LLC</strong>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Sifat Dinamis Hasil SERP Google</h2>
          <p>
            Hasil pencarian Google bersifat luar biasa dinamis dan dapat bervariasi setiap saat berdasarkan berbagai variabel eksternal yang berada di luar kendali perangkat lunak mana pun:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Personalisasi Akun</strong>: Riwayat pencarian, cookie, dan aktivitas akun Google pengguna pribadi.</li>
            <li><strong>Geolokasi & IP Jaringan</strong>: Alamat IP penyedia jasa internet (ISP), kedekatan dengan data center regional Google, dan parameter negara (\`gl\`).</li>
            <li><strong>Uji Coba Algoritma (A/B Testing)</strong>: Google secara berkesinambungan menguji persentase kemunculan fitur baru pada sebagian kecil pengguna acak.</li>
            <li><strong>Fluktuasi Waktu</strong>: Keberadaan AI Overview dapat berubah antar jam, hari, atau saat pembaruan indeks terjadi.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Fungsi Tautan Pencarian Manual</h2>
          <p>
            Tautan Google Search yang kami sertakan pada setiap baris hasil pemeriksaan disediakan sebagai <strong>sarana verifikasi manual tambahan bagi pengguna</strong>, bukan bukti absolut yang menjamin bahwa apa yang Anda lihat di peramban Anda pada detik ini akan selalu identik 100% dengan snapshot respons API saat pengujian dijalankan.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Ketiadaan Jaminan Peringkat SEO</h2>
          <p>
            Informasi, analisis status (*AI detected* vs *AI aman*), dan artikel edukasi di situs ini disediakan untuk tujuan diagnostik dan strategi. Kami tidak memberikan jaminan bahwa mengoptimalkan konten berdasarkan temuan alat ini akan secara otomatis meningkatkan peringkat Google, mengamankan posisi sitasi AI, atau menaikkan trafik organik situs web Anda.
          </p>
        </section>
      </div>
    </div>
  );
};

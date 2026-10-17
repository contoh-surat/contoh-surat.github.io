import React from 'react';

interface PrivacyProps {
  onNavigate: (path: string) => void;
}

export const Privacy: React.FC<PrivacyProps> = ({ onNavigate }) => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      <div>
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <button onClick={() => onNavigate('/')} className="hover:text-blue-600 cursor-pointer">
            Beranda
          </button>
          <span aria-hidden="true">/</span>
          <span className="text-slate-900 font-medium">Kebijakan Privasi</span>
        </div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Kebijakan Privasi
        </h1>
        <p className="mt-2 text-xs text-slate-500">
          Terakhir diperbarui: 15 Maret 2026 · Berlaku untuk seluruh pengguna aplikasi Google AI Overview Checker
        </p>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed text-slate-700 space-y-6">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Pendahuluan dan Komitmen Privasi</h2>
          <p>
            Privasi data pengguna adalah prinsip fundamental dalam pengembangan Google AI Overview Checker. Dokumen ini menjelaskan secara jujur dan transparan jenis informasi apa yang diproses saat Anda menggunakan layanan kami, bagaimana data tersebut diperlakukan, dan perlindungan apa yang diterapkan.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Pemrosesan Daftar Kata Kunci (Keywords)</h2>
          <p>
            Ketika Anda memasukkan hingga 1.000 kata kunci melalui antarmuka textarea atau unggahan CSV:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Daftar kata kunci disimpan dalam memori sesi peramban Anda (Session Storage) semata-mata untuk mencegah hilangnya data saat terjadi refresh halaman yang tidak disengaja.</li>
            <li>Kata kunci hanya dikirimkan ke endpoint pemeriksaan SERP untuk mengambil data hasil pencarian publik Google.</li>
            <li>Kami <strong>tidak pernah menjual, memonetisasi, atau mengarsipkan kata kunci Anda</strong> ke basis data publik atau database pihak ketiga.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Kredensial dan API Key</h2>
          <p>
            Jika Anda mengonfigurasi API Key eksternal (seperti SerpApi atau ValueSERP) di dalam menu pengaturan:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Kredensial disimpan secara lokal di memori browser pengguna.</li>
            <li>Jika opsi server proxy aktif, kredensial hanya diteruskan sementara dalam header HTTP terenkripsi untuk mengotentikasi panggilan ke penyedia data SERP resmi.</li>
            <li>Server kami tidak pernah mencatat (log) kunci rahasia Anda ke dalam berkas log publik.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Berkas Ekspor CSV</h2>
          <p>
            Berkas CSV yang dihasilkan di-generate secara langsung di sisi peramban (*client-side Blob*) menggunakan standar RFC 4180 dengan perlindungan formula injection. Berkas hasil unduhan tidak disimpan di server kami setelah proses transfer selesai.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">5. Layanan Pihak Ketiga</h2>
          <p>
            Aplikasi dapat berinteraksi dengan API penyedia data SERP publik (seperti SerpApi atau ValueSERP) atas permintaan aktif pengguna. Setiap penyedia memiliki kebijakan privasi masing-masing mengenai pemrosesan kuota kueri.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">6. Hak Pengguna & Penghapusan Data</h2>
          <p>
            Anda dapat menghapus seluruh riwayat kueri dan hasil pemeriksaan seketika dengan menekan tombol <em>Pemeriksaan Baru</em> atau membersihkan data penelusuran (session storage) peramban Anda.
          </p>
        </section>
      </div>
    </div>
  );
};

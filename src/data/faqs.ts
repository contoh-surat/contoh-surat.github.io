import { FAQItem } from '../types';

export const FAQ_ITEMS: FAQItem[] = [
  {
    category: 'Dasar Google AI Overview',
    question: 'Apa itu Google AI Overview?',
    answer: 'Google AI Overview adalah fitur berbasis kecerdasan buatan (sebelumnya bagian dari Search Generative Experience / SGE) yang menyajikan rangkuman sintetis jawaban langsung di bagian teratas hasil pencarian Google, dilengkapi dengan kartu rujukan sumber web.',
  },
  {
    category: 'Dasar Google AI Overview',
    question: 'Apakah Google AI Overview sudah aktif di Indonesia?',
    answer: 'Ya, Google secara bertahap telah memperluas AI Overview ke lebih dari 100 negara dan berbagai bahasa, termasuk bahasa Indonesia di domain Google.co.id. Kemunculannya bervariasi bergantung pada intensitas kueri, topik informasional, dan sinyal penelusuran.',
  },
  {
    category: 'Fungsi Aplikasi',
    question: 'Berapa banyak keyword yang dapat diperiksa sekaligus?',
    answer: 'Google AI Overview Checker dirancang untuk memproses hingga 1.000 keyword dalam satu sesi kerja, baik melalui input salin-tempel baris teks maupun unggah berkas CSV, dengan manajemen antrean asinkron dan pengendalian concurrency.',
  },
  {
    category: 'Fungsi Aplikasi',
    question: 'Apa arti status "AI detected", "AI aman", dan "Belum dapat dipastikan"?',
    answer: '"AI detected" (merah) berarti modul AI Overview teridentifikasi secara positif pada respons SERP valid. "AI aman" (hijau) berarti respons SERP berhasil diperiksa dan AI Overview dipastikan tidak muncul. "Belum dapat dipastikan" (amber/abu-abu) menandakan data respons belum mencukupi atau terjadi kendala sementara.',
  },
  {
    category: 'Akurasi & Verifikasi',
    question: 'Mengapa hasil di alat ini bisa berbeda dengan yang saya lihat di browser pribadi?',
    answer: 'Hasil pencarian Google bersifat dinamis dan dipengaruhi oleh personalisasi akun Google, riwayat penelusuran, lokasi geolokasi IP ISP, jenis peramban, serta uji A/B berkala dari pihak Google. Alat kami menyediakan tautan penelusuran langsung untuk verifikasi manual.',
  },
  {
    category: 'Integrasi & API Key',
    question: 'Apakah saya membutuhkan API key untuk menggunakan aplikasi ini?',
    answer: 'Aplikasi menyediakan Mode Demo/Simulasi bawaan yang siap dicoba tanpa API key untuk menguji fungsionalitas dan alur kerja. Untuk pemeriksaan data Google SERP langsung skala riil, Anda dapat mengonfigurasi provider SERP terpercaya seperti SerpApi atau ValueSERP.',
  },
  {
    category: 'Keamanan Data',
    question: 'Apakah daftar keyword yang saya masukkan disimpan di server publik?',
    answer: 'Tidak. Seluruh daftar keyword, antrean, dan hasil pemeriksaan Anda diproses secara lokal di sesi browser dan memori sementara server proxy tanpa disimpan secara permanen di database publik ataupun dibagikan ke pihak ketiga.',
  },
  {
    category: 'Strategi SEO',
    question: 'Bagaimana cara memanfaatkan hasil ekspor CSV untuk strategi SEO?',
    answer: 'Hasil ekspor CSV dapat dipilah berdasarkan status untuk memprioritaskan tindakan: kueri berstatus "AI detected" perlu dioptimasi untuk menembus kartu rujukan AI (sitasi fakta, tabel ringkas), sedangkan kueri "AI aman" dapat dioptimasi untuk mendominasi klik organik tradisional.',
  },
];

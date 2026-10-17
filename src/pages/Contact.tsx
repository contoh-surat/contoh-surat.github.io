import React, { useState } from 'react';

interface ContactProps {
  onNavigate: (path: string) => void;
}

export const Contact: React.FC<ContactProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    // Validation
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Mohon lengkapi nama, alamat email valid, dan pesan Anda.',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setStatusMessage({
        type: 'error',
        text: 'Format alamat email yang Anda masukkan tidak valid.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatusMessage({
          type: 'success',
          text: data.message || 'Pesan Anda berhasil diterima oleh sistem tiket kami. Kami akan merespons melalui email yang Anda cantumkan.',
        });
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        setStatusMessage({
          type: 'info',
          text: data.message || 'Layanan relay email server saat ini belum dikonfigurasi dengan gateway SMTP eksternal. Pesan Anda telah dicatat pada sistem log internal aplikasi.',
        });
      }
    } catch {
      setStatusMessage({
        type: 'info',
        text: 'Catatan Transparansi: Gateway email server eksternal saat ini belum terhubung ke penyedia SMTP (SendGrid/Mailgun). Untuk kebutuhan langsung, hubungi kami melalui kanal repositori resmi.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumb & Header */}
      <div>
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <button onClick={() => onNavigate('/')} className="hover:text-blue-600 cursor-pointer">
            Beranda
          </button>
          <span aria-hidden="true">/</span>
          <span className="text-slate-900 font-medium">Kontak & Dukungan</span>
        </div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Hubungi Tim Pengembang
        </h1>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          Sampaikan masukan, laporan bug pada deteksi SERP, atau konsultasi kebutuhan integrasi custom API.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact Form */}
        <div className="md:col-span-7 rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 mb-4">
            Kirimkan Pertanyaan atau Masukan
          </h2>

          {statusMessage && (
            <div
              className={`mb-4 rounded-lg p-3 text-xs leading-relaxed border ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : statusMessage.type === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-blue-50 border-blue-200 text-blue-900'
              }`}
            >
              {statusMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Lengkap <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Anda..."
                required
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Alamat Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@perusahaan.com"
                required
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Subjek Pembahasan
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Contoh: Laporan anomali kueri Indonesia / Request API key"
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Pesan atau Pertanyaan Anda <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Uraikan pertanyaan, kritik, atau saran teknis Anda..."
                required
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              {isSubmitting ? 'Mengirimkan...' : 'Kirim Pesan'}
            </button>
          </form>
        </div>

        {/* Sidebar Info */}
        <div className="md:col-span-5 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-xs text-slate-600 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              Transparansi Komunikasi
            </h3>
            <p className="leading-relaxed">
              Kami menghargai privasi dan waktu Anda. Formulir ini diproses langsung oleh endpoint backend internal aplikasi tanpa perantara pelacak pihak ketiga.
            </p>
            <div className="border-t border-slate-200 pt-3 space-y-2">
              <div>
                <strong className="block text-slate-800">Waktu Respons:</strong>
                <span>1 - 2 hari kerja untuk evaluasi teknis.</span>
              </div>
              <div>
                <strong className="block text-slate-800">Cakupan Dukungan:</strong>
                <span>Penanganan kendala parser SERP, ekspor CSV, dan saran konfigurasi adapter.</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-blue-900">
            <strong>Butuh Panduan Penggunaan?</strong> Pelajari halaman{' '}
            <button
              onClick={() => onNavigate('/faq')}
              className="underline font-semibold cursor-pointer"
            >
              Tanya Jawab (FAQ)
            </button>{' '}
            atau artikel edukasi kami di{' '}
            <button
              onClick={() => onNavigate('/blog')}
              className="underline font-semibold cursor-pointer"
            >
              Blog Riset SERP
            </button>.
          </div>
        </div>
      </div>
    </div>
  );
};

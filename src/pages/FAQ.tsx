import React, { useState } from 'react';
import { FAQ_ITEMS } from '../data/faqs';

interface FAQProps {
  onNavigate: (path: string) => void;
}

export const FAQ: React.FC<FAQProps> = ({ onNavigate }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = ['ALL', ...Array.from(new Set(FAQ_ITEMS.map((f) => f.category)))];

  const filteredFaqs = FAQ_ITEMS.filter((f) => {
    if (activeCategory !== 'ALL' && f.category !== activeCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      <div>
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <button onClick={() => onNavigate('/')} className="hover:text-blue-600 cursor-pointer">
            Beranda
          </button>
          <span aria-hidden="true">/</span>
          <span className="text-slate-900 font-medium">Tanya Jawab (FAQ)</span>
        </div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Frequently Asked Questions (FAQ)
        </h1>
        <p className="mt-2 text-xs text-slate-600">
          Temukan jawaban menyeluruh seputar teknologi Google AI Overview, metodologi deteksi kami, dan optimasi SEO era generatif.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills/Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat === 'ALL' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari pertanyaan..."
            className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-600 focus:outline-hidden"
          />
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center text-slate-400 border border-slate-200 rounded-xl bg-slate-50 text-xs">
            Tidak ada pertanyaan yang sesuai dengan kriteria pencarian Anda.
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => (
            <details
              key={idx}
              open={idx === 0}
              className="group rounded-xl border border-slate-200 bg-white p-4 transition-colors"
            >
              <summary className="flex cursor-pointer items-center justify-between text-xs sm:text-sm font-semibold text-slate-900">
                <span className="pr-4">{faq.question}</span>
                <span className="transition-transform group-open:rotate-180 text-slate-400 shrink-0">
                  ↓
                </span>
              </summary>
              <div className="mt-3 border-t border-slate-100 pt-3 text-xs leading-relaxed text-slate-600 space-y-2">
                <p>{faq.answer}</p>
                <div className="text-[11px] text-slate-400 font-mono">
                  Kategori: {faq.category}
                </div>
              </div>
            </details>
          ))
        )}
      </div>

      {/* Contact prompt */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-6 text-center space-y-3">
        <h3 className="text-sm font-bold text-slate-900">
          Masih memiliki pertanyaan teknis yang belum terjawab?
        </h3>
        <p className="text-xs text-slate-600 max-w-lg mx-auto">
          Tim rekayasa perangkat lunak dan analis SERP kami siap membantu menjawab kendala Anda.
        </p>
        <div>
          <button
            onClick={() => onNavigate('/contact')}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            Hubungi Tim Dukungan Kami
          </button>
        </div>
      </div>
    </div>
  );
};

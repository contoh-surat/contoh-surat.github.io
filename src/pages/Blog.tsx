import React, { useState, useMemo } from 'react';
import { BLOG_ARTICLES } from '../data/blogArticles';

interface BlogProps {
  onNavigate: (path: string) => void;
}

export const Blog: React.FC<BlogProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = useMemo(() => {
    return ['ALL', ...Array.from(new Set(BLOG_ARTICLES.map((a) => a.category)))];
  }, []);

  const filteredArticles = useMemo(() => {
    return BLOG_ARTICLES.filter((art) => {
      if (selectedCategory !== 'ALL' && art.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          art.title.toLowerCase().includes(q) ||
          art.summary.toLowerCase().includes(q) ||
          art.content.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      {/* Page Header */}
      <div className="max-w-3xl">
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <button onClick={() => onNavigate('/')} className="hover:text-blue-600 cursor-pointer">
            Beranda
          </button>
          <span aria-hidden="true">/</span>
          <span className="text-slate-900 font-medium">Blog & Riset SEO</span>
        </div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Artikel & Riset Strategi SEO di Era AI Overview
        </h1>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          Kumpulan panduan komprehensif, analisis teknis SERP, dan taktik optimasi konten berbasis bukti orisinal 100% tanpa kompromi untuk tim SEO Indonesia.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat === 'ALL' ? 'Semua Topik' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari artikel riset..."
            className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-600 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles.length === 0 ? (
          <div className="col-span-3 py-12 text-center text-slate-400 text-xs">
            Tidak ada artikel yang cocok dengan filter pencarian Anda.
          </div>
        ) : (
          filteredArticles.map((art) => (
            <article
              key={art.id}
              onClick={() => onNavigate(`/blog/${art.slug}`)}
              className="flex flex-col justify-between p-6 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-3">
                  <span className="font-semibold text-blue-600">{art.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{art.readingTime}</span>
                </div>

                <h2 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-3 leading-snug">
                  {art.title}
                </h2>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {art.summary}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono">{art.publishedAt}</span>
                <span className="text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                  Baca Artikel →
                </span>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

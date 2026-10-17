import React from 'react';
import { getArticleBySlug, BLOG_ARTICLES } from '../data/blogArticles';

interface BlogDetailProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const BlogDetail: React.FC<BlogDetailProps> = ({ slug, onNavigate }) => {
  const article = getArticleBySlug(slug);

  if (!article) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Artikel Tidak Ditemukan</h1>
        <p className="text-xs text-slate-500">
          Artikel dengan tautan "{slug}" tidak tersedia atau telah dipindahkan.
        </p>
        <div>
          <button
            onClick={() => onNavigate('/blog')}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
          >
            Kembali ke Indeks Blog
          </button>
        </div>
      </div>
    );
  }

  // Related articles
  const related = BLOG_ARTICLES.filter((a) => a.id !== article.id).slice(0, 2);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumb */}
      <div className="text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
        <button onClick={() => onNavigate('/')} className="hover:text-blue-600 cursor-pointer">
          Beranda
        </button>
        <span aria-hidden="true">/</span>
        <button onClick={() => onNavigate('/blog')} className="hover:text-blue-600 cursor-pointer">
          Blog
        </button>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 font-medium truncate max-w-xs">{article.title}</span>
      </div>

      {/* Article Header */}
      <div className="space-y-4 border-b border-slate-200 pb-8">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-blue-600 uppercase tracking-wider">{article.category}</span>
          <span aria-hidden="true">·</span>
          <span>Waktu Baca: {article.readingTime}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono">{article.publishedAt}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
          {article.title}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          {article.summary}
        </p>

        <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
          <span>Oleh: <strong className="text-slate-800">{article.author}</strong></span>
          <span aria-hidden="true">·</span>
          <span>100% Original Riset Tim SERP</span>
        </div>
      </div>

      {/* Table of Contents */}
      {article.headings.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Daftar Isi Pembahasan
          </h2>
          <ul className="space-y-1.5 text-xs">
            {article.headings.map((h) => (
              <li key={h.id} className="text-slate-600 hover:text-blue-600">
                <a href={`#${h.id}`} className="transition-colors">
                  • {h.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Article Body */}
      <article className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed text-slate-800 space-y-6">
        {article.content.split('\n\n').map((paragraph, idx) => {
          const trimmed = paragraph.trim();
          if (!trimmed) return null;

          if (trimmed.startsWith('## ')) {
            const headingText = trimmed.replace('## ', '');
            const headingMatch = article.headings.find((h) => h.title === headingText);
            const headingId = headingMatch ? headingMatch.id : `heading-${idx}`;
            return (
              <h2
                key={idx}
                id={headingId}
                className="mt-8 mb-3 text-lg sm:text-xl font-bold text-slate-900 scroll-mt-20 border-b border-slate-100 pb-2"
              >
                {headingText}
              </h2>
            );
          }

          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const listItems = trimmed.split('\n').map((li) => li.replace(/^[-*]\s+/, ''));
            return (
              <ul key={idx} className="list-disc pl-5 space-y-1 text-slate-700">
                {listItems.map((item, itemIdx) => (
                  <li key={itemIdx}>{item}</li>
                ))}
              </ul>
            );
          }

          return (
            <p key={idx} className="text-slate-700 leading-relaxed">
              {trimmed}
            </p>
          );
        })}
      </article>

      {/* In-article CTA Box to Checker Tool */}
      <div className="my-10 rounded-xl border border-blue-200 bg-blue-50/60 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Ingin Menguji Keyword Anda Sendiri Sekarang?
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Periksa hingga 1.000 kata kunci langsung di antarmuka Google AI Overview Checker.
          </p>
        </div>
        <button
          onClick={() => onNavigate('/checker')}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          Buka Alat Checker →
        </button>
      </div>

      {/* Related Articles */}
      <div className="border-t border-slate-200 pt-8 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Artikel Terkait Lainnya
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {related.map((rel) => (
            <div
              key={rel.id}
              onClick={() => {
                onNavigate(`/blog/${rel.slug}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-all cursor-pointer"
            >
              <div className="text-[10px] text-blue-600 font-semibold mb-1">{rel.category}</div>
              <h4 className="text-xs font-bold text-slate-900 line-clamp-2 hover:text-blue-600 transition-colors">
                {rel.title}
              </h4>
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                {rel.summary}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

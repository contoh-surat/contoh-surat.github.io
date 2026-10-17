import React, { useState, useEffect } from 'react';
import { ApiConfig } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Checker } from './pages/Checker';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Privacy } from './pages/Privacy';
import { Disclaimer } from './pages/Disclaimer';
import { Terms } from './pages/Terms';
import { FAQ } from './pages/FAQ';
import { Blog } from './pages/Blog';
import { BlogDetail } from './pages/BlogDetail';
import { NotFound } from './pages/NotFound';
import { ServiceStatus } from './pages/ServiceStatus';
import { getArticleBySlug } from './data/blogArticles';

const CONFIG_STORAGE_KEY = 'gio_checker_api_config_v1';

export const App: React.FC = () => {
  // Current client-side path
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  // Global SERP API Config
  const [apiConfig, setApiConfig] = useState<ApiConfig>(() => {
    try {
      const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return {
      provider: 'demo',
      apiKey: '',
      concurrency: 2,
      mode: 'DEMO',
      useServerProxy: true,
    };
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Listen to popstate (back/forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update localStorage when config changes
  useEffect(() => {
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(apiConfig));
    } catch {}
  }, [apiConfig]);

  // Client-side navigate helper
  const navigate = (path: string) => {
    if (path === currentPath) return;
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dynamic SEO metadata per route
  useEffect(() => {
    let title = 'Google AI Overview Checker — Alat Pemantau SERP AI Google Profesional';
    let description = 'Alat profesional untuk memeriksa kemunculan Google AI Overview pada hasil pencarian SERP hingga 1.000 keyword dengan analisis mendalam, ekspor CSV, dan pemantauan real-time.';

    if (currentPath === '/checker') {
      title = 'Checker 1.000 Keyword — Google AI Overview Checker';
      description = 'Periksa kemunculan Google AI Overview secara massal hingga 1.000 kata kunci per batch. Mendukung Google Indonesia (gl=id) dan seluruh negara di dunia.';
    } else if (currentPath === '/about') {
      title = 'Tentang Kami — Google AI Overview Checker';
      description = 'Pelajari misi, metodologi teknis, dan prinsip objektivitas data SERP di balik platform Google AI Overview Checker.';
    } else if (currentPath === '/contact') {
      title = 'Kontak & Dukungan — Google AI Overview Checker';
      description = 'Hubungi tim pengembang dan analis SERP kami untuk pertanyaan, masukan teknis, atau permintaan integrasi khusus.';
    } else if (currentPath === '/faq') {
      title = 'Tanya Jawab (FAQ) — Google AI Overview Checker';
      description = 'Jawaban lengkap seputar apa itu Google AI Overview, cara kerja deteksi SERP, zero-click searches, dan dampaknya terhadap SEO.';
    } else if (currentPath === '/privacy') {
      title = 'Kebijakan Privasi — Google AI Overview Checker';
      description = 'Kebijakan privasi kami menjelaskan keamanan data kueri Anda, ketiadaan pelacak berbahaya, dan perlindungan berkas ekspor CSV.';
    } else if (currentPath === '/disclaimer') {
      title = 'Disclaimer & Batasan Tanggung Jawab — Google AI Overview Checker';
      description = 'Penafian merek dagang resmi Google LLC dan penjelasan sifat dinamis hasil SERP Google yang bervariasi menurut personalisasi.';
    } else if (currentPath === '/terms') {
      title = 'Syarat & Ketentuan Layanan — Google AI Overview Checker';
      description = 'Ketentuan penggunaan yang adil (fair use), batas kapasitas 1.000 kueri, dan tanggung jawab hukum pengguna.';
    } else if (currentPath === '/status') {
      title = 'Status Layanan & Diagnostik SERP — Google AI Overview Checker';
      description = 'Pantau kesehatan server proxy, adapter SerpApi, ValueSERP, latensi antrean, dan panduan kuota operasional.';
    } else if (currentPath === '/blog') {
      title = 'Blog & Panduan SEO AI — Google AI Overview Checker';
      description = 'Kumpulan artikel mendalam 100% orisinal mengenai strategi SEO modern, Entity SEO, optimasi sitasi AI, dan analisis trafik SERP.';
    } else if (currentPath.startsWith('/blog/')) {
      const slug = currentPath.replace('/blog/', '');
      const article = getArticleBySlug(slug);
      if (article) {
        title = `${article.metaTitle} — Google AI Overview Checker`;
        description = article.metaDescription;
      }
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', description);
    }
  }, [currentPath]);

  // Route router logic
  const renderCurrentPage = () => {
    if (currentPath === '/') {
      return <Home onNavigate={navigate} />;
    }
    if (currentPath === '/checker') {
      return (
        <Checker
          apiConfig={apiConfig}
          onUpdateConfig={setApiConfig}
          isSettingsOpen={isSettingsOpen}
          onCloseSettings={() => setIsSettingsOpen(false)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      );
    }
    if (currentPath === '/about') {
      return <About onNavigate={navigate} />;
    }
    if (currentPath === '/contact') {
      return <Contact onNavigate={navigate} />;
    }
    if (currentPath === '/privacy') {
      return <Privacy onNavigate={navigate} />;
    }
    if (currentPath === '/disclaimer') {
      return <Disclaimer onNavigate={navigate} />;
    }
    if (currentPath === '/terms') {
      return <Terms onNavigate={navigate} />;
    }
    if (currentPath === '/faq') {
      return <FAQ onNavigate={navigate} />;
    }
    if (currentPath === '/blog') {
      return <Blog onNavigate={navigate} />;
    }
    if (currentPath.startsWith('/blog/')) {
      const slug = currentPath.replace('/blog/', '');
      return <BlogDetail slug={slug} onNavigate={navigate} />;
    }
    if (currentPath === '/status') {
      return (
        <ServiceStatus
          onNavigate={navigate}
          apiConfig={apiConfig}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      );
    }

    return <NotFound onNavigate={navigate} />;
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navbar */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenSettings={() => setIsSettingsOpen(true)}
        operationalMode={apiConfig.mode}
      />

      {/* Main Content Viewport */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={navigate} />
    </div>
  );
};

export default App;

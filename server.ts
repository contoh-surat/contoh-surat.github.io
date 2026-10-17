import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Helper: Sitemap generation
const SITEMAP_PAGES = [
  '',
  'checker',
  'about',
  'contact',
  'privacy',
  'disclaimer',
  'terms',
  'faq',
  'status',
  'blog',
  'blog/mengenal-google-ai-overview-panduan-lengkap',
  'blog/dampak-ai-overview-terhadap-ctr-dan-trafik-organik',
  'blog/cara-memeriksa-kemunculan-ai-overview-pada-ribuan-keyword',
  'blog/riset-keyword-era-search-generative-experience',
  'blog/anatomi-serp-modern-featured-snippet-vs-ai-overview',
  'blog/strategi-konten-berbasis-bukti-dan-entity-seo',
  'blog/monitoring-visibilitas-serp-pelacakan-manual-tidak-cukup',
  'blog/optimalisasi-konten-muncul-sebagai-sumber-referensi-ai',
];

// Route: /sitemap.xml
app.get('/sitemap.xml', (req: Request, res: Response) => {
  const host = req.get('host') || 'localhost:3000';
  const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;

  const urls = SITEMAP_PAGES.map((page) => {
    const loc = page ? `${baseUrl}/${page}` : baseUrl;
    const priority = page === '' ? '1.0' : page === 'checker' ? '0.9' : page.startsWith('blog') ? '0.8' : '0.6';
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

// Route: /robots.txt
app.get('/robots.txt', (req: Request, res: Response) => {
  const host = req.get('host') || 'localhost:3000';
  const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;

  const txt = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;
  res.header('Content-Type', 'text/plain');
  res.send(txt);
});

// API: Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Google AI Overview Checker Server API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API: Adapters info
app.get('/api/adapters', (req: Request, res: Response) => {
  const serverSerpApiKey = process.env.SERPAPI_KEY || process.env.SERP_API_KEY;
  res.json({
    adapters: [
      { id: 'demo', name: 'Built-in Demo Engine', status: 'active', supported: true },
      { id: 'serpapi', name: 'SerpApi Adapter', status: serverSerpApiKey ? 'server_key_configured' : 'client_key_required', supported: true },
      { id: 'valueserp', name: 'ValueSERP Adapter', status: 'client_key_required', supported: true },
      { id: 'custom', name: 'Custom Endpoint Adapter', status: 'available', supported: true },
    ],
  });
});

// API: Contact Submission
app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({
      error: 'Data tidak lengkap. Mohon lengkapi nama, email, dan pesan.',
    });
  }

  // Sanitize and log without leaking credentials
  const sanitizedSubmission = {
    name: String(name).slice(0, 100),
    email: String(email).slice(0, 100),
    subject: String(subject || 'General Inquiry').slice(0, 150),
    messageLength: String(message).length,
    receivedAt: new Date().toISOString(),
  };

  console.log('[CONTACT SUBMISSION RECEIVED]:', JSON.stringify(sanitizedSubmission));

  return res.json({
    ok: true,
    message: 'Pesan Anda berhasil diterima dan dicatat dalam sistem antrean layanan pelanggan.',
    ticketId: `TICK-${Date.now().toString(36).toUpperCase()}`,
  });
});

// API: Check Keyword (Server-Side Proxy)
app.post('/api/check', async (req: Request, res: Response) => {
  const { keyword, country = 'id', language = 'id', device = 'desktop', provider = 'demo', apiKey } = req.body || {};

  if (!keyword || typeof keyword !== 'string') {
    return res.status(400).json({ error: 'Keyword wajib disertakan dan harus berupa string.' });
  }

  const effectiveKey = apiKey || process.env.SERPAPI_KEY || process.env.SERP_API_KEY;
  const kw = keyword.trim();
  const start = performance.now();

  // If SerpApi requested and key exists
  if (provider === 'serpapi' && effectiveKey) {
    try {
      const params = new URLSearchParams({
        engine: 'google',
        q: kw,
        gl: country,
        hl: language,
        device: device === 'mobile' ? 'mobile' : 'desktop',
        api_key: effectiveKey,
      });

      const serpRes = await fetch(`https://serpapi.com/search.json?${params.toString()}`);
      if (!serpRes.ok) {
        const errJson = await serpRes.json().catch(() => ({}));
        return res.status(serpRes.status).json({
          status: 'FAILED',
          evidenceSummary: `SerpApi HTTP ${serpRes.status}: ${errJson.error || 'Request failed'}`,
          latencyMs: Math.round(performance.now() - start),
          errorMessage: errJson.error || `HTTP ${serpRes.status}`,
        });
      }

      const data: any = await serpRes.json();
      const latency = Math.round(performance.now() - start);

      if (data.ai_overview) {
        const overview = data.ai_overview;
        const snippet = overview.snippet || overview.text || (overview.text_blocks && overview.text_blocks.join(' ')) || '';
        const refs: any[] = [];
        if (Array.isArray(overview.references)) {
          overview.references.forEach((r: any) => {
            refs.push({
              title: r.title || 'Sumber AI Overview',
              link: r.link || '',
              source: r.source || '',
              snippet: r.snippet || '',
            });
          });
        }

        return res.json({
          status: 'AI_DETECTED',
          evidenceSummary: `AI Overview resmi terdeteksi di Google SERP (${country.toUpperCase()}). Rangkuman AI dan ${refs.length} referensi ditemukan.`,
          evidenceDetails: {
            snippet: snippet.slice(0, 300),
            references: refs,
            triggerType: overview.type || 'Google AI Overview',
            rawIndicators: ['serpapi_live_ai_overview_present'],
            organicCount: Array.isArray(data.organic_results) ? data.organic_results.length : undefined,
          },
          latencyMs: latency,
        });
      }

      if (Array.isArray(data.organic_results) && data.organic_results.length > 0) {
        return res.json({
          status: 'AI_SAFE',
          evidenceSummary: `Hasil pencarian organik valid (${data.organic_results.length} hasil). Modul AI Overview dipastikan TIDAK ada.`,
          evidenceDetails: {
            rawIndicators: ['organic_results_valid', 'no_ai_overview'],
            organicCount: data.organic_results.length,
          },
          latencyMs: latency,
        });
      }

      return res.json({
        status: 'UNKNOWN',
        evidenceSummary: 'Respons diterima namun data tidak memiliki cukup bukti untuk mengonfirmasi ketiadaan AI Overview.',
        evidenceDetails: { rawIndicators: ['inconclusive_serp_structure'] },
        latencyMs: latency,
      });
    } catch (err: any) {
      return res.status(500).json({
        status: 'FAILED',
        evidenceSummary: `Server error saat menghubungi SerpApi: ${err.message}`,
        latencyMs: Math.round(performance.now() - start),
        errorMessage: err.message,
      });
    }
  }

  // Demo Fallback with marked simulation tag
  const latency = Math.floor(120 + Math.random() * 180);
  const lower = kw.toLowerCase();

  const isInformational = /^(apa|bagaimana|mengapa|kenapa|cara|syarat|tahapan|langkah|perbedaan|pengertian|arti|tips|what|how|why|recipe|gejala)/i.test(lower);
  const isNavigational = /^(login|masuk|daftar|download|unduh|beli|harga|promo|tokopedia|shopee|bca|mandiri|facebook|tiktok|near me)/i.test(lower);

  if (isNavigational && !isInformational) {
    return res.json({
      status: 'AI_SAFE',
      evidenceSummary: '[SIMULASI / DEMO] Respons SERP valid. AI Overview tidak ditemukan. Hasil organik standar & navigasi langsung terdeteksi.',
      evidenceDetails: {
        rawIndicators: ['demo_simulation', 'organic_results_valid', 'no_ai_overview_block'],
        organicCount: 10,
        providerRawStatus: 'SUCCESS_NO_AI_OVERVIEW',
      },
      latencyMs: latency,
    });
  }

  if (isInformational || lower.split(/\s+/).length >= 4) {
    return res.json({
      status: 'AI_DETECTED',
      evidenceSummary: `[SIMULASI / DEMO] AI Overview teridentifikasi secara positif dengan blok sintesis dan referensi sitasi web untuk kueri "${kw}".`,
      evidenceDetails: {
        snippet: `Ringkasan sintesis AI untuk kueri "${kw}": Menyajikan ikhtisar terstruktur yang merangkum poin-poin utama berdasarkan konsensus berbagai sumber otoritatif.`,
        references: [
          {
            title: `Panduan Rinci: ${kw}`,
            link: `https://example.com/artikel/${encodeURIComponent(kw.slice(0, 30))}`,
            source: 'Portal Informasi Terpercaya',
            snippet: `Pembahasan lengkap mengenai ${kw}.`,
          },
          {
            title: `Rangkuman Praktis Mengenai ${kw}`,
            link: `https://example.org/panduan`,
            source: 'Ensiklopedia Digital',
          },
        ],
        triggerType: 'Informational Synthesis',
        rawIndicators: ['demo_simulation', 'ai_overview_snippet_present', 'citations_found'],
        organicCount: 9,
      },
      latencyMs: latency,
    });
  }

  return res.json({
    status: 'AI_SAFE',
    evidenceSummary: '[SIMULASI / DEMO] Respons SERP valid. Tidak ada modul AI Overview yang muncul untuk kueri ini.',
    evidenceDetails: {
      rawIndicators: ['demo_simulation', 'organic_results_only'],
      organicCount: 10,
    },
    latencyMs: latency,
  });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Google AI Overview Checker aktif di http://0.0.0.0:${PORT}`);
  });
}

startServer();

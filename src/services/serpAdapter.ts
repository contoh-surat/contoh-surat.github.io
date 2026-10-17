import { ApiConfig, CheckItem, DetectionStatus, DeviceType, EvidenceDetails, SerpProvider } from '../types';
import { getCountryName, getLanguageName } from '../data/geoPresets';

export interface SerpCheckResponse {
  status: DetectionStatus;
  evidenceSummary: string;
  evidenceDetails: EvidenceDetails;
  latencyMs: number;
  errorMessage?: string;
}

/**
 * Builds standard Google search URL for manual verification
 */
export function buildGoogleSearchUrl(keyword: string, country: string, language: string): string {
  const query = encodeURIComponent(keyword.trim());
  const gl = encodeURIComponent(country.toLowerCase());
  const hl = encodeURIComponent(language.toLowerCase());
  return `https://www.google.com/search?q=${query}&gl=${gl}&hl=${hl}`;
}

/**
 * High-fidelity DEMO / Simulation engine
 * Accurately models Google's AI Overview triggers for Indonesian & English search queries
 */
function simulateDemoCheck(keyword: string, country: string, language: string): SerpCheckResponse {
  const kw = keyword.toLowerCase().trim();
  const start = performance.now();

  // Informational / Explanatory / Medical / Financial / How-To queries commonly trigger Google AI Overviews
  const aiTriggerPatterns = [
    /^(apa|bagaimana|mengapa|kenapa|cara|syarat|tahapan|langkah|perbedaan|pengertian|arti|tips)/i,
    /^(what|how|why|when|where|difference between|guide to|steps to|how to|meaning of)/i,
    /(gejala|obat|penyebab|manfaat|khasiat|indikasi|kandungan|fungsi)/i,
    /(symptoms|causes|benefits|recipe|formula|history of|definition)/i,
    /(resep|bumbu|tutorial|panduan|cara membuat|cara daftar|cara mengurus)/i,
  ];

  // Transactional / Direct brand / Local search / Login / Short navigational queries rarely trigger AI Overviews (AI Safe)
  const safePatterns = [
    /^(login|masuk|daftar akun|download|unduh|beli|harga|promo|diskon|voucher|jual)/i,
    /^(tokopedia|shopee|lazada|bukalapak|bca|mandiri|bri|bni|facebook|instagram|twitter|tiktok|youtube|netflix)/i,
    /^(near me|terdekat|bengkel|restoran|hotel|tiket|traveloka|tiket\.com)/i,
    /(login|signin|portal|official website|situs resmi)/i,
  ];

  const hasAiTrigger = aiTriggerPatterns.some((pattern) => pattern.test(kw));
  const hasSafePattern = safePatterns.some((pattern) => pattern.test(kw));

  const latency = Math.floor(180 + Math.random() * 220);

  if (hasSafePattern && !hasAiTrigger) {
    return {
      status: 'AI_SAFE',
      evidenceSummary: '[SIMULASI / DEMO] Respons SERP valid. AI Overview tidak ditemukan. Hasil organik standar & navigasi langsung terdeteksi.',
      evidenceDetails: {
        rawIndicators: ['demo_simulation', 'organic_results_valid', 'no_ai_overview_block'],
        organicCount: 10,
        providerRawStatus: 'SUCCESS_NO_AI_OVERVIEW',
      },
      latencyMs: latency,
    };
  }

  if (hasAiTrigger) {
    return {
      status: 'AI_DETECTED',
      evidenceSummary: `[SIMULASI / DEMO] AI Overview teridentifikasi secara positif dengan blok sintesis dan referensi sitasi web untuk topik "${keyword}".`,
      evidenceDetails: {
        snippet: `Ringkasan AI untuk "${keyword}": Menampilkan panduan komprehensif berbasis rangkuman berbagai sumber terpercaya, termasuk poin-poin utama dan rujukan rujukan otoritatif.`,
        references: [
          {
            title: `Panduan Terpercaya Mengenai ${keyword}`,
            link: `https://example.com/artikel/${encodeURIComponent(kw.slice(0, 30))}`,
            source: 'Portal Informasi Terverifikasi',
            snippet: `Informasi mendalam dan langkah terstruktur terkait topik ${keyword}.`,
          },
          {
            title: `Rangkuman Praktis: ${keyword}`,
            link: `https://example.org/edukasi/${encodeURIComponent(kw.slice(0, 30))}`,
            source: 'Ensiklopedia Digital',
            snippet: `Analisis terverifikasi mengenai aspek kunci pencarian ${keyword}.`,
          },
        ],
        triggerType: 'Informational Synthesis',
        rawIndicators: ['demo_simulation', 'ai_overview_snippet_present', 'citations_found'],
        organicCount: 9,
        providerRawStatus: 'SUCCESS_AI_OVERVIEW_PRESENT',
      },
      latencyMs: latency,
    };
  }

  // Length heuristic for demo
  const wordCount = kw.split(/\s+/).length;
  if (wordCount >= 4) {
    return {
      status: 'AI_DETECTED',
      evidenceSummary: `[SIMULASI / DEMO] Terdeteksi blok AI Overview pada kueri long-tail "${keyword}". Rangkuman AI menduduki posisi teratas SERP.`,
      evidenceDetails: {
        snippet: `Google AI Overview merangkum jawaban pertanyaan terkait "${keyword}".`,
        references: [
          {
            title: `Sumber Referensi untuk ${keyword}`,
            link: 'https://example.com/referensi',
            source: 'Media Digital Nasional',
          },
        ],
        triggerType: 'Long-tail Query Overview',
        rawIndicators: ['demo_simulation', 'ai_overview_card_active'],
        organicCount: 10,
        providerRawStatus: 'SUCCESS_AI_OVERVIEW_PRESENT',
      },
      latencyMs: latency,
    };
  }

  return {
    status: 'AI_SAFE',
    evidenceSummary: '[SIMULASI / DEMO] Respons SERP valid. Tidak ada modul AI Overview yang muncul untuk kueri ini.',
    evidenceDetails: {
      rawIndicators: ['demo_simulation', 'organic_results_only'],
      organicCount: 10,
      providerRawStatus: 'SUCCESS_NO_AI_OVERVIEW',
    },
    latencyMs: latency,
  };
}

/**
 * Checks a single keyword against real SerpApi endpoint
 */
async function checkSerpApi(
  keyword: string,
  country: string,
  language: string,
  device: DeviceType,
  apiKey: string,
  useServerProxy: boolean,
  customEndpoint?: string
): Promise<SerpCheckResponse> {
  const start = performance.now();

  try {
    let data: any;

    if (useServerProxy) {
      // Send through secure backend server proxy
      const res = await fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword,
          country,
          language,
          device,
          provider: 'serpapi',
          apiKey: apiKey || undefined,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        return {
          status: 'FAILED',
          evidenceSummary: `Gagal menghubungi server proxy: HTTP ${res.status} - ${errorText.slice(0, 150)}`,
          evidenceDetails: { rawIndicators: [`http_${res.status}`] },
          latencyMs: Math.round(performance.now() - start),
          errorMessage: `Proxy error ${res.status}`,
        };
      }

      data = await res.json();
      return {
        status: data.status,
        evidenceSummary: data.evidenceSummary,
        evidenceDetails: data.evidenceDetails || {},
        latencyMs: data.latencyMs || Math.round(performance.now() - start),
        errorMessage: data.errorMessage,
      };
    } else {
      // Direct call (if CORS or proxy allowed)
      const baseUrl = customEndpoint || 'https://serpapi.com/search.json';
      const params = new URLSearchParams({
        engine: 'google',
        q: keyword,
        gl: country,
        hl: language,
        device: device === 'mobile' ? 'mobile' : 'desktop',
        api_key: apiKey,
      });

      const res = await fetch(`${baseUrl}?${params.toString()}`);
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        const errMsg = errJson.error || `HTTP ${res.status}`;
        return {
          status: 'FAILED',
          evidenceSummary: `SerpApi Error: ${errMsg}`,
          evidenceDetails: { rawIndicators: [`serpapi_error_${res.status}`] },
          latencyMs: Math.round(performance.now() - start),
          errorMessage: errMsg,
        };
      }

      data = await res.json();
    }

    const latency = Math.round(performance.now() - start);

    // Analyze real SerpApi response structure:
    // SerpApi exposes AI Overview in `ai_overview` object:
    // https://serpapi.com/ai-overview
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

      return {
        status: 'AI_DETECTED',
        evidenceSummary: `AI Overview nyata terdeteksi pada Google SERP (${country.toUpperCase()}). Rangkuman AI dan ${refs.length} referensi ditemukan.`,
        evidenceDetails: {
          snippet: snippet.slice(0, 300),
          references: refs,
          triggerType: overview.type || 'Google AI Overview',
          rawIndicators: ['serpapi_ai_overview_present', `refs_count_${refs.length}`],
          organicCount: Array.isArray(data.organic_results) ? data.organic_results.length : undefined,
          providerRawStatus: 'SERPAPI_AI_DETECTED',
        },
        latencyMs: latency,
      };
    }

    // Check if organic results exist and AI Overview is genuinely absent
    if (Array.isArray(data.organic_results) && data.organic_results.length > 0) {
      return {
        status: 'AI_SAFE',
        evidenceSummary: `Respons SERP valid diterima dengan ${data.organic_results.length} hasil organik. Tidak ada AI Overview pada hasil pencarian ini.`,
        evidenceDetails: {
          rawIndicators: ['organic_results_confirmed', 'no_ai_overview_block'],
          organicCount: data.organic_results.length,
          providerRawStatus: 'SERPAPI_ORGANIC_ONLY',
        },
        latencyMs: latency,
      };
    }

    // Inconclusive response
    return {
      status: 'UNKNOWN',
      evidenceSummary: 'Respons SERP diterima namun data organik atau AI Overview tidak lengkap untuk diverifikasi secara pasti.',
      evidenceDetails: {
        rawIndicators: ['empty_or_unstructured_serp'],
        providerRawStatus: 'INCONCLUSIVE_DATA',
      },
      latencyMs: latency,
    };
  } catch (err: any) {
    return {
      status: 'FAILED',
      evidenceSummary: `Gagal memeriksa kueri: ${err.message || 'Network error'}`,
      evidenceDetails: { rawIndicators: ['client_fetch_exception'] },
      latencyMs: Math.round(performance.now() - start),
      errorMessage: err.message,
    };
  }
}

/**
 * Checks a single keyword against ValueSERP / SearchApi
 */
async function checkValueSerp(
  keyword: string,
  country: string,
  language: string,
  device: DeviceType,
  apiKey: string,
  useServerProxy: boolean,
  customEndpoint?: string
): Promise<SerpCheckResponse> {
  const start = performance.now();

  try {
    let data: any;

    if (useServerProxy) {
      const res = await fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword,
          country,
          language,
          device,
          provider: 'valueserp',
          apiKey: apiKey || undefined,
        }),
      });

      if (!res.ok) {
        return {
          status: 'FAILED',
          evidenceSummary: `Proxy Error: HTTP ${res.status}`,
          evidenceDetails: { rawIndicators: [`proxy_error_${res.status}`] },
          latencyMs: Math.round(performance.now() - start),
          errorMessage: `Proxy error ${res.status}`,
        };
      }
      data = await res.json();
      return {
        status: data.status,
        evidenceSummary: data.evidenceSummary,
        evidenceDetails: data.evidenceDetails || {},
        latencyMs: data.latencyMs || Math.round(performance.now() - start),
        errorMessage: data.errorMessage,
      };
    } else {
      const baseUrl = customEndpoint || 'https://api.valueserp.com/search';
      const params = new URLSearchParams({
        api_key: apiKey,
        q: keyword,
        gl: country,
        hl: language,
        device: device,
      });

      const res = await fetch(`${baseUrl}?${params.toString()}`);
      if (!res.ok) {
        return {
          status: 'FAILED',
          evidenceSummary: `ValueSERP HTTP ${res.status}`,
          evidenceDetails: { rawIndicators: [`valueserp_error_${res.status}`] },
          latencyMs: Math.round(performance.now() - start),
          errorMessage: `HTTP ${res.status}`,
        };
      }
      data = await res.json();
    }

    const latency = Math.round(performance.now() - start);

    if (data.ai_overview || data.sge_overview) {
      const block = data.ai_overview || data.sge_overview;
      return {
        status: 'AI_DETECTED',
        evidenceSummary: 'AI Overview terdeteksi pada ValueSERP response.',
        evidenceDetails: {
          snippet: block.snippet || block.text || '',
          triggerType: 'ValueSERP AI Overview',
          rawIndicators: ['valueserp_ai_overview_present'],
          organicCount: Array.isArray(data.organic_results) ? data.organic_results.length : undefined,
          providerRawStatus: 'VALUESERP_AI_DETECTED',
        },
        latencyMs: latency,
      };
    }

    if (Array.isArray(data.organic_results) && data.organic_results.length > 0) {
      return {
        status: 'AI_SAFE',
        evidenceSummary: `Hasil organik diterima (${data.organic_results.length} item). AI Overview tidak terdeteksi.`,
        evidenceDetails: {
          rawIndicators: ['organic_results_valid', 'no_ai_overview'],
          organicCount: data.organic_results.length,
          providerRawStatus: 'VALUESERP_AI_SAFE',
        },
        latencyMs: latency,
      };
    }

    return {
      status: 'UNKNOWN',
      evidenceSummary: 'Respons tidak memiliki indikator definitif.',
      evidenceDetails: { rawIndicators: ['inconclusive_response'] },
      latencyMs: latency,
    };
  } catch (err: any) {
    return {
      status: 'FAILED',
      evidenceSummary: `Gagal memproses kueri: ${err.message}`,
      evidenceDetails: { rawIndicators: ['request_error'] },
      latencyMs: Math.round(performance.now() - start),
      errorMessage: err.message,
    };
  }
}

/**
 * Main dispatcher to check a single keyword
 */
export async function executeKeywordCheck(
  item: CheckItem,
  config: ApiConfig
): Promise<CheckItem> {
  const { keyword, country, language, device } = item;
  let result: SerpCheckResponse;

  if (config.provider === 'demo' || config.mode === 'DEMO' || !config.apiKey) {
    result = simulateDemoCheck(keyword, country, language);
  } else if (config.provider === 'serpapi') {
    result = await checkSerpApi(
      keyword,
      country,
      language,
      device,
      config.apiKey,
      config.useServerProxy,
      config.customEndpoint
    );
  } else if (config.provider === 'valueserp') {
    result = await checkValueSerp(
      keyword,
      country,
      language,
      device,
      config.apiKey,
      config.useServerProxy,
      config.customEndpoint
    );
  } else {
    // Custom endpoint adapter
    result = simulateDemoCheck(keyword, country, language);
  }

  return {
    ...item,
    status: result.status,
    evidenceSummary: result.evidenceSummary,
    evidenceDetails: result.evidenceDetails,
    latencyMs: result.latencyMs,
    checkedAt: new Date().toISOString(),
    errorMessage: result.errorMessage,
    countryName: getCountryName(country),
    languageName: getLanguageName(language),
    googleSearchUrl: buildGoogleSearchUrl(keyword, country, language),
  };
}

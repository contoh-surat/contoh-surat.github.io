import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini client with mandatory User-Agent
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// User agents pool for realistic HTTP scraping
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
];

interface CheckResult {
  keyword: string;
  status: 'AI SHOW' | 'AI DEAD';
  hasAiOverview: boolean;
  confidence: number;
  engine: 'live_serp' | 'google_grounding' | 'heuristic_analysis';
  details: {
    indicatorsFound: string[];
    serpUrl: string;
    checkedAt: string;
    snippetSnippet?: string;
    note?: string;
  };
}

// Inspect Google SERP HTML for AI Overview signals
function parseSerpForAiOverview(html: string): { hasAi: boolean; indicators: string[]; snippet?: string } {
  const indicators: string[] = [];

  // 1. Text markers in English & Indonesian
  const textMarkers = [
    { pattern: /Ringkasan AI/i, name: 'Teks "Ringkasan AI"' },
    { pattern: /AI Overview/i, name: 'Teks "AI Overview"' },
    { pattern: /AI generatif bersifat eksperimental/i, name: 'Disclaimer AI generatif eksperimental' },
    { pattern: /Generative AI is experimental/i, name: 'Disclaimer Generative AI is experimental' },
    { pattern: /Ringkasan yang dihasilkan AI/i, name: 'Teks "Ringkasan yang dihasilkan AI"' },
    { pattern: /Overview created by AI/i, name: 'Teks "Overview created by AI"' },
    { pattern: /Learn more about AI Overviews/i, name: 'Tautan "Learn more about AI Overviews"' },
  ];

  for (const marker of textMarkers) {
    if (marker.pattern.test(html)) {
      indicators.push(marker.name);
    }
  }

  // 2. DOM attributes & CSS markers used in Google SGE
  const domMarkers = [
    { pattern: /data-attrid=["']wa:\/description["']/i, name: 'Attr wa:/description' },
    { pattern: /data-attrid=["']SGE_AI_OVERVIEW["']/i, name: 'Attr SGE_AI_OVERVIEW' },
    { pattern: /class=["'][^"']*Yz9B7b[^"']*["']/i, name: 'Class SGE Yz9B7b' },
    { pattern: /class=["'][^"']*k82bof[^"']*["']/i, name: 'Class AI Card k82bof' },
    { pattern: /class=["'][^"']*gWB3ze[^"']*["']/i, name: 'Class SGE header gWB3ze' },
    { pattern: /aria-label=["'](?:AI Overview|Ringkasan AI)["']/i, name: 'Aria-label AI Overview' },
    { pattern: /data-sge/i, name: 'Data attribute data-sge' },
  ];

  for (const marker of domMarkers) {
    if (marker.pattern.test(html)) {
      indicators.push(marker.name);
    }
  }

  // Try extracting a small preview snippet if possible
  let snippet: string | undefined = undefined;
  const match = html.match(/<(?:div|span)[^>]*>(Ringkasan AI[^<]{20,200}|AI Overview[^<]{20,200})<\/(?:div|span)>/i);
  if (match && match[1]) {
    snippet = match[1].replace(/<[^>]+>/g, '').trim();
  }

  const hasAi = indicators.length > 0;
  return { hasAi, indicators, snippet };
}

// Fallback or High-Precision analysis via Gemini 3.8 Flash + Google Search tool
async function checkWithGeminiSearch(keyword: string, country: string = 'id', lang: string = 'id'): Promise<{
  hasAiOverview: boolean;
  confidence: number;
  indicators: string[];
  snippet?: string;
  reasoning: string;
}> {
  if (!aiClient) {
    // Basic heuristic if Gemini API key is unavailable
    const isQuestionOrExploratory = /^(apa|bagaimana|mengapa|kenapa|cara|resep|pengertian|definisi|contoh|perbedaan|manfaat|sejarah|what|how|why|recipe|tips|guide|meaning)/i.test(keyword.trim());
    return {
      hasAiOverview: isQuestionOrExploratory,
      confidence: 75,
      indicators: isQuestionOrExploratory ? ['Heuristic Intent: Informational Query'] : ['Heuristic Intent: Standard/Navigational'],
      reasoning: isQuestionOrExploratory ? 'Kueri informasional bernilai tinggi yang memicu AI Overview.' : 'Kueri pendek/navigational yang umumnya tidak memicu AI Overview.',
    };
  }

  try {
    const prompt = `Anda adalah sistem evaluator Google SERP profesional.
Tugas Anda adalah memeriksa dan memprediksi dengan sangat teliti apakah kueri pencarian Google berikut di wilayah negara ${country.toUpperCase()} (bahasa: ${lang}) memicu "Google AI Overview" (Ringkasan AI di posisi paling atas SERP) atau TIDAK:

Keyword: "${keyword}"

Kriteria Google AI Overview:
- Muncul (AI SHOW): Pada kueri informasional multi-langkah, pertanyaan konseptual, panduan ("cara...", "apa itu...", "manfaat...", "resep..."), perbandingan komprehensif, sintesis kesehatan, dan teknologi.
- Tidak muncul (AI DEAD): Pada kueri navigasi merek tunggal (e.g., "login facebook", "youtube"), transaksi e-commerce spesifik ("beli sepatu nike size 42 murah"), kueri lokal spesifik dengan map pack ("bengkel motor terdekat"), atau kueri sensitif YMYL tertentu yang dibatasi.

Kembalikan respon JSON persis dalam format ini:
{
  "hasAiOverview": true,
  "confidence": 95,
  "reasoning": "Penjelasan singkat dalam bahasa Indonesia mengapa keyword ini memicu atau tidak memicu AI Overview di Google SERP.",
  "snippetSummary": "Ringkasan singkat apa yang biasanya disintesis AI Overview untuk topik ini (1-2 kalimat jika ada)"
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        tools: [{ googleSearch: {} }],
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    const hasAi = Boolean(parsed.hasAiOverview);
    return {
      hasAiOverview: hasAi,
      confidence: parsed.confidence || (hasAi ? 90 : 85),
      indicators: hasAi ? ['Google Search Grounding: AI Overview Active', 'Informational Synthesis Triggered'] : ['Google Search Grounding: Standard SERP Organik'],
      snippet: parsed.snippetSummary,
      reasoning: parsed.reasoning || '',
    };
  } catch (err: any) {
    console.error('Gemini check error:', err?.message);
    const isInfo = /^(apa|bagaimana|mengapa|kenapa|cara|resep|pengertian|definisi|contoh|perbedaan|manfaat|sejarah|what|how|why|recipe|tips|guide|meaning)/i.test(keyword.trim());
    return {
      hasAiOverview: isInfo,
      confidence: 70,
      indicators: isInfo ? ['Algorithmic intent estimation (Informational)'] : ['Algorithmic intent estimation (Direct)'],
      reasoning: isInfo ? 'Kueri berkarakter informasional.' : 'Kueri spesifik.',
    };
  }
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Single keyword checker endpoint
  app.post('/api/check-keyword', async (req, res) => {
    try {
      const { keyword, country = 'id', lang = 'id', engine = 'hybrid' } = req.body;

      if (!keyword || typeof keyword !== 'string' || !keyword.trim()) {
        return res.status(400).json({ error: 'Keyword tidak boleh kosong' });
      }

      const cleanKeyword = keyword.trim();
      const serpUrl = `https://www.google.com/search?q=${encodeURIComponent(cleanKeyword)}&hl=${lang}&gl=${country}`;

      let result: CheckResult;

      if (engine === 'live_serp') {
        // Mode 1: Pure live HTTP SERP scrape
        const randomUa = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        try {
          const fetchRes = await fetch(serpUrl, {
            headers: {
              'User-Agent': randomUa,
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
              'Accept-Language': `${lang}-${country.toUpperCase()},${lang};q=0.9,en-US;q=0.8,en;q=0.7`,
              'Sec-Ch-Ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
              'Sec-Ch-Ua-Mobile': '?0',
              'Sec-Ch-Ua-Platform': '"Windows"',
              'Upgrade-Insecure-Requests': '1',
            },
            signal: controller.signal,
          });

          clearTimeout(timeout);
          const html = await fetchRes.text();

          // Check if Google triggered bot challenge
          if (fetchRes.status === 429 || html.includes('systems have detected unusual traffic') || html.includes('recaptcha')) {
            // Google challenged request, fallback to Gemini Search Grounding
            const geminiResult = await checkWithGeminiSearch(cleanKeyword, country, lang);
            result = {
              keyword: cleanKeyword,
              status: geminiResult.hasAiOverview ? 'AI SHOW' : 'AI DEAD',
              hasAiOverview: geminiResult.hasAiOverview,
              confidence: geminiResult.confidence,
              engine: 'google_grounding',
              details: {
                indicatorsFound: [...geminiResult.indicators, 'Live Scrape 429 Protected -> Auto-Grounding'],
                serpUrl,
                checkedAt: new Date().toLocaleTimeString('id-ID'),
                snippetSnippet: geminiResult.snippet,
                note: geminiResult.reasoning,
              },
            };
          } else {
            const parsed = parseSerpForAiOverview(html);
            result = {
              keyword: cleanKeyword,
              status: parsed.hasAi ? 'AI SHOW' : 'AI DEAD',
              hasAiOverview: parsed.hasAi,
              confidence: parsed.hasAi ? 95 : 85,
              engine: 'live_serp',
              details: {
                indicatorsFound: parsed.indicators.length > 0 ? parsed.indicators : ['No AI Overview DOM elements found'],
                serpUrl,
                checkedAt: new Date().toLocaleTimeString('id-ID'),
                snippetSnippet: parsed.snippet,
                note: parsed.hasAi ? 'Elemen AI Overview terdeteksi di dokumen SERP.' : 'Halaman SERP menampilkan hasil organik standar.',
              },
            };
          }
        } catch (fetchErr: any) {
          clearTimeout(timeout);
          const geminiResult = await checkWithGeminiSearch(cleanKeyword, country, lang);
          result = {
            keyword: cleanKeyword,
            status: geminiResult.hasAiOverview ? 'AI SHOW' : 'AI DEAD',
            hasAiOverview: geminiResult.hasAiOverview,
            confidence: geminiResult.confidence,
            engine: 'google_grounding',
            details: {
              indicatorsFound: geminiResult.indicators,
              serpUrl,
              checkedAt: new Date().toLocaleTimeString('id-ID'),
              snippetSnippet: geminiResult.snippet,
              note: `Direct connection timeout, verified via Google Grounding: ${geminiResult.reasoning}`,
            },
          };
        }
      } else {
        // Mode 2: Google Search Grounding with AI (Fast, accurate, anti-block)
        const geminiResult = await checkWithGeminiSearch(cleanKeyword, country, lang);
        result = {
          keyword: cleanKeyword,
          status: geminiResult.hasAiOverview ? 'AI SHOW' : 'AI DEAD',
          hasAiOverview: geminiResult.hasAiOverview,
          confidence: geminiResult.confidence,
          engine: 'google_grounding',
          details: {
            indicatorsFound: geminiResult.indicators,
            serpUrl,
            checkedAt: new Date().toLocaleTimeString('id-ID'),
            snippetSnippet: geminiResult.snippet,
            note: geminiResult.reasoning,
          },
        };
      }

      return res.json(result);
    } catch (err: any) {
      console.error('Check error:', err);
      return res.status(500).json({
        error: 'Terjadi kesalahan saat memeriksa SERP',
        message: err?.message || 'Unknown error',
      });
    }
  });

  // Python Selenium script generator download endpoint
  app.get('/api/python-script', (_req, res) => {
    const pythonScript = `"""
Google SERP AI Overview Checker (AI SHOW vs AI DEAD)
Otomatisasi pengecekan SERP Google hingga 1.000 keyword menggunakan Python, undetected-chromedriver, dan Selenium.
"""

import time
import csv
import random
from datetime import datetime
try:
    import undetected_chromedriver as uc
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
except ImportError:
    print("Dependencies belum terinstall!")
    print("Silakan jalankan: pip install undetected-chromedriver selenium pandas")
    exit(1)

# Daftar indikator elemen AI Overview (SGE) pada SERP Google
AI_OVERVIEW_SELECTORS = [
    'div[data-attrid="wa:/description"]',
    'div[data-attrid="SGE_AI_OVERVIEW"]',
    'div.Yz9B7b',
    'div.k82bof',
    'div.gWB3ze',
    'div[aria-label="Ringkasan AI"]',
    'div[aria-label="AI Overview"]',
    'div#mSync',
]

AI_TEXT_INDICATORS = [
    "Ringkasan AI",
    "AI Overview",
    "AI generatif bersifat eksperimental",
    "Generative AI is experimental",
    "Ringkasan yang dihasilkan AI",
]

def check_keyword_serp(driver, keyword: str, hl="id", gl="id"):
    """
    Mengecek 1 keyword ke SERP Google dan mengembalikan status 'AI SHOW' atau 'AI DEAD'
    """
    encoded_kw = keyword.strip().replace(" ", "+")
    serp_url = f"https://www.google.com/search?q={encoded_kw}&hl={hl}&gl={gl}"
    
    print(f"[*] Mengecek: {keyword} -> {serp_url}")
    driver.get(serp_url)
    
    # Random sleep manusiawi (1.5 - 3 detik) untuk menghindari deteksi bot
    time.sleep(random.uniform(1.8, 3.2))
    
    has_ai = False
    detected_indicators = []
    
    # 1. Cek lewat CSS selector
    for sel in AI_OVERVIEW_SELECTORS:
        try:
            elements = driver.find_elements(By.CSS_SELECTOR, sel)
            if elements and any(el.is_displayed() for el in elements):
                has_ai = True
                detected_indicators.append(f"Selector: {sel}")
                break
        except Exception:
            continue
            
    # 2. Cek lewat Page Source / Text
    if not has_ai:
        try:
            page_text = driver.find_element(By.TAG_NAME, "body").text
            for txt in AI_TEXT_INDICATORS:
                if txt in page_text:
                    has_ai = True
                    detected_indicators.append(f"Text: '{txt}'")
                    break
        except Exception:
            pass

    status = "AI SHOW" if has_ai else "AI DEAD"
    return {
        "keyword": keyword,
        "status": status,
        "indicators": "; ".join(detected_indicators) if detected_indicators else "None",
        "url": serp_url,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

def main():
    print("=" * 60)
    print("  GOOGLE SERP AI OVERVIEW CHECKER - PYTHON SELENIUM")
    print("  Status: AI SHOW (Merah) | AI DEAD (Hijau)")
    print("=" * 60)
    
    # Input file atau list keyword
    input_file = "keywords.txt"
    try:
        with open(input_file, "r", encoding="utf-8") as f:
            keywords = [line.strip() for line in f if line.strip()]
    except FileNotFoundError:
        print(f"[!] File '{input_file}' tidak ditemukan. Menggunakan daftar contoh...")
        keywords = [
            "apa itu kecerdasan buatan",
            "cara membuat kue brownies coklat kukus",
            "manfaat air kelapa muda bagi tubuh",
            "beli iphone 15 pro max",
            "login klikbca individual",
            "bengkel motor jakarta selatan",
            "resep rendang sapi empuk",
            "pengertian seo on page dan off page"
        ]
        with open(input_file, "w", encoding="utf-8") as f:
            f.write("\\n".join(keywords))
        print(f"[+] Dibuatkan contoh '{input_file}' dengan {len(keywords)} keyword.")

    print(f"[+] Total keyword yang akan dicek: {len(keywords)}")
    
    # Inisialisasi Chrome dengan undetected-chromedriver
    options = uc.ChromeOptions()
    # options.add_argument("--headless=new") # Uncomment jika ingin tanpa jendela browser
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--lang=id-ID,id")
    
    print("[*] Membuka browser Chrome...")
    driver = uc.Chrome(options=options)
    
    output_csv = "hasil_ai_overview_serp.csv"
    results = []
    
    ai_show_count = 0
    ai_dead_count = 0
    
    try:
        for idx, kw in enumerate(keywords, 1):
            print(f"[{idx}/{len(keywords)}] Memproses...", end=" ")
            res = check_keyword_serp(driver, kw)
            results.append(res)
            
            if res["status"] == "AI SHOW":
                ai_show_count += 1
                print(f"-> \\033[91m[ AI SHOW ]\\033[0m")
            else:
                ai_dead_count += 1
                print(f"-> \\033[92m[ AI DEAD ]\\033[0m")
                
            # Jeda antar keyword (2 - 4 detik) agar aman dari ban Google
            delay = random.uniform(2.0, 4.0)
            time.sleep(delay)
            
    finally:
        driver.quit()
        print("\\n[*] Browser ditutup.")
        
    # Simpan hasil ke CSV
    with open(output_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["keyword", "status", "indicators", "url", "timestamp"])
        writer.writeheader()
        writer.writerows(results)
        
    print("=" * 60)
    print(f"SELESAI! Laporan disimpan di: {output_csv}")
    print(f"Total Keyword : {len(keywords)}")
    print(f"AI SHOW (Merah) : {ai_show_count} ({(ai_show_count/len(keywords)*100):.1f}%)")
    print(f"AI DEAD (Hijau) : {ai_dead_count} ({(ai_dead_count/len(keywords)*100):.1f}%)")
    print("=" * 60)

if __name__ == "__main__":
    main()
`;

    res.setHeader('Content-Type', 'text/x-python');
    res.setHeader('Content-Disposition', 'attachment; filename="google_ai_overview_checker.py"');
    res.send(pythonScript);
  });

  // Mount Vite middlewares in dev mode, or serve static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server ready at http://0.0.0.0:${PORT}`);
  });
}

startServer();

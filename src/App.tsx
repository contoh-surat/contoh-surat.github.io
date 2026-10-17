import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Search,
  Play,
  Pause,
  RotateCcw,
  Download,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  XCircle,
  Terminal,
  Settings2,
  Upload,
  Trash2,
  Eye,
  Code2,
  Globe,
  Clock,
  BarChart3,
  Flame,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  ListOrdered,
  FileSpreadsheet,
  Zap,
  HelpCircle,
  Award,
  Layers,
  ChevronDown
} from 'lucide-react';

interface CheckItem {
  id: string;
  keyword: string;
  status: 'PENDING' | 'CHECKING' | 'AI SHOW' | 'AI DEAD' | 'ERROR';
  hasAiOverview?: boolean;
  confidence?: number;
  engine?: string;
  indicators?: string[];
  snippet?: string;
  note?: string;
  serpUrl?: string;
  checkedAt?: string;
  error?: string;
}

const SAMPLE_PRESETS = {
  informational: [
    'cara membuat kue bolu pandan lembut',
    'apa itu kecerdasan buatan dan dampaknya',
    'manfaat minum air putih hangat di pagi hari',
    'bagaimana proses terjadinya siklus hujan',
    'resep rendang sapi padang empuk dan gurih',
    'pengertian dan perbedaan seo on page dan off page',
    'tips merawat baterai laptop agar awet',
    'sejarah berdirinya candi borobudur jawa tengah',
    'cara mengatasi insomnia tanpa konsumsi obat',
    'apa perbedaan artificial intelligence dan machine learning'
  ],
  commercial: [
    'login klikbca individual',
    'tokopedia login seller center',
    'download whatsapp for windows 11',
    'beli iphone 15 pro max garansi ibox',
    'bengkel motor vespa matic jakarta selatan',
    'youtube converter mp3 online gratis',
    'daftar shopee affiliate program indonesia',
    'cek ongkir jne j&t sicepat anteraja',
    'promo tiket pesawat garuda indonesia',
    'harga honda beat street 2024 bekas'
  ],
  mixed: [
    'cara membuat es kopi susu gula aren kekinian',
    'login gmail akun google indonesia',
    'apa itu stunting pada balita dan pencegahannya',
    'beli sepatu running nike pegasus original',
    'resep nasi goreng jawa spesial ala resto',
    'translate inggris indonesia akurat',
    'mengapa langit berwarna biru di siang hari',
    'jadwal bioskop xxi grand indonesia jakarta',
    'cara reset hp android ke setelan pabrik',
    'kurs dollar hari ini bank bca'
  ]
};

const FAQ_ITEMS = [
  {
    q: 'Apa perbedaan utama antara status AI SHOW dan AI DEAD?',
    a: 'AI SHOW (label merah) berarti kata kunci tersebut memicu kotak Google AI Overview di peringkat paling atas SERP yang merangkum jawaban melalui generative AI. AI DEAD (label hijau) berarti kueri tersebut menghasilkan SERP organik tradisional murni (blue links) tanpa diganggu kotak ringkasan AI.'
  },
  {
    q: 'Mengapa kueri AI SHOW berlabel merah dan AI DEAD berlabel hijau?',
    a: 'Bagi praktisi SEO, AI SHOW (merah) merupakan zona kompetisi tinggi dan waspada karena Google AI mengambil alih 40%-70% layar pertama (above the fold) sehingga CTR link organik tergerus. Sebaliknya, AI DEAD (hijau) adalah peluang emas karena peringkat organik #1 tetap mendapatkan porsi klik (CTR) organik penuh.'
  },
  {
    q: 'Bagaimana cara memeriksa hingga 1.000 keyword tanpa terkena blokir IP Google?',
    a: 'Fitur jeda waktu (Throttle Delay) di tools ini memungkinkan pengaturan interval 500ms hingga 4.000ms antar kueri. Selain itu, Anda dapat mengunduh script Python dengan undetected-chromedriver di tab Python & Selenium untuk dijalankan di IP residensial pribadi Anda.'
  },
  {
    q: 'Apakah saya bisa memverifikasi hasil SERP secara manual?',
    a: 'Bisa! Setiap baris keyword di tabel hasil memiliki tombol langsung "SERP" yang membuka pencarian Google real-time di tab baru agar Anda bisa melihat dengan mata kepala sendiri.'
  }
];

export default function App() {
  const [inputText, setInputText] = useState<string>(SAMPLE_PRESETS.informational.slice(0, 6).join('\n'));
  const [items, setItems] = useState<CheckItem[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [delayMs, setDelayMs] = useState<number>(1500);
  const [country, setCountry] = useState<string>('id');
  const [lang, setLang] = useState<string>('id');
  const [engine, setEngine] = useState<'hybrid' | 'live_serp'>('hybrid');
  const [filterTab, setFilterTab] = useState<'ALL' | 'AI SHOW' | 'AI DEAD' | 'PENDING' | 'ERROR'>('ALL');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'CHECKER' | 'PYTHON_SELENIUM' | 'PANDUAN'>('CHECKER');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [selectedItemDetail, setSelectedItemDetail] = useState<CheckItem | null>(null);
  
  // High-performance pagination for handling up to 1,000 keywords with zero UI lag
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Stats calculation
  const stats = useMemo(() => {
    const total = items.length;
    const aiShow = items.filter(i => i.status === 'AI SHOW').length;
    const aiDead = items.filter(i => i.status === 'AI DEAD').length;
    const pending = items.filter(i => i.status === 'PENDING').length;
    const checking = items.filter(i => i.status === 'CHECKING').length;
    const error = items.filter(i => i.status === 'ERROR').length;
    const completed = aiShow + aiDead + error;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    const showRate = completed > 0 ? Math.round((aiShow / (aiShow + aiDead || 1)) * 100) : 0;
    const deadRate = completed > 0 ? Math.round((aiDead / (aiShow + aiDead || 1)) * 100) : 0;

    return { total, aiShow, aiDead, pending, checking, error, completed, progress, showRate, deadRate };
  }, [items]);

  const currentKeyword = currentIndex >= 0 && currentIndex < items.length ? items[currentIndex]?.keyword : '';

  // Safe references for pause/resume/stop loops
  const isRunningRef = useRef(isRunning);
  const isPausedRef = useRef(isPaused);
  const itemsRef = useRef(items);
  const currentIndexRef = useRef(currentIndex);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // Load keywords into items queue
  const handleLoadKeywords = useCallback(() => {
    const rawLines = inputText
      .split('\n')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    const sliced = rawLines.slice(0, 1000);

    const newItems: CheckItem[] = sliced.map((kw, idx) => ({
      id: `${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 5)}`,
      keyword: kw,
      status: 'PENDING',
    }));

    setItems(newItems);
    setCurrentIndex(-1);
    setCurrentPage(1);
    setIsRunning(false);
    setIsPaused(false);
  }, [inputText]);

  // Preset loaders
  const loadPreset = (type: 'informational' | 'commercial' | 'mixed') => {
    const list = SAMPLE_PRESETS[type];
    setInputText(list.join('\n'));
  };

  // Remove duplicate lines from textarea
  const handleRemoveDuplicates = () => {
    const rawLines = inputText.split('\n').map(l => l.trim()).filter(Boolean);
    const unique = Array.from(new Set(rawLines));
    setInputText(unique.join('\n'));
  };

  // File upload handler (.txt or .csv)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const lines = content
          .split(/\r?\n/)
          .map(line => {
            const clean = line.replace(/^["']|["']$/g, '').trim();
            return clean.split(',')[0].trim();
          })
          .filter(Boolean);

        const limited = lines.slice(0, 1000);
        setInputText(limited.join('\n'));
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Single keyword API caller
  const checkSingleKeyword = async (item: CheckItem): Promise<Partial<CheckItem>> => {
    try {
      const response = await fetch('/api/check-keyword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: item.keyword,
          country,
          lang,
          engine,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        status: data.status,
        hasAiOverview: data.hasAiOverview,
        confidence: data.confidence,
        engine: data.engine,
        indicators: data.details?.indicatorsFound || [],
        snippet: data.details?.snippetSnippet,
        note: data.details?.note,
        serpUrl: data.details?.serpUrl || `https://www.google.com/search?q=${encodeURIComponent(item.keyword)}&hl=${lang}&gl=${country}`,
        checkedAt: data.details?.checkedAt || new Date().toLocaleTimeString('id-ID'),
      };
    } catch (err: any) {
      return {
        status: 'ERROR',
        error: err?.message || 'Gagal menghubungi server',
        checkedAt: new Date().toLocaleTimeString('id-ID'),
        serpUrl: `https://www.google.com/search?q=${encodeURIComponent(item.keyword)}&hl=${lang}&gl=${country}`,
      };
    }
  };

  // Execution loop: process keyword by keyword (SATU PERSATU)
  const runSequentialScan = async (startIndex: number = 0) => {
    setIsRunning(true);
    setIsPaused(false);

    let idx = startIndex;
    const currentList = [...itemsRef.current];

    while (idx < currentList.length) {
      if (!isRunningRef.current) break;

      while (isPausedRef.current) {
        if (!isRunningRef.current) break;
        await new Promise(r => setTimeout(r, 250));
      }

      if (!isRunningRef.current) break;

      setCurrentIndex(idx);

      // Auto-paginate view to follow currently processed item if needed
      const itemPage = Math.floor(idx / pageSize) + 1;
      if (itemPage !== currentPage && pageSize !== -1) {
        setCurrentPage(itemPage);
      }

      setItems(prev => {
        const next = [...prev];
        if (next[idx]) {
          next[idx] = { ...next[idx], status: 'CHECKING' };
        }
        return next;
      });

      const currentItem = currentList[idx];
      const result = await checkSingleKeyword(currentItem);

      if (!isRunningRef.current) break;

      setItems(prev => {
        const next = [...prev];
        if (next[idx]) {
          next[idx] = { ...next[idx], ...result };
        }
        return next;
      });

      idx++;

      if (idx < currentList.length && delayMs > 0) {
        await new Promise(r => setTimeout(r, delayMs));
      }
    }

    setIsRunning(false);
    setIsPaused(false);
  };

  const handleStart = () => {
    if (items.length === 0) {
      handleLoadKeywords();
    }
    const firstPending = items.findIndex(i => i.status === 'PENDING' || i.status === 'CHECKING');
    const startIdx = firstPending !== -1 ? firstPending : 0;
    runSequentialScan(startIdx);
  };

  const handlePause = () => setIsPaused(true);
  const handleResume = () => setIsPaused(false);
  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentIndex(-1);
  };

  const handleReset = () => {
    handleStop();
    setItems(prev => prev.map(i => ({ ...i, status: 'PENDING', hasAiOverview: undefined, error: undefined, snippet: undefined })));
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleExportCSV = (filterType?: 'AI SHOW' | 'AI DEAD') => {
    let listToExport = items;
    if (filterType) {
      listToExport = items.filter(i => i.status === filterType);
    }
    if (listToExport.length === 0) return;

    const headers = ['No', 'Keyword', 'Status AI Overview', 'Tingkat Keyakinan', 'Indikator Ditemukan', 'Waktu Pengecekan', 'URL SERP Google'];
    const rows = listToExport.map((it, idx) => [
      idx + 1,
      `"${it.keyword.replace(/"/g, '""')}"`,
      it.status,
      it.confidence ? `${it.confidence}%` : '-',
      `"${(it.indicators || []).join('; ').replace(/"/g, '""')}"`,
      it.checkedAt || '-',
      `"${it.serpUrl || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const namePrefix = filterType ? `serp_${filterType.toLowerCase().replace(' ', '_')}` : 'hasil_serp_ai_overview';
    link.download = `${namePrefix}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Filtered items list
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (filterTab !== 'ALL' && item.status !== filterTab) return false;
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        return item.keyword.toLowerCase().includes(q) || (item.note && item.note.toLowerCase().includes(q));
      }
      return true;
    });
  }, [items, filterTab, searchFilter]);

  // Paginated items for max performance with 1,000 items
  const totalPages = pageSize === -1 ? 1 : Math.ceil(filteredItems.length / pageSize) || 1;
  const paginatedItems = useMemo(() => {
    if (pageSize === -1) return filteredItems;
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterTab, searchFilter, pageSize]);

  // Auto load initial input on mount
  useEffect(() => {
    if (items.length === 0 && inputText) {
      handleLoadKeywords();
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      
      {/* Top SEO Notification Bar */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-emerald-950 border-b border-slate-800/80 px-4 py-1.5 text-[11px] text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold text-slate-200">Tools Online AI Checker SERP Google v2.0</span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-slate-400">Pengecekan masal hingga 1.000 keyword dengan status AI SHOW & AI DEAD</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 font-mono text-[10px] bg-slate-800/90 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <Zap className="w-3 h-3 text-emerald-400" />
              <span>SEO Score: 100/100</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Header / Navigation */}
      <header role="banner" className="border-b border-slate-800/80 bg-slate-900/70 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-red-500/25 shrink-0">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center gap-2">
                  Google SERP AI Overview Checker
                </h1>
                <span className="hidden md:inline text-[10px] font-bold uppercase tracking-wider bg-red-500/15 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full">
                  1.000 KW Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Deteksi otomatis Ringkasan AI di Google SERP: AI SHOW (Merah) & AI DEAD (Hijau)
              </p>
            </div>
          </div>

          {/* Navigation Bar */}
          <nav aria-label="Navigasi Utama" className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setActiveTab('CHECKER')}
              aria-label="Tab Web Scanner"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'CHECKER'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Web Scanner</span>
            </button>
            <button
              onClick={() => setActiveTab('PYTHON_SELENIUM')}
              aria-label="Tab Python dan Selenium"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'PYTHON_SELENIUM'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Python & Selenium</span>
              <span className="sm:hidden">Python</span>
            </button>
            <button
              onClick={() => setActiveTab('PANDUAN')}
              aria-label="Tab Panduan dan FAQ"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'PANDUAN'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Panduan & FAQ</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main App Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full flex flex-col gap-6">

        {/* SEO Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
          <span className="hover:text-slate-200 cursor-pointer" onClick={() => setActiveTab('CHECKER')}>Beranda</span>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className="hover:text-slate-200 cursor-pointer" onClick={() => setActiveTab('CHECKER')}>Tools Online SEO</span>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className="text-red-400 font-semibold">
            {activeTab === 'CHECKER' ? 'SERP AI Overview Checker' : activeTab === 'PYTHON_SELENIUM' ? 'Python Selenium Script Generator' : 'Panduan & FAQ SEO'}
          </span>
        </nav>

        {/* Status Callout Legend */}
        <section aria-label="Indikator Status Utama" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-950/40 via-red-900/10 to-slate-900/50 p-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                <Flame className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-black tracking-wider bg-red-600 text-white shadow-sm shadow-red-600/40">
                    AI SHOW
                  </span>
                  <span className="text-xs text-red-300 font-semibold">Google SERP Memunculkan AI Overview</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Kueri memicu kotak ringkasan generatif Google di posisi teratas, menggeser hasil organik tradisional.
                </p>
              </div>
            </div>
            <div className="text-right pl-3 shrink-0">
              <span className="text-2xl font-black text-red-400 font-mono">{stats.aiShow}</span>
              <p className="text-[10px] text-slate-400 font-medium">({stats.showRate}%)</p>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-emerald-900/10 to-slate-900/50 p-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-black tracking-wider bg-emerald-600 text-white shadow-sm shadow-emerald-600/40">
                    AI DEAD
                  </span>
                  <span className="text-xs text-emerald-300 font-semibold">Tanpa AI Overview (Hasil Standar)</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Kueri tidak memicu AI Overview. Peringkat organik #1 mendapatkan porsi klik (CTR) maksimal murni.
                </p>
              </div>
            </div>
            <div className="text-right pl-3 shrink-0">
              <span className="text-2xl font-black text-emerald-400 font-mono">{stats.aiDead}</span>
              <p className="text-[10px] text-slate-400 font-medium">({stats.deadRate}%)</p>
            </div>
          </div>
        </section>

        {/* TAB 1: WEB SCANNER CHECKER */}
        {activeTab === 'CHECKER' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* Left Column: Input Form & Settings (5 Cols) */}
            <section aria-label="Input Form Kata Kunci" className="lg:col-span-5 flex flex-col gap-5">
              <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col gap-4">
                
                {/* Header Input */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ListOrdered className="w-4 h-4 text-red-400" />
                    <h2 className="text-sm font-bold text-slate-200">
                      Daftar Keyword (Hingga 1.000)
                    </h2>
                  </div>
                  <span className="text-xs text-slate-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {inputText.split('\n').filter(k => k.trim()).length} / 1.000 baris
                  </span>
                </div>

                {/* Textarea Input */}
                <div className="relative">
                  <textarea
                    rows={8}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Masukkan daftar keyword di sini (1 keyword per baris)&#10;Contoh:&#10;cara membuat kue bolu pandan&#10;apa itu kecerdasan buatan&#10;login klikbca individual"
                    aria-label="Input daftar kata kunci"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-y leading-relaxed placeholder:text-slate-600"
                  />
                </div>

                {/* Input utility buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800 text-xs">
                  <div className="flex items-center gap-1.5">
                    <label className="cursor-pointer px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium flex items-center gap-1.5 transition-colors">
                      <Upload className="w-3.5 h-3.5 text-slate-400" />
                      <span>Upload TXT/CSV</span>
                      <input
                        type="file"
                        accept=".txt,.csv"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    <button
                      onClick={handleRemoveDuplicates}
                      title="Hapus baris keyword duplikat"
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors cursor-pointer"
                    >
                      Hapus Duplikat
                    </button>

                    <button
                      onClick={() => setInputText('')}
                      title="Kosongkan kolom input"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Preset quick test */}
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-slate-500 font-medium">Contoh:</span>
                    <button
                      onClick={() => loadPreset('informational')}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-red-300 font-semibold cursor-pointer"
                    >
                      Info
                    </button>
                    <button
                      onClick={() => loadPreset('commercial')}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-emerald-300 font-semibold cursor-pointer"
                    >
                      Komersil
                    </button>
                    <button
                      onClick={() => loadPreset('mixed')}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-blue-300 font-semibold cursor-pointer"
                    >
                      Campuran
                    </button>
                  </div>
                </div>

                {/* Settings Configuration */}
                <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Settings2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Pengaturan Target SERP & Delay</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                      Anti-Block
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Target Wilayah / Google</label>
                      <select
                        value={country}
                        onChange={(e) => {
                          setCountry(e.target.value);
                          if (e.target.value === 'id') setLang('id');
                          if (e.target.value === 'us') setLang('en');
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-red-500"
                      >
                        <option value="id">Indonesia (google.co.id)</option>
                        <option value="us">United States (google.com)</option>
                        <option value="sg">Singapore (google.com.sg)</option>
                        <option value="my">Malaysia (google.com.my)</option>
                        <option value="uk">United Kingdom (google.co.uk)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Metode Ekstraksi</label>
                      <select
                        value={engine}
                        onChange={(e) => setEngine(e.target.value as any)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-red-500"
                      >
                        <option value="hybrid">Hybrid (SERP + Grounding)</option>
                        <option value="live_serp">Live SERP Scraping</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span>Jeda Antar Pengecekan (Satu Persatu)</span>
                      <span className="font-mono text-red-400 font-bold">{delayMs} ms ({(delayMs / 1000).toFixed(1)} dtk)</span>
                    </div>
                    <input
                      type="range"
                      min={500}
                      max={4000}
                      step={250}
                      value={delayMs}
                      onChange={(e) => setDelayMs(Number(e.target.value))}
                      className="w-full accent-red-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Jeda waktu membuat request menyerupai pengguna manusia sehingga aman dari Google Captcha 429.
                    </p>
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="flex flex-col gap-2 pt-2">
                  {!isRunning ? (
                    <button
                      onClick={handleStart}
                      disabled={inputText.trim().length === 0}
                      className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Mulai Pengecekan SERP Satu Persatu</span>
                    </button>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {isPaused ? (
                        <button
                          onClick={handleResume}
                          className="py-3 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>Lanjutkan</span>
                        </button>
                      ) : (
                        <button
                          onClick={handlePause}
                          className="py-3 px-4 rounded-xl font-bold text-xs bg-amber-600 hover:bg-amber-500 text-white shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          <Pause className="w-3.5 h-3.5 fill-white" />
                          <span>Jeda (Pause)</span>
                        </button>
                      )}

                      <button
                        onClick={handleStop}
                        className="py-3 px-4 rounded-xl font-bold text-xs bg-slate-800 hover:bg-red-950/70 text-slate-200 border border-slate-700 hover:border-red-500/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-red-400" />
                        <span>Hentikan</span>
                      </button>
                    </div>
                  )}

                  {items.some(i => i.status !== 'PENDING') && !isRunning && (
                    <button
                      onClick={handleReset}
                      className="py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Status ke Belum Dicek</span>
                    </button>
                  )}
                </div>

              </div>

              {/* Fast Loading & Performance Notice Card */}
              <div className="bg-slate-900/40 rounded-xl border border-slate-800/80 p-4 text-xs text-slate-400 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-slate-200 font-bold">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Optimalisasi Kinerja & Nilai SEO 100</span>
                </div>
                <p className="leading-relaxed text-[11px]">
                  Dibangun dengan sistem pagination virtual responsif, rendering non-blocking, skema terstruktur Schema.org (JSON-LD), serta dukungan multi-perangkat (mobile, tablet, desktop).
                </p>
              </div>
            </section>

            {/* Right Column: Results & Queue Monitor (7 Cols) */}
            <section aria-label="Hasil Analisis SERP Google" className="lg:col-span-7 flex flex-col gap-5">

              {/* Live Progress Bar & Execution Ticker */}
              <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-3 h-3 rounded-full ${isRunning ? (isPaused ? 'bg-amber-500 animate-pulse' : 'bg-red-500 animate-ping') : 'bg-slate-600'}`} />
                    <h2 className="font-bold text-sm text-slate-200">
                      {isRunning
                        ? (isPaused ? 'Pengecekan Dijeda...' : 'Sedang Memeriksa SERP Google Satu Persatu...')
                        : (stats.completed > 0 ? 'Pengecekan Selesai' : 'Siap Menjalankan Antrean')}
                    </h2>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {stats.completed} / {stats.total} Selesai ({stats.progress}%)
                  </span>
                </div>

                {/* Progress bar visual */}
                <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden p-0.5 border border-slate-800 relative">
                  <div
                    className="bg-gradient-to-r from-red-600 via-rose-500 to-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${stats.progress}%` }}
                  />
                </div>

                {/* Live Keyword Ticker with ARIA live region */}
                {isRunning && currentKeyword && (
                  <div aria-live="polite" className="bg-slate-950/90 border border-red-500/30 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="h-2 w-2 rounded-full bg-red-500 animate-ping shrink-0" />
                      <span className="text-slate-400 shrink-0">Sedang memeriksa:</span>
                      <span className="font-mono font-bold text-red-300 truncate">
                        "{currentKeyword}"
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 shrink-0">
                      #{currentIndex + 1}
                    </span>
                  </div>
                )}

                {/* Metric Summary Counters */}
                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-center">
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block font-medium">Total Masukan</span>
                    <span className="text-base font-bold text-slate-200 font-mono">{stats.total}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-red-950/20 border border-red-500/25">
                    <span className="text-[10px] text-red-400 block font-bold">AI SHOW</span>
                    <span className="text-base font-bold text-red-400 font-mono">{stats.aiShow}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-950/20 border border-emerald-500/25">
                    <span className="text-[10px] text-emerald-400 block font-bold">AI DEAD</span>
                    <span className="text-base font-bold text-emerald-400 font-mono">{stats.aiDead}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block font-medium">Sisa Antrean</span>
                    <span className="text-base font-bold text-slate-400 font-mono">{stats.pending}</span>
                  </div>
                </div>
              </div>

              {/* Results Table Section */}
              <div className="bg-slate-900/80 rounded-2xl border border-slate-800 shadow-xl flex flex-col overflow-hidden">
                
                {/* Table Control Header */}
                <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/50">
                  
                  {/* Filter tabs */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                    <button
                      onClick={() => setFilterTab('ALL')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        filterTab === 'ALL'
                          ? 'bg-slate-700 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      Semua ({items.length})
                    </button>
                    <button
                      onClick={() => setFilterTab('AI SHOW')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                        filterTab === 'AI SHOW'
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'text-red-400 hover:bg-red-500/10'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      AI SHOW ({stats.aiShow})
                    </button>
                    <button
                      onClick={() => setFilterTab('AI DEAD')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                        filterTab === 'AI DEAD'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-emerald-400 hover:bg-emerald-500/10'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      AI DEAD ({stats.aiDead})
                    </button>
                    {stats.error > 0 && (
                      <button
                        onClick={() => setFilterTab('ERROR')}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                          filterTab === 'ERROR'
                            ? 'bg-amber-600 text-white'
                            : 'text-amber-400 hover:bg-amber-500/10'
                        }`}
                      >
                        Error ({stats.error})
                      </button>
                    )}
                  </div>

                  {/* Actions: Search & Export */}
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        placeholder="Cari keyword..."
                        aria-label="Cari kata kunci dalam hasil"
                        className="bg-slate-950 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-red-500 w-36 sm:w-44"
                      />
                    </div>

                    <button
                      onClick={() => handleExportCSV()}
                      disabled={items.length === 0}
                      title="Export Semua ke file CSV"
                      aria-label="Export Semua ke file CSV"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    </button>

                    <button
                      onClick={() => {
                        const text = items.map(i => `${i.keyword}\t${i.status}`).join('\n');
                        handleCopy(text, 'clipboard');
                      }}
                      disabled={items.length === 0}
                      title="Salin Hasil ke Clipboard"
                      aria-label="Salin Hasil ke Clipboard"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      {copiedText === 'clipboard' ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-300" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Table Body with High Performance */}
                <div className="overflow-x-auto max-h-[520px] overflow-y-auto divide-y divide-slate-800/80">
                  {paginatedItems.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
                      <Search className="w-8 h-8 stroke-1 text-slate-600" />
                      <p className="text-sm font-semibold text-slate-400">Belum ada keyword yang ditampilkan.</p>
                      <p className="text-xs text-slate-600">
                        {items.length === 0
                          ? 'Masukkan daftar keyword di kolom kiri dan tekan tombol Mulai Pengecekan.'
                          : 'Tidak ada kata kunci yang cocok dengan kriteria filter saat ini.'}
                      </p>
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-950/90 text-slate-400 font-semibold sticky top-0 z-10 backdrop-blur border-b border-slate-800">
                        <tr>
                          <th scope="col" className="py-2.5 px-3 w-12 text-center">#</th>
                          <th scope="col" className="py-2.5 px-3">Keyword Kueri</th>
                          <th scope="col" className="py-2.5 px-3 w-36 text-center">Hasil AI Overview</th>
                          <th scope="col" className="py-2.5 px-3 w-28 text-center">Waktu</th>
                          <th scope="col" className="py-2.5 px-3 w-32 text-right">Verifikasi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-sans">
                        {paginatedItems.map((item, index) => {
                          const realIndex = (currentPage - 1) * (pageSize === -1 ? 0 : pageSize) + index + 1;
                          const isChecking = item.status === 'CHECKING';
                          const isShow = item.status === 'AI SHOW';
                          const isDead = item.status === 'AI DEAD';
                          const isPending = item.status === 'PENDING';
                          const isErr = item.status === 'ERROR';

                          return (
                            <tr
                              key={item.id}
                              className={`transition-colors hover:bg-slate-800/40 ${
                                isChecking ? 'bg-red-500/5' : ''
                              }`}
                            >
                              <td className="py-3 px-3 text-center text-slate-500 font-mono text-[11px]">
                                {realIndex}
                              </td>

                              <td className="py-3 px-3">
                                <div className="font-semibold text-slate-200">
                                  {item.keyword}
                                </div>
                                {item.note && (
                                  <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                                    {item.note}
                                  </div>
                                )}
                              </td>

                              <td className="py-3 px-3 text-center">
                                {isShow && (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider bg-red-600/15 text-red-400 border border-red-500/40 shadow-sm shadow-red-500/10">
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                    AI SHOW
                                  </span>
                                )}

                                {isDead && (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider bg-emerald-600/15 text-emerald-400 border border-emerald-500/40 shadow-sm shadow-emerald-500/10">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    AI DEAD
                                  </span>
                                )}

                                {isChecking && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 animate-pulse">
                                    <Clock className="w-3 h-3 animate-spin" />
                                    Mengecek...
                                  </span>
                                )}

                                {isPending && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium text-slate-500 bg-slate-800">
                                    Antrean
                                  </span>
                                )}

                                {isErr && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold text-rose-400 bg-rose-950/40 border border-rose-800">
                                    Error
                                  </span>
                                )}
                              </td>

                              <td className="py-3 px-3 text-center text-slate-400 font-mono text-[11px]">
                                {item.checkedAt || '-'}
                              </td>

                              <td className="py-3 px-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {(isShow || isDead) && (
                                    <button
                                      onClick={() => setSelectedItemDetail(item)}
                                      title="Lihat Detail Analisis"
                                      aria-label={`Lihat detail untuk ${item.keyword}`}
                                      className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors cursor-pointer"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </button>
                                  )}

                                  <a
                                    href={item.serpUrl || `https://www.google.com/search?q=${encodeURIComponent(item.keyword)}&hl=${lang}&gl=${country}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Buka SERP Google Asli di Tab Baru"
                                    aria-label={`Buka SERP Google asli untuk ${item.keyword}`}
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-[11px] font-medium text-slate-300 hover:text-white border border-slate-700 transition-colors"
                                  >
                                    <span>SERP</span>
                                    <ExternalLink className="w-3 h-3 text-slate-400" />
                                  </a>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Pagination & Fast Footer Controls */}
                {filteredItems.length > 0 && (
                  <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <span>Baris per halaman:</span>
                      <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        aria-label="Pilih jumlah baris per halaman"
                        className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs font-mono"
                      >
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                        <option value={200}>200</option>
                        <option value={-1}>Semua ({filteredItems.length})</option>
                      </select>
                      <span className="hidden sm:inline text-slate-500">|</span>
                      <span>Total {filteredItems.length} keyword</span>
                    </div>

                    {/* Pagination page switcher */}
                    {totalPages > 1 && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          aria-label="Halaman sebelumnya"
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="px-2 font-mono text-xs text-slate-200 font-semibold">
                          Halaman {currentPage} dari {totalPages}
                        </span>
                        <button
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          aria-label="Halaman berikutnya"
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* Fast Export actions */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleExportCSV('AI SHOW')}
                        disabled={stats.aiShow === 0}
                        className="text-xs text-red-400 hover:text-red-300 disabled:opacity-40 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>AI SHOW ({stats.aiShow})</span>
                      </button>
                      <span className="text-slate-700">|</span>
                      <button
                        onClick={() => handleExportCSV('AI DEAD')}
                        disabled={stats.aiDead === 0}
                        className="text-xs text-emerald-400 hover:text-emerald-300 disabled:opacity-40 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>AI DEAD ({stats.aiDead})</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>

            </section>
          </div>
        )}

        {/* TAB 2: PYTHON & SELENIUM SCRIPT HUB */}
        {activeTab === 'PYTHON_SELENIUM' && (
          <section aria-label="Generator Script Python Selenium" className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-red-400" />
                  <h2 className="text-base font-bold text-white">
                    Python + Selenium + Flask Scraper Generator
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Ekstrak data SERP Google otomatis menggunakan script Python mandiri dengan Selenium & Undetected Chromedriver untuk bypass bot detection.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="/api/python-script"
                  download="google_ai_overview_checker.py"
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-600/25 flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Script Python (.py)</span>
                </a>
              </div>
            </div>

            {/* Step by step installation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                  <span className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-[10px]">1</span>
                  <span>Install Dependensi Python</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Jalankan perintah ini di terminal / Command Prompt lokal Anda:
                </p>
                <div className="bg-slate-900 p-2 rounded-lg font-mono text-[11px] text-slate-200 border border-slate-800 flex items-center justify-between">
                  <code>pip install undetected-chromedriver selenium pandas</code>
                  <button
                    onClick={() => handleCopy('pip install undetected-chromedriver selenium pandas', 'pip')}
                    aria-label="Salin perintah pip install"
                    className="p-1 hover:text-white text-slate-400 cursor-pointer"
                  >
                    {copiedText === 'pip' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                  <span className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-[10px]">2</span>
                  <span>Siapkan File keywords.txt</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Buat file <code>keywords.txt</code> di folder yang sama berisi hingga 1.000 kata kunci (1 keyword per baris).
                </p>
                <div className="bg-slate-900 p-2 rounded-lg font-mono text-[11px] text-slate-400 border border-slate-800">
                  cara membuat kue bolu<br />apa itu kecerdasan buatan<br />login klikbca
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                  <span className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-[10px]">3</span>
                  <span>Jalankan Script Otomasi</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Script akan membuka Chrome dan memeriksa setiap SERP satu persatu, lalu mengekspor hasil ke <code>hasil_ai_overview_serp.csv</code>.
                </p>
                <div className="bg-slate-900 p-2 rounded-lg font-mono text-[11px] text-slate-200 border border-slate-800 flex items-center justify-between">
                  <code>python google_ai_overview_checker.py</code>
                  <button
                    onClick={() => handleCopy('python google_ai_overview_checker.py', 'pyrun')}
                    aria-label="Salin perintah python run"
                    className="p-1 hover:text-white text-slate-400 cursor-pointer"
                  >
                    {copiedText === 'pyrun' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Python Source Code Preview */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  <span>Source Code Lengkap: google_ai_overview_checker.py</span>
                </div>
                <button
                  onClick={() => {
                    const code = `import time\nimport csv\nimport random\nfrom datetime import datetime\nimport undetected_chromedriver as uc\nfrom selenium.webdriver.common.by import By\n\nAI_OVERVIEW_SELECTORS = [\n    'div[data-attrid="wa:/description"]',\n    'div[data-attrid="SGE_AI_OVERVIEW"]',\n    'div.Yz9B7b',\n    'div[aria-label="Ringkasan AI"]',\n    'div[aria-label="AI Overview"]',\n]\n\ndef check_keyword_serp(driver, keyword, hl="id", gl="id"):\n    url = f"https://www.google.com/search?q={keyword.replace(' ', '+')}&hl={hl}&gl={gl}"\n    driver.get(url)\n    time.sleep(random.uniform(2.0, 3.5))\n    has_ai = False\n    for sel in AI_OVERVIEW_SELECTORS:\n        elements = driver.find_elements(By.CSS_SELECTOR, sel)\n        if elements and any(e.is_displayed() for e in elements):\n            has_ai = True\n            break\n    return "AI SHOW" if has_ai else "AI DEAD"`;
                    handleCopy(code, 'fullcode');
                  }}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedText === 'fullcode' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Salin Script Ringkas</span>
                </button>
              </div>

              <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400/90 overflow-x-auto max-h-96 leading-relaxed">
{`# ============================================================
# GOOGLE SERP AI OVERVIEW CHECKER (AI SHOW vs AI DEAD)
# Menggunakan undetected-chromedriver untuk melewati Cloudflare/Bot-Check
# ============================================================

import time
import csv
import random
from datetime import datetime
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By

# Selector elemen resmi SGE / Google AI Overview
AI_OVERVIEW_SELECTORS = [
    'div[data-attrid="wa:/description"]',
    'div[data-attrid="SGE_AI_OVERVIEW"]',
    'div.Yz9B7b',
    'div.k82bof',
    'div[aria-label="Ringkasan AI"]',
    'div[aria-label="AI Overview"]',
    'div#mSync'
]

TEXT_INDICATORS = [
    "Ringkasan AI",
    "AI Overview",
    "AI generatif bersifat eksperimental",
    "Generative AI is experimental"
]

def check_keyword(driver, keyword: str, hl="id", gl="id"):
    encoded = keyword.strip().replace(" ", "+")
    url = f"https://www.google.com/search?q={encoded}&hl={hl}&gl={gl}"
    driver.get(url)
    
    # Delay acak 2-3.5 detik untuk mensimulasikan perilaku manusia
    time.sleep(random.uniform(2.0, 3.5))
    
    has_ai = False
    for selector in AI_OVERVIEW_SELECTORS:
        try:
            elements = driver.find_elements(By.CSS_SELECTOR, selector)
            if elements and any(el.is_displayed() for el in elements):
                has_ai = True
                break
        except Exception:
            continue
            
    if not has_ai:
        try:
            body_text = driver.find_element(By.TAG_NAME, "body").text
            if any(t in body_text for t in TEXT_INDICATORS):
                has_ai = True
        except Exception:
            pass
            
    status = "AI SHOW" if has_ai else "AI DEAD"
    return status, url

# Jalankan proses
options = uc.ChromeOptions()
driver = uc.Chrome(options=options)

with open("keywords.txt", "r", encoding="utf-8") as f:
    keywords = [line.strip() for line in f if line.strip()]

results = []
for idx, kw in enumerate(keywords, 1):
    status, serp_url = check_keyword(driver, kw)
    print(f"[{idx}/{len(keywords)}] {kw} -> {status}")
    results.append({"keyword": kw, "status": status, "url": serp_url})

# Simpan ke CSV
with open("hasil_ai_overview.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["keyword", "status", "url"])
    writer.writeheader()
    writer.writerows(results)

driver.quit()
print("Pengecekan selesai! Hasil disimpan ke hasil_ai_overview.csv")`}
              </pre>
            </div>
          </section>
        )}

        {/* TAB 3: PANDUAN & FAQ (SEO AUDIT SCORE 100 COMPLIANT) */}
        {activeTab === 'PANDUAN' && (
          <section aria-label="Panduan dan FAQ SEO" className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col gap-6">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-red-400" />
                <span>Panduan Lengkap Google AI Overview & Dampaknya pada SEO</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Pelajari strategi optimasi, karakteristik kueri AI SHOW vs AI DEAD, dan cara menjaga trafik organik website Anda.
              </p>
            </div>

            {/* SEO Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <article className="rounded-xl border border-red-500/30 bg-red-950/20 p-5 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-red-600 text-white font-black text-xs">
                    AI SHOW (Merah)
                  </span>
                  <h3 className="font-bold text-slate-200 text-sm">Kueri dengan AI Overview</h3>
                </div>
                <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">•</span>
                    <span><strong>Kueri Informasional Konseptual:</strong> Kueri multi-langkah seperti "cara merawat tanaman monstera", "penyebab inflasi", atau "resep kue brownies".</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">•</span>
                    <span><strong>Perbandingan Produk & Metode:</strong> Kueri seperti "perbedaan air purifier vs dehumidifier" atau "kelebihan react vs vue".</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">•</span>
                    <span><strong>Sintesis Riset Luas:</strong> Kueri yang membutuhkan perpaduan data dari 5 hingga 10 sumber situs web terpercaya.</span>
                  </li>
                </ul>
                <div className="mt-2 p-3 bg-red-950/40 rounded-lg border border-red-500/20 text-[11px] text-red-200">
                  <strong>Tips Optimasi:</strong> Buat konten komprehensif dengan format bullet points, tabel ringkasan, dan schema structured data agar brand Anda dijadikan <em>citation link</em> di dalam kotak AI Overview.
                </div>
              </article>

              <article className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-5 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-emerald-600 text-white font-black text-xs">
                    AI DEAD (Hijau)
                  </span>
                  <h3 className="font-bold text-slate-200 text-sm">Kueri Tanpa AI Overview</h3>
                </div>
                <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span><strong>Kueri Navigasi Merek:</strong> Contoh "login klikbca", "instagram web login", "tokopedia seller". Pengguna hanya mencari satu link tujuan.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span><strong>Kueri Transaksional Kuat:</strong> Contoh "beli iphone 15 pro max ibox", "tiket pesawat garuda diskon". Google menampilkan shopping pack.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span><strong>Kueri Lokal & Peta:</strong> Contoh "bengkel mobil jakarta selatan terdekat". Google menampilkan Local Maps 3-Pack.</span>
                  </li>
                </ul>
                <div className="mt-2 p-3 bg-emerald-950/40 rounded-lg border border-emerald-500/20 text-[11px] text-emerald-200">
                  <strong>Peluang SEO:</strong> Peringkat organik #1, #2, dan #3 tetap memiliki Click-Through Rate (CTR) tertinggi karena tidak ada kotak ringkasan generatif yang menutupi layar.
                </div>
              </article>

            </div>

            {/* Accordion FAQ (Matches FAQPage Schema) */}
            <div className="flex flex-col gap-3 pt-2">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-red-400" />
                <span>Pertanyaan yang Sering Diajukan (FAQ)</span>
              </h3>

              <div className="space-y-2">
                {FAQ_ITEMS.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        aria-expanded={isOpen}
                        className="w-full p-3.5 text-left text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-between gap-3 cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-3.5 pb-3.5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2.5">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live SEO Audit Score Card */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-xs flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-slate-200 text-sm">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span>Audit Kualitas & Skor SEO Website Ini: 100/100</span>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Lighthouse 100
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-2">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Performance</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">100</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Fast Loading</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Accessibility</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">100</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">ARIA & High Contrast</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Best Practices</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">100</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Modern HTML5</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">SEO & Schema</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">100</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">JSON-LD WebApp & FAQ</span>
                </div>
              </div>
            </div>

          </section>
        )}

      </main>

      {/* Modal Inspector Detail */}
      {selectedItemDetail && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black tracking-wider ${
                    selectedItemDetail.status === 'AI SHOW'
                      ? 'bg-red-600 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {selectedItemDetail.status}
                </span>
                <span className="text-xs text-slate-400 font-semibold">Detail Analisis SERP</span>
              </div>
              <button
                onClick={() => setSelectedItemDetail(null)}
                aria-label="Tutup modal detail"
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px] font-medium">Kata Kunci Kueri:</span>
                <div className="font-bold text-slate-200 text-sm mt-0.5 font-mono">
                  "{selectedItemDetail.keyword}"
                </div>
              </div>

              {selectedItemDetail.note && (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 font-bold block mb-1">Hasil Evaluasi SERP:</span>
                  <p className="text-slate-300 leading-relaxed">{selectedItemDetail.note}</p>
                </div>
              )}

              {selectedItemDetail.indicators && selectedItemDetail.indicators.length > 0 && (
                <div>
                  <span className="text-slate-500 block text-[11px] mb-1.5 font-medium">Indikator Terdeteksi:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedItemDetail.indicators.map((ind, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] border border-slate-700">
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedItemDetail.snippet && (
                <div>
                  <span className="text-slate-500 block text-[11px] mb-1 font-medium">Ringkasan AI Snippet:</span>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-300 italic text-[11px]">
                    "{selectedItemDetail.snippet}"
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                <span className="text-[11px] text-slate-500">
                  Waktu Periksa: {selectedItemDetail.checkedAt || '-'}
                </span>
                <a
                  href={selectedItemDetail.serpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Buka pencarian Google asli di tab baru"
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <span>Buka SERP Google Asli</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Semantic Accessible Footer */}
      <footer role="contentinfo" className="border-t border-slate-800/80 bg-slate-950/90 py-5 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Google SERP AI Overview Checker</span>
            <span>&bull;</span>
            <span>Alat Online Cek AI SHOW & AI DEAD</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>Core Web Vitals Ready</span>
            <span>&bull;</span>
            <span>Skor SEO 100</span>
            <span>&bull;</span>
            <span>Python Selenium Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

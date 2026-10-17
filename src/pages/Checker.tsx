import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ApiConfig, CheckItem, DeviceType, JobStats, JobStatus } from '../types';
import { KeywordInputCard } from '../components/KeywordInputCard';
import { QueueControlBar } from '../components/QueueControlBar';
import { StatsGrid } from '../components/StatsGrid';
import { ResultTable } from '../components/ResultTable';
import { DetailModal } from '../components/DetailModal';
import { SettingsModal } from '../components/SettingsModal';
import { executeKeywordCheck, buildGoogleSearchUrl } from '../services/serpAdapter';
import { generateCsv, downloadCsvFile } from '../services/csvExport';
import { getCountryName, getLanguageName } from '../data/geoPresets';

interface CheckerProps {
  apiConfig: ApiConfig;
  onUpdateConfig: (newConfig: ApiConfig) => void;
  isSettingsOpen: boolean;
  onCloseSettings: () => void;
  onOpenSettings: () => void;
}

const STORAGE_KEY_ITEMS = 'gio_checker_items_v1';
const STORAGE_KEY_SETTINGS = 'gio_checker_settings_v1';

export const Checker: React.FC<CheckerProps> = ({
  apiConfig,
  onUpdateConfig,
  isSettingsOpen,
  onCloseSettings,
  onOpenSettings,
}) => {
  // State for items
  const [items, setItems] = useState<CheckItem[]>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY_ITEMS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return [];
  });

  const [jobStatus, setJobStatus] = useState<JobStatus>('idle');
  const [selectedCountry, setSelectedCountry] = useState<string>('id');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('id');
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>('desktop');
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('ALL');
  const [inspectedItem, setInspectedItem] = useState<CheckItem | null>(null);

  // Timing refs
  const startTimeRef = useRef<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [estimatedRemainingSeconds, setEstimatedRemainingSeconds] = useState<number | undefined>(undefined);

  // Status ref for loop synchronization
  const statusRef = useRef<JobStatus>('idle');
  statusRef.current = jobStatus;

  // Persist items to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
    } catch {}
  }, [items]);

  // Compute job stats
  const stats: JobStats = React.useMemo(() => {
    const total = items.length;
    let completed = 0;
    let inProgress = 0;
    let pending = 0;
    let aiDetected = 0;
    let aiSafe = 0;
    let unknown = 0;
    let unsupported = 0;
    let failed = 0;

    for (const item of items) {
      if (item.status === 'AI_DETECTED') {
        completed++;
        aiDetected++;
      } else if (item.status === 'AI_SAFE') {
        completed++;
        aiSafe++;
      } else if (item.status === 'UNKNOWN') {
        completed++;
        unknown++;
      } else if (item.status === 'UNSUPPORTED') {
        completed++;
        unsupported++;
      } else if (item.status === 'FAILED') {
        completed++;
        failed++;
      } else {
        // Pending
        pending++;
      }
    }

    const progressPercent = total > 0 ? (completed / total) * 100 : 0;

    return {
      total,
      completed,
      inProgress,
      pending,
      aiDetected,
      aiSafe,
      unknown,
      unsupported,
      failed,
      progressPercent,
      elapsedSeconds,
      estimatedRemainingSeconds,
    };
  }, [items, elapsedSeconds, estimatedRemainingSeconds]);

  // Elapsed time timer
  useEffect(() => {
    let timer: any;
    if (jobStatus === 'running') {
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now() - elapsedSeconds * 1000;
      }
      timer = setInterval(() => {
        if (startTimeRef.current) {
          const secs = Math.floor((Date.now() - startTimeRef.current) / 1000);
          setElapsedSeconds(secs);
        }
      }, 1000);
    } else {
      if (jobStatus === 'idle') {
        startTimeRef.current = null;
      }
    }
    return () => clearInterval(timer);
  }, [jobStatus, elapsedSeconds]);

  // Process worker
  const runQueueWorker = useCallback(async (currentItems: CheckItem[]) => {
    const concurrency = Math.max(1, Math.min(5, apiConfig.concurrency || 2));
    let localItems = [...currentItems];

    // Find indices of pending items
    const pendingIndices = localItems
      .map((item, idx) => ({ item, idx }))
      .filter(({ item }) => item.status === 'FAILED' && item.retryCount === 0 || !(item.status in { AI_DETECTED: 1, AI_SAFE: 1, UNKNOWN: 1, UNSUPPORTED: 1 }))
      .map(({ idx }) => idx);

    if (pendingIndices.length === 0) {
      setJobStatus('completed');
      return;
    }

    let currentIndexPtr = 0;
    let completedCount = localItems.filter((i) => i.checkedAt).length;
    const workerStartTime = performance.now();

    const processNext = async (): Promise<void> => {
      while (currentIndexPtr < pendingIndices.length) {
        // Check if user paused or cancelled
        if (statusRef.current === 'paused' || statusRef.current === 'cancelled') {
          return;
        }

        const targetIdx = pendingIndices[currentIndexPtr];
        currentIndexPtr++;

        if (targetIdx === undefined || targetIdx >= localItems.length) {
          return;
        }

        const targetItem = localItems[targetIdx];

        // Execute check via adapter
        try {
          const updated = await executeKeywordCheck(targetItem, apiConfig);

          // Update local copy and React state
          localItems[targetIdx] = updated;
          completedCount++;

          // Update ETA calculation based on real throughput
          const timeElapsedMs = performance.now() - workerStartTime;
          const avgTimePerItem = timeElapsedMs / Math.max(1, completedCount);
          const remainingItems = localItems.length - completedCount;
          const etaSecs = Math.max(0, Math.round((remainingItems * avgTimePerItem) / 1000));
          setEstimatedRemainingSeconds(etaSecs);

          // Batched state update
          setItems([...localItems]);
        } catch (err: any) {
          localItems[targetIdx] = {
            ...targetItem,
            status: 'FAILED',
            errorMessage: err.message || 'Error tidak diketahui',
            evidenceSummary: 'Pemeriksaan gagal dieksekusi oleh mesin antrean.',
            checkedAt: new Date().toISOString(),
          };
          setItems([...localItems]);
        }

        // Brief delay between requests to protect rate-limit
        await new Promise((r) => setTimeout(r, 60));
      }
    };

    // Spin up concurrent worker threads
    const workers = Array.from({ length: concurrency }, () => processNext());
    await Promise.all(workers);

    if (statusRef.current === 'running') {
      setJobStatus('completed');
      setEstimatedRemainingSeconds(0);
    }
  }, [apiConfig]);

  // Handler when user submits keywords to queue
  const handleQueueReady = (
    keywords: string[],
    country: string,
    language: string,
    device: DeviceType
  ) => {
    setSelectedCountry(country);
    setSelectedLanguage(language);
    setSelectedDevice(device);

    const countryName = getCountryName(country);
    const languageName = getLanguageName(language);

    const newItems: CheckItem[] = keywords.map((kw, index) => ({
      id: `item-${Date.now()}-${index}`,
      index: index + 1,
      keyword: kw,
      normalizedKeyword: kw.toLowerCase().trim(),
      status: 'FAILED', // Initial state before processing (displayed as pending)
      country,
      countryName,
      language,
      languageName,
      device,
      retryCount: 0,
      provider: apiConfig.provider,
      evidenceSummary: 'Menunggu pemrosesan antrean...',
      googleSearchUrl: buildGoogleSearchUrl(kw, country, language),
    }));

    setItems(newItems);
    setJobStatus('idle');
    setElapsedSeconds(0);
    setEstimatedRemainingSeconds(undefined);
    startTimeRef.current = null;
  };

  // Start processing
  const handleStart = () => {
    if (items.length === 0) return;
    setJobStatus('running');
    runQueueWorker(items);
  };

  // Pause processing
  const handlePause = () => {
    setJobStatus('paused');
  };

  // Resume processing
  const handleResume = () => {
    setJobStatus('running');
    runQueueWorker(items);
  };

  // Cancel processing
  const handleCancel = () => {
    setJobStatus('cancelled');
    setEstimatedRemainingSeconds(0);
  };

  // Reset / Clear all
  const handleReset = () => {
    setJobStatus('idle');
    setItems([]);
    setElapsedSeconds(0);
    setEstimatedRemainingSeconds(undefined);
    startTimeRef.current = null;
    try {
      sessionStorage.removeItem(STORAGE_KEY_ITEMS);
    } catch {}
  };

  // Retry failed keywords
  const handleRetryFailed = () => {
    const updated = items.map((item) => {
      if (item.status === 'FAILED') {
        return {
          ...item,
          retryCount: item.retryCount + 1,
          evidenceSummary: 'Menunggu pengulangan...',
          checkedAt: undefined,
        };
      }
      return item;
    });
    setItems(updated);
    setJobStatus('running');
    runQueueWorker(updated);
  };

  // Rerun individual item
  const handleRerunItem = async (targetItem: CheckItem) => {
    const idx = items.findIndex((i) => i.id === targetItem.id);
    if (idx === -1) return;

    const preparing = {
      ...targetItem,
      evidenceSummary: 'Mengulang pemeriksaan...',
    };
    const nextList = [...items];
    nextList[idx] = preparing;
    setItems(nextList);

    const checked = await executeKeywordCheck(targetItem, apiConfig);
    nextList[idx] = checked;
    setItems([...nextList]);
  };

  // Export full CSV
  const handleExportCsv = () => {
    if (items.length === 0) return;
    const csvData = generateCsv(items);
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadCsvFile(csvData, `google-ai-overview-check-${dateStr}.csv`);
  };

  // Export filtered CSV
  const handleExportFilteredCsv = (filtered: CheckItem[]) => {
    if (filtered.length === 0) return;
    const csvData = generateCsv(filtered);
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadCsvFile(csvData, `google-ai-overview-filtered-${dateStr}.csv`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Top Breadcrumb & Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span>Beranda</span>
            <span aria-hidden="true">/</span>
            <span className="text-slate-900 font-medium">Checker SERP AI Overview</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Workstation Pemeriksaan AI Overview Google
          </h1>
          <p className="mt-0.5 text-xs text-slate-600">
            Audit massal hingga 1.000 kata kunci dengan manajemen antrean asinkron, retry otomatis, dan ekspor CSV.
          </p>
        </div>

        {/* Operational Status Pill & Provider Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs">
            <span className="text-slate-500">Mode:</span>
            <span className="font-semibold text-slate-800 uppercase font-mono text-[11px]">
              {apiConfig.mode} ({apiConfig.provider})
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenSettings}
            className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
          >
            Ubah Provider / API Key
          </button>
        </div>
      </div>

      {/* Input Section */}
      <KeywordInputCard
        onQueueReady={handleQueueReady}
        isProcessing={jobStatus === 'running'}
        selectedCountry={selectedCountry}
        selectedLanguage={selectedLanguage}
        selectedDevice={selectedDevice}
        onChangeCountry={setSelectedCountry}
        onChangeLanguage={setSelectedLanguage}
        onChangeDevice={setSelectedDevice}
      />

      {/* If items exist, show Queue Controls, Stats, and Results Table */}
      {items.length > 0 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Queue Control Bar */}
          <QueueControlBar
            status={jobStatus}
            stats={stats}
            onStart={handleStart}
            onPause={handlePause}
            onResume={handleResume}
            onCancel={handleCancel}
            onRetryFailed={handleRetryFailed}
            onExportCsv={handleExportCsv}
            onReset={handleReset}
            disabledStart={jobStatus === 'running'}
          />

          {/* Stats Grid */}
          <StatsGrid
            stats={stats}
            activeFilter={activeStatusFilter}
            onFilterByStatus={setActiveStatusFilter}
          />

          {/* Results Table */}
          <ResultTable
            items={items}
            onInspectItem={setInspectedItem}
            onRerunItem={handleRerunItem}
            onExportCsv={handleExportCsv}
            onExportFilteredCsv={handleExportFilteredCsv}
            activeStatusFilter={activeStatusFilter}
            onStatusFilterChange={setActiveStatusFilter}
          />
        </div>
      )}

      {/* Inspection Detail Modal */}
      <DetailModal
        item={inspectedItem}
        onClose={() => setInspectedItem(null)}
      />

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          config={apiConfig}
          onSave={onUpdateConfig}
          onClose={onCloseSettings}
        />
      )}
    </div>
  );
};

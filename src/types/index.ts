export type DetectionStatus = 'AI_DETECTED' | 'AI_SAFE' | 'UNKNOWN' | 'UNSUPPORTED' | 'FAILED';

export type SerpProvider = 'serpapi' | 'valueserp' | 'dataforseo' | 'custom' | 'demo';

export type DeviceType = 'desktop' | 'mobile';

export type OperationalMode = 'DEMO' | 'INTEGRATION_CONFIGURED' | 'LIVE_VERIFIED';

export type JobStatus = 'idle' | 'running' | 'paused' | 'cancelled' | 'completed';

export interface ReferenceSource {
  title: string;
  link: string;
  source?: string;
  snippet?: string;
}

export interface EvidenceDetails {
  snippet?: string;
  references?: ReferenceSource[];
  triggerType?: string;
  rawIndicators?: string[];
  organicCount?: number;
  providerRawStatus?: string;
}

export interface CheckItem {
  id: string;
  index: number;
  keyword: string;
  normalizedKeyword: string;
  status: DetectionStatus;
  country: string;
  countryName: string;
  language: string;
  languageName: string;
  device: DeviceType;
  checkedAt?: string;
  provider: SerpProvider;
  evidenceSummary: string;
  evidenceDetails?: EvidenceDetails;
  googleSearchUrl: string;
  latencyMs?: number;
  retryCount: number;
  errorMessage?: string;
}

export interface JobStats {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  aiDetected: number;
  aiSafe: number;
  unknown: number;
  unsupported: number;
  failed: number;
  progressPercent: number;
  startedAt?: string;
  finishedAt?: string;
  elapsedSeconds: number;
  estimatedRemainingSeconds?: number;
}

export interface ApiConfig {
  provider: SerpProvider;
  apiKey: string;
  customEndpoint?: string;
  concurrency: number;
  mode: OperationalMode;
  useServerProxy: boolean;
}

export interface CountryOption {
  code: string;
  name: string;
  hl: string;
}

export interface LanguageOption {
  code: string;
  name: string;
}

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
  readingTime: string;
  publishedAt: string;
  summary: string;
  content: string;
  author: string;
  headings: Array<{ id: string; title: string; level: number }>;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

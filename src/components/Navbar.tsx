import React from 'react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSettings?: () => void;
  operationalMode?: 'DEMO' | 'INTEGRATION_CONFIGURED' | 'LIVE_VERIFIED';
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  onOpenSettings,
  operationalMode = 'DEMO',
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2.5 text-left text-slate-900 transition-opacity hover:opacity-85 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold shadow-sm">
            AI
          </div>
          <span className="text-base font-semibold tracking-tight text-slate-900">
            Google AI Overview Checker
          </span>
        </button>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavigate('/')}
            className={`transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              currentPath === '/' ? 'text-blue-600 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => onNavigate('/checker')}
            className={`transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              currentPath === '/checker' ? 'text-blue-600 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Checker 1.000 KW
          </button>
          <button
            onClick={() => onNavigate('/blog')}
            className={`transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              currentPath.startsWith('/blog') ? 'text-blue-600 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Panduan & Blog
          </button>
          <button
            onClick={() => onNavigate('/faq')}
            className={`transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              currentPath === '/faq' ? 'text-blue-600 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            FAQ
          </button>
          <button
            onClick={() => onNavigate('/status')}
            className={`transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              currentPath === '/status' ? 'text-blue-600 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Status SERP
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              title="Pengaturan Provider SERP"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="hidden sm:inline">Provider:</span>
              <span className="font-semibold">{operationalMode}</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('/checker')}
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Mulai Checker
          </button>
        </div>
      </div>
    </header>
  );
};

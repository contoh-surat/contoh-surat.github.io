import { CheckItem } from '../types';

/**
 * Sanitizes a cell value to prevent CSV Formula Injection (CWE-1236)
 * If a cell begins with '=', '+', '-', '@', '\t', '\r', prepend a single quote (')
 */
export function sanitizeCsvCell(value: unknown): string {
  if (value === null || value === undefined) {
    return '""';
  }
  let str = String(value);

  // Check for dangerous formula injection trigger characters
  const dangerousTriggers = ['=', '+', '-', '@', '\t', '\r'];
  if (dangerousTriggers.some((char) => str.startsWith(char))) {
    str = `'${str}`;
  }

  // Escape double quotes
  str = str.replace(/"/g, '""');

  return `"${str}"`;
}

/**
 * Formats status for CSV export
 */
export function formatStatusForCsv(status: string): string {
  switch (status) {
    case 'AI_DETECTED':
      return 'AI detected';
    case 'AI_SAFE':
      return 'AI aman';
    case 'UNKNOWN':
      return 'Belum dapat dipastikan';
    case 'UNSUPPORTED':
      return 'Tidak didukung';
    case 'FAILED':
      return 'Gagal';
    default:
      return status;
  }
}

/**
 * Generates RFC 4180 compliant CSV string with UTF-8 BOM
 */
export function generateCsv(items: CheckItem[]): string {
  const headers = [
    'No',
    'Keyword',
    'Status AI Overview',
    'Status Kode',
    'Negara',
    'Bahasa',
    'Perangkat',
    'Waktu Pemeriksaan',
    'Sumber Provider',
    'Ringkasan Bukti',
    'Tautan Verifikasi Google',
    'Latensi (ms)',
  ];

  const headerRow = headers.map(sanitizeCsvCell).join(',');

  const dataRows = items.map((item, idx) => {
    return [
      sanitizeCsvCell(idx + 1),
      sanitizeCsvCell(item.keyword),
      sanitizeCsvCell(formatStatusForCsv(item.status)),
      sanitizeCsvCell(item.status),
      sanitizeCsvCell(item.countryName || item.country),
      sanitizeCsvCell(item.languageName || item.language),
      sanitizeCsvCell(item.device),
      sanitizeCsvCell(item.checkedAt || '-'),
      sanitizeCsvCell(item.provider),
      sanitizeCsvCell(item.evidenceSummary || '-'),
      sanitizeCsvCell(item.googleSearchUrl || '-'),
      sanitizeCsvCell(item.latencyMs !== undefined ? item.latencyMs : '-'),
    ].join(',');
  });

  // UTF-8 BOM ensures Excel and Google Sheets parse Indonesian characters properly
  const bom = '\uFEFF';
  return bom + [headerRow, ...dataRows].join('\r\n');
}

/**
 * Triggers file download in browser
 */
export function downloadCsvFile(csvContent: string, fileName: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

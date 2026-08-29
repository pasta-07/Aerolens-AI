/**
 * AeroLens AI - Date & Time Utilities
 */

export function formatCurrentDateTime() {
  const now = new Date();
  return now.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }) + ' IST';
}

export function formatRelativeTime(dateStr) {
  return dateStr;
}

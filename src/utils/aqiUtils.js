/**
 * AeroLens AI - AQI & Severity Utilities
 * Compliant with Central Pollution Control Board (CPCB) NAQI standards
 */

export function getAqiCategory(aqi) {
  if (aqi <= 50) return { label: 'Good', color: '#10B981', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' };
  if (aqi <= 100) return { label: 'Satisfactory', color: '#84CC16', bg: 'bg-lime-500/10', text: 'text-lime-400', border: 'border-lime-500/30' };
  if (aqi <= 200) return { label: 'Moderate', color: '#F59E0B', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' };
  if (aqi <= 300) return { label: 'Poor', color: '#F97316', bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' };
  if (aqi <= 400) return { label: 'Very Poor', color: '#EF4444', bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' };
  return { label: 'Severe', color: '#991B1B', bg: 'bg-red-950/40', text: 'text-red-400', border: 'border-red-600/40' };
}

export function getSeverityStyle(severity) {
  switch (severity?.toLowerCase()) {
    case 'severe':
      return {
        label: 'Severe Anomaly',
        badgeBg: 'bg-red-500/15',
        badgeText: 'text-red-400',
        badgeBorder: 'border-red-500/40',
        pinColor: '#EF4444',
        glow: 'shadow-[0_0_12px_rgba(239,68,68,0.4)]',
        pulseClass: 'pulse-ring-severe',
      };
    case 'high':
      return {
        label: 'High Anomaly',
        badgeBg: 'bg-orange-500/15',
        badgeText: 'text-orange-400',
        badgeBorder: 'border-orange-500/40',
        pinColor: '#F97316',
        glow: 'shadow-[0_0_12px_rgba(249,115,22,0.35)]',
        pulseClass: 'pulse-ring-high',
      };
    case 'moderate':
      return {
        label: 'Moderate',
        badgeBg: 'bg-amber-500/15',
        badgeText: 'text-amber-400',
        badgeBorder: 'border-amber-500/40',
        pinColor: '#F59E0B',
        glow: 'shadow-[0_0_8px_rgba(245,158,11,0.25)]',
        pulseClass: '',
      };
    default:
      return {
        label: 'Normal Baseline',
        badgeBg: 'bg-emerald-500/15',
        badgeText: 'text-emerald-400',
        badgeBorder: 'border-emerald-500/30',
        pinColor: '#10B981',
        glow: '',
        pulseClass: '',
      };
  }
}

export function getAlertSeverityStyle(severity) {
  switch (severity?.toLowerCase()) {
    case 'severe':
      return {
        badgeBg: 'bg-red-500/20',
        badgeText: 'text-red-300',
        border: 'border-red-500/40',
        dotColor: 'bg-red-500',
      };
    case 'warning':
      return {
        badgeBg: 'bg-amber-500/20',
        badgeText: 'text-amber-300',
        border: 'border-amber-500/40',
        dotColor: 'bg-amber-500',
      };
    default:
      return {
        badgeBg: 'bg-cyan-500/20',
        badgeText: 'text-cyan-300',
        border: 'border-cyan-500/40',
        dotColor: 'bg-cyan-400',
      };
  }
}

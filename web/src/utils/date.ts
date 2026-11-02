/**
 * Global UTC Date & Time formatting utilities for GYDE Web Frontend & Portals
 */

export const formatUtcTime = (dateInput?: string | Date): string => {
  if (!dateInput) return '15:30 UTC';
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return '15:30 UTC';
    const hours = String(d.getUTCHours()).padStart(2, '0');
    const mins = String(d.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${mins} UTC`;
  } catch {
    return '15:30 UTC';
  }
};

export const formatUtcDate = (dateInput?: string | Date, locale = 'en-US'): string => {
  if (!dateInput) return 'TBD';
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return 'TBD';
    return d.toLocaleDateString(locale, {
      timeZone: 'UTC',
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'TBD';
  }
};

export const formatUtcDateTime = (dateInput?: string | Date, locale = 'en-US'): string => {
  if (!dateInput) return 'TBD';
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return 'TBD';
    const dateStr = d.toLocaleDateString(locale, {
      timeZone: 'UTC',
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    const hours = String(d.getUTCHours()).padStart(2, '0');
    const mins = String(d.getUTCMinutes()).padStart(2, '0');
    return `${dateStr} • ${hours}:${mins} UTC`;
  } catch {
    return 'TBD';
  }
};

/**
 * Format Date into YYYY-MM-DDTHH:mm string in UTC for <input type="datetime-local" />
 */
export const toUtcDatetimeLocalString = (dateInput?: string | Date): string => {
  if (!dateInput) return '';
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
  } catch {
    return '';
  }
};

/**
 * Convert value from <input type="datetime-local" /> (entered in UTC) into standard UTC ISO string
 */
export const fromUtcDatetimeLocalToIso = (localInput?: string): string => {
  if (!localInput) return '';
  const trimmed = localInput.trim();
  if (!trimmed) return '';
  if (trimmed.endsWith('Z')) return trimmed;
  if (trimmed.length === 16) return `${trimmed}:00.000Z`;
  if (trimmed.length === 19) return `${trimmed}.000Z`;
  return new Date(trimmed).toISOString();
};

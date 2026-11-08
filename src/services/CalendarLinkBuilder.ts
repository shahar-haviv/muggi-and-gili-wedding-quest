import type { WeddingDetails } from '../types/wedding.ts';
import { WEDDING_DETAILS } from '../data/weddingDetails.ts';

/**
 * Single-responsibility service that builds a Google Calendar template URL
 * from wedding event metadata.
 */
export function createGoogleCalendarUrl(details: WeddingDetails = WEDDING_DETAILS): string {
  const start = new Date(details.weddingDateIso);
  if (Number.isNaN(start.getTime())) return '';

  const end = new Date(
    start.getTime() + details.calendar.durationHours * 60 * 60 * 1000,
  );

  const parameters = new URLSearchParams({
    action: 'TEMPLATE',
    text: details.calendar.title,
    dates: `${formatUtcCalendarTimestamp(start)}/${formatUtcCalendarTimestamp(end)}`,
    details: details.calendar.details,
    location: details.calendar.location,
  });

  return `https://calendar.google.com/calendar/render?${parameters.toString()}`;
}

function formatUtcCalendarTimestamp(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

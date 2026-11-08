/**
 * Every date, name, and address the site repeats lives here. Replace the
 * placeholder venue details before sharing the invitation with guests.
 */
export const WEDDING_DETAILS = Object.freeze({
  couple: {
    partnerOne: 'Shahar',
    partnerTwo: 'Almog',
    monogram: 'S&A',
  },
  weddingDateIso: '2027-06-12T19:00:00+03:00',
  weddingDateDisplay: '12 · 06 · 2027',
  weddingDayLabel: 'SATURDAY',
  rsvpDeadlineIso: '2027-05-12T23:59:59+03:00',
  rsvpDeadlineDisplay: '12 · 05 · 2027',
  dressCode: 'Garden festive',
  contactEmail: 'hello@shaharandalmog.example',
  venue: {
    name: 'Villa Aurora',
    city: 'Caesarea',
    country: 'Israel',
    address: 'Villa Aurora, Caesarea, Israel',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Villa+Aurora+Caesarea+Israel',
    coordinates: {
      latitude: 32.5189,
      longitude: 34.9044,
    },
    arrivalNote:
      'Gates open at 18:30. Follow the lantern-lit path past the old stone house.',
    parkingNote:
      'Free parking is available beside the garden entrance. Carpooling is encouraged.',
    accessibilityNote:
      'The ceremony and reception areas are step-free. Tell us about any access needs in the RSVP notes.',
  },
  calendar: {
    title: 'Shahar & Almog — A Wedding Quest',
    details:
      'Two players, one very good night. Ceremony at 19:12, feast and dancing to follow. Dress code: garden festive.',
    location: 'Villa Aurora, Caesarea, Israel',
    durationHours: 6,
  },
  tickerMessages: [
    '12.06.2027',
    'VILLA AURORA',
    'RSVP BY 12.05.2027',
    'DRESS CODE: GARDEN FESTIVE',
    'TWO PLAYERS, ONE LOVE STORY',
  ],
});

/**
 * Builds a Google Calendar template link from the central wedding details so
 * the date cannot drift out of sync with the rest of the page.
 */
export function createGoogleCalendarUrl(details = WEDDING_DETAILS) {
  const start = new Date(details.weddingDateIso);
  if (Number.isNaN(start.getTime())) return '';

  const end = new Date(
    start.getTime() + details.calendar.durationHours * 60 * 60 * 1000,
  );

  const parameters = new URLSearchParams({
    action: 'TEMPLATE',
    text: details.calendar.title,
    dates: `${formatCalendarDate(start)}/${formatCalendarDate(end)}`,
    details: details.calendar.details,
    location: details.calendar.location,
  });

  return `https://calendar.google.com/calendar/render?${parameters.toString()}`;
}

function formatCalendarDate(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

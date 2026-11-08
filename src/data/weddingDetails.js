/**
 * Every date, name, and address the site repeats lives here. Replace the
 * placeholder venue details before sharing the invitation with guests.
 */
export const WEDDING_DETAILS = Object.freeze({
  couple: {
    partnerOne: 'Muggi',
    partnerTwo: 'Gili',
    monogram: 'M&G',
  },
  weddingDateIso: '2027-05-19T18:00:00+03:00',
  weddingDateDisplay: '19 · 05 · 2027',
  weddingDayLabel: 'WEDNESDAY',
  rsvpDeadlineIso: '2027-04-19T23:59:59+03:00',
  rsvpDeadlineDisplay: '19 · 04 · 2027',
  dressCode: 'Jaffa festive',
  contactEmail: 'hello@muggiandgili.example',
  venue: {
    name: 'Consul House',
    city: 'Jaffa, Tel Aviv',
    country: 'Israel',
    address: 'HaZorfim St 15, Jaffa, Tel Aviv-Yafo',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Consul+House+HaZorfim+15+Jaffa+Tel+Aviv',
    coordinates: {
      latitude: 32.0554,
      longitude: 34.7538,
    },
    arrivalNote:
      'Doors open at 18:00. Enter through the historic 1845 stone archway on HaZorfim 15 and head up to the Old Jaffa terrace.',
    parkingNote:
      'HaZorfim Parking Lot (HaZorfim 15A) is right next door and open 24/7. Additional lots are a short walk away near the Flea Market and promenade.',
    accessibilityNote:
      'Step-free access is available across the historic courtyard and event spaces. Tell us about any access needs in the RSVP notes.',
  },
  calendar: {
    title: 'Muggi & Gili — A Wedding Quest',
    details:
      'Two players, one very good night at Consul House in Old Jaffa. Greeting at 18:00, ceremony at 19:00, feast and dancing at 20:00.',
    location: 'Consul House, HaZorfim St 15, Jaffa, Tel Aviv-Yafo, Israel',
    durationHours: 6,
  },
  tickerMessages: [
    '19.05.2027',
    'CONSUL HOUSE · JAFFA',
    'RSVP BY 19.04.2027',
    'GREETING 18:00 · CEREMONY 19:00 · FEAST 20:00',
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

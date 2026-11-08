import type { WeddingDetails } from '../types/wedding.ts';
export { createGoogleCalendarUrl } from '../services/CalendarLinkBuilder.ts';

/**
 * Central immutable wedding configuration for Muggi & Gili at Consul House, Jaffa.
 */
export const WEDDING_DETAILS: WeddingDetails = Object.freeze({
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
    parkingName: 'HaZorfim Parking Lot (חניון הצורפים)',
    parkingMapsUrl:
      'https://www.google.com/maps/search/?api=1&query=%D7%97%D7%A0%D7%99%D7%95%D7%9F+%D7%94%D7%A6%D7%95%D7%A8%D7%A4%D7%99%D7%9D+HaZorfim+15+Jaffa+Tel+Aviv',
    coordinates: {
      latitude: 32.05383,
      longitude: 34.7539,
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

import type { FaqItem } from '../types/wedding.ts';

/**
 * Practical answers for guests heading to Old Jaffa.
 */
export const VENUE_FAQ_ITEMS: readonly FaqItem[] = Object.freeze([
  {
    id: 'arrival',
    question: 'WHAT TIME SHOULD I ARRIVE?',
    answer:
      'Doors open at 18:00 for the greeting and welcome drinks. Aim to be seated under the chuppah by 18:50 so the ceremony can begin at 19:00 sharp, followed by the feast at 20:00.',
  },
  {
    id: 'parking',
    question: 'IS THERE PARKING AT THE VENUE?',
    answer:
      'Yes — HaZorfim Parking Lot (Old Jaffa East, HaZorfim 15A) is located right next door to Consul House and is open 24/7. Additional public parking lots are a short walk away near the Jaffa Flea Market and along the promenade.',
  },
  {
    id: 'dress-code',
    question: 'WHAT SHOULD I WEAR?',
    answer:
      'Jaffa festive: sunset colours, breezy fabrics, and shoes that can handle Old Jaffa stone and a serious dance floor. There is no need to wear a suit of armour — unless it is a very stylish suit of armour.',
  },
  {
    id: 'children',
    question: 'CAN I BRING MY CHILDREN?',
    answer:
      'This is an adults-only celebration. If your invitation includes little players, it will say so explicitly. If you are unsure, send us a message and we will confirm your party size.',
  },
  {
    id: 'dietary',
    question: 'WILL THERE BE FOOD FOR MY DIET?',
    answer:
      'Absolutely. Tell us about vegetarian, vegan, gluten-free, or allergy needs in the RSVP form and the kitchen will take care of you. The more detail you share, the safer and tastier dinner will be.',
  },
  {
    id: 'photos',
    question: 'CAN I TAKE PHOTOS DURING THE CEREMONY?',
    answer:
      'Please keep phones and cameras away during the ceremony and let our photographers work their magic. After the first kiss, snap away — we would love to see the night through your eyes.',
  },
  {
    id: 'accessibility',
    question: 'IS THE VENUE ACCESSIBLE?',
    answer:
      'The ceremony and reception areas are step-free, with accessible parking near the entrance. Tell us about any access needs in the RSVP notes and we will make a plan before you arrive.',
  },
  {
    id: 'gifts',
    question: 'WHAT ABOUT GIFTS?',
    answer:
      'Your presence is the present. If you would like to contribute to our next adventure, a card at the welcome table is perfect. Please do not bring anything that needs watering or assembling.',
  },
]);

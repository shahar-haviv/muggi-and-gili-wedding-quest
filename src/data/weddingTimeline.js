/**
 * The three save points of the wedding quest. Times are intentionally
 * generous: guests should never have to sprint between champagne and vows.
 */
export const WEDDING_TIMELINE_STAGES = Object.freeze([
  {
    id: 'gathering',
    stageNumber: '01',
    time: '18:00',
    title: 'GREETING',
    tagline: 'The party assembles in Old Jaffa',
    location: 'The Historic Courtyard',
    accent: 'mint',
    description:
      'Step through the 1845 stone arches of Consul House on HaZorfim Street, collect a welcome drink, and mingle in the Jaffa sea breeze before the ceremony bell.',
    objectives: [
      'Collect your welcome drink',
      'Sign the guest scroll',
      'Head up to the terrace before the bell',
    ],
    note: 'Come as you are — the courtyard is ready for slow arrivals and long hellos.',
  },
  {
    id: 'ceremony',
    stageNumber: '02',
    time: '19:00',
    title: 'CEREMONY',
    tagline: 'The main quest begins',
    location: 'The Jaffa Rooftop Terrace',
    accent: 'rose',
    description:
      'Take a seat under the chuppah overlooking Old Jaffa and the Tel Aviv skyline as dusk settles in. We will say our vows, exchange rings, and break a glass. Please be seated by 18:50 so the magic can start on time.',
    objectives: [
      'Be seated by 18:50',
      'Cheer the first kiss',
      'Keep an eye on the glass',
    ],
    note: 'The ceremony begins at 19:00 sharp against the Jaffa sunset. The photographers have been warned about happy tears.',
  },
  {
    id: 'feast',
    stageNumber: '03',
    time: '20:00',
    title: 'FEAST',
    tagline: 'Dinner, toasts & the dance floor',
    location: 'The Arched Hall & Terrace',
    accent: 'gold',
    description:
      'A Jaffa feast under the historic stone arches and stars, followed by toasts, cake, and a dance floor that refuses to close early. The kitchen has a plan for every dietary need you tell us about.',
    objectives: [
      'Find your table',
      'Raise a glass to Muggi & Gili',
      'Request a song and stay for one more',
    ],
    note: 'Dancing until late. Comfortable shoes are the real dress-code loophole.',
  },
]);

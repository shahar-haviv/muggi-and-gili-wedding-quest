/**
 * The three save points of the wedding quest. Times are intentionally
 * generous: guests should never have to sprint between champagne and vows.
 */
export const WEDDING_TIMELINE_STAGES = Object.freeze([
  {
    id: 'gathering',
    stageNumber: '01',
    time: '18:30',
    title: 'GATHERING',
    tagline: 'The party assembles',
    location: 'The Garden Terrace',
    accent: 'mint',
    description:
      'Arrive through the garden gate, collect a welcome drink, and find your name on the seating scroll. Lawn games and a string-lit bar keep everyone busy until the ceremony bell.',
    objectives: [
      'Collect your welcome drink',
      'Sign the guest scroll',
      'Claim your seat before the bell',
    ],
    note: 'Come as you are — the garden is ready for slow arrivals and long hellos.',
  },
  {
    id: 'ceremony',
    stageNumber: '02',
    time: '19:12',
    title: 'CEREMONY',
    tagline: 'The main quest begins',
    location: 'The Chuppah Lawn',
    accent: 'rose',
    description:
      'Take a seat under the chuppah as the sun drops below the sea. We will say our vows, exchange rings, and break a glass. Please be in your seat by 19:05 so the magic can start on time.',
    objectives: [
      'Be seated by 19:05',
      'Cheer the first kiss',
      'Keep an eye on the glass',
    ],
    note: 'Sunset is scheduled for 19:12. The photographers have been warned about happy tears.',
  },
  {
    id: 'feast',
    stageNumber: '03',
    time: '20:00',
    title: 'FEAST',
    tagline: 'Dinner, toasts & the dance floor',
    location: 'The Courtyard',
    accent: 'gold',
    description:
      'A Mediterranean feast under the stars, followed by toasts, cake, and a dance floor that refuses to close early. The kitchen has a plan for every dietary need you tell us about.',
    objectives: [
      'Find your table',
      'Raise a glass to the couple',
      'Request a song and stay for one more',
    ],
    note: 'Dancing until late. Comfortable shoes are the real dress-code loophole.',
  },
]);

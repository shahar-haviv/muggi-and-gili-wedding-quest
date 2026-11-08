import type { SideQuestConfig, SideQuestSlug } from '../types/wedding.ts';

/**
 * Typed route definitions and starter blueprints for the three Side Quests:
 * - /side-quest/bachelor
 * - /side-quest/bachelorette
 * - /side-quest/united
 */
export const SIDE_QUESTS: Readonly<Record<SideQuestSlug, SideQuestConfig>> = Object.freeze({
  bachelor: {
    slug: 'bachelor',
    path: '/side-quest/bachelor',
    shortLabel: 'BACHELOR',
    tabBadge: 'SQ · 01',
    eyebrow: 'SIDE QUEST 01 · PLAYER 1 CO-OP',
    title: "MUGGI'S BACHELOR QUEST",
    subtitle: 'High scores, cold drinks, and zero regrets before the main boss.',
    hostLabel: 'MUGGI & CREW',
    accent: 'mint',
    dateDisplay: 'MAY 2027 · TBA',
    locationDisplay: 'SECRET BASE · TBA',
    dressCode: 'CASUAL CO-OP',
    vibeLevel: 'MAX ENERGY',
    description:
      'Before Muggi steps under the chuppah in Old Jaffa, the bachelor party crew assembles for an off-the-grid side quest. This route is ready for us to customize with the exact schedule, location, packing list, and crew check-in.',
    loadoutItems: [
      'Sunglasses & recovery potions',
      'Competitive arcade spirit',
      'Swim / night-out gear (TBA)',
      'Strict no-spoilers pact',
    ],
    checkpoints: [
      {
        step: '01',
        time: 'TBA',
        title: 'SPAWN POINT & WARM-UP',
        location: 'Checkpoint Alpha',
        summary: 'Crew check-in, first round of drinks, and side-quest briefing.',
      },
      {
        step: '02',
        time: 'TBA',
        title: 'MAIN CHALLENGE',
        location: 'Checkpoint Beta',
        summary: 'Daytime / sunset activity, games, and tournament rounds.',
      },
      {
        step: '03',
        time: 'TBA',
        title: 'AFTER-HOURS BOSS RUN',
        location: 'Checkpoint Omega',
        summary: 'Late-night feast, music, and legendary stories.',
      },
    ],
    designPromptHint:
      'Ready to customize: tell me the date, location, activities, or interactive features you want on the Bachelor route!',
  },
  bachelorette: {
    slug: 'bachelorette',
    path: '/side-quest/bachelorette',
    shortLabel: 'BACHELORETTE',
    tabBadge: 'SQ · 02',
    eyebrow: 'SIDE QUEST 02 · PLAYER 2 CO-OP',
    title: "GILI'S BACHELORETTE QUEST",
    subtitle: 'Sunsets, cocktails, main-character energy, and golden-hour magic.',
    hostLabel: 'GILI & SQUAD',
    accent: 'rose',
    dateDisplay: 'MAY 2027 · TBA',
    locationDisplay: 'SECRET OASIS · TBA',
    dressCode: 'GLAM PIXEL FESTIVE',
    vibeLevel: 'GOLDEN HOUR 100%',
    description:
      "Gili's pre-wedding side quest gets its own dedicated stage. We can customize this route with the exact itinerary, pool/beach or city plans, dress-code moodboard, playlist requests, and squad RSVP.",
    loadoutItems: [
      'Main-character outfit & swimwear',
      'Polaroid / disposable camera',
      'Dancing shoes for round one',
      'Favourite toast or memory for Gili',
    ],
    checkpoints: [
      {
        step: '01',
        time: 'TBA',
        title: 'WELCOME POTIONS',
        location: 'Stage 01 · Arrival',
        summary: 'Check in, drop bags, pop bubbles, and unlock the weekend kit.',
      },
      {
        step: '02',
        time: 'TBA',
        title: 'GOLDEN HOUR SESSION',
        location: 'Stage 02 · Sunset',
        summary: 'Music, poolside or rooftop vibes, and celebratory games.',
      },
      {
        step: '03',
        time: 'TBA',
        title: 'MIDNIGHT ENCORE',
        location: 'Stage 03 · Night Out',
        summary: 'Dinner, cocktails, and dancing into the night.',
      },
    ],
    designPromptHint:
      'Ready to customize: tell me the vibe, venue, schedule, or interactive widgets you want on the Bachelorette route!',
  },
  united: {
    slug: 'united',
    path: '/side-quest/united',
    shortLabel: 'UNITED PARTY',
    tabBadge: 'SQ · 03',
    eyebrow: 'SIDE QUEST 03 · ALL-PLAYERS CROSSOVER',
    title: 'BACHELORS & BACHELORETTES UNITED',
    subtitle: 'Both crews merge into one mega pre-wedding crossover party.',
    hostLabel: 'MUGGI + GILI FULL SQUAD',
    accent: 'gold',
    dateDisplay: 'MAY 2027 · TBA',
    locationDisplay: 'CROSSOVER ARENA · TBA',
    dressCode: 'FESTIVE PARTY MODE',
    vibeLevel: 'MULTIPLAYER CHAOS',
    description:
      'Why keep the crews apart when you can throw one massive crossover event? Both sides unite before the wedding day so everyone already knows each other on the Consul House dance floor.',
    loadoutItems: [
      'High-five energy for meeting the other crew',
      'Team spirit for crossover games',
      'Song request for the warm-up playlist',
      'Hydration & stamina buff',
    ],
    checkpoints: [
      {
        step: '01',
        time: 'TBA',
        title: 'THE MERGER',
        location: 'Arena Entrance',
        summary: 'Both squads link up, icebreaker drinks, and team badges.',
      },
      {
        step: '02',
        time: 'TBA',
        title: 'CO-OP TOURNAMENT',
        location: 'Main Floor',
        summary: 'Muggi & Gili trivia, team challenges, and shared toasts.',
      },
      {
        step: '03',
        time: 'TBA',
        title: 'FULL-PARTY RAVE',
        location: 'Dance Floor Zero',
        summary: 'DJs, late-night snacks, and the ultimate dress rehearsal for 19.05.',
      },
    ],
    designPromptHint:
      'Ready to customize: tell me where and how the United Party goes down and what features we should build here!',
  },
});

export const SIDE_QUEST_LIST: readonly SideQuestConfig[] = Object.freeze([
  SIDE_QUESTS.bachelor,
  SIDE_QUESTS.bachelorette,
  SIDE_QUESTS.united,
]);

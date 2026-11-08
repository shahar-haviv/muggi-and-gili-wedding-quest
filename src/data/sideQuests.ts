import type { SideQuestConfig, SideQuestSlug } from '../types/wedding.ts';

/**
 * Typed route definitions for the three secret Side Quests:
 * - /side-quest/bachelor     (Madrid / Europe Boys Expedition)
 * - /side-quest/bachelorette (Funky Medieval Paris — Chapter I of Gili's Tour)
 * - /side-quest/united       (Sunny Caesarea Villa Party — April 2027)
 */
export const SIDE_QUESTS: Readonly<Record<SideQuestSlug, SideQuestConfig>> = Object.freeze({
  bachelor: {
    slug: 'bachelor',
    path: '/side-quest/bachelor',
    shortLabel: 'BACHELOR',
    tabBadge: 'MADRID EXPEDITION',
    eyebrow: 'SECRET QUEST · ABROAD WITH THE BOYS',
    title: 'Muggi’s Madrid Fiesta',
    subtitle:
      'All the boys flying out to Madrid for European adventures, late-night plazas, cold drinks, and one legendary trip.',
    hostLabel: 'MUGGI & THE BOYS',
    accent: 'mint',
    dateDisplay: '2027 · DATES TBA',
    locationDisplay: 'MADRID, SPAIN / EUROPE',
    dressCode: 'European Night Out & Tavern Ready',
    vibeLevel: 'FULL FIESTA MODE',
    description:
      'Before the wedding in Old Jaffa, the boys are taking off to Europe. Think warm Madrid nights on the plaza, endless rounds of cold beers and sangria, daytime adventures across the city, and partying until sunrise.',
    loadoutItems: [
      'Valid passport & carry-on',
      'Stamina for Madrid tavern-hopping',
      'Sharp evening fit for the big night out',
      'Sunglasses for the morning after',
    ],
    checkpoints: [
      {
        step: '01',
        time: 'DAY 1',
        title: 'Touchdown & First Round',
        location: 'Madrid Plaza Basecamp',
        summary: 'Drop the bags, claim the rooms, and toast the first cold round in the sun.',
      },
      {
        step: '02',
        time: 'DAY 2',
        title: 'European Daytime Adventure',
        location: 'Across the Kingdom of Madrid',
        summary: 'Full-crew daytime expedition, long tapas feast, and pre-game warm-up.',
      },
      {
        step: '03',
        time: 'NIGHT',
        title: 'The Grand Madrid Fiesta',
        location: 'Old Quarter & Late-Night Clubs',
        summary: 'All the boys out on the town until sunrise.',
      },
    ],
    designPromptHint: 'Exact flight details and villa/hotel drop pin will be posted here.',
  },
  bachelorette: {
    slug: 'bachelorette',
    path: '/side-quest/bachelorette',
    shortLabel: 'BACHELORETTE',
    tabBadge: 'PARIS · CHAPTER I',
    eyebrow: 'SECRET QUEST · FUNKY MEDIEVAL PARIS',
    title: 'Gili in Paris: Part I',
    subtitle:
      'Gili and the girls take over Paris for the first stop of her bachelorette tour — sophisticated, funky, overflowing with wine, and ready to party.',
    hostLabel: 'GILI & THE GIRLS',
    accent: 'rose',
    dateDisplay: '2027 · DATES TBA',
    locationDisplay: 'PARIS, FRANCE',
    dressCode: 'Chic Parisian Royal · Fancy-Shmancy',
    vibeLevel: 'CHAMPAGNE & LET’S GO',
    description:
      'One bachelorette party wasn’t enough, so Chapter I kicks off in Paris! Imagine a funky medieval-meets-Parisian fantasy: candlelit wine bars, champagne towers, effortlessly cool outfits, and dancing through the night with all the girls.',
    loadoutItems: [
      'Passport & your chicest Parisian outfits',
      'Appetite for wine, champagne & late-night bistros',
      'Heels (plus backup flats for 3 AM)',
      'Main-character party energy',
    ],
    checkpoints: [
      {
        step: '01',
        time: 'ACT I',
        title: 'Bonjour & Bubbles',
        location: 'Parisian HQ',
        summary: 'Touchdown in France, pop the first bottle of champagne, and dress up.',
      },
      {
        step: '02',
        time: 'ACT II',
        title: 'Fancy-Shmancy Wine & Feast',
        location: 'Le Marais / Seine Quarter',
        summary: 'Long candlelit dinner, endless wine pours, toasts, and golden-hour photos.',
      },
      {
        step: '03',
        time: 'ACT III',
        title: 'Midnight in Paris Party',
        location: 'Paris After Dark',
        summary: 'High-energy music, cocktails, and celebrating Gili all night long.',
      },
    ],
    designPromptHint: 'Chapter I of Gili’s bachelorette tour — flight & hotel details coming soon.',
  },
  united: {
    slug: 'united',
    path: '/side-quest/united',
    shortLabel: 'UNITED PARTY',
    tabBadge: 'APRIL 2027 · CAESAREA',
    eyebrow: 'SECRET QUEST · THE ALL-TOGETHER VILLA PARTY',
    title: 'Caesarea Villa Fiesta',
    subtitle:
      'In April, both crews unite at a huge sunny villa in Caesarea for pool vibes, cold drinks, music, and one big happy celebration.',
    hostLabel: 'MUGGI + GILI & EVERYONE',
    accent: 'gold',
    dateDisplay: 'APRIL 2027 · EXACT DATE TBA',
    locationDisplay: 'CAESAREA VILLA, ISRAEL',
    dressCode: 'Sunny Coastal & Poolside Festive',
    vibeLevel: 'SUNNY VILLA PARTY',
    description:
      'A month before the wedding, all the boys and all the girls come together in Caesarea! We’re taking over a huge villa by the coast — sunshine, a massive pool, overflowing drinks, great music, and everybody happy in one place.',
    loadoutItems: [
      'Swimsuit, towel & sunglasses',
      'Sunny afternoon party outfit',
      'Good vibes for the full-crew warm-up',
      'Your favorite poolside drink',
    ],
    checkpoints: [
      {
        step: '01',
        time: 'SUNNY DAY',
        title: 'Villa Gates Open & Pool Dip',
        location: 'Caesarea Villa Deck',
        summary: 'Arrive in the sun, grab a cold drink at the bar, and jump straight in.',
      },
      {
        step: '02',
        time: 'GOLDEN HOUR',
        title: 'Mediterranean Sunset Session',
        location: 'Poolside & Lawn',
        summary: 'Music turned up, food sizzling, and both crews mingling in the golden hour.',
      },
      {
        step: '03',
        time: 'EVENING',
        title: 'Full-House Villa Party',
        location: 'Main Villa Courtyard',
        summary: 'Dancing, toasts, and the ultimate warm-up before 19 May at Consul House.',
      },
    ],
    designPromptHint: 'Exact April 2027 weekend date and Caesarea villa pin will drop here soon.',
  },
});

export const SIDE_QUEST_LIST: readonly SideQuestConfig[] = Object.freeze([
  SIDE_QUESTS.bachelor,
  SIDE_QUESTS.bachelorette,
  SIDE_QUESTS.united,
]);

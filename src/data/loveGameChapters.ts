import type { LoveGameChapter } from '../types/wedding.ts';

/**
 * The 7-chapter medieval pixel-art RPG chronicle of Muggi & Gili ("Play the Love Game").
 * Single-responsibility story data module so chapters, dialogue, and lore can be refined independently.
 */
export const LOVE_GAME_CHAPTERS: readonly LoveGameChapter[] = Object.freeze([
  {
    id: 'tavern-feast',
    chapterNumber: '01',
    eraLabel: '~9 YEARS AGO · AGES 20 & 19',
    title: 'THE BANQUET OF THE ROYAL GUARD',
    subtitle: 'Where a young Knight-Officer met the Realm’s newest Recruit at a faraway medieval feast.',
    locationRealm: 'THE FARAWAY BANQUET HALL',
    realWorldParallel: 'Army Party · Gili (19, New Recruit) & Muggi (20, Officer)',
    accent: 'gold',
    sceneType: 'tavern-feast',
    narrative:
      'Nearly nine winters ago, in a torch-lit banquet hall far across the Kingdom, a 20-year-old Knight-Officer named Sir Muggi stood among the banners of the Royal Guard. Across the crowded medieval feast stepped 19-year-old Lady Gili, newly sworn into the Realm’s service. Between clinking goblets, lute melodies, and hearthfire sparks, their eyes locked — and the first quest began.',
    muggiStatus: 'LVL 20 KNIGHT-OFFICER OF THE GUARD',
    giliStatus: 'LVL 19 NEWLY SWORN SQUIRE-RECRUIT',
    actionLabel: 'RAISE GOBLETS AT THE FEAST',
    actionReactionText:
      'CRITICAL HIT! Sir Muggi & Lady Gili toast across the tavern table — +100 CHARISMA & SPARK UNLOCKED!',
    lootUnlocked: 'GOLDEN GOBLET OF FIRST ENCOUNTER',
  },
  {
    id: 'first-alliance',
    chapterNumber: '02',
    eraLabel: 'THE FIRST CAMPAIGN · YEARS TOGETHER',
    title: 'YEARS OF THE FIRST ALLIANCE',
    subtitle: 'Side by side through watchtowers,weekend furloughs, and starry kingdom roads.',
    locationRealm: 'THE LANTERN ROADS OF JUDEA',
    realWorldParallel: 'Together for a few years after meeting in the army',
    accent: 'mint',
    sceneType: 'first-alliance',
    narrative:
      'What began at a single feast grew into a multi-year alliance. Through guard duties, weekend leaves, and moonlit journeys across the Kingdom, the Officer and the Recruit became an inseparable party of two — sharing rations, inside jokes, and early adventures before the winds of wanderlust called them beyond the sea.',
    muggiStatus: 'CO-OP PARTY LEADER · SHIELD BEARER',
    giliStatus: 'CO-OP PARTY LEADER · SPELLWEAVER',
    actionLabel: 'CAMP UNDER THE STARLIGHT',
    actionReactionText:
      'PARTY BOND LEVEL UP! Campfire lit under the crescent moon — 3+ years of shared memories stored!',
    lootUnlocked: 'COMPASS OF SHARED DESTINY',
  },
  {
    id: 'twin-dragons',
    chapterNumber: '03',
    eraLabel: 'THE GREAT VOYAGE · SEPARATE SKIES',
    title: 'FLIGHT OF THE TWIN DRAGONS',
    subtitle: 'Parting ways across the ocean — each riding their own dragon over the Mystic Southern Continent.',
    locationRealm: 'THE MYSTIC SOUTHERN REALMS',
    realWorldParallel: 'Flying separately to different corners of South America',
    accent: 'rose',
    sceneType: 'twin-dragons',
    narrative:
      'When their service ended, the chapter shifted and each hero embarked on a solo odyssey. In this medieval realm there are no airplanes — so Sir Muggi saddled an Emerald Wyvern and flew west, while Lady Gili mounted a Crimson Dragon bound for different lands across the Southern Continent of South America. Over Andean peaks, jungle temples, and distant clouds, two dragons soared on separate paths.',
    muggiStatus: 'RIDING THE EMERALD WYVERN · SOUTHERN PEAKS',
    giliStatus: 'RIDING THE CRIMSON DRAGON · JUNGLE CITADELS',
    actionLabel: 'SOAR ACROSS THE ANDES',
    actionReactionText:
      'TWIN DRAGON ROAR! Even across different corners of South America, an invisible thread connects their skies!',
    lootUnlocked: 'SCALES OF THE SOUTHERN WYVERNS',
  },
  {
    id: 'rekindled-flame',
    chapterNumber: '04',
    eraLabel: 'THE HOMECOMING · SECOND SPARK',
    title: 'THE RETURN & THE REKINDLED FLAME',
    subtitle: 'Both dragons touch down in the Homeland — and our heroes fall in love all over again.',
    locationRealm: 'GATES OF THE HOMELAND',
    realWorldParallel: 'Returning to Israel & falling in love again',
    accent: 'gold',
    sceneType: 'rekindled-flame',
    narrative:
      'At last, both dragons folded their wings and returned across the sea to the Homeland of Israel. Wiser, bolder, and back on the same soil, Sir Muggi and Lady Gili crossed paths once more. One look was all it took: the ancient ember burst into a roaring royal wildfire, and they fell in love all over again — for good.',
    muggiStatus: 'RETURNED WANDERER · HEART AFLAME',
    giliStatus: 'RETURNED ADVENTURER · HEART AFLAME',
    actionLabel: 'REKINDLE THE ANCIENT FLAME',
    actionReactionText:
      'LEGENDARY REUNION! Twin hearts merge into a permanent party buff — UNBREAKABLE BOND ACTIVATED!',
    lootUnlocked: 'ETERNAL TORCH OF REUNION',
  },
  {
    id: 'castle-north',
    chapterNumber: '05',
    eraLabel: 'CASTLE I · FIRST STRONGHOLD',
    title: 'THE NORTHERN CITADEL',
    subtitle: 'Moving in together for the first time — claiming their white-stone fortress in North Tel Aviv.',
    locationRealm: 'CITADEL OF THE NORTHERN MARCHES',
    realWorldParallel: 'First Apartment Together · Northern Tel Aviv',
    accent: 'mint',
    sceneType: 'castle-north',
    narrative:
      'Every true royal couple needs a stronghold. Leaving solo quests behind, Muggi and Gili marched to the sun-drenched Northern Marches of Tel Aviv and claimed their very first castle together. They raised the "M & G" banner above the battlements, furnished the great hall, and proved their co-op domestic mastery.',
    muggiStatus: 'LORD OF THE NORTHERN KEEP',
    giliStatus: 'LADY OF THE NORTHERN KEEP',
    actionLabel: 'HOIST THE FIRST CASTLE FLAG',
    actionReactionText:
      'STRONGHOLD CLAIMED! The Northern Tel Aviv Citadel now flies the royal M&G crest!',
    lootUnlocked: 'KEYS TO THE NORTHERN CITADEL',
  },
  {
    id: 'castle-king-george',
    chapterNumber: '06',
    eraLabel: 'CASTLE II · THE ROYAL AVENUE',
    title: 'THE KEEP OF KING GEORGE',
    subtitle: 'Advancing into the bustling heart of the realm to rule the Keep of King George.',
    locationRealm: 'ROYAL KEEP OF KING GEORGE',
    realWorldParallel: 'Second Apartment Together · King George St., Tel Aviv',
    accent: 'lilac',
    sceneType: 'castle-king-george',
    narrative:
      'From the quiet northern walls, the duo rode south into the lively heart of the Kingdom and established Castle II: the Keep of King George! Surrounded by bustling medieval street markets, alchemists’ coffee taverns, and midnight minstrels, their second fortress echoed with laughter, friends, and late-night feasts.',
    muggiStatus: 'GUARDIAN OF KING GEORGE KEEP',
    giliStatus: 'CHAMPION OF KING GEORGE KEEP',
    actionLabel: 'LIGHT THE KEEP WINDOWS',
    actionReactionText:
      'ROYAL DECREE! Lanterns glow across every tower on King George Street!',
    lootUnlocked: 'CROWN SIGIL OF KING GEORGE',
  },
  {
    id: 'castle-masaryk',
    chapterNumber: '07',
    eraLabel: 'CASTLE III · THE GRAND SANCTUARY',
    title: 'STRONGHOLD OF MASARYK SQUARE',
    subtitle: 'Their third and finest castle beside the enchanted fountain — preparing for the Final Coronation in Jaffa.',
    locationRealm: 'SANCTUARY OF MASARYK SQUARE',
    realWorldParallel: 'Third Apartment · Masaryk Square → Wedding at Consul House (19.05.2027)',
    accent: 'rose',
    sceneType: 'castle-masaryk',
    narrative:
      'Their third conquest brought them to the leafy, enchanted Courtyard of Masaryk Square. Above the stone fountain and ancient trees stands their grandest castle yet. And from its highest tower, looking south toward the Old Jaffa sea cliffs, the next quest marker gleams in gold: 19 May 2027 at Consul House — where the whole realm will gather for the Wedding Feast!',
    muggiStatus: 'READY FOR THE 19.05.2027 CORONATION',
    giliStatus: 'READY FOR THE 19.05.2027 CORONATION',
    actionLabel: 'SUMMON THE WEDDING CORONATION',
    actionReactionText:
      'FINAL QUEST UNLOCKED! Next stop: Consul House, Old Jaffa on 19 · 05 · 2027!',
    lootUnlocked: 'RINGS OF CONSUL HOUSE (19.05.2027)',
  },
]);

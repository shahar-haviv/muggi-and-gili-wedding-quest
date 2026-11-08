import type { LoveGameChapter } from '../types/wedding.ts';

/**
 * Quiet, minimal storybook chapters for Muggi & Gili ("Play the Love Game").
 * Kept intentionally brief and warm so the pixel-art vignettes take center stage.
 */
export const LOVE_GAME_CHAPTERS: readonly LoveGameChapter[] = Object.freeze([
  {
    id: 'tavern-feast',
    chapterNumber: '01',
    eraLabel: 'CHAPTER I · ~9 YEARS AGO',
    title: 'The Medieval Feast',
    caption:
      'Gili was 19, just starting the army. Muggi was a 20-year-old officer. They met at a faraway party.',
    sceneType: 'tavern-feast',
  },
  {
    id: 'first-alliance',
    chapterNumber: '02',
    eraLabel: 'CHAPTER II · EARLY YEARS',
    title: 'Years Side by Side',
    caption:
      'For the next few years they walked the same road, building their first quiet world together.',
    sceneType: 'first-alliance',
  },
  {
    id: 'twin-dragons',
    chapterNumber: '03',
    eraLabel: 'CHAPTER III · SOUTH AMERICA',
    title: 'Two Dragons West',
    caption:
      'Then each mounted a dragon and flew to South America — exploring different corners of a distant continent.',
    sceneType: 'twin-dragons',
  },
  {
    id: 'rekindled-flame',
    chapterNumber: '04',
    eraLabel: 'CHAPTER IV · HOMECOMING',
    title: 'Back Home, In Love Again',
    caption:
      'Both dragons returned to Israel. Their paths crossed once more, and they fell in love all over again.',
    sceneType: 'rekindled-flame',
  },
  {
    id: 'castle-north',
    chapterNumber: '05',
    eraLabel: 'CHAPTER V · FIRST CASTLE',
    title: 'The Northern Keep',
    caption:
      'They moved into their very first castle together in the quiet north of Tel Aviv.',
    sceneType: 'castle-north',
  },
  {
    id: 'castle-king-george',
    chapterNumber: '06',
    eraLabel: 'CHAPTER VI · SECOND CASTLE',
    title: 'Keep of King George',
    caption:
      'Next came their second castle right in the lively heart of King George Street.',
    sceneType: 'castle-king-george',
  },
  {
    id: 'castle-masaryk',
    chapterNumber: '07',
    eraLabel: 'CHAPTER VII · THIRD CASTLE',
    title: 'Castle Masaryk',
    caption:
      'From their third castle on Masaryk Square, the road now leads to Old Jaffa on 19 May 2027.',
    sceneType: 'castle-masaryk',
  },
]);

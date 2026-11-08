import * as THREE from 'three';
import { createSeededRandom } from './createPixelTexture.ts';

export type CharacterArchetype = 'groom' | 'bride' | 'guestSuit' | 'guestDress';
export type CharacterPalette = Readonly<Record<string, string>>;

/**
 * Tiny 14 x 22 character maps.
 */
export const CHARACTER_PIXEL_MAPS: Readonly<Record<CharacterArchetype, readonly string[]>> =
  Object.freeze({
    groom: [
      '..............',
      '....HHHHHH....',
      '...HHHHHHHH...',
      '...HSSSSSSH...',
      '...HSESSESH...',
      '...HSSSSSSH...',
      '....SSSSSS....',
      '.....SSSS.....',
      '...CCCCCCCC...',
      '..CCCCCCCCCC..',
      '..CCFWWWWWCC..',
      '..CCWWTTWWCC..',
      '..CCWWTTWWCC..',
      '..CCCCCCCCCC..',
      '...CCCCCCCC...',
      '...CCCCCCCC...',
      '...PPPPPPPP...',
      '...PPPPPPPP...',
      '...PPP..PPP...',
      '...PPP..PPP...',
      '...BBB..BBB...',
      '..............',
    ],
    bride: [
      '..............',
      '.....HHHH.....',
      '....HHHHHH....',
      '....HSSSSH....',
      '....HSESSH....',
      '....HSSSSH....',
      '.....SSSS.....',
      '...VVVVVVVV...',
      '..VVVWWWWVVV..',
      '..VVWWWWWWVV..',
      '..VWWWWWWWWV..',
      '...WWWWWWWWF..',
      '...WWWWWWWWF..',
      '..WWWWWWWWWFF.',
      '..WWWWWWWWWW..',
      '.WWWWWWWWWWWW.',
      '.WWWWWWWWWWWW.',
      'WWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWW',
      '....SS..SS....',
      '....BB..BB....',
      '..............',
    ],
    guestSuit: [
      '..............',
      '....HHHHHH....',
      '...HHHHHHHH...',
      '...HSSSSSSH...',
      '...HSESSESH...',
      '...HSSSSSSH...',
      '....SSSSSS....',
      '.....SSSS.....',
      '...CCCCCCCC...',
      '..CCCCCCCCCC..',
      '..CCCCCCCCCC..',
      '..CCCCCCCCCC..',
      '..CCCCCCCCCC..',
      '...CCCCCCCC...',
      '...PPPPPPPP...',
      '...PPPPPPPP...',
      '...PPP..PPP...',
      '...PPP..PPP...',
      '...PPP..PPP...',
      '...BBB..BBB...',
      '..............',
      '..............',
    ],
    guestDress: [
      '..............',
      '.....HHHH.....',
      '....HHHHHH....',
      '....HSSSSH....',
      '....HSESSH....',
      '....HSSSSH....',
      '.....SSSS.....',
      '...CCCCCCCC...',
      '..CCCCCCCCCC..',
      '..CCCCCCCCCC..',
      '..CCCCCCCCCC..',
      '...CCCCCCCC...',
      '..CCCCCCCCCC..',
      '..CCCCCCCCCC..',
      '.CCCCCCCCCCCC.',
      '.CCCCCCCCCCCC.',
      'CCCCCCCCCCCCCC',
      'CCCCCCCCCCCCCC',
      '....SS..SS....',
      '....BB..BB....',
      '..............',
      '..............',
    ],
  });

const SKIN_TONES = ['#f4c9a4', '#e3b088', '#c98e68', '#9c6a4c', '#6e4533', '#f7d8b8'];
const HAIR_COLOURS = ['#2a1a19', '#4a2c1f', '#191118', '#6b4328', '#8c5a33', '#c9a06a', '#d9d0c4'];
const SUIT_COLOURS = ['#26305a', '#3a2445', '#24453e', '#4a2c2e', '#2f3a4d', '#4b3a68', '#5a3b2c'];
const DRESS_COLOURS = ['#d9648c', '#7c5ac2', '#3f9b8e', '#e0a63f', '#b34767', '#efd6b0', '#8a63c9'];
const TROUSER_COLOURS = ['#1b203a', '#2c2230', '#27332f', '#3a2a3f'];

export const CHARACTER_PALETTES: Readonly<Record<'groom' | 'bride' | 'officiant', CharacterPalette>> =
  Object.freeze({
    groom: {
      H: '#2a1a19',
      S: '#e3b088',
      E: '#241016',
      C: '#232c52',
      W: '#fff0d6',
      T: '#f2799b',
      P: '#1a2038',
      B: '#0c0810',
      F: '#ffc857',
    },
    bride: {
      H: '#3b241f',
      S: '#f0c4a2',
      E: '#2a141b',
      V: '#ffd3df',
      W: '#fff4e2',
      F: '#f2799b',
      B: '#b98b5e',
    },
    officiant: {
      H: '#57505e',
      S: '#c98e68',
      E: '#241016',
      C: '#34303f',
      P: '#24202c',
      B: '#0c0810',
    },
  });

export function createGuestPalette({
  seed,
  archetype,
}: {
  readonly seed: number;
  readonly archetype: CharacterArchetype;
}): CharacterPalette {
  const random = createSeededRandom(seed);
  const pick = (colours: readonly string[]): string =>
    colours[Math.floor(random() * colours.length)];
  const isDress = archetype === 'guestDress';

  return {
    H: pick(HAIR_COLOURS),
    S: pick(SKIN_TONES),
    E: '#221119',
    C: isDress ? pick(DRESS_COLOURS) : pick(SUIT_COLOURS),
    P: pick(TROUSER_COLOURS),
    B: '#120c18',
  };
}

export function createCharacterSpriteTexture({
  archetype,
  palette,
}: {
  readonly archetype: CharacterArchetype;
  readonly palette: CharacterPalette;
}): THREE.CanvasTexture {
  const pixelMap = CHARACTER_PIXEL_MAPS[archetype] ?? CHARACTER_PIXEL_MAPS.guestSuit;
  const canvas = document.createElement('canvas');
  canvas.width = 14;
  canvas.height = pixelMap.length;

  const context = canvas.getContext('2d');
  if (context) {
    context.imageSmoothingEnabled = false;
    context.clearRect(0, 0, canvas.width, canvas.height);

    pixelMap.forEach((row, y) => {
      [...row].forEach((token, x) => {
        const colour = palette[token];
        if (!colour) return;
        context.fillStyle = colour;
        context.fillRect(x, y, 1, 1);
      });
    });
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.colorSpace = THREE.NoColorSpace;
  texture.needsUpdate = true;

  return texture;
}

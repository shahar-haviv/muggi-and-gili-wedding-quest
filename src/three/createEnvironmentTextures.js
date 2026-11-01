import { PIXEL_PALETTE } from './pixelPalette.js';
import { createPixelTexture, createSeededRandom } from './createPixelTexture.js';

const toCssColour = (hexColour) => `#${hexColour.toString(16).padStart(6, '0')}`;

function drawGrassTexture(context, width, height) {
  const random = createSeededRandom(1987);
  context.fillStyle = toCssColour(PIXEL_PALETTE.grassBase);
  context.fillRect(0, 0, width, height);

  const speckleColours = [
    PIXEL_PALETTE.grassLight,
    PIXEL_PALETTE.grassDark,
    PIXEL_PALETTE.grassDeep,
  ];

  for (let index = 0; index < 150; index += 1) {
    const x = Math.floor(random() * width);
    const y = Math.floor(random() * height);
    context.fillStyle = toCssColour(speckleColours[Math.floor(random() * speckleColours.length)]);
    context.fillRect(x, y, random() > 0.72 ? 2 : 1, 1);
  }

  for (let tuft = 0; tuft < 14; tuft += 1) {
    const x = Math.floor(random() * width);
    const y = Math.floor(random() * height);
    context.fillStyle = toCssColour(PIXEL_PALETTE.grassLight);
    context.fillRect(x, y, 1, 2);
    context.fillRect(x + 1, y + 1, 1, 1);
  }
}

function drawDirtTexture(context, width, height) {
  const random = createSeededRandom(42);
  context.fillStyle = toCssColour(PIXEL_PALETTE.dirtBase);
  context.fillRect(0, 0, width, height);

  for (let row = 0; row < height; row += 4) {
    context.fillStyle = toCssColour(row % 8 === 0 ? PIXEL_PALETTE.dirtLight : PIXEL_PALETTE.dirtDark);
    context.globalAlpha = 0.38;
    context.fillRect(0, row, width, 1);
  }
  context.globalAlpha = 1;

  for (let detail = 0; detail < 74; detail += 1) {
    const x = Math.floor(random() * width);
    const y = Math.floor(random() * height);
    const colours = [PIXEL_PALETTE.dirtLight, PIXEL_PALETTE.dirtDark, PIXEL_PALETTE.stoneDark];
    context.fillStyle = toCssColour(colours[Math.floor(random() * colours.length)]);
    context.fillRect(x, y, random() > 0.8 ? 3 : 2, 1);
  }
}

function drawStoneTexture(context, width, height) {
  const random = createSeededRandom(77);
  context.fillStyle = toCssColour(PIXEL_PALETTE.stoneDark);
  context.fillRect(0, 0, width, height);

  const stonePalette = [
    PIXEL_PALETTE.stoneBase,
    PIXEL_PALETTE.stoneLight,
    PIXEL_PALETTE.stoneDark,
  ];

  for (let row = 0; row < 4; row += 1) {
    for (let column = 0; column < 4; column += 1) {
      const offset = row % 2 === 0 ? 0 : 4;
      const x = (column * 8 + offset) % width;
      const y = row * 8;
      const colour = stonePalette[Math.floor(random() * stonePalette.length)];

      context.fillStyle = toCssColour(colour);
      context.fillRect(x, y, 7, 7);
      context.fillStyle = toCssColour(PIXEL_PALETTE.stoneLight);
      context.fillRect(x, y, 7, 1);
      context.fillRect(x, y, 1, 7);
      context.fillStyle = toCssColour(PIXEL_PALETTE.stoneDark);
      context.fillRect(x + 6, y + 1, 1, 6);
      context.fillRect(x + 1, y + 6, 6, 1);

      if (random() > 0.72) {
        context.fillStyle = toCssColour(PIXEL_PALETTE.stoneDark);
        context.fillRect(x + 3, y + 2, 1, 3);
      }
    }
  }
}

function drawDanceFloorTexture(context, width) {
  context.fillStyle = toCssColour(PIXEL_PALETTE.creamDim);
  context.fillRect(0, 0, width, width);

  const tileColours = [PIXEL_PALETTE.rose, PIXEL_PALETTE.cream];
  const tileSize = width / 2;

  for (let row = 0; row < 2; row += 1) {
    for (let column = 0; column < 2; column += 1) {
      context.fillStyle = toCssColour(tileColours[(row + column) % 2]);
      context.fillRect(column * tileSize, row * tileSize, tileSize, tileSize);

      context.fillStyle = toCssColour(PIXEL_PALETTE.wine);
      context.fillRect(column * tileSize, row * tileSize + tileSize - 1, tileSize, 1);
      context.fillRect(column * tileSize + tileSize - 1, row * tileSize, 1, tileSize);

      context.fillStyle = 'rgba(255, 242, 210, 0.45)';
      context.fillRect(column * tileSize + 1, row * tileSize + 1, 2, 1);
    }
  }
}

function drawTableclothTexture(context, width, height) {
  context.fillStyle = toCssColour(PIXEL_PALETTE.cream);
  context.fillRect(0, 0, width, height);

  context.fillStyle = toCssColour(PIXEL_PALETTE.rose);
  context.fillRect(0, 0, 4, height);
  context.fillRect(8, 0, 4, height);

  context.fillStyle = toCssColour(PIXEL_PALETTE.gold);
  context.fillRect(4, 0, 1, height);
  context.fillRect(12, 0, 1, height);

  for (let y = 2; y < height; y += 5) {
    context.fillStyle = toCssColour(PIXEL_PALETTE.roseDeep);
    context.fillRect(2, y, 2, 1);
    context.fillRect(10, y, 2, 1);
  }
}

function drawCanopyTexture(context, width, height) {
  context.fillStyle = toCssColour(PIXEL_PALETTE.cream);
  context.fillRect(0, 0, width, height);

  for (let x = 0; x < width; x += 8) {
    context.fillStyle = toCssColour(x % 16 === 0 ? PIXEL_PALETTE.rose : PIXEL_PALETTE.creamDim);
    context.globalAlpha = 0.55;
    context.fillRect(x, 0, 4, height);
  }
  context.globalAlpha = 1;

  for (let y = 0; y < height; y += 6) {
    context.fillStyle = 'rgba(255, 200, 87, 0.42)';
    context.fillRect(0, y, width, 1);
  }

  const random = createSeededRandom(9);
  for (let dot = 0; dot < 18; dot += 1) {
    context.fillStyle = toCssColour(
      random() > 0.5 ? PIXEL_PALETTE.roseDeep : PIXEL_PALETTE.gold,
    );
    context.fillRect(Math.floor(random() * width), Math.floor(random() * height), 1, 1);
  }
}

function drawHeartTexture(context) {
  const pixelMap = [
    '.XX.XX.',
    'XXXXXXX',
    'XXXXXXX',
    '.XXXXX.',
    '..XXX..',
    '...X...',
  ];
  const colours = {
    X: toCssColour(PIXEL_PALETTE.rose),
  };

  pixelMap.forEach((row, y) => {
    [...row].forEach((token, x) => {
      if (token === '.') return;
      context.fillStyle = colours[token];
      context.fillRect(x, y, 1, 1);
    });
  });

  context.fillStyle = toCssColour(PIXEL_PALETTE.roseBright);
  context.fillRect(1, 1, 1, 1);
  context.fillRect(2, 1, 1, 1);
  context.fillRect(1, 2, 1, 1);
}

function drawMoonTexture(context, width, height) {
  const centre = width / 2;
  const radius = width / 2 - 2;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const distance = Math.hypot(x + 0.5 - centre, y + 0.5 - centre);
      if (distance <= radius) {
        context.fillStyle = toCssColour(PIXEL_PALETTE.moon);
        context.fillRect(x, y, 1, 1);
      }
    }
  }

  const craters = [
    [8, 8, 2, 2],
    [14, 6, 2, 1],
    [9, 14, 1, 2],
    [15, 13, 2, 2],
  ];

  context.fillStyle = toCssColour(PIXEL_PALETTE.moonCrater);
  craters.forEach(([x, y, widthOfCrater, heightOfCrater]) => {
    context.fillRect(x, y, widthOfCrater, heightOfCrater);
  });
}

/**
 * Builds every shared environment texture once. Reusing them keeps the GPU
 * happy and makes the scene cheap enough for mid-range phones.
 */
export function createEnvironmentTextures() {
  return {
    grass: createPixelTexture({
      width: 32,
      height: 32,
      draw: drawGrassTexture,
      repeat: [10, 8],
    }),
    dirt: createPixelTexture({
      width: 32,
      height: 32,
      draw: drawDirtTexture,
      repeat: [5, 1],
    }),
    stone: createPixelTexture({
      width: 32,
      height: 32,
      draw: drawStoneTexture,
      repeat: [2, 8],
    }),
    danceFloor: createPixelTexture({
      width: 16,
      height: 16,
      draw: drawDanceFloorTexture,
      repeat: [3, 2],
    }),
    tablecloth: createPixelTexture({
      width: 16,
      height: 16,
      draw: drawTableclothTexture,
      repeat: [4, 1],
    }),
    canopy: createPixelTexture({
      width: 32,
      height: 32,
      draw: drawCanopyTexture,
      repeat: [2, 2],
    }),
    heart: createPixelTexture({
      width: 7,
      height: 6,
      draw: drawHeartTexture,
    }),
    moon: createPixelTexture({
      width: 24,
      height: 24,
      draw: drawMoonTexture,
    }),
  };
}

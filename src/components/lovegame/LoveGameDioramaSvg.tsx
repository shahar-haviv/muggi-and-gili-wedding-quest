import { useEffect, useRef } from 'preact/hooks';
import type { LoveGameSceneType } from '../../types/wedding.ts';

interface LoveGameDioramaProps {
  readonly sceneType: LoveGameSceneType;
}

const WIDTH = 160;
const HEIGHT = 90;

/**
 * Draws a crisp 1x1 pixel rectangle on the low-res canvas.
 */
function px(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

/**
 * Draws a tiny 5x5 pixel heart.
 */
function drawTinyHeart(ctx: CanvasRenderingContext2D, x: number, y: number, color = '#f2799b') {
  px(ctx, x + 1, y, 1, 1, color);
  px(ctx, x + 3, y, 1, 1, color);
  px(ctx, x, y + 1, 5, 2, color);
  px(ctx, x + 1, y + 3, 3, 1, color);
  px(ctx, x + 2, y + 4, 1, 1, color);
}

/**
 * Cute minimalist pixel sprite for Sir Muggi (Officer in cloak & gold trim).
 */
function drawMuggi(ctx: CanvasRenderingContext2D, x: number, y: number, stepFrame: number) {
  const bob = stepFrame % 2 === 0 ? 0 : -1;
  // Soft shadow
  px(ctx, x, y + 11, 6, 1, 'rgba(0,0,0,0.35)');
  // Boots
  px(ctx, x + 1, y + 9, 1, 2, '#181028');
  px(ctx, x + 4, y + 9, 1, 2, '#181028');
  // Officer tunic & cape
  px(ctx, x, y + 5 + bob, 6, 4, '#3b5878');
  px(ctx, x + 1, y + 5 + bob, 4, 1, '#ffc857'); // gold officer collar
  px(ctx, x + 2, y + 6 + bob, 2, 3, '#71e0c0');
  // Head
  px(ctx, x + 1, y + 1 + bob, 4, 4, '#ffd7b5');
  px(ctx, x + 1, y + bob, 4, 1, '#4a2e1b'); // hair
  px(ctx, x + 2, y - 1 + bob, 2, 1, '#71e0c0'); // tiny officer plume
  px(ctx, x + 4, y + 2 + bob, 1, 1, '#181028'); // eye facing right
}

/**
 * Cute minimalist pixel sprite for Lady Gili (Recruit / Adventurer).
 */
function drawGili(ctx: CanvasRenderingContext2D, x: number, y: number, stepFrame: number) {
  const bob = (stepFrame + 1) % 2 === 0 ? 0 : -1;
  // Soft shadow
  px(ctx, x, y + 11, 6, 1, 'rgba(0,0,0,0.35)');
  // Boots
  px(ctx, x + 1, y + 9, 1, 2, '#181028');
  px(ctx, x + 4, y + 9, 1, 2, '#181028');
  // Tunic & dress
  px(ctx, x + 1, y + 5 + bob, 4, 4, '#d95b82');
  px(ctx, x + 2, y + 5 + bob, 2, 3, '#fff2d2');
  // Long hair & head
  px(ctx, x + 1, y + bob, 4, 5, '#59301a');
  px(ctx, x + 1, y + 1 + bob, 3, 4, '#ffe0c4');
  px(ctx, x + 2, y - 1 + bob, 2, 1, '#ffc857'); // tiny gold circlet
  px(ctx, x + 1, y + 2 + bob, 1, 1, '#181028'); // eye facing left
}

/**
 * Graceful, delicate pixel dragon with rider silhouette.
 */
function drawDragon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  bodyColor: string,
  wingColor: string,
  riderColor: string,
  wingUp: boolean,
) {
  // Tail
  px(ctx, x - 6, y + 2, 3, 1, bodyColor);
  px(ctx, x - 3, y + 1, 3, 2, bodyColor);
  // Body
  px(ctx, x, y, 10, 4, bodyColor);
  px(ctx, x + 2, y + 3, 6, 1, '#ffc857');
  // Neck & Head
  px(ctx, x + 9, y - 2, 3, 3, bodyColor);
  px(ctx, x + 11, y - 3, 4, 2, bodyColor);
  px(ctx, x + 10, y - 4, 1, 1, '#ffc857'); // horn
  // Rider
  px(ctx, x + 4, y - 3, 2, 3, riderColor);
  px(ctx, x + 4, y - 4, 2, 1, '#ffd7b5');
  // Wing
  if (wingUp) {
    px(ctx, x + 3, y - 6, 5, 3, wingColor);
    px(ctx, x + 2, y - 3, 6, 3, wingColor);
  } else {
    px(ctx, x + 3, y + 2, 6, 4, wingColor);
  }
}

/**
 * Draws a banded dusk sky with gentle twinkling stars.
 */
function drawMellowSky(ctx: CanvasRenderingContext2D, t: number, warmHorizon = false) {
  const bands = warmHorizon
    ? ['#0d081c', '#160f2e', '#231742', '#352157', '#4d2b63']
    : ['#0b0717', '#120c26', '#1b1336', '#251a46', '#312257'];

  const bandHeight = Math.ceil(HEIGHT / bands.length);
  bands.forEach((color, idx) => {
    px(ctx, 0, idx * bandHeight, WIDTH, bandHeight, color);
  });

  // Quiet stars
  const stars = [
    [18, 10],
    [42, 16],
    [74, 8],
    [108, 14],
    [138, 11],
    [28, 26],
    [124, 24],
  ];
  stars.forEach(([sx, sy], i) => {
    const twinkle = Math.sin(t * 1.8 + i * 1.7) > 0.3;
    px(ctx, sx, sy, 1, 1, twinkle ? '#fff2d2' : '#6e5b8c');
  });
}

/**
 * Draws a medieval castle silhouette with warm glowing windows.
 */
function drawCastle(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  baseY: number,
  variant: 'north' | 'king-george' | 'masaryk',
  t: number,
) {
  const stoneMain = variant === 'north' ? '#2c2247' : variant === 'king-george' ? '#291c45' : '#301d4a';
  const stoneTrim = variant === 'north' ? '#433569' : variant === 'king-george' ? '#4a3270' : '#4f306e';
  const roofColor = variant === 'north' ? '#529c89' : variant === 'king-george' ? '#b89cff' : '#d95b82';

  // Main keep body
  px(ctx, centerX - 24, baseY - 28, 48, 28, stoneMain);
  px(ctx, centerX - 24, baseY - 28, 48, 2, stoneTrim);

  // Left & Right towers
  px(ctx, centerX - 32, baseY - 38, 12, 38, stoneTrim);
  px(ctx, centerX + 20, baseY - 38, 12, 38, stoneTrim);

  if (variant === 'north') {
    // Flat coastal battlements + tiny waving flag
    for (let cx = -32; cx <= -22; cx += 4) px(ctx, centerX + cx, baseY - 40, 2, 2, stoneTrim);
    for (let cx = 20; cx <= 30; cx += 4) px(ctx, centerX + cx, baseY - 40, 2, 2, stoneTrim);
    px(ctx, centerX, baseY - 38, 1, 10, '#cbb99e');
    const flagWave = Math.sin(t * 3) > 0 ? 0 : 1;
    px(ctx, centerX + 1, baseY - 38 + flagWave, 6, 4, '#71e0c0');
  } else if (variant === 'king-george') {
    // Central royal tower + golden crown spire
    px(ctx, centerX - 10, baseY - 44, 20, 16, stoneTrim);
    px(ctx, centerX - 6, baseY - 47, 2, 3, '#ffc857');
    px(ctx, centerX - 1, baseY - 49, 2, 5, '#ffc857');
    px(ctx, centerX + 4, baseY - 47, 2, 3, '#ffc857');
  } else {
    // Pointed fairy-tale roofs on Masaryk Castle
    for (let r = 0; r < 6; r++) {
      px(ctx, centerX - 32 + r, baseY - 39 - r, 12 - r * 2, 1, roofColor);
      px(ctx, centerX + 20 + r, baseY - 39 - r, 12 - r * 2, 1, roofColor);
    }
  }

  // Warm glowing windows
  const glow = Math.sin(t * 2) > 0 ? '#ffc857' : '#ffdb85';
  px(ctx, centerX - 14, baseY - 20, 4, 6, glow);
  px(ctx, centerX - 2, baseY - 20, 4, 6, glow);
  px(ctx, centerX + 10, baseY - 20, 4, 6, glow);
  px(ctx, centerX - 27, baseY - 30, 3, 5, glow);
  px(ctx, centerX + 24, baseY - 30, 3, 5, glow);

  // Arched wooden doorway
  px(ctx, centerX - 4, baseY - 10, 8, 10, '#160d29');
  px(ctx, centerX - 3, baseY - 11, 6, 1, '#160d29');
}

/**
 * Cozy, low-res (160x90) pixel-art vignette canvas for "Play the Love Game".
 */
export function LoveGameDioramaSvg({ sceneType }: LoveGameDioramaProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let rafId = 0;
    let lastFrameTime = 0;

    const renderFrame = (nowMs: number) => {
      rafId = window.requestAnimationFrame(renderFrame);
      // Cap at a cozy 10fps so pixel movements feel calm and deliberate
      if (nowMs - lastFrameTime < 100) return;
      lastFrameTime = nowMs;

      const t = nowMs * 0.001;
      const stepFrame = Math.floor(t * 1.6);
      const heartBob = Math.floor(Math.sin(t * 2.2) * 1.5);

      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      if (sceneType === 'tavern-feast') {
        // Cozy medieval stone hall interior
        drawMellowSky(ctx, t, true);
        // Stone wall & arched windows
        px(ctx, 16, 12, 128, 56, '#1e1433');
        px(ctx, 16, 12, 128, 2, '#382659');
        // Three arched night windows looking out at stars
        [40, 74, 108].forEach((wx) => {
          px(ctx, wx, 22, 12, 20, '#0d081c');
          px(ctx, wx + 2, 20, 8, 2, '#0d081c');
          px(ctx, wx, 42, 12, 1, '#4b3570');
        });
        // Warm overhead garland lights
        for (let lx = 26; lx <= 134; lx += 12) {
          const ly = 17 + (lx % 24 === 0 ? 1 : 2);
          px(ctx, lx, ly, 2, 2, (lx + stepFrame) % 3 === 0 ? '#ffd97d' : '#ffc857');
        }
        // Wooden floor
        px(ctx, 0, 68, WIDTH, 22, '#150d24');
        px(ctx, 12, 68, 136, 2, '#2d1d47');
        // Long wooden feast table with two golden goblets
        px(ctx, 48, 63, 64, 3, '#7a4e2d');
        px(ctx, 54, 66, 3, 5, '#52321b');
        px(ctx, 103, 66, 3, 5, '#52321b');
        px(ctx, 73, 60, 2, 3, '#ffc857');
        px(ctx, 85, 60, 2, 3, '#ffc857');

        // Officer Muggi & Recruit Gili meeting across the table
        drawMuggi(ctx, 64, 57, stepFrame);
        drawGili(ctx, 90, 57, stepFrame);
        drawTinyHeart(ctx, 78, 48 + heartBob);
      } else if (sceneType === 'first-alliance') {
        drawMellowSky(ctx, t, false);
        // Crescent moon
        px(ctx, 126, 14, 7, 7, '#ffe3a8');
        px(ctx, 129, 14, 5, 5, '#120c26');
        // Soft distant hills
        px(ctx, 0, 58, WIDTH, 12, '#192928');
        px(ctx, 20, 54, 50, 4, '#192928');
        px(ctx, 95, 55, 45, 3, '#192928');
        // Foreground meadow & path
        px(ctx, 0, 66, WIDTH, 24, '#13201e');
        px(ctx, 0, 71, WIDTH, 6, '#2b2140');
        // Small warm campfire
        const flicker = stepFrame % 2 === 0 ? 0 : 1;
        px(ctx, 78, 69, 4, 1, '#6e4726');
        px(ctx, 79, 66 + flicker, 2, 3 - flicker, '#ff9b54');
        px(ctx, 79, 67, 2, 2, '#ffc857');

        drawMuggi(ctx, 66, 59, stepFrame);
        drawGili(ctx, 88, 59, stepFrame);
        drawTinyHeart(ctx, 78, 51 + heartBob);
      } else if (sceneType === 'twin-dragons') {
        drawMellowSky(ctx, t, true);
        // Distant Andean mountain silhouettes & jungle pyramid
        for (let i = 0; i < 24; i++) {
          px(ctx, 14 + i, 68 - i, 48 - i * 2, 1, '#1e1638');
        }
        // Snow cap
        for (let i = 0; i < 6; i++) {
          px(ctx, 32 + i, 50 - i, 12 - i * 2, 1, '#cbb99e');
        }
        // Stepped temple silhouette on the right
        px(ctx, 106, 60, 28, 8, '#1a2b2e');
        px(ctx, 111, 54, 18, 6, '#21383b');
        px(ctx, 116, 49, 8, 5, '#294549');
        // Sea below
        px(ctx, 0, 68, WIDTH, 22, '#0e1d36');

        // Two dragons gliding smoothly in separate skies
        const glideX = Math.sin(t * 0.9) * 4;
        const glideY = Math.cos(t * 1.3) * 2;
        const wingUp = stepFrame % 2 === 0;

        drawDragon(ctx, 36 + glideX, 26 + glideY, '#3ca385', '#71e0c0', '#3b5878', wingUp);
        drawDragon(ctx, 102 - glideX, 36 - glideY, '#c94f79', '#f2799b', '#d95b82', !wingUp);
      } else if (sceneType === 'rekindled-flame') {
        drawMellowSky(ctx, t, true);
        // Ancient homeland stone arch in the center
        px(ctx, 58, 30, 6, 38, '#362654');
        px(ctx, 96, 30, 6, 38, '#362654');
        px(ctx, 54, 25, 52, 5, '#48336e');
        px(ctx, 56, 23, 48, 2, '#ffc857');
        // Ground
        px(ctx, 0, 68, WIDTH, 22, '#18102b');

        // Resting dragons on the sides
        drawDragon(ctx, 18, 62, '#3ca385', '#71e0c0', '#3ca385', false);
        drawDragon(ctx, 128, 62, '#c94f79', '#f2799b', '#c94f79', false);

        // Muggi & Gili close together under the arch
        drawMuggi(ctx, 71, 58, stepFrame);
        drawGili(ctx, 83, 58, stepFrame);
        drawTinyHeart(ctx, 78, 46 + heartBob, '#ffc857');
      } else if (sceneType === 'castle-north') {
        drawMellowSky(ctx, t, false);
        // Yarkon river & northern greenery
        px(ctx, 0, 68, WIDTH, 22, '#142624');
        px(ctx, 0, 75, WIDTH, 8, '#132b47');
        drawCastle(ctx, 80, 68, 'north', t);
        drawMuggi(ctx, 70, 61, stepFrame);
        drawGili(ctx, 84, 61, stepFrame);
        drawTinyHeart(ctx, 78, 52 + heartBob);
      } else if (sceneType === 'castle-king-george') {
        drawMellowSky(ctx, t, true);
        px(ctx, 0, 68, WIDTH, 22, '#1a112e');
        // Warm street lanterns along King George
        [32, 126].forEach((lx) => {
          px(ctx, lx, 54, 1, 14, '#4a356e');
          px(ctx, lx - 1, 52, 3, 3, '#ffc857');
        });
        drawCastle(ctx, 80, 68, 'king-george', t);
        drawMuggi(ctx, 70, 61, stepFrame);
        drawGili(ctx, 84, 61, stepFrame);
        drawTinyHeart(ctx, 78, 52 + heartBob);
      } else if (sceneType === 'castle-masaryk') {
        drawMellowSky(ctx, t, true);
        px(ctx, 0, 68, WIDTH, 22, '#152922');
        drawCastle(ctx, 80, 66, 'masaryk', t);
        // Leafy Masaryk Square trees
        [28, 130].forEach((tx) => {
          px(ctx, tx, 58, 2, 10, '#4d311e');
          px(ctx, tx - 5, 46, 12, 12, '#2d6349');
          px(ctx, tx - 3, 44, 8, 2, '#3f8a5f');
        });
        // Iconic Masaryk Fountain in the foreground courtyard
        px(ctx, 68, 73, 24, 4, '#4a396b');
        px(ctx, 70, 72, 20, 2, '#3d73a8');
        const spray = stepFrame % 2 === 0 ? 0 : 1;
        px(ctx, 79, 67 + spray, 2, 5, '#8ec5ff');
        px(ctx, 76, 69, 8, 1, '#71e0c0');

        drawMuggi(ctx, 56, 62, stepFrame);
        drawGili(ctx, 98, 62, stepFrame);
        drawTinyHeart(ctx, 78, 56 + heartBob);
      }
    };

    rafId = window.requestAnimationFrame(renderFrame);
    return () => window.cancelAnimationFrame(rafId);
  }, [sceneType]);

  return (
    <canvas
      ref={canvasRef}
      width={WIDTH}
      height={HEIGHT}
      className="love-scene__canvas"
      role="img"
      aria-label="Pixel-art storybook vignette of Muggi and Gili"
    />
  );
}

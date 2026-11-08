import { useEffect, useRef } from 'preact/hooks';
import type { SideQuestSlug } from '../../types/wedding.ts';

interface SideQuestSceneCanvasProps {
  readonly slug: SideQuestSlug;
}

const WIDTH = 180;
const HEIGHT = 96;

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
 * Draws a cute pixel party character with an optional raised drink/goblet.
 */
function drawPartyGuest(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  outfitColor: string,
  hairColor: string,
  drinkColor: string,
  bob: number,
  crownColor?: string,
) {
  // Shadow
  px(ctx, x, y + 11, 5, 1, 'rgba(0,0,0,0.3)');
  // Legs
  px(ctx, x + 1, y + 9, 1, 2, '#181028');
  px(ctx, x + 3, y + 9, 1, 2, '#181028');
  // Torso
  px(ctx, x, y + 5 + bob, 5, 4, outfitColor);
  // Head
  px(ctx, x + 1, y + 1 + bob, 3, 4, '#ffd7b5');
  px(ctx, x + 1, y + bob, 3, 1, hairColor);
  if (crownColor) {
    px(ctx, x + 1, y - 1 + bob, 3, 1, crownColor);
  }
  // Raised drink glass / tankard
  px(ctx, x + 5, y + 2 + bob, 2, 3, drinkColor);
  px(ctx, x + 5, y + 1 + bob, 2, 1, '#fff2d2');
}

/**
 * Scene 1: MADRID / EUROPE BACHELOR EXPEDITION
 * Warm Spanish Plaza Mayor arches, twin bell towers, dragon flight overhead,
 * oak tavern barrels, and Muggi + the boys raising tankards at night.
 */
function renderMadridBachelor(ctx: CanvasRenderingContext2D, t: number, stepFrame: number) {
  // Warm Iberian night sky
  const skyBands = ['#0c071c', '#180e30', '#291542', '#3d1c4d', '#54234e'];
  skyBands.forEach((col, i) => px(ctx, 0, i * 16, WIDTH, 16, col));

  // Stars
  [
    [16, 10],
    [48, 8],
    [92, 12],
    [134, 9],
    [162, 15],
  ].forEach(([sx, sy], i) => {
    px(ctx, sx, sy, 1, 1, Math.sin(t * 2 + i) > 0 ? '#fff2d2' : '#7b588f');
  });

  // Small dragon silhouette flying the boys into Madrid
  const dx = 28 + Math.sin(t * 0.8) * 6;
  const dy = 16 + Math.cos(t * 1.2) * 2;
  px(ctx, dx, dy, 8, 3, '#71e0c0');
  px(ctx, dx + 7, dy - 1, 3, 2, '#71e0c0');
  px(ctx, dx + 2, dy + (stepFrame % 2 === 0 ? -3 : 2), 4, 3, '#ffc857');

  // Plaza Mayor terracotta facade & twin Spanish towers
  px(ctx, 22, 34, 136, 38, '#5e2538');
  px(ctx, 22, 32, 136, 3, '#ffc857');
  // Twin Madrid towers with spires
  px(ctx, 18, 20, 18, 52, '#732c41');
  px(ctx, 144, 20, 18, 52, '#732c41');
  for (let s = 0; s < 6; s++) {
    px(ctx, 21 + s, 19 - s, 12 - s * 2, 1, '#2b1b42');
    px(ctx, 147 + s, 19 - s, 12 - s * 2, 1, '#2b1b42');
  }
  px(ctx, 26, 11, 2, 3, '#ffc857');
  px(ctx, 152, 11, 2, 3, '#ffc857');

  // Warm illuminated balcony windows
  for (let wx = 44; wx <= 132; wx += 16) {
    px(ctx, wx, 40, 6, 8, '#ffc857');
  }
  // Plaza ground Arches
  for (let ax = 42; ax <= 130; ax += 16) {
    px(ctx, ax, 56, 10, 16, '#1f0e29');
    px(ctx, ax + 1, 55, 8, 1, '#1f0e29');
  }

  // Festive Spanish plaza string lights
  for (let lx = 26; lx <= 154; lx += 8) {
    const bulbColor = (lx + stepFrame) % 16 === 0 ? '#ff7196' : '#ffc857';
    px(ctx, lx, 30 + (lx % 16 === 0 ? 1 : 2), 2, 2, bulbColor);
  }

  // Cobblestone Plaza floor
  px(ctx, 0, 72, WIDTH, 24, '#1a1029');
  px(ctx, 0, 72, WIDTH, 2, '#3c2659');

  // Long outdoor tapas & tavern table + oak barrels
  px(ctx, 30, 68, 8, 8, '#7a4924');
  px(ctx, 30, 70, 8, 1, '#ffc857');
  px(ctx, 64, 71, 52, 3, '#8b542b');

  // Muggi & the Boys crew celebrating with golden beers & sangria
  const boys = [
    { x: 48, outfit: '#3b5878', hair: '#3b2314', drink: '#ffc857' },
    { x: 64, outfit: '#2e6f5e', hair: '#1c121c', drink: '#ff7196' },
    { x: 84, outfit: '#3b5878', hair: '#4a2e1b', drink: '#ffc857', crown: '#71e0c0' }, // Muggi
    { x: 104, outfit: '#633b78', hair: '#2e1c10', drink: '#ffc857' },
    { x: 122, outfit: '#8c3b58', hair: '#1c121c', drink: '#ff7196' },
  ];
  boys.forEach((b, idx) => {
    const bob = (stepFrame + idx) % 2 === 0 ? 0 : -1;
    drawPartyGuest(ctx, b.x, 66, b.outfit, b.hair, b.drink, bob, b.crown);
  });
}

/**
 * Scene 2: FUNKY MEDIEVAL PARIS BACHELORETTE (Gili & the girls)
 * Chic rose-violet sky, Gothic Notre-Dame & Eiffel spire silhouette,
 * glowing chandelier/disco orb, champagne & wine tower, and the girls partying!
 */
function renderParisBachelorette(ctx: CanvasRenderingContext2D, t: number, stepFrame: number) {
  // Chic Parisian rose-plum dusk sky
  const skyBands = ['#140924', '#221038', '#361852', '#4f2169', '#6e2c7d'];
  skyBands.forEach((col, i) => px(ctx, 0, i * 16, WIDTH, 16, col));

  // Sparkling stars & Parisian shimmer
  [
    [20, 12],
    [54, 18],
    [122, 10],
    [154, 16],
    [38, 28],
    [140, 26],
  ].forEach(([sx, sy], i) => {
    const bright = Math.sin(t * 2.5 + i) > 0;
    px(ctx, sx, sy, 1, 1, bright ? '#fff2d2' : '#ffa3bd');
  });

  // Funky Medieval Paris Skyline:
  // 1) Eiffel Spire on the left-center
  px(ctx, 41, 14, 2, 12, '#3d1c52');
  px(ctx, 39, 26, 6, 12, '#3d1c52');
  px(ctx, 37, 38, 10, 14, '#3d1c52');
  px(ctx, 34, 52, 16, 12, '#3d1c52');
  px(ctx, 38, 56, 8, 8, '#4f2169'); // Eiffel base arch
  // Golden Eiffel beacon
  px(ctx, 41, 12, 2, 2, stepFrame % 2 === 0 ? '#ffc857' : '#fff2d2');

  // 2) Gothic Notre-Dame Twin Towers & Rose Window on the right-center
  px(ctx, 118, 28, 12, 36, '#351847');
  px(ctx, 142, 28, 12, 36, '#351847');
  px(ctx, 130, 38, 12, 26, '#2b123b');
  // Glowing Gothic Rose Window
  px(ctx, 133, 43, 6, 6, '#f2799b');
  px(ctx, 135, 45, 2, 2, '#ffc857');

  // Hanging funky crystal/disco orb above the rooftop party
  px(ctx, 89, 0, 1, 14, '#b89cff');
  px(ctx, 86, 14, 7, 7, '#f2799b');
  px(ctx, 87, 15, 5, 5, stepFrame % 2 === 0 ? '#fff2d2' : '#ffc857');

  // Shimmering River Seine & Rooftop Terrace balustrade
  px(ctx, 0, 64, WIDTH, 6, '#1c1238');
  px(ctx, 0, 70, WIDTH, 26, '#211133');
  for (let bx = 6; bx < WIDTH; bx += 8) {
    px(ctx, bx, 66, 3, 4, '#4b2f78');
  }
  px(ctx, 0, 65, WIDTH, 2, '#b89cff');

  // Fancy Parisian wine & champagne tower table at center
  px(ctx, 76, 70, 26, 4, '#fff2d2');
  px(ctx, 78, 74, 22, 6, '#d95b82');
  // Wine bottles & pyramid of glasses
  px(ctx, 80, 65, 2, 5, '#1e5c4e');
  px(ctx, 83, 66, 2, 4, '#b93d68');
  px(ctx, 88, 67, 8, 3, '#ffc857');
  px(ctx, 90, 64, 4, 3, '#fff2d2');

  // Lady Gili & her squad in chic Parisian fits raising wine glasses
  const girls = [
    { x: 32, outfit: '#f2799b', hair: '#4a2e1b', drink: '#b93d68' },
    { x: 48, outfit: '#b89cff', hair: '#d99b52', drink: '#ffc857' },
    { x: 64, outfit: '#fff2d2', hair: '#59301a', drink: '#b93d68', crown: '#ffc857' }, // Gili
    { x: 108, outfit: '#ff7196', hair: '#261710', drink: '#b93d68' },
    { x: 124, outfit: '#71e0c0', hair: '#6e3b1e', drink: '#ffc857' },
    { x: 140, outfit: '#f2799b', hair: '#3b2214', drink: '#b93d68' },
  ];
  girls.forEach((g, idx) => {
    const bob = (stepFrame + idx) % 2 === 0 ? 0 : -1;
    drawPartyGuest(ctx, g.x, 68, g.outfit, g.hair, g.drink, bob, g.crown);
  });
}

/**
 * Scene 3: UNITED PARTY IN CAESAREA (April 2027 · Sunny Luxury Villa & Pool Party)
 * Bright Mediterranean sunshine, turquoise sea, Roman aqueduct arches,
 * grand white Caesarea villa, palm trees, swimming pool, and full crew celebrating!
 */
function renderCaesareaUnited(ctx: CanvasRenderingContext2D, t: number, stepFrame: number) {
  // Sunny Mediterranean coastal sky
  const skyBands = ['#2b6cb0', '#3b82c4', '#569cd6', '#7ec0ee', '#bfe3f7'];
  skyBands.forEach((col, i) => px(ctx, 0, i * 11, WIDTH, 12, col));

  // Radiant golden sun in top-left sky
  const sunPulse = stepFrame % 2 === 0 ? 1 : 0;
  px(ctx, 20 - sunPulse, 10 - sunPulse, 12 + sunPulse * 2, 12 + sunPulse * 2, '#ffe3a8');
  px(ctx, 22, 12, 8, 8, '#ffc857');

  // Fluffy white clouds drifting slowly
  const cloudShift = Math.sin(t * 0.5) * 4;
  px(ctx, 64 + cloudShift, 14, 18, 4, '#ffffff');
  px(ctx, 68 + cloudShift, 12, 10, 2, '#ffffff');
  px(ctx, 132 - cloudShift, 18, 16, 4, '#ffffff');

  // Turquoise Caesarea Sea on the horizon
  px(ctx, 0, 50, WIDTH, 10, '#1d7096');
  px(ctx, 0, 50, WIDTH, 2, '#3ba1c9');

  // Ancient Caesarea Roman Aqueduct arches along the shore (left side)
  px(ctx, 4, 38, 44, 14, '#d9c29c');
  px(ctx, 4, 37, 44, 2, '#bfa378');
  for (let rx = 8; rx <= 40; rx += 10) {
    px(ctx, rx, 42, 6, 10, '#569cd6');
  }

  // Grand White Caesarea Luxury Villa (center-right)
  px(ctx, 62, 28, 76, 28, '#fff7e6');
  px(ctx, 58, 25, 84, 4, '#d95b43'); // terracotta roof tiles
  px(ctx, 90, 20, 24, 8, '#fff7e6');
  px(ctx, 88, 18, 28, 3, '#d95b43');
  // Villa arched windows & open patio doors
  [70, 86, 102, 118].forEach((vx) => {
    px(ctx, vx, 36, 8, 14, '#244b6b');
    px(ctx, vx, 34, 8, 2, '#ffc857');
  });

  // Palm trees swaying
  [54, 146].forEach((pxTree) => {
    px(ctx, pxTree, 34, 3, 22, '#8b5a2b');
    px(ctx, pxTree - 6, 30, 15, 3, '#2e8b57');
    px(ctx, pxTree - 4, 27, 11, 3, '#3cb371');
  });

  // Sunny limestone Villa deck & lawn
  px(ctx, 0, 56, WIDTH, 40, '#e8d5b5');
  px(ctx, 0, 56, WIDTH, 2, '#cbb28c');

  // Shimmering Turquoise Villa Swimming Pool
  px(ctx, 48, 72, 84, 18, '#ffffff');
  px(ctx, 50, 74, 80, 14, '#2ac3d4');
  // Pool water sparkles & pink flamingo float
  px(ctx, 62 + (stepFrame % 4), 78, 8, 2, '#8cf0fa');
  px(ctx, 98 - (stepFrame % 4), 82, 10, 2, '#8cf0fa');
  px(ctx, 76, 77, 6, 4, '#ff7196'); // flamingo float body
  px(ctx, 80, 74, 2, 4, '#ff7196'); // flamingo neck

  // Both crews (boys + girls) partying around the villa terrace!
  const crew = [
    { x: 18, outfit: '#f2799b', hair: '#4a2e1b', drink: '#ffc857' },
    { x: 32, outfit: '#3b5878', hair: '#2b1b10', drink: '#2ac3d4' },
    { x: 66, outfit: '#3b5878', hair: '#4a2e1b', drink: '#ffc857', crown: '#71e0c0' }, // Muggi
    { x: 84, outfit: '#ff7196', hair: '#59301a', drink: '#ffc857', crown: '#ffc857' }, // Gili
    { x: 104, outfit: '#71e0c0', hair: '#1c121c', drink: '#ff7196' },
    { x: 138, outfit: '#b89cff', hair: '#6e3b1e', drink: '#ffc857' },
    { x: 154, outfit: '#2e8b57', hair: '#261710', drink: '#ff7196' },
  ];
  crew.forEach((c, idx) => {
    const bob = (stepFrame + idx) % 2 === 0 ? 0 : -1;
    drawPartyGuest(ctx, c.x, 58, c.outfit, c.hair, c.drink, bob, c.crown);
  });
}

/**
 * Single-responsibility pixel-art canvas illustrating the specific location and
 * atmosphere of each secret Side Quest (`bachelor`, `bachelorette`, `united`).
 */
export function SideQuestSceneCanvas({ slug }: SideQuestSceneCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let rafId = 0;
    let lastFrameMs = 0;

    const tick = (nowMs: number) => {
      rafId = window.requestAnimationFrame(tick);
      if (nowMs - lastFrameMs < 110) return;
      lastFrameMs = nowMs;

      const t = nowMs * 0.001;
      const stepFrame = Math.floor(t * 1.8);

      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      if (slug === 'bachelor') {
        renderMadridBachelor(ctx, t, stepFrame);
      } else if (slug === 'bachelorette') {
        renderParisBachelorette(ctx, t, stepFrame);
      } else {
        renderCaesareaUnited(ctx, t, stepFrame);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [slug]);

  return (
    <canvas
      ref={canvasRef}
      width={WIDTH}
      height={HEIGHT}
      className="side-quest-canvas"
      role="img"
      aria-label={`Animated pixel-art scene for the ${slug} party`}
    />
  );
}

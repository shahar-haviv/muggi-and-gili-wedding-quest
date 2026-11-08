import * as THREE from 'three';

export interface PixelTextureOptions {
  readonly width: number;
  readonly height: number;
  readonly draw: (context: CanvasRenderingContext2D, width: number, height: number) => void;
  readonly repeat?: readonly [number, number];
}

/**
 * Creates a crisp CanvasTexture with no mipmaps and nearest-neighbour sampling.
 */
export function createPixelTexture({
  width,
  height,
  draw,
  repeat = [1, 1],
}: PixelTextureOptions): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (context) {
    context.imageSmoothingEnabled = false;
    draw(context, width, height);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeat[0], repeat[1]);
  texture.colorSpace = THREE.NoColorSpace;
  texture.needsUpdate = true;

  return texture;
}

/**
 * Deterministic PRNG so the garden looks organic but identical on every visit.
 */
export function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;

  return function nextRandomValue(): number {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

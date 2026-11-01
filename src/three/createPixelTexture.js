import * as THREE from 'three';

/**
 * Creates a crisp CanvasTexture with no mipmaps and nearest-neighbour sampling.
 * Every texture in the scene is intentionally tiny; the pixelation pipeline and
 * the browser's CSS scaling do the rest.
 */
export function createPixelTexture({ width, height, draw, repeat = [1, 1] }) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  context.imageSmoothingEnabled = false;
  draw(context, width, height);

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
export function createSeededRandom(seed) {
  let state = seed >>> 0;

  return function nextRandomValue() {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

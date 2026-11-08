import * as THREE from 'three';

/**
 * Renders the diorama into a tiny offscreen buffer, then upscales it with
 * nearest-neighbour sampling and a 4x4 ordered-dither pass.
 */
export class PixelationPipeline {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly renderTarget: THREE.WebGLRenderTarget;
  private readonly bayerTexture: THREE.DataTexture;
  private readonly postMaterial: THREE.ShaderMaterial;
  private readonly postScene: THREE.Scene;
  private readonly postCamera: THREE.OrthographicCamera;
  private readonly postQuad: THREE.Mesh;

  constructor(
    renderer: THREE.WebGLRenderer,
    { colourLevelCount = 30 }: { readonly colourLevelCount?: number } = {},
  ) {
    this.renderer = renderer;

    this.renderTarget = new THREE.WebGLRenderTarget(1, 1, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
      depthBuffer: true,
      stencilBuffer: false,
    });
    this.renderTarget.texture.colorSpace = THREE.NoColorSpace;
    this.renderTarget.texture.generateMipmaps = false;

    this.bayerTexture = new THREE.DataTexture(
      new Uint8Array([0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]).map((value) =>
        Math.round((value / 16) * 255),
      ),
      4,
      4,
      THREE.RedFormat,
    );
    this.bayerTexture.minFilter = THREE.NearestFilter;
    this.bayerTexture.magFilter = THREE.NearestFilter;
    this.bayerTexture.generateMipmaps = false;
    this.bayerTexture.needsUpdate = true;

    this.postMaterial = new THREE.ShaderMaterial({
      uniforms: {
        sceneTexture: { value: this.renderTarget.texture },
        bayerTexture: { value: this.bayerTexture },
        lowResolution: { value: new THREE.Vector2(1, 1) },
        colourLevelCount: { value: colourLevelCount },
      },
      vertexShader: /* glsl */ `
        varying vec2 textureCoordinate;

        void main() {
          textureCoordinate = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D sceneTexture;
        uniform sampler2D bayerTexture;
        uniform vec2 lowResolution;
        uniform float colourLevelCount;
        varying vec2 textureCoordinate;

        void main() {
          vec2 pixelCell = floor(textureCoordinate * lowResolution);
          vec2 bayerCoordinate = (mod(pixelCell, 4.0) + 0.5) / 4.0;

          float bayerValue = texture2D(bayerTexture, bayerCoordinate).r;
          vec3 sceneColour = texture2D(sceneTexture, textureCoordinate).rgb;

          float ditherOffset = (bayerValue - 0.5) * 1.2;
          vec3 ditheredColour = sceneColour + ditherOffset / colourLevelCount;
          vec3 quantisedColour =
            floor(ditheredColour * colourLevelCount + 0.5) / colourLevelCount;

          float vignette = smoothstep(0.87, 0.32, distance(textureCoordinate, vec2(0.5)));
          quantisedColour *= mix(0.79, 1.0, vignette);

          gl_FragColor = vec4(clamp(quantisedColour, 0.0, 1.0), 1.0);
        }
      `,
      depthTest: false,
      depthWrite: false,
    });

    this.postScene = new THREE.Scene();
    this.postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.postQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.postMaterial);
    this.postQuad.frustumCulled = false;
    this.postScene.add(this.postQuad);
  }

  setSize(width: number, height: number): void {
    this.renderTarget.setSize(width, height);
    (this.postMaterial.uniforms.lowResolution.value as THREE.Vector2).set(width, height);
  }

  render(scene: THREE.Scene, camera: THREE.Camera): void {
    this.renderer.setRenderTarget(this.renderTarget);
    this.renderer.clear(true, true, true);
    this.renderer.render(scene, camera);

    this.renderer.setRenderTarget(null);
    this.renderer.render(this.postScene, this.postCamera);
  }

  dispose(): void {
    this.renderTarget.dispose();
    this.bayerTexture.dispose();
    this.postMaterial.dispose();
    this.postQuad.geometry.dispose();
  }
}

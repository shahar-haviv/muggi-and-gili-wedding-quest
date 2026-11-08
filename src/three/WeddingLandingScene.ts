import * as THREE from 'three';
import { buildWeddingDiorama, type WeddingDioramaHandle } from './buildWeddingDiorama.ts';
import { PixelationPipeline } from './PixelationPipeline.ts';
import { PIXEL_PALETTE } from './pixelPalette.ts';

THREE.ColorManagement.enabled = false;

const BASE_AZIMUTH = Math.PI / 4;
const BASE_ELEVATION = 0.72;
const CAMERA_DISTANCE = 28;

export interface WeddingLandingSceneOptions {
  readonly canvas: HTMLCanvasElement;
  readonly onCelebration?: () => void;
  readonly onReady?: () => void;
}

/**
 * Owns the canvas, the orthographic camera, the low-resolution pixelation pass,
 * and the pointer interactions.
 */
export class WeddingLandingScene {
  private readonly canvas: HTMLCanvasElement;
  private readonly container: HTMLElement;
  private readonly onCelebration: () => void;
  private readonly onReady: () => void;
  private readonly reducedMotionMediaQuery: MediaQueryList;
  private reducedMotion: boolean;
  private readonly isCompactViewport: boolean;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.OrthographicCamera;
  private readonly cameraTarget: THREE.Vector3;
  private currentAzimuth: number = BASE_AZIMUTH;
  private currentElevation: number = BASE_ELEVATION;
  private targetAzimuthOffset: number = 0;
  private targetElevationOffset: number = 0;
  private readonly diorama: WeddingDioramaHandle;
  private readonly pipeline: PixelationPipeline;
  private elapsedSeconds: number = 0;
  private lastFrameTimestamp: number = 0;
  private celebrationEnergy: number = 0;
  private lastCelebrationTimestamp: number = 0;
  private isRunning: boolean = false;
  private isHeroVisible: boolean = true;
  private isDisposed: boolean = false;
  private hasRenderedFirstFrame: boolean = false;
  private lowResolutionWidth: number = 1;
  private lowResolutionHeight: number = 1;
  private cssAspect: number = 1;
  private isPointerDown: boolean = false;
  private pointerStartX: number = 0;
  private pointerStartY: number = 0;
  private dragStartAzimuth: number = 0;
  private dragStartElevation: number = 0;
  private pointerHasMoved: boolean = false;
  private pointerDownTimestamp: number = 0;
  private animationFrameRequest: number | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private intersectionObserver: IntersectionObserver | null = null;

  constructor({
    canvas,
    onCelebration = () => {},
    onReady = () => {},
  }: WeddingLandingSceneOptions) {
    this.canvas = canvas;
    this.container = canvas.parentElement ?? document.body;
    this.onCelebration = onCelebration;
    this.onReady = onReady;

    this.reducedMotionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.reducedMotion = this.reducedMotionMediaQuery.matches;
    this.isCompactViewport = window.innerWidth < 720;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
      stencil: false,
    });
    this.renderer.setPixelRatio(1);
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    this.renderer.toneMapping = THREE.NoToneMapping;
    this.renderer.setClearColor(PIXEL_PALETTE.skyTop, 1);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(PIXEL_PALETTE.skyTop);
    this.scene.fog = new THREE.Fog(0x1a0f2e, 34, 70);

    this.addLighting();

    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 90);
    this.cameraTarget = new THREE.Vector3(0, 2.6, 0);

    this.diorama = buildWeddingDiorama({
      scene: this.scene,
      isCompactViewport: this.isCompactViewport,
      reducedMotion: this.reducedMotion,
    });

    this.pipeline = new PixelationPipeline(this.renderer);

    this.handleResize = this.handleResize.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.handlePointerCancel = this.handlePointerCancel.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handleReducedMotionChange = this.handleReducedMotionChange.bind(this);
    this.handleContextLost = this.handleContextLost.bind(this);
    this.renderFrame = this.renderFrame.bind(this);

    this.attachInputListeners();
    this.attachObservers();
    this.handleResize();
    this.updateCamera(0.016, 0);
    this.syncAnimationState();
  }

  private addLighting(): void {
    const hemisphereLight = new THREE.HemisphereLight(0xb89cff, 0x241426, 1.55);
    this.scene.add(hemisphereLight);

    const warmKeyLight = new THREE.DirectionalLight(0xffe3b8, 1.9);
    warmKeyLight.position.set(11, 16, 9);
    this.scene.add(warmKeyLight);

    const coolRimLight = new THREE.DirectionalLight(0x7f6bff, 0.8);
    coolRimLight.position.set(-9, 7, -11);
    this.scene.add(coolRimLight);
  }

  private attachInputListeners(): void {
    this.canvas.addEventListener('pointerdown', this.handlePointerDown, { passive: true });
    this.canvas.addEventListener('pointermove', this.handlePointerMove, { passive: true });
    this.canvas.addEventListener('pointerup', this.handlePointerUp, { passive: true });
    this.canvas.addEventListener('pointercancel', this.handlePointerCancel, { passive: true });
    this.canvas.addEventListener('webglcontextlost', this.handleContextLost, false);
  }

  private attachObservers(): void {
    this.resizeObserver = new ResizeObserver(this.handleResize);
    this.resizeObserver.observe(this.container);

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        this.isHeroVisible = entries.some((entry) => entry.isIntersecting);
        this.syncAnimationState();
      },
      { threshold: 0.01 },
    );
    this.intersectionObserver.observe(this.container);

    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    this.reducedMotionMediaQuery.addEventListener('change', this.handleReducedMotionChange);
  }

  private handleResize(): void {
    if (this.isDisposed) return;

    const containerBounds = this.container.getBoundingClientRect();
    const cssWidth = Math.max(320, Math.round(containerBounds.width || window.innerWidth));
    const cssHeight = Math.max(
      420,
      Math.round(containerBounds.height || window.innerHeight),
    );
    const cssAspect = cssWidth / cssHeight;

    const desktopColumnCount = Math.min(380, Math.max(260, Math.round(cssWidth / 4)));
    const targetColumnCount = cssWidth < 640 ? 200 : desktopColumnCount;
    const lowResolutionWidth = Math.max(160, targetColumnCount);
    const lowResolutionHeight = Math.max(
      160,
      Math.round(lowResolutionWidth / cssAspect),
    );

    if (
      lowResolutionWidth === this.lowResolutionWidth &&
      lowResolutionHeight === this.lowResolutionHeight &&
      this.cssAspect === cssAspect
    ) {
      return;
    }

    this.cssAspect = cssAspect;
    this.lowResolutionWidth = lowResolutionWidth;
    this.lowResolutionHeight = lowResolutionHeight;

    this.renderer.setSize(lowResolutionWidth, lowResolutionHeight, false);
    this.pipeline.setSize(lowResolutionWidth, lowResolutionHeight);
    this.configureCameraProjection(cssAspect);
  }

  private configureCameraProjection(cssAspect: number): void {
    const targetVisibleWidth = cssAspect < 0.8 ? 9.4 : cssAspect < 1.3 ? 13.2 : 16.2;
    const visibleHeight = targetVisibleWidth / cssAspect;
    const halfVisibleHeight = visibleHeight / 2;
    const halfVisibleWidth = (visibleHeight * cssAspect) / 2;

    this.camera.left = -halfVisibleWidth;
    this.camera.right = halfVisibleWidth;
    this.camera.top = halfVisibleHeight;
    this.camera.bottom = -halfVisibleHeight;
    this.camera.updateProjectionMatrix();

    this.cameraTarget.y = cssAspect < 0.8 ? 3.3 : 2.6;
  }

  private handlePointerDown(event: PointerEvent): void {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    this.isPointerDown = true;
    this.pointerStartX = event.clientX;
    this.pointerStartY = event.clientY;
    this.dragStartAzimuth = this.targetAzimuthOffset;
    this.dragStartElevation = this.targetElevationOffset;
    this.pointerHasMoved = false;
    this.pointerDownTimestamp = performance.now();

    try {
      this.canvas.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture can fail on older mobile browsers; dragging still works.
    }
  }

  private handlePointerMove(event: PointerEvent): void {
    if (!this.isPointerDown) return;

    const deltaX = event.clientX - this.pointerStartX;
    const deltaY = event.clientY - this.pointerStartY;

    if (Math.hypot(deltaX, deltaY) > 6) {
      this.pointerHasMoved = true;
    }

    if (event.pointerType === 'touch' && Math.abs(deltaX) < Math.abs(deltaY)) {
      return;
    }

    this.targetAzimuthOffset = THREE.MathUtils.clamp(
      this.dragStartAzimuth - deltaX * 0.0055,
      -0.62,
      0.62,
    );

    if (event.pointerType !== 'touch') {
      this.targetElevationOffset = THREE.MathUtils.clamp(
        this.dragStartElevation + deltaY * 0.0028,
        -0.17,
        0.19,
      );
    }
  }

  private handlePointerUp(event: PointerEvent): void {
    if (!this.isPointerDown) return;

    const tapWasQuick = performance.now() - this.pointerDownTimestamp < 520;
    const shouldCelebrate = !this.pointerHasMoved && tapWasQuick;

    this.isPointerDown = false;

    try {
      if (this.canvas.hasPointerCapture(event.pointerId)) {
        this.canvas.releasePointerCapture(event.pointerId);
      }
    } catch {
      // Nothing to release.
    }

    if (shouldCelebrate) {
      this.celebrate();
    }
  }

  private handlePointerCancel(): void {
    this.isPointerDown = false;
    this.pointerHasMoved = false;
  }

  celebrate({ emitSound = true }: { readonly emitSound?: boolean } = {}): void {
    const now = performance.now();
    if (now - this.lastCelebrationTimestamp < 180) return;
    this.lastCelebrationTimestamp = now;

    this.celebrationEnergy = 1;
    this.diorama.triggerCelebration();

    if (emitSound) {
      this.onCelebration();
    }
  }

  private handleVisibilityChange(): void {
    this.syncAnimationState();
  }

  private handleReducedMotionChange(event: MediaQueryListEvent): void {
    this.reducedMotion = event.matches;
  }

  private handleContextLost(event: Event): void {
    event.preventDefault();
    this.stop();
    this.container.closest('.landing-hero')?.classList.add('landing-hero--no-webgl');
  }

  private syncAnimationState(): void {
    const shouldAnimate = this.isHeroVisible && !document.hidden && !this.isDisposed;

    if (shouldAnimate && !this.isRunning) {
      this.start();
    } else if (!shouldAnimate && this.isRunning) {
      this.stop();
    }
  }

  start(): void {
    if (this.isRunning || this.isDisposed) return;
    this.isRunning = true;
    this.lastFrameTimestamp = performance.now();
    this.renderFrame();
  }

  stop(): void {
    this.isRunning = false;
    if (this.animationFrameRequest !== null) {
      cancelAnimationFrame(this.animationFrameRequest);
      this.animationFrameRequest = null;
    }
  }

  private updateCamera(deltaSeconds: number, elapsedSeconds: number): void {
    const idleAzimuth = this.reducedMotion ? 0 : Math.sin(elapsedSeconds * 0.11) * 0.035;
    const idleElevation = this.reducedMotion ? 0 : Math.sin(elapsedSeconds * 0.08) * 0.018;

    const desiredAzimuth = BASE_AZIMUTH + this.targetAzimuthOffset + idleAzimuth;
    const desiredElevation = BASE_ELEVATION + this.targetElevationOffset + idleElevation;
    const smoothing = 1 - Math.pow(0.0015, Math.min(deltaSeconds, 0.06));

    this.currentAzimuth += (desiredAzimuth - this.currentAzimuth) * smoothing;
    this.currentElevation += (desiredElevation - this.currentElevation) * smoothing;

    const horizontalDistance = Math.cos(this.currentElevation) * CAMERA_DISTANCE;

    this.camera.position.set(
      this.cameraTarget.x + Math.sin(this.currentAzimuth) * horizontalDistance,
      this.cameraTarget.y + Math.sin(this.currentElevation) * CAMERA_DISTANCE,
      this.cameraTarget.z + Math.cos(this.currentAzimuth) * horizontalDistance,
    );
    this.camera.lookAt(this.cameraTarget);
  }

  private renderFrame(): void {
    if (!this.isRunning) return;

    const frameTimestamp = performance.now();
    const rawElapsedMs = frameTimestamp - this.lastFrameTimestamp;
    const isActivelyInteracting =
      this.isPointerDown ||
      this.celebrationEnergy > 0.01 ||
      Math.abs(BASE_AZIMUTH + this.targetAzimuthOffset - this.currentAzimuth) > 0.01 ||
      Math.abs(BASE_ELEVATION + this.targetElevationOffset - this.currentElevation) > 0.01;

    if (this.hasRenderedFirstFrame && !isActivelyInteracting && rawElapsedMs < 31) {
      this.animationFrameRequest = requestAnimationFrame(this.renderFrame);
      return;
    }

    const deltaSeconds = Math.min(rawElapsedMs / 1000, 0.05);
    this.lastFrameTimestamp = frameTimestamp;
    this.elapsedSeconds += deltaSeconds;
    this.celebrationEnergy = Math.max(0, this.celebrationEnergy - deltaSeconds * 0.85);

    this.updateCamera(deltaSeconds, this.elapsedSeconds);
    this.diorama.update(deltaSeconds, this.elapsedSeconds, this.celebrationEnergy);
    this.pipeline.render(this.scene, this.camera);

    if (!this.hasRenderedFirstFrame) {
      this.hasRenderedFirstFrame = true;
      this.onReady();
    }

    this.animationFrameRequest = requestAnimationFrame(this.renderFrame);
  }

  dispose(): void {
    if (this.isDisposed) return;
    this.isDisposed = true;
    this.stop();

    this.canvas.removeEventListener('pointerdown', this.handlePointerDown);
    this.canvas.removeEventListener('pointermove', this.handlePointerMove);
    this.canvas.removeEventListener('pointerup', this.handlePointerUp);
    this.canvas.removeEventListener('pointercancel', this.handlePointerCancel);
    this.canvas.removeEventListener('webglcontextlost', this.handleContextLost);

    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    this.reducedMotionMediaQuery.removeEventListener('change', this.handleReducedMotionChange);

    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();

    this.diorama.dispose();
    this.pipeline.dispose();
    this.renderer.dispose();
  }
}

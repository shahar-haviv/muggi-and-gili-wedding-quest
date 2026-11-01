import * as THREE from 'three';
import { buildWeddingDiorama } from './buildWeddingDiorama.js';
import { PixelationPipeline } from './PixelationPipeline.js';
import { PIXEL_PALETTE } from './pixelPalette.js';

// The whole experience is hand-tuned for raw, unmanaged colours. Disabling
// Three.js colour management keeps the 16-bit palette exactly as authored.
THREE.ColorManagement.enabled = false;

const BASE_AZIMUTH = Math.PI / 4;
const BASE_ELEVATION = 0.72;
const CAMERA_DISTANCE = 28;

/**
 * Owns the canvas, the orthographic camera, the low-resolution pixelation pass,
 * and the pointer interactions. The actual scenery lives in buildWeddingDiorama.
 */
export class WeddingLandingScene {
  constructor({ canvas, onCelebration = () => {}, onReady = () => {} }) {
    this.canvas = canvas;
    this.container = canvas.parentElement;
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
    this.currentAzimuth = BASE_AZIMUTH;
    this.currentElevation = BASE_ELEVATION;
    this.targetAzimuthOffset = 0;
    this.targetElevationOffset = 0;

    this.diorama = buildWeddingDiorama({
      scene: this.scene,
      isCompactViewport: this.isCompactViewport,
      reducedMotion: this.reducedMotion,
    });

    this.pipeline = new PixelationPipeline(this.renderer);

    this.elapsedSeconds = 0;
    this.lastFrameTimestamp = 0;
    this.celebrationEnergy = 0;
    this.lastCelebrationTimestamp = 0;
    this.isRunning = false;
    this.isHeroVisible = true;
    this.isDisposed = false;
    this.hasRenderedFirstFrame = false;
    this.lowResolutionWidth = 1;
    this.lowResolutionHeight = 1;

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

  addLighting() {
    const hemisphereLight = new THREE.HemisphereLight(0xb89cff, 0x241426, 1.55);
    this.scene.add(hemisphereLight);

    const warmKeyLight = new THREE.DirectionalLight(0xffe3b8, 1.9);
    warmKeyLight.position.set(11, 16, 9);
    this.scene.add(warmKeyLight);

    const coolRimLight = new THREE.DirectionalLight(0x7f6bff, 0.8);
    coolRimLight.position.set(-9, 7, -11);
    this.scene.add(coolRimLight);
  }

  attachInputListeners() {
    this.canvas.addEventListener('pointerdown', this.handlePointerDown, { passive: true });
    this.canvas.addEventListener('pointermove', this.handlePointerMove, { passive: true });
    this.canvas.addEventListener('pointerup', this.handlePointerUp, { passive: true });
    this.canvas.addEventListener('pointercancel', this.handlePointerCancel, { passive: true });
    this.canvas.addEventListener('webglcontextlost', this.handleContextLost, false);
  }

  attachObservers() {
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

    if (this.reducedMotionMediaQuery.addEventListener) {
      this.reducedMotionMediaQuery.addEventListener('change', this.handleReducedMotionChange);
    } else {
      this.reducedMotionMediaQuery.addListener(this.handleReducedMotionChange);
    }
  }

  handleResize() {
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

    this.cssAspect = cssAspect;
    this.lowResolutionWidth = lowResolutionWidth;
    this.lowResolutionHeight = lowResolutionHeight;

    this.renderer.setSize(lowResolutionWidth, lowResolutionHeight, false);
    this.pipeline.setSize(lowResolutionWidth, lowResolutionHeight);
    this.configureCameraProjection(cssAspect);
  }

  configureCameraProjection(cssAspect) {
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

  handlePointerDown(event) {
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

  handlePointerMove(event) {
    if (!this.isPointerDown) return;

    const deltaX = event.clientX - this.pointerStartX;
    const deltaY = event.clientY - this.pointerStartY;

    if (Math.hypot(deltaX, deltaY) > 6) {
      this.pointerHasMoved = true;
    }

    // Vertical swipes belong to the page scroll on touch devices.
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

  handlePointerUp(event) {
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

  handlePointerCancel() {
    this.isPointerDown = false;
    this.pointerHasMoved = false;
  }

  celebrate() {
    const now = performance.now();
    if (now - this.lastCelebrationTimestamp < 180) return;
    this.lastCelebrationTimestamp = now;

    this.celebrationEnergy = 1;
    this.diorama.triggerCelebration();
    this.onCelebration();
  }

  handleVisibilityChange() {
    this.syncAnimationState();
  }

  handleReducedMotionChange(event) {
    this.reducedMotion = event.matches;
  }

  handleContextLost(event) {
    event.preventDefault();
    this.stop();
    this.container.closest('.landing-hero')?.classList.add('landing-hero--no-webgl');
  }

  syncAnimationState() {
    const shouldAnimate = this.isHeroVisible && !document.hidden && !this.isDisposed;

    if (shouldAnimate && !this.isRunning) {
      this.start();
    } else if (!shouldAnimate && this.isRunning) {
      this.stop();
    }
  }

  start() {
    if (this.isRunning || this.isDisposed) return;
    this.isRunning = true;
    this.lastFrameTimestamp = performance.now();
    this.renderFrame();
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameRequest) {
      cancelAnimationFrame(this.animationFrameRequest);
      this.animationFrameRequest = null;
    }
  }

  updateCamera(deltaSeconds, elapsedSeconds) {
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

  renderFrame() {
    if (!this.isRunning) return;

    const frameTimestamp = performance.now();
    const deltaSeconds = Math.min(
      (frameTimestamp - this.lastFrameTimestamp) / 1000,
      0.05,
    );
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

  dispose() {
    if (this.isDisposed) return;
    this.isDisposed = true;
    this.stop();

    this.canvas.removeEventListener('pointerdown', this.handlePointerDown);
    this.canvas.removeEventListener('pointermove', this.handlePointerMove);
    this.canvas.removeEventListener('pointerup', this.handlePointerUp);
    this.canvas.removeEventListener('pointercancel', this.handlePointerCancel);
    this.canvas.removeEventListener('webglcontextlost', this.handleContextLost);

    document.removeEventListener('visibilitychange', this.handleVisibilityChange);

    if (this.reducedMotionMediaQuery.removeEventListener) {
      this.reducedMotionMediaQuery.removeEventListener('change', this.handleReducedMotionChange);
    } else {
      this.reducedMotionMediaQuery.removeListener(this.handleReducedMotionChange);
    }

    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();

    this.diorama.dispose();
    this.pipeline.dispose();
    this.renderer.dispose();
  }
}

import './styles/index.css';
import { PixelSoundEngine } from './audio/PixelSoundEngine.js';
import { WeddingCountdown } from './components/WeddingCountdown.js';
import { WEDDING_DETAILS } from './data/weddingDetails.js';
import { WeddingLandingScene } from './three/WeddingLandingScene.js';

/**
 * Page-level chrome and the single Three.js experience live here. Feature
 * modules (timeline, venue guide, RSVP) are mounted from this entry point.
 */
const SOUND_PREFERENCE_KEY = 'shahar-liza-sound-enabled';

const siteHeader = document.querySelector('[data-site-header]');
const bootScreen = document.querySelector('#boot-screen');
const landingHero = document.querySelector('#landing-hero');
const landingCanvas = document.querySelector('#wedding-landing-canvas');
const startQuestButton = document.querySelector('#start-quest-button');
const soundToggleButton = document.querySelector('#sound-toggle-button');
const soundToggleLabel = document.querySelector('.sound-toggle__label');
const countdownRoot = document.querySelector('#wedding-countdown');
const reducedMotionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

let weddingLandingScene = null;

const pixelSoundEngine = new PixelSoundEngine({
  enabled: readSoundPreference(),
});

function readSoundPreference() {
  try {
    return window.localStorage.getItem(SOUND_PREFERENCE_KEY) === 'true';
  } catch {
    return false;
  }
}

function writeSoundPreference(isEnabled) {
  try {
    window.localStorage.setItem(SOUND_PREFERENCE_KEY, String(isEnabled));
  } catch {
    // The site works fine without persistent preferences.
  }
}

function syncSoundToggle() {
  const isEnabled = pixelSoundEngine.enabled;

  soundToggleButton?.setAttribute('aria-pressed', String(isEnabled));
  soundToggleButton?.setAttribute(
    'aria-label',
    isEnabled
      ? 'Disable 8-bit sound effects and music'
      : 'Enable 8-bit sound effects and music',
  );

  if (soundToggleLabel) {
    soundToggleLabel.textContent = isEnabled ? 'SFX ON' : 'SFX OFF';
  }
}

function handleSoundToggle() {
  const nextEnabledState = !pixelSoundEngine.enabled;

  if (!nextEnabledState) {
    pixelSoundEngine.playUiClick();
  }

  const appliedState = pixelSoundEngine.setEnabled(nextEnabledState);
  writeSoundPreference(appliedState);

  if (appliedState) {
    pixelSoundEngine.playJingle();
  }

  syncSoundToggle();
}

function updateHeaderOnScroll() {
  const hasScrolledPastTitle = window.scrollY > 24;
  siteHeader?.classList.toggle('is-condensed', hasScrolledPastTitle);
}

function dismissBootScreen() {
  bootScreen?.classList.add('is-dismissed');
}

function showStaticLandingFallback() {
  landingHero?.classList.add('landing-hero--no-webgl');
  dismissBootScreen();
}

function initializeWeddingLandingScene() {
  if (!landingCanvas) return null;

  try {
    weddingLandingScene = new WeddingLandingScene({
      canvas: landingCanvas,
      onReady: dismissBootScreen,
      onCelebration: () => pixelSoundEngine.playCelebration(),
    });

    if (import.meta.env.DEV) {
      window.__weddingScene = weddingLandingScene;
    }
  } catch (error) {
    console.warn('The pixel diorama could not start; showing the static fallback.', error);
    showStaticLandingFallback();
  }

  return weddingLandingScene;
}

function handleStartQuest() {
  pixelSoundEngine.playJingle();
  weddingLandingScene?.celebrate({ emitSound: false });

  countdownRoot?.scrollIntoView({
    behavior: reducedMotionMediaQuery.matches ? 'auto' : 'smooth',
    block: 'center',
  });
}

syncSoundToggle();
soundToggleButton?.addEventListener('click', handleSoundToggle);
startQuestButton?.addEventListener('click', handleStartQuest);

updateHeaderOnScroll();
window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
window.addEventListener('load', dismissBootScreen, { once: true });
window.setTimeout(dismissBootScreen, 3000);

new WeddingCountdown({
  root: countdownRoot,
  targetDateIso: WEDDING_DETAILS.weddingDateIso,
});

initializeWeddingLandingScene();

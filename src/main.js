import './styles/index.css';
import { WeddingLandingScene } from './three/WeddingLandingScene.js';

/**
 * Page-level chrome and the single Three.js experience live here. Feature
 * modules (timeline, venue guide, RSVP) are mounted from this entry point.
 */
const siteHeader = document.querySelector('[data-site-header]');
const bootScreen = document.querySelector('#boot-screen');
const landingHero = document.querySelector('#landing-hero');
const landingCanvas = document.querySelector('#wedding-landing-canvas');

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
  if (!landingCanvas) return;

  try {
    const weddingScene = new WeddingLandingScene({
      canvas: landingCanvas,
      onReady: dismissBootScreen,
      onCelebration: () => {
        // The chiptune sound engine is wired in the next feature step.
      },
    });

    if (import.meta.env.DEV) {
      window.__weddingScene = weddingScene;
    }
  } catch (error) {
    console.warn('The pixel diorama could not start; showing the static fallback.', error);
    showStaticLandingFallback();
  }
}

updateHeaderOnScroll();
window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
window.addEventListener('load', dismissBootScreen, { once: true });
window.setTimeout(dismissBootScreen, 3000);

initializeWeddingLandingScene();

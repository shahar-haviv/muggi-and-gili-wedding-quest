import './styles/index.css';

/**
 * Small, page-level chrome that is independent of the Three.js scene.
 * Feature modules are mounted from here as the experience grows.
 */
const siteHeader = document.querySelector('[data-site-header]');
const bootScreen = document.querySelector('#boot-screen');

function updateHeaderOnScroll() {
  const hasScrolledPastTitle = window.scrollY > 24;
  siteHeader?.classList.toggle('is-condensed', hasScrolledPastTitle);
}

function dismissBootScreen() {
  bootScreen?.classList.add('is-dismissed');
}

updateHeaderOnScroll();
window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
window.addEventListener('load', dismissBootScreen, { once: true });

import { useEffect, useRef, useState } from 'preact/hooks';
import type { WeddingDetails } from '../../types/wedding.ts';
import type { WeddingLandingScene } from '../../three/WeddingLandingScene.ts';
import { PixelHeartIcon } from '../common/PixelHeartIcon.tsx';

interface LandingHeroProps {
  readonly details: WeddingDetails;
  readonly onCelebrationSound: () => void;
  readonly onStartQuestSound: () => void;
}

declare global {
  interface Window {
    __weddingScene?: WeddingLandingScene;
  }
}

/**
 * Renders the pixel-art Three.js title screen and manages the WebGL lifecycle
 * so GPU resources are cleanly disposed when navigating to a Side Quest route.
 */
export function LandingHero({
  details,
  onCelebrationSound,
  onStartQuestSound,
}: LandingHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<WeddingLandingScene | null>(null);
  const [isBootDismissed, setIsBootDismissed] = useState(false);
  const [isWebglFallback, setIsWebglFallback] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    let bootTimeoutId = window.setTimeout(() => {
      if (!isCancelled) setIsBootDismissed(true);
    }, 2800);

    const rafId = window.requestAnimationFrame(() => {
      window.setTimeout(async () => {
        if (isCancelled || !canvasRef.current) return;

        try {
          const { WeddingLandingScene } = await import('../../three/WeddingLandingScene.ts');
          if (isCancelled || !canvasRef.current) return;

          const sceneInstance = new WeddingLandingScene({
            canvas: canvasRef.current,
            onReady: () => {
              if (!isCancelled) {
                window.requestAnimationFrame(() => setIsBootDismissed(true));
              }
            },
            onCelebration: onCelebrationSound,
          });

          sceneRef.current = sceneInstance;
          if (import.meta.env.DEV) {
            window.__weddingScene = sceneInstance;
          }
        } catch (error) {
          console.warn('The pixel diorama could not start; showing the static fallback.', error);
          if (!isCancelled) {
            setIsWebglFallback(true);
            setIsBootDismissed(true);
          }
        }
      }, 0);
    });

    return () => {
      isCancelled = true;
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(bootTimeoutId);
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, [onCelebrationSound]);

  const handleStartQuest = () => {
    onStartQuestSound();
    sceneRef.current?.celebrate({ emitSound: false });

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelector('#wedding-countdown')?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'center',
    });
  };

  return (
    <section
      className={`landing-hero${isWebglFallback ? ' landing-hero--no-webgl' : ''}`}
      id="landing-hero"
      aria-labelledby="wedding-title"
    >
      <div className="landing-hero__canvas-wrap">
        <canvas
          ref={canvasRef}
          id="wedding-landing-canvas"
          className="landing-hero__canvas"
          role="img"
          aria-label="A pixel-art wedding scene at dusk: a chuppah, a glowing dance floor, guests, trees, and string lights."
        />
        <div className="landing-hero__webgl-fallback" id="webgl-fallback" aria-hidden="true" />
      </div>
      <div className="landing-hero__atmosphere" aria-hidden="true" />
      <div className="landing-hero__scanlines" aria-hidden="true" />

      <div className="landing-hero__content">
        <div className="landing-hero__crest" aria-hidden="true">
          <PixelHeartIcon className="pixel-heart-icon pixel-heart-icon--hero" />
        </div>

        <p className="landing-hero__kicker">A WEDDING QUEST IN 8 BITS</p>

        <h1
          className="wedding-title"
          id="wedding-title"
          aria-label={`${details.couple.partnerOne} and ${details.couple.partnerTwo}`}
        >
          <span className="wedding-title__name" aria-hidden="true">
            {details.couple.partnerOne.toUpperCase()}
          </span>
          <span className="wedding-title__ampersand" aria-hidden="true">
            &amp;
          </span>
          <span className="wedding-title__name" aria-hidden="true">
            {details.couple.partnerTwo.toUpperCase()}
          </span>
        </h1>

        <div className="landing-hero__details">
          <p className="landing-hero__date">
            <span>{details.weddingDayLabel}</span>
            <span className="landing-hero__date-dot" aria-hidden="true">
              ◆
            </span>
            <time dateTime="2027-05-19">{details.weddingDateDisplay}</time>
          </p>
          <p className="landing-hero__venue">
            {details.venue.name.toUpperCase()} · {details.venue.city.toUpperCase()}
          </p>
        </div>

        <div className="landing-hero__actions">
          <button
            className="pixel-button pixel-button--primary"
            id="start-quest-button"
            type="button"
            onClick={handleStartQuest}
          >
            PRESS START
          </button>
          <a className="pixel-button pixel-button--ghost" href="#rsvp">
            RSVP NOW
          </a>
        </div>

        <p className="landing-hero__hint">DRAG THE SCENE · TAP FOR CONFETTI</p>
      </div>

      <a className="landing-hero__scroll-cue" href="#wedding-countdown">
        <span>SCROLL TO CONTINUE</span>
        <span className="landing-hero__scroll-arrow" aria-hidden="true">
          ▼
        </span>
      </a>

      <div className="landing-hero__ticker" aria-hidden="true">
        <div className="landing-hero__ticker-track">
          {[0, 1].map((groupIndex) => (
            <div className="landing-hero__ticker-group" key={groupIndex}>
              {details.tickerMessages.map((msg) => (
                <span key={msg}>★ {msg}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div
        className={`boot-screen${isBootDismissed ? ' is-dismissed' : ''}`}
        id="boot-screen"
        aria-hidden="true"
      >
        <p className="boot-screen__title">LOADING LOVE...</p>
        <div className="boot-screen__track">
          <span className="boot-screen__bar" />
        </div>
        <p className="boot-screen__hint">INSERT COIN</p>
      </div>
    </section>
  );
}

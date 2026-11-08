import { useCallback, useEffect, useState } from 'preact/hooks';
import { PixelHeartIcon } from '../components/common/PixelHeartIcon.tsx';
import { LoveGameDioramaSvg } from '../components/lovegame/LoveGameDioramaSvg.tsx';
import { LOVE_GAME_CHAPTERS } from '../data/loveGameChapters.ts';
import type { AppRoutePath } from '../types/wedding.ts';

interface LoveGamePageProps {
  readonly onNavigate: (target: AppRoutePath, options?: { readonly hash?: string }) => void;
  readonly onStageAdvanceSound: () => void;
  readonly onCelebrationSound: () => void;
}

const CHAPTER_SHORT_LABELS: readonly string[] = [
  'FEAST',
  'ALLIANCE',
  'DRAGONS',
  'REUNION',
  'NORTH KEEP',
  'KING GEORGE',
  'MASARYK',
];

/**
 * Interactive 8-bit/16-bit Medieval RPG screen ("Play the Love Game") at `/love-game`.
 * Animates the 9-year story of Sir Muggi & Lady Gili across 7 playable chapters.
 */
export function LoveGamePage({
  onNavigate,
  onStageAdvanceSound,
  onCelebrationSound,
}: LoveGamePageProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [unlockedChapters, setUnlockedChapters] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const chapter = LOVE_GAME_CHAPTERS[activeIndex];
  const isActionActive = unlockedChapters.has(chapter.id);
  const totalChapters = LOVE_GAME_CHAPTERS.length;
  const progressPercent = Math.round(((activeIndex + 1) / totalChapters) * 100);

  const selectChapter = useCallback(
    (nextIndex: number) => {
      const clamped = Math.max(0, Math.min(totalChapters - 1, nextIndex));
      if (clamped !== activeIndex) {
        setActiveIndex(clamped);
        onStageAdvanceSound();
      }
    },
    [activeIndex, onStageAdvanceSound, totalChapters],
  );

  const handleTriggerAction = useCallback(() => {
    onCelebrationSound();
    setUnlockedChapters((prev) => {
      const next = new Set(prev);
      next.add(chapter.id);
      return next;
    });
  }, [chapter.id, onCelebrationSound]);

  // Keyboard navigation (Left / Right arrows)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        selectChapter(activeIndex + 1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        selectChapter(activeIndex - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, selectChapter]);

  // Optional Auto-Play cinema mode
  useEffect(() => {
    if (!isAutoPlaying) return undefined;

    const actionTimer = window.setTimeout(() => {
      handleTriggerAction();
    }, 1400);

    const advanceTimer = window.setTimeout(() => {
      if (activeIndex < totalChapters - 1) {
        selectChapter(activeIndex + 1);
      } else {
        setIsAutoPlaying(false);
      }
    }, 5200);

    return () => {
      window.clearTimeout(actionTimer);
      window.clearTimeout(advanceTimer);
    };
  }, [activeIndex, handleTriggerAction, isAutoPlaying, selectChapter, totalChapters]);

  return (
    <div className={`love-game-page love-game-page--${chapter.accent}`} id="love-game-top">
      <section className="love-game-hero" aria-labelledby="love-game-heading">
        <div className="content-section__inner love-game-container">
          {/* Top Navigation & Auto-Play Bar */}
          <div className="love-game-topbar">
            <a
              href="/"
              className="pixel-button pixel-button--tiny pixel-button--ghost"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/');
              }}
            >
              &lt; BACK TO WEDDING
            </a>

            <div className="love-game-topbar__hud">
              <span className="love-game-topbar__xp-label">
                CHAPTER {chapter.chapterNumber} / 0{totalChapters}
              </span>
              <div className="love-game-topbar__xp-track" aria-hidden="true">
                <span
                  className="love-game-topbar__xp-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <button
              type="button"
              className={`pixel-button pixel-button--tiny ${
                isAutoPlaying ? 'pixel-button--primary' : 'pixel-button--ghost'
              }`}
              aria-pressed={isAutoPlaying ? 'true' : 'false'}
              onClick={() => setIsAutoPlaying((prev) => !prev)}
            >
              {isAutoPlaying ? '❚❚ PAUSE STORY' : '▶ AUTO-PLAY STORY'}
            </button>
          </div>

          {/* Game Title Header */}
          <header className="love-game-header">
            <p className="love-game-header__eyebrow">
              <PixelHeartIcon /> THE MEDIEVAL REALM CHRONICLES OF MUGGI &amp; GILI
            </p>
            <h1 className="love-game-header__title" id="love-game-heading">
              PLAY THE LOVE GAME
            </h1>
          </header>

          {/* 7-Chapter Map Selector Strip */}
          <nav className="love-game-map-strip" aria-label="Story chapters">
            {LOVE_GAME_CHAPTERS.map((item, idx) => {
              const isCurrent = idx === activeIndex;
              const isCompleted = unlockedChapters.has(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`love-game-map-node${isCurrent ? ' is-active' : ''}${
                    isCompleted ? ' is-completed' : ''
                  }`}
                  aria-current={isCurrent ? 'step' : undefined}
                  onClick={() => selectChapter(idx)}
                >
                  <span className="love-game-map-node__num">{item.chapterNumber}</span>
                  <span className="love-game-map-node__label">{CHAPTER_SHORT_LABELS[idx]}</span>
                </button>
              );
            })}
          </nav>

          {/* Main RPG Stage Screen */}
          <article className="love-game-stage pixel-frame" aria-live="polite">
            <div className="love-game-stage__hud">
              <span className="love-game-stage__era">{chapter.eraLabel}</span>
              <span className="love-game-stage__realm">{chapter.locationRealm}</span>
            </div>

            <div className="love-game-stage__viewport">
              <LoveGameDioramaSvg
                sceneType={chapter.sceneType}
                isActionActive={isActionActive}
                onTriggerAction={handleTriggerAction}
              />

              <div className="love-game-stage__action-bar">
                <button
                  type="button"
                  className="pixel-button pixel-button--tiny love-game-stage__action-btn"
                  onClick={handleTriggerAction}
                >
                  ★ {chapter.actionLabel}
                </button>
              </div>
            </div>

            {/* Action Reaction Banner */}
            {isActionActive && (
              <div className="love-game-reaction" role="status">
                <span className="love-game-reaction__badge">LOOT: {chapter.lootUnlocked}</span>
                <p className="love-game-reaction__text">{chapter.actionReactionText}</p>
              </div>
            )}

            {/* RPG Dialogue & Lore Box */}
            <div className="love-game-dialogue">
              <div className="love-game-dialogue__header">
                <div>
                  <p className="love-game-dialogue__chapter-tag">
                    STAGE {chapter.chapterNumber} · {chapter.realWorldParallel}
                  </p>
                  <h2 className="love-game-dialogue__title">{chapter.title}</h2>
                </div>
              </div>

              <p className="love-game-dialogue__subtitle">{chapter.subtitle}</p>
              <p className="love-game-dialogue__narrative">{chapter.narrative}</p>

              {/* Hero Party Status Cards */}
              <div className="love-game-party-grid">
                <div className="love-game-hero-card love-game-hero-card--muggi">
                  <span className="love-game-hero-card__name">SIR MUGGI</span>
                  <span className="love-game-hero-card__status">{chapter.muggiStatus}</span>
                </div>
                <div className="love-game-hero-card love-game-hero-card--gili">
                  <span className="love-game-hero-card__name">LADY GILI</span>
                  <span className="love-game-hero-card__status">{chapter.giliStatus}</span>
                </div>
              </div>

              {/* Stage Navigation Controls */}
              <div className="love-game-controls">
                <button
                  type="button"
                  className="pixel-button pixel-button--ghost pixel-button--tiny"
                  disabled={activeIndex === 0}
                  onClick={() => selectChapter(activeIndex - 1)}
                >
                  &lt; PREV CHAPTER
                </button>

                {activeIndex < totalChapters - 1 ? (
                  <button
                    type="button"
                    className="pixel-button pixel-button--primary pixel-button--tiny"
                    onClick={() => selectChapter(activeIndex + 1)}
                  >
                    NEXT CHAPTER &gt;
                  </button>
                ) : (
                  <a
                    href="/#rsvp"
                    className="pixel-button pixel-button--primary pixel-button--tiny"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate('/', { hash: '#rsvp' });
                    }}
                  >
                    RSVP FOR THE 19.05.2027 CORONATION &gt;
                  </a>
                )}
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

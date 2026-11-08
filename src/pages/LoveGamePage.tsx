import { useCallback, useEffect, useState } from 'preact/hooks';
import { LoveGameDioramaSvg } from '../components/lovegame/LoveGameDioramaSvg.tsx';
import { LOVE_GAME_CHAPTERS } from '../data/loveGameChapters.ts';
import type { AppRoutePath } from '../types/wedding.ts';

interface LoveGamePageProps {
  readonly onNavigate: (target: AppRoutePath, options?: { readonly hash?: string }) => void;
  readonly onStageAdvanceSound: () => void;
  readonly onCelebrationSound?: () => void;
}

/**
 * Calm, minimalist pixel-art storybook page ("Play the Love Game") at `/love-game`.
 */
export function LoveGamePage({
  onNavigate,
  onStageAdvanceSound,
}: LoveGamePageProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalChapters = LOVE_GAME_CHAPTERS.length;
  const chapter = LOVE_GAME_CHAPTERS[activeIndex];

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

  return (
    <div className="love-game-page" id="love-game-top">
      <section className="love-game-shell" aria-labelledby="love-chapter-title">
        <div className="love-game-card">
          <div className="love-game-card__top">
            <a
              href="/"
              className="love-game-back"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/');
              }}
            >
              &lt; BACK
            </a>
            <span className="love-game-step-counter">
              {chapter.chapterNumber} / 0{totalChapters}
            </span>
          </div>

          <div className="love-game-viewport">
            <LoveGameDioramaSvg sceneType={chapter.sceneType} />
          </div>

          <div className="love-game-copy">
            <p className="love-game-copy__era">{chapter.eraLabel}</p>
            <h1 className="love-game-copy__title" id="love-chapter-title">
              {chapter.title}
            </h1>
            <p className="love-game-copy__caption">{chapter.caption}</p>
          </div>

          <div className="love-game-nav">
            <button
              type="button"
              className="love-game-nav__btn"
              disabled={activeIndex === 0}
              onClick={() => selectChapter(activeIndex - 1)}
            >
              &lt; PREV
            </button>

            <div className="love-game-dots" role="tablist" aria-label="Story chapters">
              {LOVE_GAME_CHAPTERS.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={idx === activeIndex ? 'true' : 'false'}
                  aria-label={`Chapter ${item.chapterNumber}: ${item.title}`}
                  className={`love-game-dot${idx === activeIndex ? ' is-active' : ''}`}
                  onClick={() => selectChapter(idx)}
                />
              ))}
            </div>

            {activeIndex < totalChapters - 1 ? (
              <button
                type="button"
                className="love-game-nav__btn love-game-nav__btn--next"
                onClick={() => selectChapter(activeIndex + 1)}
              >
                NEXT &gt;
              </button>
            ) : (
              <a
                href="/#rsvp"
                className="love-game-nav__btn love-game-nav__btn--next"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/', { hash: '#rsvp' });
                }}
              >
                RSVP &gt;
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

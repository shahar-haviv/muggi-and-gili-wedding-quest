import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import type { TimelineStage } from '../../types/wedding.ts';
import { WeddingTimelineNode } from './WeddingTimelineNode.tsx';

interface WeddingTimelineProps {
  readonly stages: readonly TimelineStage[];
  readonly onStageChangeSound: () => void;
}

/**
 * Coordinates the quest-log timeline: scroll-driven stage highlighting,
 * HUD progress indicator, and keyboard/button controls.
 */
export function WeddingTimeline({ stages, onStageChangeSound }: WeddingTimelineProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const timelineRootRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<(HTMLLIElement | null)[]>([]);

  const updateActiveStage = useCallback(
    (
      nextIndex: number,
      { scrollIntoView = false, emitSound = false }: { scrollIntoView?: boolean; emitSound?: boolean } = {},
    ) => {
      if (nextIndex < 0 || nextIndex >= stages.length) return;
      const changed = nextIndex !== activeIndexRef.current;
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);

      if (scrollIntoView) {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        nodeRefs.current[nextIndex]?.scrollIntoView({
          behavior: reducedMotion ? 'auto' : 'smooth',
          block: 'center',
        });
      }

      if (changed && emitSound) {
        onStageChangeSound();
      }
    },
    [stages.length, onStageChangeSound],
  );

  const goToStage = useCallback(
    (targetIndex: number) => {
      const bounded = Math.max(0, Math.min(stages.length - 1, targetIndex));
      if (bounded === activeIndexRef.current) {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        nodeRefs.current[bounded]?.scrollIntoView({
          behavior: reducedMotion ? 'auto' : 'smooth',
          block: 'center',
        });
        return;
      }
      updateActiveStage(bounded, { scrollIntoView: true, emitSound: true });
    },
    [stages.length, updateActiveStage],
  );

  useEffect(() => {
    let scrollFrame: number | null = null;

    const syncToScroll = () => {
      scrollFrame = null;
      const rootEl = timelineRootRef.current;
      if (!rootEl) return;

      const bounds = rootEl.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      if (bounds.bottom < 80 || bounds.top > viewportHeight - 80) return;

      const readingAnchor = viewportHeight * 0.35;
      let nearestIndex = activeIndexRef.current;
      let nearestDistance = Number.POSITIVE_INFINITY;

      nodeRefs.current.forEach((nodeEl, idx) => {
        if (!nodeEl) return;
        const rect = nodeEl.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const distance = Math.abs(center - readingAnchor);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = idx;
        }
      });

      if (nearestIndex !== activeIndexRef.current) {
        updateActiveStage(nearestIndex);
      }
    };

    const handleScroll = () => {
      if (scrollFrame !== null) return;
      scrollFrame = window.requestAnimationFrame(syncToScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      if (scrollFrame !== null) window.cancelAnimationFrame(scrollFrame);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [updateActiveStage]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      goToStage(activeIndexRef.current + (event.key === 'ArrowRight' ? 1 : -1));
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      goToStage(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      goToStage(stages.length - 1);
    }
  };

  const activeStage = stages[activeIndex] ?? stages[0];
  const progressPercent = ((activeIndex + 1) / stages.length) * 100;

  return (
    <section
      className="content-section content-section--quest"
      id="quest-log"
      aria-labelledby="quest-log-heading"
    >
      <div className="content-section__inner" onKeyDown={handleKeyDown}>
        <header className="section-heading">
          <p className="section-heading__eyebrow">STAGE SELECT</p>
          <h2 id="quest-log-heading">THE QUEST LOG</h2>
          <p className="section-heading__intro">
            Three checkpoints. One long, loud, delicious night in Old Jaffa. Scroll the log or use
            the controls to preview each stage of the celebration.
          </p>
        </header>

        <div className="quest-hud pixel-frame">
          <div className="quest-hud__status">
            <span className="quest-hud__label">CURRENT STAGE</span>
            <span className="quest-hud__stage" id="quest-stage-label">
              {activeStage.stageNumber} / {String(stages.length).padStart(2, '0')}
            </span>
          </div>

          <div
            className="quest-hud__progress-track"
            id="quest-progress-bar"
            role="progressbar"
            aria-label="Timeline progress"
            aria-valuemin={1}
            aria-valuemax={stages.length}
            aria-valuenow={activeIndex + 1}
            aria-valuetext={`Stage ${activeIndex + 1} of ${stages.length}: ${activeStage.title}`}
          >
            <span
              className="quest-hud__progress-fill"
              id="quest-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="quest-hud__controls">
            <button
              className="pixel-button pixel-button--tiny"
              id="quest-previous-button"
              type="button"
              aria-label="Go to the previous timeline stage"
              disabled={activeIndex === 0}
              onClick={() => goToStage(activeIndex - 1)}
            >
              &lt; PREV
            </button>
            <button
              className="pixel-button pixel-button--tiny"
              id="quest-next-button"
              type="button"
              aria-label="Go to the next timeline stage"
              disabled={activeIndex === stages.length - 1}
              onClick={() => goToStage(activeIndex + 1)}
            >
              NEXT &gt;
            </button>
          </div>
        </div>

        <div
          ref={timelineRootRef}
          className="wedding-timeline"
          id="wedding-timeline-root"
          data-active-stage={activeStage.id}
        >
          <ol className="wedding-timeline__track" aria-label="Wedding celebration stages">
            {stages.map((stage, index) => (
              <WeddingTimelineNode
                key={stage.id}
                stage={stage}
                index={index}
                isActive={index === activeIndex}
                nodeRef={(el) => {
                  nodeRefs.current[index] = el;
                }}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

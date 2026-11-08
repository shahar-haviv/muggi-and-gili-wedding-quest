import type { TimelineStage } from '../../types/wedding.ts';

interface WeddingTimelineNodeProps {
  readonly stage: TimelineStage;
  readonly index: number;
  readonly isActive: boolean;
  readonly nodeRef: (element: HTMLLIElement | null) => void;
}

/**
 * Single-responsibility component for rendering one checkpoint card in the quest log.
 */
export function WeddingTimelineNode({
  stage,
  index,
  isActive,
  nodeRef,
}: WeddingTimelineNodeProps) {
  return (
    <li
      ref={nodeRef}
      className={`wedding-timeline-node wedding-timeline-node--${stage.accent}${
        isActive ? ' is-active' : ''
      }`}
      id={`timeline-stage-${stage.id}`}
      data-stage-index={String(index)}
      style={{ '--stage-order': String(index) } as Record<string, string>}
      aria-current={isActive ? 'step' : undefined}
    >
      <div className="wedding-timeline-node__rail" aria-hidden="true">
        <span className="wedding-timeline-node__marker">
          <span className="wedding-timeline-node__marker-index">{stage.stageNumber}</span>
          <span className="wedding-timeline-node__marker-dot" />
        </span>
      </div>

      <article className="wedding-timeline-node__card pixel-frame">
        <span className="wedding-timeline-node__current-badge">CURRENT STAGE</span>

        <header className="wedding-timeline-node__header">
          <p className="wedding-timeline-node__meta">
            <span className="wedding-timeline-node__time">{stage.time}</span>
            <span className="wedding-timeline-node__location">{stage.location}</span>
          </p>
          <p className="wedding-timeline-node__tagline">{stage.tagline}</p>
          <h3 className="wedding-timeline-node__title">{stage.title}</h3>
        </header>

        <p className="wedding-timeline-node__description">{stage.description}</p>

        <div className="wedding-timeline-node__objectives-block">
          <p className="wedding-timeline-node__objectives-label">QUEST OBJECTIVES</p>
          <ul className="wedding-timeline-node__objectives">
            {stage.objectives.map((objective) => (
              <li key={objective}>{objective}</li>
            ))}
          </ul>
        </div>

        <p className="wedding-timeline-node__note">{stage.note}</p>
        <span className="wedding-timeline-node__stamp" aria-hidden="true">
          CHECKPOINT {stage.stageNumber}
        </span>
      </article>
    </li>
  );
}

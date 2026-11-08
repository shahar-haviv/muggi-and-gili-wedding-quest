import { SideQuestSceneCanvas } from '../components/sidequest/SideQuestSceneCanvas.tsx';
import type { SideQuestConfig } from '../types/wedding.ts';

interface SideQuestPageProps {
  readonly quest: SideQuestConfig;
}

/**
 * Calm, stylish secret page for `/side-quest/bachelor`, `/side-quest/bachelorette`,
 * or `/side-quest/united`. Features a bespoke low-res pixel-art scene canvas
 * and clean, readable details.
 */
export function SideQuestPage({ quest }: SideQuestPageProps) {
  return (
    <div
      className={`side-quest-page side-quest-page--${quest.accent}`}
      id="side-quest-top"
    >
      <section className="side-quest-hero" aria-labelledby="side-quest-title">
        <div className="content-section__inner side-quest-shell">
          <div className="side-quest-card">
            <div className="side-quest-card__top">
              <span className="side-quest-card__badge">{quest.tabBadge}</span>
              <span className="side-quest-card__eyebrow">{quest.eyebrow}</span>
            </div>

            <div className="side-quest-canvas-wrap">
              <SideQuestSceneCanvas slug={quest.slug} />
            </div>

            <div className="side-quest-header-copy">
              <h1 className="side-quest-title" id="side-quest-title">
                {quest.title}
              </h1>
              <p className="side-quest-subtitle">{quest.subtitle}</p>
            </div>

            <div className="side-quest-stats-grid">
              <div className="side-quest-stat">
                <span className="side-quest-stat__label">WHO</span>
                <span className="side-quest-stat__value">{quest.hostLabel}</span>
              </div>
              <div className="side-quest-stat">
                <span className="side-quest-stat__label">WHEN</span>
                <span className="side-quest-stat__value">{quest.dateDisplay}</span>
              </div>
              <div className="side-quest-stat">
                <span className="side-quest-stat__label">WHERE</span>
                <span className="side-quest-stat__value">{quest.locationDisplay}</span>
              </div>
              <div className="side-quest-stat">
                <span className="side-quest-stat__label">VIBE</span>
                <span className="side-quest-stat__value">{quest.vibeLevel}</span>
              </div>
            </div>
          </div>

          <div className="side-quest-grid" id="briefing">
            <article className="side-quest-panel">
              <p className="side-quest-panel__eyebrow">THE PLAN</p>
              <h2 className="side-quest-panel__title">What to Expect</h2>
              <p className="side-quest-panel__copy">{quest.description}</p>
              <p className="side-quest-panel__note">{quest.designPromptHint}</p>
            </article>

            <aside className="side-quest-panel" id="loadout">
              <p className="side-quest-panel__eyebrow">PACKING LIST</p>
              <h2 className="side-quest-panel__title">What to Bring</h2>
              <ul className="side-quest-loadout-list">
                {quest.loadoutItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="side-quest-loadout-dress">
                <span>DRESS CODE:</span> {quest.dressCode}
              </p>
            </aside>
          </div>

          <div className="side-quest-checkpoints" id="stages">
            <p className="side-quest-panel__eyebrow">LINEUP</p>
            <h2 className="side-quest-checkpoints__heading">Party Stages</h2>

            <div className="side-quest-checkpoint-grid">
              {quest.checkpoints.map((cp) => (
                <article key={cp.step} className="side-quest-checkpoint-card">
                  <div className="side-quest-checkpoint-card__header">
                    <span className="side-quest-checkpoint-card__step">{cp.step}</span>
                    <span className="side-quest-checkpoint-card__time">{cp.time}</span>
                  </div>
                  <h3 className="side-quest-checkpoint-card__title">{cp.title}</h3>
                  <p className="side-quest-checkpoint-card__location">{cp.location}</p>
                  <p className="side-quest-checkpoint-card__summary">{cp.summary}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

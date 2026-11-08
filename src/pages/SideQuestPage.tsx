import { SIDE_QUEST_LIST } from '../data/sideQuests.ts';
import type { AppRoutePath, SideQuestConfig } from '../types/wedding.ts';
import { PixelHeartIcon } from '../components/common/PixelHeartIcon.tsx';

interface SideQuestPageProps {
  readonly quest: SideQuestConfig;
  readonly onNavigate: (target: AppRoutePath, options?: { readonly hash?: string }) => void;
}

/**
 * Dedicated route view for `/side-quest/bachelor`, `/side-quest/bachelorette`,
 * and `/side-quest/united`.
 */
export function SideQuestPage({ quest, onNavigate }: SideQuestPageProps) {
  return (
    <div className={`side-quest-page side-quest-page--${quest.accent}`}>
      <section className="side-quest-hero" aria-labelledby="side-quest-title">
        <div className="side-quest-hero__scanlines" aria-hidden="true" />
        <div className="content-section__inner side-quest-hero__inner">
          <div className="side-quest-hero__top-bar">
            <a
              href="/"
              className="pixel-button pixel-button--tiny pixel-button--ghost"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/');
              }}
            >
              &lt; MAIN WEDDING QUEST
            </a>

            <div className="side-quest-switcher" role="navigation" aria-label="Switch side quest">
              {SIDE_QUEST_LIST.map((item) => {
                const isActive = item.slug === quest.slug;
                return (
                  <a
                    key={item.slug}
                    href={item.path}
                    className={`side-quest-switcher__pill side-quest-switcher__pill--${item.accent}${
                      isActive ? ' is-active' : ''
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(item.path);
                    }}
                  >
                    {item.shortLabel}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="side-quest-hero__banner pixel-frame">
            <div className="side-quest-hero__eyebrow-row">
              <span className="side-quest-hero__badge">{quest.tabBadge}</span>
              <span className="side-quest-hero__eyebrow">{quest.eyebrow}</span>
            </div>

            <h1 className="side-quest-hero__title" id="side-quest-title">
              {quest.title}
            </h1>
            <p className="side-quest-hero__subtitle">{quest.subtitle}</p>

            <div className="side-quest-stats-grid">
              <div className="side-quest-stat">
                <span className="side-quest-stat__label">SQUAD</span>
                <span className="side-quest-stat__value">{quest.hostLabel}</span>
              </div>
              <div className="side-quest-stat">
                <span className="side-quest-stat__label">WHEN</span>
                <span className="side-quest-stat__value">{quest.dateDisplay}</span>
              </div>
              <div className="side-quest-stat">
                <span className="side-quest-stat__label">SPAWN POINT</span>
                <span className="side-quest-stat__value">{quest.locationDisplay}</span>
              </div>
              <div className="side-quest-stat">
                <span className="side-quest-stat__label">MODE</span>
                <span className="side-quest-stat__value">{quest.vibeLevel}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section side-quest-body" aria-label="Side quest mission details">
        <div className="content-section__inner">
          <div className="side-quest-grid">
            <article className="side-quest-panel pixel-frame">
              <p className="section-heading__eyebrow">MISSION BRIEFING</p>
              <h2 className="side-quest-panel__title">ABOUT THIS SIDE QUEST</h2>
              <p className="side-quest-panel__copy">{quest.description}</p>

              <div className="side-quest-design-callout">
                <PixelHeartIcon />
                <p>{quest.designPromptHint}</p>
              </div>
            </article>

            <aside className="side-quest-panel pixel-frame">
              <p className="section-heading__eyebrow">INVENTORY</p>
              <h2 className="side-quest-panel__title">REQUIRED LOADOUT</h2>
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

          <div className="side-quest-checkpoints">
            <header className="section-heading">
              <p className="section-heading__eyebrow">STAGE ROUTE</p>
              <h2>SIDE QUEST CHECKPOINTS</h2>
            </header>

            <div className="side-quest-checkpoint-grid">
              {quest.checkpoints.map((cp) => (
                <article key={cp.step} className="side-quest-checkpoint-card pixel-frame">
                  <div className="side-quest-checkpoint-card__header">
                    <span className="side-quest-checkpoint-card__step">STAGE {cp.step}</span>
                    <span className="side-quest-checkpoint-card__time">{cp.time}</span>
                  </div>
                  <h3 className="side-quest-checkpoint-card__title">{cp.title}</h3>
                  <p className="side-quest-checkpoint-card__location">{cp.location}</p>
                  <p className="side-quest-checkpoint-card__summary">{cp.summary}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="side-quest-footer-cta pixel-frame">
            <div>
              <p className="side-quest-footer-cta__eyebrow">MAIN EVENT</p>
              <h3 className="side-quest-footer-cta__title">
                DON'T FORGET THE FINAL BOSS ON 19 · 05 · 2027
              </h3>
              <p className="side-quest-footer-cta__copy">
                Consul House · HaZorfim 15, Old Jaffa · Greeting 18:00 · Ceremony 19:00 · Feast 20:00
              </p>
            </div>
            <div className="side-quest-footer-cta__actions">
              <a
                href="/#rsvp"
                className="pixel-button pixel-button--primary"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/', { hash: '#rsvp' });
                }}
              >
                MAIN WEDDING RSVP
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

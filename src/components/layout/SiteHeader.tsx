import { useEffect, useState } from 'preact/hooks';
import { SIDE_QUEST_LIST } from '../../data/sideQuests.ts';
import type { AppRoutePath, WeddingDetails } from '../../types/wedding.ts';
import { PixelHeartIcon } from '../common/PixelHeartIcon.tsx';

interface SiteHeaderProps {
  readonly details: WeddingDetails;
  readonly currentRoute: AppRoutePath;
  readonly onNavigate: (target: AppRoutePath, options?: { readonly hash?: string }) => void;
  readonly isSoundEnabled: boolean;
  readonly onToggleSound: () => void;
}

/**
 * Single-responsibility site header with section navigation and the iPhone-friendly
 * Quest Route Switcher bar (Main Quest + Bachelor / Bachelorette / United Side Quests).
 */
export function SiteHeader({
  details,
  currentRoute,
  onNavigate,
  isSoundEnabled,
  onToggleSound,
}: SiteHeaderProps) {
  const [isCondensed, setIsCondensed] = useState(false);

  useEffect(() => {
    const updateOnScroll = () => {
      const nextState = window.scrollY > 24;
      setIsCondensed((prev) => (prev === nextState ? prev : nextState));
    };

    updateOnScroll();
    window.addEventListener('scroll', updateOnScroll, { passive: true });
    return () => window.removeEventListener('scroll', updateOnScroll);
  }, []);

  const handleRouteClick = (
    event: MouseEvent,
    target: AppRoutePath,
    hash?: string,
  ) => {
    event.preventDefault();
    onNavigate(target, hash ? { hash } : undefined);
  };

  return (
    <header
      className={`site-header${isCondensed ? ' is-condensed' : ''}`}
      data-site-header
    >
      <div className="site-header__top-row">
        <a
          className="site-header__brand"
          href="/"
          aria-label={`${details.couple.partnerOne} and ${details.couple.partnerTwo} — back to the title screen`}
          onClick={(e) => handleRouteClick(e, '/', '#landing-hero')}
        >
          <PixelHeartIcon />
          <span>
            {details.couple.partnerOne[0]}
            <span className="site-header__ampersand">&amp;</span>
            {details.couple.partnerTwo[0]}
          </span>
        </a>

        <nav className="site-header__navigation" aria-label="Main wedding sections">
          <a
            href="/#quest-log"
            onClick={(e) => handleRouteClick(e, '/', '#quest-log')}
          >
            QUEST
          </a>
          <a
            href="/#venue"
            onClick={(e) => handleRouteClick(e, '/', '#venue')}
          >
            VENUE
          </a>
          <a
            className="site-header__rsvp-link"
            href="/#rsvp"
            onClick={(e) => handleRouteClick(e, '/', '#rsvp')}
          >
            RSVP
          </a>
        </nav>

        <button
          className="sound-toggle"
          id="sound-toggle-button"
          type="button"
          aria-pressed={isSoundEnabled ? 'true' : 'false'}
          aria-label={
            isSoundEnabled
              ? 'Disable 8-bit sound effects and music'
              : 'Enable 8-bit sound effects and music'
          }
          onClick={onToggleSound}
        >
          <span className="sound-toggle__label" aria-hidden="true">
            {isSoundEnabled ? 'SFX ON' : 'SFX OFF'}
          </span>
        </button>
      </div>

      <nav className="quest-route-tabs" aria-label="Quest and Side Quest routes">
        <a
          href="/"
          className={`quest-route-tab quest-route-tab--main${
            currentRoute === '/' ? ' is-active' : ''
          }`}
          aria-current={currentRoute === '/' ? 'page' : undefined}
          onClick={(e) => handleRouteClick(e, '/')}
        >
          <span className="quest-route-tab__badge">MAIN</span>
          <span className="quest-route-tab__label">WEDDING</span>
        </a>

        {SIDE_QUEST_LIST.map((sideQuest) => {
          const isActive = currentRoute === sideQuest.path;
          return (
            <a
              key={sideQuest.slug}
              href={sideQuest.path}
              className={`quest-route-tab quest-route-tab--${sideQuest.accent}${
                isActive ? ' is-active' : ''
              }`}
              aria-current={isActive ? 'page' : undefined}
              onClick={(e) => handleRouteClick(e, sideQuest.path)}
            >
              <span className="quest-route-tab__badge">{sideQuest.tabBadge}</span>
              <span className="quest-route-tab__label">{sideQuest.shortLabel}</span>
            </a>
          );
        })}
      </nav>
    </header>
  );
}

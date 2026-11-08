import { useEffect, useState } from 'preact/hooks';
import type { SideQuestConfig, WeddingDetails } from '../../types/wedding.ts';
import { PixelHeartIcon } from '../common/PixelHeartIcon.tsx';

interface SiteHeaderProps {
  readonly details: WeddingDetails;
  readonly activeSideQuest: SideQuestConfig | null;
  readonly isSoundEnabled: boolean;
  readonly onToggleSound: () => void;
}

/**
 * Single-responsibility site header.
 * Renders the main wedding section anchors on `/`, or a standalone header for
 * the active unlisted side-quest page (`/side-quest/*`) without exposing any
 * links to other routes.
 */
export function SiteHeader({
  details,
  activeSideQuest,
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

  const topAnchor = activeSideQuest ? '#side-quest-top' : '#landing-hero';

  return (
    <header
      className={`site-header${isCondensed ? ' is-condensed' : ''}`}
      data-site-header
    >
      <a
        className="site-header__brand"
        href={topAnchor}
        aria-label={
          activeSideQuest
            ? `${activeSideQuest.title} — back to top`
            : `${details.couple.partnerOne} and ${details.couple.partnerTwo} — back to the title screen`
        }
      >
        <PixelHeartIcon />
        <span>
          {details.couple.partnerOne[0]}
          <span className="site-header__ampersand">&amp;</span>
          {details.couple.partnerTwo[0]}
        </span>
      </a>

      {activeSideQuest ? (
        <nav className="site-header__navigation" aria-label="Side quest sections">
          <a href="#briefing">BRIEFING</a>
          <a href="#loadout">LOADOUT</a>
          <a className="site-header__rsvp-link" href="#stages">
            STAGES
          </a>
        </nav>
      ) : (
        <nav className="site-header__navigation" aria-label="Main wedding sections">
          <a href="#quest-log">QUEST</a>
          <a href="#venue">VENUE</a>
          <a className="site-header__rsvp-link" href="#rsvp">
            RSVP
          </a>
        </nav>
      )}

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
    </header>
  );
}

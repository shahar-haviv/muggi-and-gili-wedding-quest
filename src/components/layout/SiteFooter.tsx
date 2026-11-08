import type { SideQuestConfig, WeddingDetails } from '../../types/wedding.ts';
import { PixelHeartIcon } from '../common/PixelHeartIcon.tsx';

interface SiteFooterProps {
  readonly details: WeddingDetails;
  readonly activeSideQuest: SideQuestConfig | null;
}

export function SiteFooter({ details, activeSideQuest }: SiteFooterProps) {
  const topAnchor = activeSideQuest ? '#side-quest-top' : '#landing-hero';

  return (
    <footer className="site-footer">
      <p className="site-footer__logo">
        {details.couple.partnerOne.toUpperCase()}
        <PixelHeartIcon />
        {details.couple.partnerTwo.toUpperCase()}
      </p>
      <p className="site-footer__meta">
        {activeSideQuest
          ? `${activeSideQuest.tabBadge} · ${activeSideQuest.title}`
          : `19.05.2027 · ${details.venue.name.toUpperCase()} · ${details.venue.city.toUpperCase()}`}
      </p>
      <p className="site-footer__credits">MADE WITH LOVE, THREE.JS &amp; TOO MANY PIXELS</p>
      <a className="site-footer__back-link" href={topAnchor}>
        ↑ BACK TO TOP
      </a>
    </footer>
  );
}

import { SIDE_QUEST_LIST } from '../../data/sideQuests.ts';
import type { AppRoutePath, WeddingDetails } from '../../types/wedding.ts';
import { PixelHeartIcon } from '../common/PixelHeartIcon.tsx';

interface SiteFooterProps {
  readonly details: WeddingDetails;
  readonly currentRoute: AppRoutePath;
  readonly onNavigate: (target: AppRoutePath, options?: { readonly hash?: string }) => void;
}

export function SiteFooter({ details, currentRoute, onNavigate }: SiteFooterProps) {
  const handleLinkClick = (event: MouseEvent, target: AppRoutePath, hash?: string) => {
    event.preventDefault();
    onNavigate(target, hash ? { hash } : undefined);
  };

  return (
    <footer className="site-footer">
      <p className="site-footer__logo">
        {details.couple.partnerOne.toUpperCase()}
        <PixelHeartIcon />
        {details.couple.partnerTwo.toUpperCase()}
      </p>
      <p className="site-footer__meta">
        19.05.2027 · {details.venue.name.toUpperCase()} · {details.venue.city.toUpperCase()}
      </p>

      <nav className="site-footer__routes" aria-label="Footer route links">
        <a
          href="/"
          className={currentRoute === '/' ? 'is-active' : undefined}
          onClick={(e) => handleLinkClick(e, '/')}
        >
          MAIN QUEST
        </a>
        {SIDE_QUEST_LIST.map((quest) => (
          <a
            key={quest.slug}
            href={quest.path}
            className={currentRoute === quest.path ? 'is-active' : undefined}
            onClick={(e) => handleLinkClick(e, quest.path)}
          >
            {quest.shortLabel}
          </a>
        ))}
      </nav>

      <p className="site-footer__credits">MADE WITH LOVE, THREE.JS &amp; TOO MANY PIXELS</p>
      <a
        className="site-footer__back-link"
        href={currentRoute === '/' ? '#landing-hero' : currentRoute}
        onClick={(e) =>
          handleLinkClick(e, currentRoute, currentRoute === '/' ? '#landing-hero' : undefined)
        }
      >
        ↑ BACK TO TOP
      </a>
    </footer>
  );
}

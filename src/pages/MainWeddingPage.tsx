import { useState } from 'preact/hooks';
import { SIDE_QUEST_LIST } from '../data/sideQuests.ts';
import type {
  AppRoutePath,
  FaqItem,
  RsvpResponse,
  RsvpSaveResult,
  TimelineStage,
  WeddingDetails,
} from '../types/wedding.ts';
import { WeddingCountdown } from '../components/countdown/WeddingCountdown.tsx';
import { LandingHero } from '../components/landing/LandingHero.tsx';
import { GuestDietaryForm } from '../components/rsvp/GuestDietaryForm.tsx';
import { RsvpConfirmationDialog } from '../components/rsvp/RsvpConfirmationDialog.tsx';
import { WeddingTimeline } from '../components/timeline/WeddingTimeline.tsx';
import { VenueFaqAccordion } from '../components/venue/VenueFaqAccordion.tsx';
import { VenueInformationPanel } from '../components/venue/VenueInformationPanel.tsx';

interface MainWeddingPageProps {
  readonly details: WeddingDetails;
  readonly timelineStages: readonly TimelineStage[];
  readonly faqItems: readonly FaqItem[];
  readonly onNavigate: (target: AppRoutePath, options?: { readonly hash?: string }) => void;
  readonly onCelebrationSound: () => void;
  readonly onJingleSound: () => void;
  readonly onStageAdvanceSound: () => void;
  readonly onErrorSound: () => void;
}

/**
 * Composes the main wedding invitation experience at `/`.
 */
export function MainWeddingPage({
  details,
  timelineStages,
  faqItems,
  onNavigate,
  onCelebrationSound,
  onJingleSound,
  onStageAdvanceSound,
  onErrorSound,
}: MainWeddingPageProps) {
  const [savedResponse, setSavedResponse] = useState<RsvpResponse | null>(null);
  const [saveResult, setSaveResult] = useState<RsvpSaveResult | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRsvpSaved = (response: RsvpResponse, result: RsvpSaveResult) => {
    setSavedResponse(response);
    setSaveResult(result);
    setIsDialogOpen(true);
    onJingleSound();
  };

  return (
    <>
      <LandingHero
        details={details}
        onCelebrationSound={onCelebrationSound}
        onStartQuestSound={onJingleSound}
      />

      <WeddingCountdown targetDateIso={details.weddingDateIso} />

      <WeddingTimeline
        stages={timelineStages}
        onStageChangeSound={onStageAdvanceSound}
      />

      <section
        className="content-section content-section--side-quests-portal"
        id="side-quests"
        aria-labelledby="side-quests-portal-heading"
      >
        <div className="content-section__inner">
          <header className="section-heading">
            <p className="section-heading__eyebrow">BONUS STAGES UNLOCKED</p>
            <h2 id="side-quests-portal-heading">PRE-WEDDING SIDE QUESTS</h2>
            <p className="section-heading__intro">
              Before we meet at Consul House on 19 May 2027, choose your bonus stage:
              the Bachelor quest, the Bachelorette quest, or the full-crew United Party.
            </p>
          </header>

          <div className="side-quest-portal-grid">
            {SIDE_QUEST_LIST.map((quest) => (
              <article
                key={quest.slug}
                className={`side-quest-portal-card side-quest-portal-card--${quest.accent} pixel-frame`}
              >
                <div className="side-quest-portal-card__top">
                  <span className="side-quest-portal-card__badge">{quest.tabBadge}</span>
                  <span className="side-quest-portal-card__host">{quest.hostLabel}</span>
                </div>
                <h3 className="side-quest-portal-card__title">{quest.title}</h3>
                <p className="side-quest-portal-card__copy">{quest.subtitle}</p>
                <a
                  href={quest.path}
                  className="pixel-button pixel-button--tiny side-quest-portal-card__cta"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(quest.path);
                  }}
                >
                  ENTER {quest.shortLabel} &gt;
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="content-section content-section--venue"
        id="venue"
        aria-labelledby="venue-heading"
      >
        <div className="content-section__inner">
          <header className="section-heading">
            <p className="section-heading__eyebrow">WORLD MAP</p>
            <h2 id="venue-heading">THE VENUE</h2>
            <p className="section-heading__intro">
              An 1845 Ottoman-era landmark in Old Jaffa with stone arches, a rooftop terrace
              overlooking the sea and Tel Aviv skyline, and a ceremony booked for 19:00 sharp.
            </p>
          </header>

          <VenueInformationPanel details={details} />

          <div className="venue-faq-block">
            <div className="venue-faq-block__heading">
              <p className="section-heading__eyebrow">SIDE QUESTS</p>
              <h3>FREQUENTLY ASKED QUESTS</h3>
            </div>
            <VenueFaqAccordion items={faqItems} />
          </div>
        </div>
      </section>

      <section
        className="content-section content-section--rsvp"
        id="rsvp"
        aria-labelledby="rsvp-heading"
      >
        <div className="content-section__inner">
          <header className="section-heading section-heading--centered">
            <p className="section-heading__eyebrow">FINAL BOSS</p>
            <h2 id="rsvp-heading">RESERVE YOUR SPOT</h2>
            <p className="section-heading__intro">
              Tell us if you can make it, what you can eat, and which song will get you on the
              dance floor. Your answer is saved on this device and can be updated any time.
            </p>
          </header>

          <div className="rsvp-layout">
            <aside className="rsvp-brief" aria-label="RSVP details">
              <div className="rsvp-brief__panel pixel-frame">
                <p className="rsvp-brief__label">RESPOND BY</p>
                <p className="rsvp-brief__deadline">{details.rsvpDeadlineDisplay}</p>

                <div className="rsvp-brief__rule" aria-hidden="true" />

                <ul className="rsvp-brief__facts">
                  <li>
                    <span className="rsvp-brief__fact-label">PARTY SIZE</span>
                    <span>Up to 4 guests, per your invite.</span>
                  </li>
                  <li>
                    <span className="rsvp-brief__fact-label">DIETARY NEEDS</span>
                    <span>Veggie, vegan, gluten-free, allergies — the kitchen is listening.</span>
                  </li>
                  <li>
                    <span className="rsvp-brief__fact-label">QUESTIONS?</span>
                    <a href={`mailto:${details.contactEmail}`}>{details.contactEmail}</a>
                  </li>
                </ul>

                <p className="rsvp-brief__note">NO ACCOUNTS. NO APPS. JUST PIXELS.</p>
              </div>
            </aside>

            <GuestDietaryForm onSaved={handleRsvpSaved} onError={onErrorSound} />
          </div>
        </div>
      </section>

      <RsvpConfirmationDialog
        details={details}
        response={savedResponse}
        saveResult={saveResult}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}

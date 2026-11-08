import { useCallback, useMemo, useState } from 'preact/hooks';
import { PixelSoundEngine } from './audio/PixelSoundEngine.ts';
import { SiteFooter } from './components/layout/SiteFooter.tsx';
import { SiteHeader } from './components/layout/SiteHeader.tsx';
import { SIDE_QUESTS } from './data/sideQuests.ts';
import { VENUE_FAQ_ITEMS } from './data/venueFaq.ts';
import { WEDDING_DETAILS } from './data/weddingDetails.ts';
import { WEDDING_TIMELINE_STAGES } from './data/weddingTimeline.ts';
import { LoveGamePage } from './pages/LoveGamePage.tsx';
import { MainWeddingPage } from './pages/MainWeddingPage.tsx';
import { SideQuestPage } from './pages/SideQuestPage.tsx';
import { useRoute } from './router/useRoute.ts';
import { SoundPreferenceStore } from './services/SoundPreferenceStore.ts';

/**
 * Root application shell managing audio preference state, URL-based page resolution,
 * and shared layout chrome.
 */
export function App() {
  const soundPreferenceStore = useMemo(() => new SoundPreferenceStore(), []);
  const soundEngine = useMemo(
    () => new PixelSoundEngine({ enabled: soundPreferenceStore.read() }),
    [soundPreferenceStore],
  );
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => soundEngine.enabled);

  const handleRouteChanged = useCallback(() => {
    soundEngine.playStageAdvance();
  }, [soundEngine]);

  const { route, sideQuestSlug, navigate } = useRoute(handleRouteChanged);

  const handleToggleSound = useCallback(() => {
    const nextState = !soundEngine.enabled;
    if (!nextState) {
      soundEngine.playUiClick();
    }

    const applied = soundEngine.setEnabled(nextState);
    soundPreferenceStore.write(applied);
    setIsSoundEnabled(applied);

    if (applied) {
      soundEngine.playJingle();
    }
  }, [soundEngine, soundPreferenceStore]);

  const handleCelebrationSound = useCallback(() => {
    soundEngine.playCelebration();
  }, [soundEngine]);

  const handleJingleSound = useCallback(() => {
    soundEngine.playJingle();
  }, [soundEngine]);

  const handleStageAdvanceSound = useCallback(() => {
    soundEngine.playStageAdvance();
  }, [soundEngine]);

  const handleErrorSound = useCallback(() => {
    soundEngine.playError();
  }, [soundEngine]);

  const handleOpenLoveGame = useCallback(() => {
    soundEngine.playJingle();
    navigate('/love-game');
  }, [navigate, soundEngine]);

  const activeSideQuest = sideQuestSlug ? SIDE_QUESTS[sideQuestSlug] : null;

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to the good part
      </a>

      <SiteHeader
        details={WEDDING_DETAILS}
        currentRoute={route}
        activeSideQuest={activeSideQuest}
        onNavigate={navigate}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={handleToggleSound}
      />

      <main id="main-content">
        {activeSideQuest ? (
          <SideQuestPage quest={activeSideQuest} />
        ) : route === '/love-game' ? (
          <LoveGamePage
            onNavigate={navigate}
            onStageAdvanceSound={handleStageAdvanceSound}
            onCelebrationSound={handleCelebrationSound}
          />
        ) : (
          <MainWeddingPage
            details={WEDDING_DETAILS}
            timelineStages={WEDDING_TIMELINE_STAGES}
            faqItems={VENUE_FAQ_ITEMS}
            onOpenLoveGame={handleOpenLoveGame}
            onCelebrationSound={handleCelebrationSound}
            onJingleSound={handleJingleSound}
            onStageAdvanceSound={handleStageAdvanceSound}
            onErrorSound={handleErrorSound}
          />
        )}
      </main>

      <SiteFooter
        details={WEDDING_DETAILS}
        currentRoute={route}
        activeSideQuest={activeSideQuest}
      />
    </>
  );
}

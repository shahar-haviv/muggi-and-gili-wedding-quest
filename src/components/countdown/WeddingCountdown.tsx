import { useEffect, useState } from 'preact/hooks';

interface CountdownUnitConfig {
  readonly key: 'days' | 'hours' | 'minutes' | 'seconds';
  readonly label: string;
  readonly milliseconds: number;
  readonly modulo?: number;
}

const COUNTDOWN_UNITS: readonly CountdownUnitConfig[] = [
  { key: 'days', label: 'DAYS', milliseconds: 24 * 60 * 60 * 1000 },
  { key: 'hours', label: 'HOURS', milliseconds: 60 * 60 * 1000, modulo: 24 },
  { key: 'minutes', label: 'MINUTES', milliseconds: 60 * 1000, modulo: 60 },
  { key: 'seconds', label: 'SECONDS', milliseconds: 1000, modulo: 60 },
];

interface WeddingCountdownProps {
  readonly targetDateIso: string;
}

function computeRemainingMs(targetTimestamp: number): number {
  return Math.max(0, targetTimestamp - Date.now());
}

/**
 * Single-responsibility countdown ribbon component.
 */
export function WeddingCountdown({ targetDateIso }: WeddingCountdownProps) {
  const targetTimestamp = new Date(targetDateIso).getTime();
  const [remainingMs, setRemainingMs] = useState<number>(() =>
    computeRemainingMs(targetTimestamp),
  );

  useEffect(() => {
    if (Number.isNaN(targetTimestamp)) return;

    const tick = () => {
      const next = computeRemainingMs(targetTimestamp);
      setRemainingMs(next);
    };

    tick();
    const intervalId = window.setInterval(tick, 1000);
    return () => window.clearInterval(intervalId);
  }, [targetTimestamp]);

  const isComplete = remainingMs <= 0;

  return (
    <section className="countdown-ribbon" aria-labelledby="countdown-heading">
      <div className="countdown-ribbon__inner">
        <div className="countdown-ribbon__heading">
          <p className="countdown-ribbon__eyebrow">SAVE FILE</p>
          <h2 id="countdown-heading">TIME UNTIL “I DO”</h2>
        </div>

        <div
          className={`countdown-grid${isComplete ? ' is-complete' : ''}`}
          id="wedding-countdown"
          role="timer"
          aria-live="off"
        >
          {COUNTDOWN_UNITS.map((unit) => {
            const wholeUnits = Math.floor(remainingMs / unit.milliseconds);
            const unitValue = unit.modulo ? wholeUnits % unit.modulo : wholeUnits;

            return (
              <div
                key={unit.key}
                className="countdown-unit"
                data-countdown-unit={unit.key}
              >
                <span
                  className="countdown-unit__value"
                  data-countdown-value={unit.key}
                >
                  {String(unitValue).padStart(2, '0')}
                </span>
                <span className="countdown-unit__label">{unit.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

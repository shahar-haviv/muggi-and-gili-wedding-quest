const COUNTDOWN_UNITS = [
  { key: 'days', label: 'DAYS', milliseconds: 24 * 60 * 60 * 1000 },
  { key: 'hours', label: 'HOURS', milliseconds: 60 * 60 * 1000, modulo: 24 },
  { key: 'minutes', label: 'MINUTES', milliseconds: 60 * 1000, modulo: 60 },
  { key: 'seconds', label: 'SECONDS', milliseconds: 1000, modulo: 60 },
];

/**
 * Renders the save-file countdown and keeps it ticking once per second.
 * The timer stops itself when the wedding day arrives.
 */
export class WeddingCountdown {
  constructor({ root, targetDateIso, onComplete = () => {} }) {
    this.root = root;
    this.targetDate = new Date(targetDateIso);
    this.onComplete = onComplete;
    this.intervalId = null;
    this.hasCompleted = false;
    this.unitValueElements = new Map();

    if (!this.root || Number.isNaN(this.targetDate.getTime())) return;

    this.renderUnits();
    this.update();
    this.intervalId = window.setInterval(() => this.update(), 1000);
  }

  renderUnits() {
    const fragment = document.createDocumentFragment();

    COUNTDOWN_UNITS.forEach((unit) => {
      const unitElement = document.createElement('div');
      unitElement.className = 'countdown-unit';
      unitElement.dataset.countdownUnit = unit.key;

      const valueElement = document.createElement('span');
      valueElement.className = 'countdown-unit__value';
      valueElement.dataset.countdownValue = unit.key;
      valueElement.textContent = '00';

      const labelElement = document.createElement('span');
      labelElement.className = 'countdown-unit__label';
      labelElement.textContent = unit.label;

      unitElement.append(valueElement, labelElement);
      fragment.append(unitElement);
      this.unitValueElements.set(unit.key, valueElement);
    });

    this.root.replaceChildren(fragment);
  }

  update() {
    const remainingMilliseconds = Math.max(0, this.targetDate.getTime() - Date.now());

    COUNTDOWN_UNITS.forEach((unit) => {
      const wholeUnits = Math.floor(remainingMilliseconds / unit.milliseconds);
      const unitValue = unit.modulo ? wholeUnits % unit.modulo : wholeUnits;

      const valueElement = this.unitValueElements.get(unit.key);
      if (valueElement) {
        valueElement.textContent = String(unitValue).padStart(2, '0');
      }
    });

    if (remainingMilliseconds <= 0) {
      this.root.classList.add('is-complete');
      this.stop();

      if (!this.hasCompleted) {
        this.hasCompleted = true;
        this.onComplete();
      }
    }
  }

  stop() {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

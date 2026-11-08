const SOUND_PREFERENCE_KEY = 'shahar-liza-sound-enabled';

/**
 * Single-responsibility storage wrapper for the user's 8-bit audio preference.
 */
export class SoundPreferenceStore {
  private readonly storageKey: string;

  constructor(storageKey: string = SOUND_PREFERENCE_KEY) {
    this.storageKey = storageKey;
  }

  read(): boolean {
    try {
      return window.localStorage.getItem(this.storageKey) === 'true';
    } catch {
      return false;
    }
  }

  write(isEnabled: boolean): void {
    try {
      window.localStorage.setItem(this.storageKey, String(isEnabled));
    } catch {
      // Site works without persistent storage in private browsing.
    }
  }
}

const MASTER_VOLUME = 0.24;

/**
 * Tiny WebAudio chiptune engine. The audio context is created lazily on the
 * first sound so browsers never block autoplay, and every effect is synthesized
 * from oscillators instead of shipping audio files.
 */
export class PixelSoundEngine {
  constructor({ enabled = false } = {}) {
    this.audioContext = null;
    this.masterGain = null;
    this.isSupported = Boolean(window.AudioContext || window.webkitAudioContext);
    this.enabled = enabled && this.isSupported;
  }

  setEnabled(enabled) {
    if (enabled && !this.isSupported) {
      this.enabled = false;
      return false;
    }

    this.enabled = enabled;

    if (enabled) {
      const context = this.ensureContext();
      if (!context || !this.masterGain) {
        this.enabled = false;
        return false;
      }

      this.masterGain.gain.cancelScheduledValues(context.currentTime);
      this.masterGain.gain.setTargetAtTime(MASTER_VOLUME, context.currentTime, 0.03);
    } else if (this.masterGain && this.audioContext) {
      this.masterGain.gain.setTargetAtTime(0.0001, this.audioContext.currentTime, 0.03);
    }

    return this.enabled;
  }

  ensureContext() {
    if (!this.isSupported) return null;

    if (!this.audioContext) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContextClass();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = MASTER_VOLUME;
      this.masterGain.connect(this.audioContext.destination);
    }

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => {
        // A later user gesture will try again.
      });
    }

    return this.audioContext;
  }

  playJingle() {
    this.playMelody([
      { frequency: 523.25, offset: 0, duration: 0.1 },
      { frequency: 659.25, offset: 0.11, duration: 0.1 },
      { frequency: 783.99, offset: 0.22, duration: 0.1 },
      { frequency: 1046.5, offset: 0.33, duration: 0.26, type: 'triangle', volume: 0.22 },
    ]);

    this.playNote(261.63, {
      offset: 0,
      duration: 0.3,
      type: 'triangle',
      volume: 0.16,
    });
    this.playNote(392, {
      offset: 0.33,
      duration: 0.32,
      type: 'triangle',
      volume: 0.14,
    });
  }

  playCelebration() {
    this.playMelody(
      [659.25, 783.99, 987.77, 1318.51, 987.77, 1318.51].map((frequency, index) => ({
        frequency,
        offset: index * 0.055,
        duration: 0.08,
        volume: 0.12,
      })),
    );

    this.playNote(329.63, {
      offset: 0,
      duration: 0.3,
      type: 'triangle',
      volume: 0.16,
    });
  }

  playStageAdvance() {
    this.playMelody([
      { frequency: 440, offset: 0, duration: 0.07 },
      { frequency: 659.25, offset: 0.08, duration: 0.11 },
    ]);
  }

  playUiClick() {
    this.playMelody([
      { frequency: 880, offset: 0, duration: 0.045, volume: 0.1 },
      { frequency: 1174.66, offset: 0.045, duration: 0.05, volume: 0.08 },
    ]);
  }

  playError() {
    this.playNote(196, {
      offset: 0,
      duration: 0.12,
      volume: 0.14,
      endFrequency: 147,
    });
  }

  playMelody(notes) {
    notes.forEach(({ frequency, offset, duration, type = 'square', volume = 0.15 }) => {
      this.playNote(frequency, { offset, duration, type, volume });
    });
  }

  playNote(
    frequency,
    {
      offset = 0,
      duration = 0.1,
      type = 'square',
      volume = 0.15,
      endFrequency = null,
    } = {},
  ) {
    if (!this.enabled) return;

    const context = this.ensureContext();
    if (!context || !this.masterGain) return;

    const startTime = context.currentTime + offset;
    const stopTime = startTime + duration;
    const oscillator = context.createOscillator();
    const envelope = context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startTime);

    if (endFrequency) {
      oscillator.frequency.exponentialRampToValueAtTime(endFrequency, stopTime);
    }

    envelope.gain.setValueAtTime(0.0001, startTime);
    envelope.gain.exponentialRampToValueAtTime(volume, startTime + 0.012);
    envelope.gain.exponentialRampToValueAtTime(0.0001, stopTime);

    oscillator.connect(envelope);
    envelope.connect(this.masterGain);
    oscillator.start(startTime);
    oscillator.stop(stopTime + 0.02);
  }
}

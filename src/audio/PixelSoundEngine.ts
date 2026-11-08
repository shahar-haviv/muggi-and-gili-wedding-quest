const MASTER_VOLUME = 0.24;

export interface NoteDescriptor {
  readonly frequency: number;
  readonly offset?: number;
  readonly duration?: number;
  readonly type?: OscillatorType;
  readonly volume?: number;
  readonly endFrequency?: number | null;
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

/**
 * Tiny WebAudio chiptune engine. The audio context is created lazily on the
 * first sound so browsers never block autoplay, and every effect is synthesized
 * from oscillators instead of shipping audio files.
 */
export class PixelSoundEngine {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  public readonly isSupported: boolean;
  public enabled: boolean;

  constructor({ enabled = false }: { readonly enabled?: boolean } = {}) {
    this.isSupported = Boolean(window.AudioContext || window.webkitAudioContext);
    this.enabled = enabled && this.isSupported;
  }

  setEnabled(enabled: boolean): boolean {
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

  private ensureContext(): AudioContext | null {
    if (!this.isSupported) return null;

    if (!this.audioContext) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;

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

  playJingle(): void {
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

  playCelebration(): void {
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

  playStageAdvance(): void {
    this.playMelody([
      { frequency: 440, offset: 0, duration: 0.07 },
      { frequency: 659.25, offset: 0.08, duration: 0.11 },
    ]);
  }

  playUiClick(): void {
    this.playMelody([
      { frequency: 880, offset: 0, duration: 0.045, volume: 0.1 },
      { frequency: 1174.66, offset: 0.045, duration: 0.05, volume: 0.08 },
    ]);
  }

  playError(): void {
    this.playNote(196, {
      offset: 0,
      duration: 0.12,
      volume: 0.14,
      endFrequency: 147,
    });
  }

  private playMelody(notes: readonly NoteDescriptor[]): void {
    notes.forEach(({ frequency, offset = 0, duration = 0.1, type = 'square', volume = 0.15 }) => {
      this.playNote(frequency, { offset, duration, type, volume });
    });
  }

  playNote(
    frequency: number,
    {
      offset = 0,
      duration = 0.1,
      type = 'square',
      volume = 0.15,
      endFrequency = null,
    }: Omit<NoteDescriptor, 'frequency'> = {},
  ): void {
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

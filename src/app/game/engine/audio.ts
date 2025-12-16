// Web Audio API based sound effects synthesizer
// Creates NES-style sound effects programmatically

export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private muted = false;

  constructor() {
    this.initAudio();
  }

  private initAudio(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.3;
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  private ensureAudioContext(): void {
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  // Square wave generator (NES-like sound)
  private playSquareWave(frequency: number, duration: number, volume: number = 0.3): void {
    if (!this.audioContext || !this.masterGain || this.muted) return;
    this.ensureAudioContext();

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = 'square';
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Triangle wave (bass-like sound)
  private playTriangleWave(frequency: number, duration: number, volume: number = 0.3): void {
    if (!this.audioContext || !this.masterGain || this.muted) return;
    this.ensureAudioContext();

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = 'triangle';
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Noise generator (for percussion/effects)
  private playNoise(duration: number, volume: number = 0.2): void {
    if (!this.audioContext || !this.masterGain || this.muted) return;
    this.ensureAudioContext();

    const bufferSize = this.audioContext.sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    filter.type = 'highpass';
    filter.frequency.value = 1000;

    noise.buffer = buffer;
    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);

    noise.start(this.audioContext.currentTime);
  }

  // Sound effect methods
  playJump(): void {
    if (!this.audioContext) return;

    // Rising pitch jump sound
    const now = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(150, now);
    oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.15);

    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain!);

    oscillator.start(now);
    oscillator.stop(now + 0.15);
  }

  playCoin(): void {
    // High-pitched coin sound
    this.playSquareWave(988, 0.05, 0.2);
    setTimeout(() => this.playSquareWave(1319, 0.1, 0.2), 50);
  }

  playPowerUp(): void {
    // Rising arpeggio
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playSquareWave(freq, 0.1, 0.15), i * 80);
    });
  }

  playStomp(): void {
    // Quick stomp sound
    this.playSquareWave(200, 0.05, 0.3);
    setTimeout(() => this.playSquareWave(150, 0.05, 0.2), 30);
  }

  playBump(): void {
    // Bump/hit block sound
    this.playTriangleWave(100, 0.08, 0.3);
  }

  playBreak(): void {
    // Brick breaking sound
    this.playNoise(0.1, 0.3);
    this.playSquareWave(80, 0.1, 0.2);
  }

  playDeath(): void {
    // Descending death sound
    if (!this.audioContext) return;

    const now = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(600, now);
    oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.5);

    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.setValueAtTime(0.2, now + 0.3);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain!);

    oscillator.start(now);
    oscillator.stop(now + 0.5);
  }

  playOneUp(): void {
    // 1-UP jingle
    const notes = [330, 392, 523, 392, 523, 698];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playSquareWave(freq, 0.1, 0.15), i * 100);
    });
  }

  playFlagpole(): void {
    // Flagpole celebration sound
    const notes = [262, 330, 392, 523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playSquareWave(freq, 0.15, 0.15), i * 80);
    });
  }

  playPipe(): void {
    // Pipe enter sound
    this.playTriangleWave(200, 0.1, 0.3);
    setTimeout(() => this.playTriangleWave(150, 0.2, 0.3), 100);
  }

  playFireball(): void {
    // Fireball throw sound
    if (!this.audioContext) return;

    const now = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(800, now);
    oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.1);

    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain!);

    oscillator.start(now);
    oscillator.stop(now + 0.1);
  }

  playKick(): void {
    // Shell kick sound
    this.playSquareWave(300, 0.05, 0.25);
    setTimeout(() => this.playSquareWave(200, 0.05, 0.2), 30);
  }

  // Background music (simple looping melody)
  private musicInterval: number | null = null;

  startMusic(): void {
    if (this.musicInterval || this.muted) return;

    // Simple 4-bar melody inspired by classic platformers
    const melody = [
      { note: 659, dur: 0.15 }, // E5
      { note: 659, dur: 0.15 },
      { note: 0, dur: 0.15 },   // Rest
      { note: 659, dur: 0.15 },
      { note: 0, dur: 0.15 },
      { note: 523, dur: 0.15 }, // C5
      { note: 659, dur: 0.3 },  // E5
      { note: 784, dur: 0.3 },  // G5
      { note: 0, dur: 0.3 },
      { note: 392, dur: 0.3 },  // G4
      { note: 0, dur: 0.3 },
    ];

    let noteIndex = 0;
    const playNextNote = () => {
      const note = melody[noteIndex];
      if (note.note > 0) {
        this.playSquareWave(note.note, note.dur * 0.9, 0.1);
      }
      noteIndex = (noteIndex + 1) % melody.length;
    };

    // Play at ~120 BPM
    this.musicInterval = window.setInterval(playNextNote, 150);
  }

  stopMusic(): void {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    if (this.muted) {
      this.stopMusic();
    }
    return this.muted;
  }

  isMuted(): boolean {
    return this.muted;
  }

  setVolume(volume: number): void {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
    }
  }
}

// Singleton instance
export const audioEngine = new AudioEngine();

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private activeOscillators: Map<string, { osc: OscillatorNode; gain: GainNode }> = new Map();

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public playTone(id: string, frequency: number, durationMs?: number) {
    if (frequency <= 0) {
      this.stopTone(id);
      return;
    }

    try {
      const ctx = this.getContext();
      this.stopTone(id);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square'; // Typical piezo buzzer sound
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime); // Comfortable volume

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      this.activeOscillators.set(id, { osc, gain });

      if (durationMs && durationMs > 0) {
        setTimeout(() => {
          this.stopTone(id);
        }, durationMs);
      }
    } catch (e) {
      console.warn('Audio playTone error:', e);
    }
  }

  public stopTone(id: string) {
    const active = this.activeOscillators.get(id);
    if (active) {
      try {
        active.gain.gain.setValueAtTime(0, this.getContext().currentTime);
        active.osc.stop();
        active.osc.disconnect();
        active.gain.disconnect();
      } catch {
        // ignore
      }
      this.activeOscillators.delete(id);
    }
  }

  public stopAll() {
    this.activeOscillators.forEach((_, id) => {
      this.stopTone(id);
    });
    this.activeOscillators.clear();
  }
}

export const audioSynth = new AudioSynthesizer();

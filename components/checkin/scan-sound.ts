/**
 * Web Audio API tone generation for check-in feedback.
 * Shared AudioContext instance, auto-resumes on first user gesture.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

async function playTone(frequency: number, durationMs: number, volume: number) {
  const ctx = getAudioContext();

  // Resume if suspended (browser autoplay policy)
  if (ctx.state === "suspended") {
    await ctx.resume();
  }

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
  gainNode.gain.setValueAtTime(volume, ctx.currentTime);
  // Quick fade out to avoid click
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + durationMs / 1000);
}

/** 800Hz success beep, 150ms */
export function playSuccessSound() {
  playTone(800, 150, 0.3);
}

/** 200Hz error buzz, 200ms */
export function playErrorSound() {
  playTone(200, 200, 0.3);
}

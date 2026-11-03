let context: AudioContext | null = null;
/** Unlock during the Done tap so iOS permits the confirmation after the network response. */
export function prepareCompletionSound() {
  try {
    context ??= new AudioContext();
    void context.resume().catch(() => {});
  } catch {
    /* Sound is optional. */
  }
}
export function playCompletionSound() {
  if (!context || context.state !== "running") return;
  const audio = context;
  const start = audio.currentTime;
  [659.25, 830.61, 987.77].forEach((frequency, i) => {
    const oscillator = audio.createOscillator(),
      gain = audio.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0, start + i * 0.1);
    gain.gain.linearRampToValueAtTime(0.09, start + i * 0.1 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, start + i * 0.1 + 0.45);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start(start + i * 0.1);
    oscillator.stop(start + i * 0.1 + 0.5);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
    };
  });
}

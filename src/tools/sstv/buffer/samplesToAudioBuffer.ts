import { Sample } from '@/tools/sstv/types';

const SILENCE = 1;

export const samplesToAudioBuffer = async (sampleRate: number, samples: Sample[]): Promise<AudioBuffer | null> => {
  const totalDurationSec = samples.reduce((sum, s) => sum + s.durationMs / 1000, SILENCE);
  const audioCtx = new window.OfflineAudioContext(1, Math.ceil(sampleRate * totalDurationSec), sampleRate);

  if (!audioCtx) {
    return null;
  }

  const oscillator = audioCtx.createOscillator();
  oscillator.type = 'sine';

  const gainNode = audioCtx.createGain();
  gainNode.gain.value = 0;

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  let t = SILENCE;
  samples.forEach(({ freq, durationMs }) => {
    oscillator.frequency.setValueAtTime(freq, t);
    gainNode.gain.setValueAtTime(0.8, t);
    t += durationMs / 1000;
  });

  gainNode.gain.setValueAtTime(0, t);

  oscillator.start();
  oscillator.stop(t + SILENCE);
  return audioCtx.startRendering();
};


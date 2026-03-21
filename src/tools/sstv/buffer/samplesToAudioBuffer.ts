import { Sample } from '@/tools/sstv/types';

export const samplesToAudioBuffer = async (sampleRate: number, samples: Sample[]): Promise<AudioBuffer | null> => {
  const totalDurationSec = samples.reduce((sum, s) => sum + s.durationMs / 1000, 0);
  const audioCtx = new window.OfflineAudioContext(1, sampleRate * totalDurationSec, sampleRate);

  if (!audioCtx) {
    return null;
  }

  const oscillator = audioCtx.createOscillator();
  oscillator.type = 'sine';

  const gainNode = audioCtx.createGain();
  gainNode.gain.value = 0.8;

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  let t = 0;
  oscillator.start();
  samples.forEach(({ freq, durationMs }) => {
    oscillator.frequency.setValueAtTime(freq, t);
    t += durationMs / 1000;
  });
  oscillator.stop(t);

  return audioCtx.startRendering();
};


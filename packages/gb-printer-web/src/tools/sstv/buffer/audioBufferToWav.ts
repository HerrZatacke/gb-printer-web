import { BufferWriter } from '@/tools/BufferWriter';

export const audioBufferToWav = (audioBuffer: AudioBuffer): Blob => {
  const numChannels = audioBuffer.numberOfChannels;
  const length = audioBuffer.length;
  const sampleRate = audioBuffer.sampleRate;
  const bytesPerSample = 2; // =16bit
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = length * blockAlign;
  const bufferWriter = new BufferWriter(44 + dataSize);

  const writeString = (s: string) => {
    for (let i = 0; i < s.length; i++) {
      bufferWriter.setUint8(s.charCodeAt(i));
    }
  };

  // RIFF header
  writeString('RIFF');
  bufferWriter.setUint32(36 + dataSize, true);
  writeString('WAVE');

  // fmt chunk
  writeString('fmt ');
  bufferWriter.setUint32(16, true); // PCM chunk size
  bufferWriter.setUint16(1, true);  // PCM format
  bufferWriter.setUint16(numChannels, true);
  bufferWriter.setUint32(sampleRate, true);
  bufferWriter.setUint32(byteRate, true);
  bufferWriter.setUint16(blockAlign, true);
  bufferWriter.setUint16(bytesPerSample * 8, true);

  // data chunk
  writeString('data');
  bufferWriter.setUint32(dataSize, true);

  // write interleaved samples
  const channels = [];
  for (let ch = 0; ch < numChannels; ch++) {
    channels.push(audioBuffer.getChannelData(ch));
  }

  for (let i = 0; i < length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = channels[ch][i];
      const clamped = Math.max(-1, Math.min(1, sample));
      const value = clamped < 0 ? sample * 0x8000 : sample * 0x7FFF;
      bufferWriter.setInt16(value, true);
    }
  }

  return new Blob([bufferWriter.getBuffer()], { type: 'audio/wav' });
};

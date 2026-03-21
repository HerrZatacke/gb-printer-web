import { getSettings } from './getSettings';
import { blobToImageData, pixelToFreq, valueToSample } from './tools';
import { ModeType, type Sample, type SSTVSettings } from './types';

const createVIS = (settings: SSTVSettings): Sample[] => {
  let parity = 0;

  const samples: Sample[] = [
    // Leader + break + leader
    valueToSample(settings.leaderFreq, settings.leaderMs),
    valueToSample(settings.breakFreq, settings.breakMs),
    valueToSample(settings.leaderFreq, settings.leaderMs),
    // Start bit
    valueToSample(settings.startStopBitFreq, settings.visBitMs),
    ...(
      Array.from({ length: 7 }, (_, i) => i)
        .map((index) => {
          // eslint-disable-next-line no-bitwise
          const bit = (settings.visCode >> index) & 1;
          // eslint-disable-next-line no-bitwise
          parity ^= bit;
          return valueToSample(bit ? settings.highBitFreq : settings.lowBitFreq, settings.visBitMs);
        })
    ),
    // Parity bit
    valueToSample(parity ? settings.highBitFreq : settings.lowBitFreq, settings.visBitMs),
    // Stop bit
    valueToSample(settings.startStopBitFreq, settings.visBitMs),
  ];

  return samples;
};

const createGBRLine = (settings: SSTVSettings, rawRGBA: Uint8ClampedArray): Sample[] => {
  const samples: Sample[] = [];

  for (const channel of ['g', 'b', 'r']) {
    for (let x = 0; x < settings.width; x += 1) {
      const pixelIndex = x * 4;
      const colorValue = channel === 'r' ? rawRGBA[pixelIndex] : channel === 'g' ? rawRGBA[pixelIndex+1] : rawRGBA[pixelIndex+2];
      samples.push(valueToSample(pixelToFreq(settings, colorValue), settings.pixelMs));
    }

    if (channel !== 'r') {
      samples.push(valueToSample(settings.porchFreq, settings.porchMs));
    }
  }

  return samples;
};


const createYLine = (settings: SSTVSettings, rawRGBA: Uint8ClampedArray): Sample[] => {
  const samples: Sample[] = [];

  for (let x = 0; x < settings.width; x += 1) {
    const i = x * 4;

    const r = rawRGBA[i];
    const g = rawRGBA[i + 1];
    const b = rawRGBA[i + 2];

    const y  =  0.299 * r + 0.587 * g + 0.114 * b;

    samples.push(valueToSample(pixelToFreq(settings, y), settings.pixelMs));
  }

  // Porch after Y
  samples.push(valueToSample(settings.porchFreq, settings.porchMs));

  return samples;
};

const createChromaLine = (settings: SSTVSettings, rawRGBA: Uint8ClampedArray, useCb: boolean): Sample[] => {
  const samples: Sample[] = [];

  for (let x = 0; x < settings.width; x += 1) {
    const i = x * 4;

    const r = rawRGBA[i];
    const g = rawRGBA[i + 1];
    const b = rawRGBA[i + 2];

    const value = useCb
      ? 128 - 0.168736 * r - 0.331264 * g + 0.5 * b
      : 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

    samples.push(valueToSample(pixelToFreq(settings, value), settings.pixelMs));
  }

  samples.push(valueToSample(settings.porchFreq, settings.porchMs));

  return samples;
};

export const generateSamples = async (pngBlob: Blob, mode: ModeType) => {
  const settings = getSettings(mode);

  const data = await blobToImageData(pngBlob, settings.width, settings.height);
  const samples: Sample[] = [
    ...createVIS(settings),
  ];

  // const testVis = [
  //   { 'freq': 1900, 'durationMs': 300 },  // Leader
  //   { 'freq': 1200, 'durationMs': 10 },   // Break
  //   { 'freq': 1900, 'durationMs': 300 },  // Leader repeat
  //   { 'freq': 1200, 'durationMs': 30 },   // Start bit
  //   { 'freq': 1200, 'durationMs': 30 },   // Bit 0 → 1
  //   { 'freq': 1900, 'durationMs': 30 },   // Bit 1 → 0
  //   { 'freq': 1900, 'durationMs': 30 },   // Bit 2 → 0
  //   { 'freq': 1200, 'durationMs': 30 },   // Bit 3 → 1
  //   { 'freq': 1900, 'durationMs': 30 },   // Bit 4 → 0
  //   { 'freq': 1900, 'durationMs': 30 },   // Bit 5 → 0
  //   { 'freq': 1900, 'durationMs': 30 },   // Bit 6 → 0
  //   { 'freq': 1900, 'durationMs': 30 },   // Parity bit (even parity → 0 → 1900)
  //   { 'freq': 1200, 'durationMs': 30 },    // Stop bit
  // ];
  //
  //
  // console.log(JSON.stringify(settings, null, 2));
  // console.log(JSON.stringify(samples, null, 2));
  // if (JSON.stringify(testVis) === JSON.stringify(samples)) {
  //   samples = testVis;
  // }

  // Image lines
  for (let y = 0; y < settings.height; y += 1) {
    // Sync + porch
    samples.push(valueToSample(settings.syncFreq, settings.syncMs));
    samples.push(valueToSample(settings.porchFreq, settings.porchMs));
    const lineData = data.subarray(y * settings.width * 4, (y + 1) * settings.width * 4);

    switch (mode) {
      case ModeType.MARTIN_1:
      case ModeType.MARTIN_2:
        samples.push(...createGBRLine(settings, lineData));
        break;
      case ModeType.ROBOT_32:
      case ModeType.ROBOT_36:
      case ModeType.ROBOT_72:
        throw new Error('Not corretly implemented');
        samples.push(...createYLine(settings, lineData));
        samples.push(...createChromaLine(settings, lineData, Boolean(y % 2)));
        break;
    }
  }

  return samples;
};

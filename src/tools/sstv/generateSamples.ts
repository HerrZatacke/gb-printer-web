import { getSettings, voxTones } from './getSettings';
import { blobToImageData, pixelToFreq, valueToSample } from './tools';
import { ModeType, RGBChannel, type Sample, type SSTVSettings, type SamplesResult } from './types';

const createVoxTones = (): Sample[] => {
  const samples: Sample[] = [
    valueToSample(voxTones.freqToneMid, voxTones.durationMs),
    valueToSample(voxTones.freqToneLow, voxTones.durationMs),
    valueToSample(voxTones.freqToneMid, voxTones.durationMs),
    valueToSample(voxTones.freqToneLow, voxTones.durationMs),
    valueToSample(voxTones.freqToneHigh, voxTones.durationMs),
    valueToSample(voxTones.freqToneLow, voxTones.durationMs),
    valueToSample(voxTones.freqToneHigh, voxTones.durationMs),
    valueToSample(voxTones.freqToneLow, voxTones.durationMs),
  ];

  return samples;
};

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

const createRGBLine = (settings: SSTVSettings, channelOrder: RGBChannel[], rawRGBA: Uint8ClampedArray): Sample[] => {
  const pixelOffsets: Record<RGBChannel, number> = {
    [RGBChannel.RED]: 0,
    [RGBChannel.GREEN]: 1,
    [RGBChannel.BLUE]: 2,
  };

  const pxWidth = rawRGBA.length / 4;
  const pxMs = settings.channelDurationMs / pxWidth;

  const lineParts = channelOrder.map((channel) => {
    const linePartSamples: Sample[] = [
      valueToSample(settings.porchFreq, settings.porchMs),
    ];
    for (let x = 0; x < settings.width; x += 1) {
      const pixelIndex = x * 4 + pixelOffsets[channel];
      const colorValue = rawRGBA[pixelIndex];
      linePartSamples.push(valueToSample(pixelToFreq(settings, colorValue), pxMs));
    }

    return linePartSamples;
  });

  return [
    ...lineParts[0],
    ...lineParts[1],
    ...lineParts[2],
  ];
};


const createYLine = (settings: SSTVSettings, rawRGBA: Uint8ClampedArray): Sample[] => {
  const samples: Sample[] = [
    valueToSample(settings.porchFreq, settings.porchMs),
  ];

  const pxWidth = rawRGBA.length / 4;
  const pxMs = settings.channelDurationMs / pxWidth;

  for (let x = 0; x < settings.width; x += 1) {
    const i = x * 4;

    const r = rawRGBA[i];
    const g = rawRGBA[i + 1];
    const b = rawRGBA[i + 2];

    const y  =  0.299 * r + 0.587 * g + 0.114 * b;

    samples.push(valueToSample(pixelToFreq(settings, y), pxMs));
  }

  return samples;
};

const createChromaLine = (settings: SSTVSettings, rawRGBA: Uint8ClampedArray, useCb: boolean): Sample[] => {
  const samples: Sample[] = [
    valueToSample(useCb ? settings.freqWhite : settings.freqBlack, settings.porchMs),
  ];

  const pxWidth = rawRGBA.length / 4;
  const pxMs = (settings.channelDurationMs / 2) / pxWidth;

  for (let x = 0; x < settings.width; x += 1) {
    const i = x * 4;

    const r = rawRGBA[i];
    const g = rawRGBA[i + 1];
    const b = rawRGBA[i + 2];

    const value = useCb
      ? 128 - 0.168736 * r - 0.331264 * g + 0.5 * b
      : 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

    samples.push(valueToSample(pixelToFreq(settings, value), pxMs));
  }

  return samples;
};

export const generateSamples = async (pngBlob: Blob, mode: ModeType): Promise<SamplesResult> => {
  const settings = getSettings(mode);

  const data = await blobToImageData(pngBlob, settings);
  const samples: Sample[] = [
    ...createVoxTones(),
    ...createVIS(settings),
  ];

  // Image lines
  for (let y = 0; y < settings.height; y += 1) {
    // Sync
    samples.push(valueToSample(settings.syncFreq, settings.syncMs));
    const lineData = data.subarray(y * settings.width * 4, (y + 1) * settings.width * 4);

    switch (mode) {
      case ModeType.MARTIN_1:
      case ModeType.MARTIN_2:
        samples.push(...createRGBLine(settings, [RGBChannel.GREEN, RGBChannel.BLUE, RGBChannel.RED], lineData));
        break;
      // case ModeType.ROBOT_8:
      // case ModeType.ROBOT_12:
      // case ModeType.ROBOT_24:
      case ModeType.ROBOT_36:
        samples.push(...createYLine(settings, lineData));
        samples.push(...createChromaLine(settings, lineData, Boolean(y % 2)));
        break;
      case ModeType.ROBOT_72:
        samples.push(...createYLine(settings, lineData));
        samples.push(...createChromaLine(settings, lineData, false));
        samples.push(...createChromaLine(settings, lineData, true));
        break;
      case ModeType.SCOTTIE_1:
      case ModeType.SCOTTIE_2:
      case ModeType.SCOTTIE_DX:
        throw new Error('Not implemented');
        break;
    }
  }

  return {
    samples,
    settings,
  };
};

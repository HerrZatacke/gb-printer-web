/* eslint-disable no-bitwise */
import type { CustomMetaData, RomByteOffsets } from './types';
import { RomTypes } from './types';
import {
  // Addresses
  byteOffsetsPXLR,
  byteOffsetsPhoto,

  // Masks
  maskCapture,
  maskEdgeExclusive,
  maskEdgeOpMode,
  maskGain,
  maskEdgeRatio,
  maskInvertOutput,
  maskVoltageRef,
  maskZeroPoint,
  maskVoltageOut,
  maskDitherSet,
  maskDitherOnOff,

  // Values
  valuesCapture,
  valuesGain,
  valuesEdgeOpMode,
  valuesEdgeExclusive,
  valuesEdgeRatio,
  valuesInvertOutput,
  valuesVoltageRef,
  valuesZeroPoint,
  valuesVoltageOut,
  valuesDither,
} from './valueDefs';

const getExposureTime = (exposureHigh: number, exposureLow: number): string => {
  const exposureTimeMultiplierHigh = 0.016;
  const exposureTimeMultiplierLow = 4.096;

  const timeMs = (
    (exposureTimeMultiplierHigh * exposureHigh) +
    (exposureTimeMultiplierLow * exposureLow)
  );

  return timeMs < 10 ? `${timeMs.toFixed(1)}ms` : `${Math.floor(timeMs)}ms`;
};

const getCaptureMode = (captureMode: number): string => {
  switch (captureMode) {
    case valuesCapture.positive: return 'positive';
    case valuesCapture.negative: return 'negative';
    default: return 'unknown';
  }
};

const getEdgeExclusive = (edgeExclusive: number): string => {
  switch (edgeExclusive) {
    case valuesEdgeExclusive.on: return 'on';
    case valuesEdgeExclusive.off: return 'off';
    default: return 'unknown';
  }
};

const getEdgeOpMode = (edgeOpMode: number): string => {
  switch (edgeOpMode) {
    case valuesEdgeOpMode.none: return 'none';
    case valuesEdgeOpMode.horizontal: return 'horizontal';
    case valuesEdgeOpMode.vertical: return 'vertical';
    case valuesEdgeOpMode['2d']: return '2d';
    default: return 'unknown';
  }
};

const getGain = (gain: number): string => {
  switch (gain) {
    case valuesGain['140']: return '14.0';
    case valuesGain['155']: return '15.5';
    case valuesGain['170']: return '17.0';
    case valuesGain['185']: return '18.5';
    case valuesGain['200']: return '20.0';
    case valuesGain['200Dup']: return '20.0 (d)';
    case valuesGain['215']: return '21.5';
    case valuesGain['215Dup']: return '21.5 (d)';
    case valuesGain['230']: return '23.0';
    case valuesGain['230Dup']: return '23.0 (d)';
    case valuesGain['245']: return '24.5';
    case valuesGain['245Dup']: return '24.5 (d)';
    case valuesGain['260']: return '26.0';
    case valuesGain['260Dup']: return '26.0 (d)';
    case valuesGain['275']: return '27.5';
    case valuesGain['290']: return '29.0';
    case valuesGain['290Dup']: return '29.0 (d)';
    case valuesGain['305']: return '30.5';
    case valuesGain['320']: return '32.0';
    case valuesGain['320Dup']: return '32.0 (d)';
    case valuesGain['350']: return '35.0';
    case valuesGain['350Dup']: return '35.0 (d)';
    case valuesGain['380']: return '38.0';
    case valuesGain['380Dup']: return '38.0 (d)';
    case valuesGain['410']: return '41.0';
    case valuesGain['410Dup']: return '41.0 (d)';
    case valuesGain['440']: return '44.0';
    case valuesGain['455']: return '45.5';
    case valuesGain['470']: return '47.0';
    case valuesGain['515']: return '51.5';
    case valuesGain['515Dup']: return '51.5 (d)';
    case valuesGain['575']: return '57.5';
    default: return 'unknown';
  }
};

const getEdgeMode = (edgeMode: number): string => {
  switch (edgeMode) {
    case valuesEdgeRatio['050']: return '50%';
    case valuesEdgeRatio['075']: return '75%';
    case valuesEdgeRatio['100']: return '100%';
    case valuesEdgeRatio['125']: return '125%';
    case valuesEdgeRatio['200']: return '200%';
    case valuesEdgeRatio['300']: return '300%';
    case valuesEdgeRatio['400']: return '400%';
    case valuesEdgeRatio['500']: return '500%';
    default: return 'unknown';
  }
};

const getInvertOut = (invertOut: number): string => {
  switch (invertOut) {
    case valuesInvertOutput.on: return 'on';
    case valuesInvertOutput.off: return 'off';
    default: return 'unknown';
  }
};

const getVoltageRef = (vRef: number): string => {
  switch (vRef) {
    case valuesVoltageRef['00v']: return '0.0V';
    case valuesVoltageRef['05v']: return '0.5V';
    case valuesVoltageRef['10v']: return '1.0V';
    case valuesVoltageRef['15v']: return '1.5V';
    case valuesVoltageRef['20v']: return '2.0V';
    case valuesVoltageRef['25v']: return '2.5V';
    case valuesVoltageRef['30v']: return '3.0V';
    case valuesVoltageRef['35v']: return '3.5V';
    default: return 'unknown';
  }
};

const getZeroPoint = (zeroPoint: number): string => {
  switch (zeroPoint) {
    case valuesZeroPoint.disabled: return 'none';
    case valuesZeroPoint.positive: return 'positive';
    case valuesZeroPoint.negative: return 'negative';
    default: return 'unknown';
  }
};

const getVoltageOut = (vOut: number): string => {
  switch (vOut) {
    case valuesVoltageOut.neg992: return '-0.992mV';
    case valuesVoltageOut.neg960: return '-0.960mV';
    case valuesVoltageOut.neg928: return '-0.928mV';
    case valuesVoltageOut.neg896: return '-0.896mV';
    case valuesVoltageOut.neg864: return '-0.864mV';
    case valuesVoltageOut.neg832: return '-0.832mV';
    case valuesVoltageOut.neg800: return '-0.800mV';
    case valuesVoltageOut.neg768: return '-0.768mV';
    case valuesVoltageOut.neg736: return '-0.736mV';
    case valuesVoltageOut.neg704: return '-0.704mV';
    case valuesVoltageOut.neg672: return '-0.672mV';
    case valuesVoltageOut.neg640: return '-0.640mV';
    case valuesVoltageOut.neg608: return '-0.608mV';
    case valuesVoltageOut.neg576: return '-0.576mV';
    case valuesVoltageOut.neg544: return '-0.544mV';
    case valuesVoltageOut.neg512: return '-0.512mV';
    case valuesVoltageOut.neg480: return '-0.480mV';
    case valuesVoltageOut.neg448: return '-0.448mV';
    case valuesVoltageOut.neg416: return '-0.416mV';
    case valuesVoltageOut.neg384: return '-0.384mV';
    case valuesVoltageOut.neg352: return '-0.352mV';
    case valuesVoltageOut.neg320: return '-0.320mV';
    case valuesVoltageOut.neg288: return '-0.288mV';
    case valuesVoltageOut.neg256: return '-0.256mV';
    case valuesVoltageOut.neg224: return '-0.224mV';
    case valuesVoltageOut.neg192: return '-0.192mV';
    case valuesVoltageOut.neg160: return '-0.160mV';
    case valuesVoltageOut.neg128: return '-0.128mV';
    case valuesVoltageOut.neg096: return '-0.096mV';
    case valuesVoltageOut.neg064: return '-0.064mV';
    case valuesVoltageOut.neg032: return '-0.032mV';
    case valuesVoltageOut.neg000: return '-0.000mV';
    case valuesVoltageOut.pos000: return ' 0.000mV';
    case valuesVoltageOut.pos032: return '0.032mV';
    case valuesVoltageOut.pos064: return '0.064mV';
    case valuesVoltageOut.pos096: return '0.096mV';
    case valuesVoltageOut.pos128: return '0.128mV';
    case valuesVoltageOut.pos160: return '0.160mV';
    case valuesVoltageOut.pos192: return '0.192mV';
    case valuesVoltageOut.pos224: return '0.224mV';
    case valuesVoltageOut.pos256: return '0.256mV';
    case valuesVoltageOut.pos288: return '0.288mV';
    case valuesVoltageOut.pos320: return '0.320mV';
    case valuesVoltageOut.pos352: return '0.352mV';
    case valuesVoltageOut.pos384: return '0.384mV';
    case valuesVoltageOut.pos416: return '0.416mV';
    case valuesVoltageOut.pos448: return '0.448mV';
    case valuesVoltageOut.pos480: return '0.480mV';
    case valuesVoltageOut.pos512: return '0.512mV';
    case valuesVoltageOut.pos544: return '0.544mV';
    case valuesVoltageOut.pos576: return '0.576mV';
    case valuesVoltageOut.pos608: return '0.608mV';
    case valuesVoltageOut.pos640: return '0.640mV';
    case valuesVoltageOut.pos672: return '0.672mV';
    case valuesVoltageOut.pos704: return '0.704mV';
    case valuesVoltageOut.pos736: return '0.736mV';
    case valuesVoltageOut.pos768: return '0.768mV';
    case valuesVoltageOut.pos800: return '0.800mV';
    case valuesVoltageOut.pos832: return '0.832mV';
    case valuesVoltageOut.pos864: return '0.864mV';
    case valuesVoltageOut.pos896: return '0.896mV';
    case valuesVoltageOut.pos928: return '0.928mV';
    case valuesVoltageOut.pos960: return '0.960mV';
    case valuesVoltageOut.pos992: return '0.992mV';
    default: return 'unknown';
  }
};

const getDitherSet = (ditherSet: number): string => {
  let set;
  let onoff;

  switch (ditherSet & maskDitherSet) {
    case valuesDither.setHigh: set = 'High'; break;
    case valuesDither.setLow: set = 'Low'; break;
    default: set = 'unknown'; break;
  }

  switch (ditherSet & maskDitherOnOff) {
    case valuesDither.on: onoff = 'On'; break;
    case valuesDither.off: onoff = 'Off'; break;
    default: onoff = 'unknown'; break;
  }

  return `${set}/${onoff}`;
};

export const getRomType = (thumb: Uint8Array): RomTypes => {
  // The unused lines below the thumbnail-image are:
  // * all white in the stock rom (0x00)
  // * all black in PXLR (0xff)
  // * containing the metadata in Photo
  const unusedLines: number[] = [
    0xC8, 0xC9, 0xCA, 0xCB, 0xCC, 0xCD, 0xCE, 0xCF,
    0xD8, 0xD9, 0xDA, 0xDB, 0xDC, 0xDD, 0xDE, 0xDF,
    0xE8, 0xE9, 0xEA, 0xEB, 0xEC, 0xED, 0xEE, 0xEF,
    0xF8, 0xF9, 0xFA, 0xFB, 0xFC, 0xFD, 0xFE, 0xFF,
  ];

  // const photoData = unusedLines
  const all0x00: number[] = unusedLines
    .map((addr) => thumb[addr])
    .filter((value) => value === 0x00);

  if (all0x00.length === unusedLines.length) {
    return RomTypes.STOCK;
  }

  const all0xff: number[] = unusedLines
    .map((addr) => thumb[addr])
    .filter((value) => value === 0xFF);

  if (all0xff.length === unusedLines.length) {
    return RomTypes.PXLR;
  }

  return RomTypes.PHOTO;
};

export const parseCustomMetadata = (thumbnail: Uint8Array, romType: RomTypes): CustomMetaData | null => {
  let offsets: RomByteOffsets;

  switch (romType) {
    case RomTypes.PHOTO:
      offsets = byteOffsetsPhoto;
      break;
    case RomTypes.PXLR:
      offsets = byteOffsetsPXLR;
      break;
    default:
      return null;
  }

  const exposureHigh = thumbnail[offsets.thumbnailByteExposureHigh];
  const exposureLow = thumbnail[offsets.thumbnailByteExposureLow];
  const captureMode = thumbnail[offsets.thumbnailByteCapture] & maskCapture;
  const edgeExclusive = thumbnail[offsets.thumbnailByteEdgegains] & maskEdgeExclusive;
  const edgeOperation = thumbnail[offsets.thumbnailByteEdgegains] & maskEdgeOpMode;
  const gain = thumbnail[offsets.thumbnailByteEdgegains] & maskGain;
  const edgeMode = thumbnail[offsets.thumbnailByteEdmovolt] & maskEdgeRatio;
  const invertOut = thumbnail[offsets.thumbnailByteEdmovolt] & maskInvertOutput;
  const vRef = thumbnail[offsets.thumbnailByteEdmovolt] & maskVoltageRef;
  const zeroPoint = thumbnail[offsets.thumbnailByteVoutzero] & maskZeroPoint;
  const vOut = thumbnail[offsets.thumbnailByteVoutzero] & maskVoltageOut;
  const ditherset = thumbnail[offsets.thumbnailByteDitherset];
  const contrast = thumbnail[offsets.thumbnailByteContrast];

  if (romType === RomTypes.PHOTO) {
    return {
      romType,
      exposure: getExposureTime(exposureHigh, exposureLow),
      captureMode: getCaptureMode(captureMode),
      edgeExclusive: getEdgeExclusive(edgeExclusive),
      edgeOperation: getEdgeOpMode(edgeOperation),
      gain: getGain(gain),
      edgeMode: getEdgeMode(edgeMode),
      invertOut: getInvertOut(invertOut),
      voltageRef: getVoltageRef(vRef),
      zeroPoint: getZeroPoint(zeroPoint),
      vOut: getVoltageOut(vOut),
    };
  }

  return {
    romType,
    exposure: getExposureTime(exposureHigh, exposureLow),
    captureMode: getCaptureMode(captureMode),
    edgeExclusive: getEdgeExclusive(edgeExclusive),
    edgeOperation: getEdgeOpMode(edgeOperation),
    gain: getGain(gain),
    edgeMode: getEdgeMode(edgeMode),
    invertOut: getInvertOut(invertOut),
    voltageRef: getVoltageRef(vRef),
    zeroPoint: getZeroPoint(zeroPoint),
    vOut: getVoltageOut(vOut),
    ditherset: getDitherSet(ditherset),
    contrast: contrast + 1,
  };

};

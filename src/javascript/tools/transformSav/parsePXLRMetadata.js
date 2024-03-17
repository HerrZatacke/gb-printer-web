/* eslint-disable no-bitwise */
import {
  // Addresses
  thumbnailByteExposureHigh,
  thumbnailByteExposureLow,
  thumbnailByteCapture,
  thumbnailByteEdgegains,
  thumbnailByteEdmovolt,
  thumbnailByteVoutzero,
  thumbnailByteContrast,
  thumbnailByteDitherset,

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
  valueCapturePositive,
  valueCaptureNegative,
  valueEdgeExclusiveOn,
  valueEdgeExclusiveOff,
  valueEdgeOpModeNone,
  valueEdgeOpModeHorizontal,
  valueEdgeOpModeVertical,
  valueEdgeOpMode2d,
  valueGain140,
  valueGain155,
  valueGain170,
  valueGain185,
  valueGain200,
  valueGain200Dup,
  valueGain215,
  valueGain215Dup,
  valueGain230,
  valueGain230Dup,
  valueGain245,
  valueGain245Dup,
  valueGain260,
  valueGain260Dup,
  valueGain275,
  valueGain290,
  valueGain290Dup,
  valueGain305,
  valueGain320,
  valueGain320Dup,
  valueGain350,
  valueGain350Dup,
  valueGain380,
  valueGain380Dup,
  valueGain410,
  valueGain410Dup,
  valueGain440,
  valueGain455,
  valueGain470,
  valueGain515,
  valueGain515Dup,
  valueGain575,
  valueEdgeRatio050,
  valueEdgeRatio075,
  valueEdgeRatio100,
  valueEdgeRatio125,
  valueEdgeRatio200,
  valueEdgeRatio300,
  valueEdgeRatio400,
  valueEdgeRatio500,
  valueInvertOutputOn,
  valueInvertOutputOff,
  valueVoltageRef00,
  valueVoltageRef05,
  valueVoltageRef10,
  valueVoltageRef15,
  valueVoltageRef20,
  valueVoltageRef25,
  valueVoltageRef30,
  valueVoltageRef35,
  valueZeroPointDisabled,
  valueZeroPointPositive,
  valueZeroPointNegative,
  valueVoltageOutNeg992,
  valueVoltageOutNeg960,
  valueVoltageOutNeg928,
  valueVoltageOutNeg896,
  valueVoltageOutNeg864,
  valueVoltageOutNeg832,
  valueVoltageOutNeg800,
  valueVoltageOutNeg768,
  valueVoltageOutNeg736,
  valueVoltageOutNeg704,
  valueVoltageOutNeg672,
  valueVoltageOutNeg640,
  valueVoltageOutNeg608,
  valueVoltageOutNeg576,
  valueVoltageOutNeg544,
  valueVoltageOutNeg512,
  valueVoltageOutNeg480,
  valueVoltageOutNeg448,
  valueVoltageOutNeg416,
  valueVoltageOutNeg384,
  valueVoltageOutNeg352,
  valueVoltageOutNeg320,
  valueVoltageOutNeg288,
  valueVoltageOutNeg256,
  valueVoltageOutNeg224,
  valueVoltageOutNeg192,
  valueVoltageOutNeg160,
  valueVoltageOutNeg128,
  valueVoltageOutNeg096,
  valueVoltageOutNeg064,
  valueVoltageOutNeg032,
  valueVoltageOutNeg000,
  valueVoltageOutPos000,
  valueVoltageOutPos032,
  valueVoltageOutPos064,
  valueVoltageOutPos096,
  valueVoltageOutPos128,
  valueVoltageOutPos160,
  valueVoltageOutPos192,
  valueVoltageOutPos224,
  valueVoltageOutPos256,
  valueVoltageOutPos288,
  valueVoltageOutPos320,
  valueVoltageOutPos352,
  valueVoltageOutPos384,
  valueVoltageOutPos416,
  valueVoltageOutPos448,
  valueVoltageOutPos480,
  valueVoltageOutPos512,
  valueVoltageOutPos544,
  valueVoltageOutPos576,
  valueVoltageOutPos608,
  valueVoltageOutPos640,
  valueVoltageOutPos672,
  valueVoltageOutPos704,
  valueVoltageOutPos736,
  valueVoltageOutPos768,
  valueVoltageOutPos800,
  valueVoltageOutPos832,
  valueVoltageOutPos864,
  valueVoltageOutPos896,
  valueVoltageOutPos928,
  valueVoltageOutPos960,
  valueVoltageOutPos992,
  valueDitherSetHigh,
  valueDitherSetLow,
  valueDitherOn,
  valueDitherOff,
} from './valueDefs';

const getExposureTime = (exposureHigh, exposureLow) => {
  const exposureTimeMultiplierHigh = 0.016;
  const exposureTimeMultiplierLow = 4.096;

  const timeMs = (
    (exposureTimeMultiplierHigh * exposureHigh) +
    (exposureTimeMultiplierLow * exposureLow)
  );

  return timeMs < 10 ? `${timeMs.toFixed(1)}ms` : `${Math.floor(timeMs)}ms`;
};

const getCaptureMode = (captureMode) => {
  switch (captureMode) {
    case valueCapturePositive: return 'positive';
    case valueCaptureNegative: return 'negative';
    default: return 'unknown';
  }
};

const getEdgeExclusive = (edgeExclusive) => {
  switch (edgeExclusive) {
    case valueEdgeExclusiveOn: return 'on';
    case valueEdgeExclusiveOff: return 'off';
    default: return 'unknown';
  }
};

const getEdgeOpMode = (edgeOpMode) => {
  switch (edgeOpMode) {
    case valueEdgeOpModeNone: return 'none';
    case valueEdgeOpModeHorizontal: return 'horizontal';
    case valueEdgeOpModeVertical: return 'vertical';
    case valueEdgeOpMode2d: return '2d';
    default: return 'unknown';
  }
};

const getGain = (gain) => {
  switch (gain) {
    case valueGain140: return '14.0';
    case valueGain155: return '15.5';
    case valueGain170: return '17.0';
    case valueGain185: return '18.5';
    case valueGain200: return '20.0';
    case valueGain200Dup: return '20.0 (d)';
    case valueGain215: return '21.5';
    case valueGain215Dup: return '21.5 (d)';
    case valueGain230: return '23.0';
    case valueGain230Dup: return '23.0 (d)';
    case valueGain245: return '24.5';
    case valueGain245Dup: return '24.5 (d)';
    case valueGain260: return '26.0';
    case valueGain260Dup: return '26.0 (d)';
    case valueGain275: return '27.5';
    case valueGain290: return '29.0';
    case valueGain290Dup: return '29.0 (d)';
    case valueGain305: return '30.5';
    case valueGain320: return '32.0';
    case valueGain320Dup: return '32.0 (d)';
    case valueGain350: return '35.0';
    case valueGain350Dup: return '35.0 (d)';
    case valueGain380: return '38.0';
    case valueGain380Dup: return '38.0 (d)';
    case valueGain410: return '41.0';
    case valueGain410Dup: return '41.0 (d)';
    case valueGain440: return '44.0';
    case valueGain455: return '45.5';
    case valueGain470: return '47.0';
    case valueGain515: return '51.5';
    case valueGain515Dup: return '51.5 (d)';
    case valueGain575: return '57.5';
    default: return 'unknown';
  }
};

const getEdgeMode = (edgeMode) => {
  switch (edgeMode) {
    case valueEdgeRatio050: return '50%';
    case valueEdgeRatio075: return '75%';
    case valueEdgeRatio100: return '100%';
    case valueEdgeRatio125: return '125%';
    case valueEdgeRatio200: return '200%';
    case valueEdgeRatio300: return '300%';
    case valueEdgeRatio400: return '400%';
    case valueEdgeRatio500: return '500%';
    default: return 'unknown';
  }
};

const getInvertOut = (invertOut) => {
  switch (invertOut) {
    case valueInvertOutputOn: return 'on';
    case valueInvertOutputOff: return 'off';
    default: return 'unknown';
  }
};

const getVoltageRef = (vRef) => {
  switch (vRef) {
    case valueVoltageRef00: return '0.0V';
    case valueVoltageRef05: return '0.5V';
    case valueVoltageRef10: return '1.0V';
    case valueVoltageRef15: return '1.5V';
    case valueVoltageRef20: return '2.0V';
    case valueVoltageRef25: return '2.5V';
    case valueVoltageRef30: return '3.0V';
    case valueVoltageRef35: return '3.5V';
    default: return 'unknown';
  }
};

const getZeroPoint = (zeroPoint) => {
  switch (zeroPoint) {
    case valueZeroPointDisabled: return 'none';
    case valueZeroPointPositive: return 'positive';
    case valueZeroPointNegative: return 'negative';
    default: return 'unknown';
  }
};

const getVoltageOut = (vOut) => {
  switch (vOut) {
    case valueVoltageOutNeg992: return '-0.992mV';
    case valueVoltageOutNeg960: return '-0.960mV';
    case valueVoltageOutNeg928: return '-0.928mV';
    case valueVoltageOutNeg896: return '-0.896mV';
    case valueVoltageOutNeg864: return '-0.864mV';
    case valueVoltageOutNeg832: return '-0.832mV';
    case valueVoltageOutNeg800: return '-0.800mV';
    case valueVoltageOutNeg768: return '-0.768mV';
    case valueVoltageOutNeg736: return '-0.736mV';
    case valueVoltageOutNeg704: return '-0.704mV';
    case valueVoltageOutNeg672: return '-0.672mV';
    case valueVoltageOutNeg640: return '-0.640mV';
    case valueVoltageOutNeg608: return '-0.608mV';
    case valueVoltageOutNeg576: return '-0.576mV';
    case valueVoltageOutNeg544: return '-0.544mV';
    case valueVoltageOutNeg512: return '-0.512mV';
    case valueVoltageOutNeg480: return '-0.480mV';
    case valueVoltageOutNeg448: return '-0.448mV';
    case valueVoltageOutNeg416: return '-0.416mV';
    case valueVoltageOutNeg384: return '-0.384mV';
    case valueVoltageOutNeg352: return '-0.352mV';
    case valueVoltageOutNeg320: return '-0.320mV';
    case valueVoltageOutNeg288: return '-0.288mV';
    case valueVoltageOutNeg256: return '-0.256mV';
    case valueVoltageOutNeg224: return '-0.224mV';
    case valueVoltageOutNeg192: return '-0.192mV';
    case valueVoltageOutNeg160: return '-0.160mV';
    case valueVoltageOutNeg128: return '-0.128mV';
    case valueVoltageOutNeg096: return '-0.096mV';
    case valueVoltageOutNeg064: return '-0.064mV';
    case valueVoltageOutNeg032: return '-0.032mV';
    case valueVoltageOutNeg000: return '-0.000mV';
    case valueVoltageOutPos000: return ' 0.000mV';
    case valueVoltageOutPos032: return '0.032mV';
    case valueVoltageOutPos064: return '0.064mV';
    case valueVoltageOutPos096: return '0.096mV';
    case valueVoltageOutPos128: return '0.128mV';
    case valueVoltageOutPos160: return '0.160mV';
    case valueVoltageOutPos192: return '0.192mV';
    case valueVoltageOutPos224: return '0.224mV';
    case valueVoltageOutPos256: return '0.256mV';
    case valueVoltageOutPos288: return '0.288mV';
    case valueVoltageOutPos320: return '0.320mV';
    case valueVoltageOutPos352: return '0.352mV';
    case valueVoltageOutPos384: return '0.384mV';
    case valueVoltageOutPos416: return '0.416mV';
    case valueVoltageOutPos448: return '0.448mV';
    case valueVoltageOutPos480: return '0.480mV';
    case valueVoltageOutPos512: return '0.512mV';
    case valueVoltageOutPos544: return '0.544mV';
    case valueVoltageOutPos576: return '0.576mV';
    case valueVoltageOutPos608: return '0.608mV';
    case valueVoltageOutPos640: return '0.640mV';
    case valueVoltageOutPos672: return '0.672mV';
    case valueVoltageOutPos704: return '0.704mV';
    case valueVoltageOutPos736: return '0.736mV';
    case valueVoltageOutPos768: return '0.768mV';
    case valueVoltageOutPos800: return '0.800mV';
    case valueVoltageOutPos832: return '0.832mV';
    case valueVoltageOutPos864: return '0.864mV';
    case valueVoltageOutPos896: return '0.896mV';
    case valueVoltageOutPos928: return '0.928mV';
    case valueVoltageOutPos960: return '0.960mV';
    case valueVoltageOutPos992: return '0.992mV';
    default: return 'unknown';
  }
};

const getDitherSet = (ditherSet) => {
  let set;
  let onoff;

  switch (ditherSet & maskDitherSet) {
    case valueDitherSetHigh: set = 'High'; break;
    case valueDitherSetLow: set = 'Low'; break;
    default: set = 'unknown'; break;
  }

  switch (ditherSet & maskDitherOnOff) {
    case valueDitherOn: onoff = 'On'; break;
    case valueDitherOff: onoff = 'Off'; break;
    default: onoff = 'unknown'; break;
  }

  return `${set}/${onoff}`;
};

const isPhoto = (thumb) => {
  const whiteLines = [
    0xC8, 0xC9, 0xCA, 0xCB, 0xCC, 0xCD, 0xCE, 0xCF,
    0xD8, 0xD9, 0xDA, 0xDB, 0xDC, 0xDD, 0xDE, 0xDF,
    0xE8, 0xE9, 0xEA, 0xEB, 0xEC, 0xED, 0xEE, 0xEF,
    0xF8, 0xF9, 0xFA, 0xFB, 0xFC, 0xFD, 0xFE, 0xFF,
  ]
    .map((addr) => thumb[addr])
    .filter((value) => value !== 0xFF);

  return Boolean(whiteLines.length);
};

const parsePXLRMetadata = (thumbnail) => {
  if (isPhoto(thumbnail)) {
    return {};
  }

  const exposureHigh = thumbnail[thumbnailByteExposureHigh];
  const exposureLow = thumbnail[thumbnailByteExposureLow];
  const captureMode = thumbnail[thumbnailByteCapture] & maskCapture;
  const edgeExclusive = thumbnail[thumbnailByteEdgegains] & maskEdgeExclusive;
  const edgeOperation = thumbnail[thumbnailByteEdgegains] & maskEdgeOpMode;
  const gain = thumbnail[thumbnailByteEdgegains] & maskGain;
  const edgeMode = thumbnail[thumbnailByteEdmovolt] & maskEdgeRatio;
  const invertOut = thumbnail[thumbnailByteEdmovolt] & maskInvertOutput;
  const vRef = thumbnail[thumbnailByteEdmovolt] & maskVoltageRef;
  const zeroPoint = thumbnail[thumbnailByteVoutzero] & maskZeroPoint;
  const vOut = thumbnail[thumbnailByteVoutzero] & maskVoltageOut;
  const ditherset = thumbnail[thumbnailByteDitherset];
  const contrast = thumbnail[thumbnailByteContrast];

  const originalRomValues = [255, 255, 3, 128, 96, 31, 112, 8, 7, 192, 63, 255, 255].join('_');
  const parsedValues = [exposureHigh, exposureLow, captureMode, edgeExclusive, edgeOperation, gain, edgeMode, invertOut, vRef, zeroPoint, vOut, ditherset, contrast].join('_');

  if (originalRomValues === parsedValues) {
    return {};
  }

  return {
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

export default parsePXLRMetadata;

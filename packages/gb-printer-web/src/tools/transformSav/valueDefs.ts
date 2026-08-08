import { RomByteOffsets } from '@/types/transformSav';

export const maskCapture = 0b00000010;
export const maskEdgeExclusive = 0b10000000;
export const maskEdgeOpMode = 0b01100000;
export const maskGain = 0b00011111;
export const maskEdgeRatio = 0b01110000;
export const maskInvertOutput = 0b00001000;
export const maskVoltageRef = 0b00000111;
export const maskZeroPoint = 0b11000000;
export const maskVoltageOut = 0b00111111;
export const maskDitherSet = 0b00000001;
export const maskDitherOnOff = 0b00000010;


export const valuesCapture = {
  positive: 0b00000010,
  negative: 0b00000000,
};

export const valuesGain = {
  140: 0b00000000, // 14.0 (gbcam gain:  5.01)
  155: 0b00000001, // 15.5
  170: 0b00000010, // 17.0
  185: 0b00000011, // 18.5
  200: 0b00000100, // 20.0 (gbcam gain: 10.00)
  '200Dup': 0b00010000, // 20.0 (d)
  215: 0b00000101, // 21.5
  '215Dup': 0b00010001, // 21.5 (d)
  230: 0b00000110, // 23.0
  '230Dup': 0b00010010, // 23.0 (d)
  245: 0b00000111, // 24.5
  '245Dup': 0b00010011, // 24.5 (d)
  260: 0b00001000, // 26.0 (gbcam gain: 19.95)
  '260Dup': 0b00010100, // 26.0 (d)
  275: 0b00010101, // 27.5
  290: 0b00001001, // 29.0
  '290Dup': 0b00010110, // 29.0 (d)
  305: 0b00010111, // 30.5
  320: 0b00001010, // 32.0 (gbcam gain: 39.81)
  '320Dup': 0b00011000, // 32.0 (d)
  350: 0b00001011, // 35.0
  '350Dup': 0b00011001, // 35.0 (d)
  380: 0b00001100, // 38.0
  '380Dup': 0b00011010, // 38.0 (d)
  410: 0b00001101, // 41.0
  '410Dup': 0b00011011, // 41.0 (d)
  440: 0b00011100, // 44.0
  455: 0b00001110, // 45.5
  470: 0b00011101, // 47.0
  515: 0b00001111, // 51.5
  '515Dup': 0b00011110, // 51.5 (d)
  575: 0b00011111, // 57.5
};

export const valuesEdgeOpMode = {
  none: 0b00000000,
  horizontal: 0b00100000,
  vertical: 0b01000000,
  '2d': 0b01100000,
};

export const valuesEdgeExclusive = {
  on: 0b10000000,
  off: 0b00000000,
};

export const valuesEdgeRatio = {
  '050': 0b00000000,
  '075': 0b00010000,
  100: 0b00100000,
  125: 0b00110000,
  200: 0b01000000,
  300: 0b01010000,
  400: 0b01100000,
  500: 0b01110000,
};

export const valuesInvertOutput = {
  on: 0b00001000,
  off: 0b00000000,
};

export const valuesVoltageRef = {
  '00v': 0b00000000,
  '05v': 0b00000001,
  '10v': 0b00000010,
  '15v': 0b00000011,
  '20v': 0b00000100,
  '25v': 0b00000101,
  '30v': 0b00000110,
  '35v': 0b00000111,
};

export const valuesZeroPoint = {
  disabled: 0b00000000,
  positive: 0b10000000,
  negative: 0b01000000,
};

export const valuesVoltageOut = {
  neg992: 0b00011111, // -0.992mV
  neg960: 0b00011110, // -0.960mV
  neg928: 0b00011101, // -0.928mV
  neg896: 0b00011100, // -0.896mV
  neg864: 0b00011011, // -0.864mV
  neg832: 0b00011010, // -0.832mV
  neg800: 0b00011001, // -0.800mV
  neg768: 0b00011000, // -0.768mV
  neg736: 0b00010111, // -0.736mV
  neg704: 0b00010110, // -0.704mV
  neg672: 0b00010101, // -0.672mV
  neg640: 0b00010100, // -0.640mV
  neg608: 0b00010011, // -0.608mV
  neg576: 0b00010010, // -0.576mV
  neg544: 0b00010001, // -0.544mV
  neg512: 0b00010000, // -0.512mV
  neg480: 0b00001111, // -0.480mV
  neg448: 0b00001110, // -0.448mV
  neg416: 0b00001101, // -0.416mV
  neg384: 0b00001100, // -0.384mV
  neg352: 0b00001011, // -0.352mV
  neg320: 0b00001010, // -0.320mV
  neg288: 0b00001001, // -0.288mV
  neg256: 0b00001000, // -0.256mV
  neg224: 0b00000111, // -0.224mV
  neg192: 0b00000110, // -0.192mV
  neg160: 0b00000101, // -0.160mV
  neg128: 0b00000100, // -0.128mV
  neg096: 0b00000011, // -0.096mV
  neg064: 0b00000010, // -0.064mV
  neg032: 0b00000001, // -0.032mV
  neg000: 0b00000000, // -0.000mV
  pos000: 0b00100000, //  0.000mV
  pos032: 0b00100001, //  0.032mV
  pos064: 0b00100010, //  0.064mV
  pos096: 0b00100011, //  0.096mV
  pos128: 0b00100100, //  0.128mV
  pos160: 0b00100101, //  0.160mV
  pos192: 0b00100110, //  0.192mV
  pos224: 0b00100111, //  0.224mV
  pos256: 0b00101000, //  0.256mV
  pos288: 0b00101001, //  0.288mV
  pos320: 0b00101010, //  0.320mV
  pos352: 0b00101011, //  0.352mV
  pos384: 0b00101100, //  0.384mV
  pos416: 0b00101101, //  0.416mV
  pos448: 0b00101110, //  0.448mV
  pos480: 0b00101111, //  0.480mV
  pos512: 0b00110000, //  0.512mV
  pos544: 0b00110001, //  0.544mV
  pos576: 0b00110010, //  0.576mV
  pos608: 0b00110011, //  0.608mV
  pos640: 0b00110100, //  0.640mV
  pos672: 0b00110101, //  0.672mV
  pos704: 0b00110110, //  0.704mV
  pos736: 0b00110111, //  0.736mV
  pos768: 0b00111000, //  0.768mV
  pos800: 0b00111001, //  0.800mV
  pos832: 0b00111010, //  0.832mV
  pos864: 0b00111011, //  0.864mV
  pos896: 0b00111100, //  0.896mV
  pos928: 0b00111101, //  0.928mV
  pos960: 0b00111110, //  0.960mV
  pos992: 0b00111111, //  0.992mV
};

export const valuesDither = {
  setHigh: 0b00000000,
  setLow: 0b00000001,
  on: 0x00000000,
  off: 0x00000010,
};


export const byteOffsetsPXLR: RomByteOffsets = {
  thumbnailByteCapture: 0x00,
  thumbnailByteEdgegains: 0x10,
  thumbnailByteExposureHigh: 0x20,
  thumbnailByteExposureLow: 0x30,
  thumbnailByteEdmovolt: 0xC6,
  thumbnailByteVoutzero: 0xD6,
  thumbnailByteDitherset: 0xE6,
  thumbnailByteContrast: 0xF6,
};

export const byteOffsetsPhoto: RomByteOffsets = {
  thumbnailByteCapture: 0xC8,
  thumbnailByteEdgegains: 0xC9,
  thumbnailByteExposureHigh: 0xCB, // Photo seems to "swap" the bytes only when sending to the sensor
  thumbnailByteExposureLow: 0xCA, // So for metadata just flip them back
  thumbnailByteEdmovolt: 0xCC,
  thumbnailByteVoutzero: 0xCD,
  thumbnailByteDitherset: 0xC8, // currently not supported
  thumbnailByteContrast: 0xC8, // currently not supported
};


export const maskCapture = 0b00000011;
export const maskEdgeExclusive = 0b10000000;
export const maskEdgeOpMode = 0b01100000;
export const maskGain = 0b00011111;
export const maskEdgeRatio = 0b01110000;
export const maskInvertOutput = 0b00001000;
export const maskVoltageRef = 0b00000111;
export const maskZeroPoint = 0b11000000;
export const maskVoltageOut = 0b00111111;
export const maskDitherSet = 0b00000001;
export const maskDitherOnOff = 0x00000010;

export const valueCapturePositive = 0b00000011;
export const valueCaptureNegative = 0b00000001;

// // The Game Boy Camera uses 0x00, 0x04, 0x08 and 0x0C
// // They are 14.0dB, 20.0dB, 26.0dB and 32dB, which translate to a gain of 5.01, 10.00, 19.95 and 39.81.
export const valueGain140 = 0b00000000; // 14.0 (gbcam gain:  5.01)
export const valueGain155 = 0b00000001; // 15.5
export const valueGain170 = 0b00000010; // 17.0
export const valueGain185 = 0b00000010; // 18.5
export const valueGain200 = 0b00000100; // 20.0 (gbcam gain: 10.00)
export const valueGain200Dup = 0b00010000; // 20.0 (d)
export const valueGain215 = 0b00000101; // 21.5
export const valueGain215Dup = 0b00010001; // 21.5 (d)
export const valueGain230 = 0b00000110; // 23.0
export const valueGain230Dup = 0b00010010; // 23.0 (d)
export const valueGain245 = 0b00000111; // 24.5
export const valueGain245Dup = 0b00010010; // 24.5 (d)
export const valueGain260 = 0b00001000; // 26.0 (gbcam gain: 19.95)
export const valueGain260Dup = 0b00010100; // 26.0 (d)
export const valueGain275 = 0b00010101; // 27.5
export const valueGain290 = 0b00001001; // 29.0
export const valueGain290Dup = 0b00010110; // 29.0 (d)
export const valueGain305 = 0b00010111; // 30.5
export const valueGain320 = 0b00001010; // 32.0 (gbcam gain: 39.81)
export const valueGain320Dup = 0b00011000; // 32.0 (d)
export const valueGain350 = 0b00001011; // 35.0
export const valueGain350Dup = 0b00011001; // 35.0 (d)
export const valueGain380 = 0b00001100; // 38.0
export const valueGain380Dup = 0b00011010; // 38.0 (d)
export const valueGain410 = 0b00001101; // 41.0
export const valueGain410Dup = 0b00011011; // 41.0 (d)
export const valueGain440 = 0b00011100; // 44.0
export const valueGain455 = 0b00001110; // 45.5
export const valueGain470 = 0b00011101; // 47.0
export const valueGain515 = 0b00001111; // 51.5
export const valueGain515Dup = 0b00011110; // 51.5 (d)
export const valueGain575 = 0b00011111; // 57.5
//
export const valueEdgeOpModeNone = 0b00000000;
export const valueEdgeOpModeHorizontal = 0b00100000;
export const valueEdgeOpModeVertical = 0b01000000;
export const valueEdgeOpMode2d = 0b01100000;
//
export const valueEdgeExclusiveOn = 0b10000000;
export const valueEdgeExclusiveOff = 0b00000000;
//
export const valueEdgeRatio050 = 0b00000000;
export const valueEdgeRatio075 = 0b00010000;
export const valueEdgeRatio100 = 0b00100000;
export const valueEdgeRatio125 = 0b00110000;
export const valueEdgeRatio200 = 0b01000000;
export const valueEdgeRatio300 = 0b01010000;
export const valueEdgeRatio400 = 0b01100000;
export const valueEdgeRatio500 = 0b01110000;

export const valueInvertOutputOn = 0b00001000;
export const valueInvertOutputOff = 0b00000000;

export const valueVoltageRef00 = 0b00000000;
export const valueVoltageRef05 = 0b00000001;
export const valueVoltageRef10 = 0b00000010;
export const valueVoltageRef15 = 0b00000011;
export const valueVoltageRef20 = 0b00000100;
export const valueVoltageRef25 = 0b00000101;
export const valueVoltageRef30 = 0b00000110;
export const valueVoltageRef35 = 0b00000111;

export const valueZeroPointDisabled = 0b00000000;
export const valueZeroPointPositive = 0b10000000;
export const valueZeroPointNegative = 0b01000000;

export const valueVoltageOutNeg992 = 0b00011111; // -0.992mV
export const valueVoltageOutNeg960 = 0b00011110; // -0.960mV
export const valueVoltageOutNeg928 = 0b00011101; // -0.928mV
export const valueVoltageOutNeg896 = 0b00011100; // -0.896mV
export const valueVoltageOutNeg864 = 0b00011011; // -0.864mV
export const valueVoltageOutNeg832 = 0b00011010; // -0.832mV
export const valueVoltageOutNeg800 = 0b00011001; // -0.800mV
export const valueVoltageOutNeg768 = 0b00011000; // -0.768mV
export const valueVoltageOutNeg736 = 0b00010111; // -0.736mV
export const valueVoltageOutNeg704 = 0b00010110; // -0.704mV
export const valueVoltageOutNeg672 = 0b00010101; // -0.672mV
export const valueVoltageOutNeg640 = 0b00010100; // -0.640mV
export const valueVoltageOutNeg608 = 0b00010011; // -0.608mV
export const valueVoltageOutNeg576 = 0b00010010; // -0.576mV
export const valueVoltageOutNeg544 = 0b00010001; // -0.544mV
export const valueVoltageOutNeg512 = 0b00010000; // -0.512mV
export const valueVoltageOutNeg480 = 0b00001111; // -0.480mV
export const valueVoltageOutNeg448 = 0b00001110; // -0.448mV
export const valueVoltageOutNeg416 = 0b00001101; // -0.416mV
export const valueVoltageOutNeg384 = 0b00001100; // -0.384mV
export const valueVoltageOutNeg352 = 0b00001011; // -0.352mV
export const valueVoltageOutNeg320 = 0b00001010; // -0.320mV
export const valueVoltageOutNeg288 = 0b00001001; // -0.288mV
export const valueVoltageOutNeg256 = 0b00001000; // -0.256mV
export const valueVoltageOutNeg224 = 0b00000111; // -0.224mV
export const valueVoltageOutNeg192 = 0b00000110; // -0.192mV
export const valueVoltageOutNeg160 = 0b00000101; // -0.160mV
export const valueVoltageOutNeg128 = 0b00000100; // -0.128mV
export const valueVoltageOutNeg096 = 0b00000011; // -0.096mV
export const valueVoltageOutNeg064 = 0b00000010; // -0.064mV
export const valueVoltageOutNeg032 = 0b00000001; // -0.032mV
export const valueVoltageOutNeg000 = 0b00000000; // -0.000mV
export const valueVoltageOutPos000 = 0b00100000; //  0.000mV
export const valueVoltageOutPos032 = 0b00100001; //  0.032mV
export const valueVoltageOutPos064 = 0b00100010; //  0.064mV
export const valueVoltageOutPos096 = 0b00100011; //  0.096mV
export const valueVoltageOutPos128 = 0b00100100; //  0.128mV
export const valueVoltageOutPos160 = 0b00100101; //  0.160mV
export const valueVoltageOutPos192 = 0b00100110; //  0.192mV
export const valueVoltageOutPos224 = 0b00100111; //  0.224mV
export const valueVoltageOutPos256 = 0b00101000; //  0.256mV
export const valueVoltageOutPos288 = 0b00101001; //  0.288mV
export const valueVoltageOutPos320 = 0b00101010; //  0.320mV
export const valueVoltageOutPos352 = 0b00101011; //  0.352mV
export const valueVoltageOutPos384 = 0b00101100; //  0.384mV
export const valueVoltageOutPos416 = 0b00101101; //  0.416mV
export const valueVoltageOutPos448 = 0b00101110; //  0.448mV
export const valueVoltageOutPos480 = 0b00101111; //  0.480mV
export const valueVoltageOutPos512 = 0b00110000; //  0.512mV
export const valueVoltageOutPos544 = 0b00110001; //  0.544mV
export const valueVoltageOutPos576 = 0b00110010; //  0.576mV
export const valueVoltageOutPos608 = 0b00110011; //  0.608mV
export const valueVoltageOutPos640 = 0b00110100; //  0.640mV
export const valueVoltageOutPos672 = 0b00110101; //  0.672mV
export const valueVoltageOutPos704 = 0b00110110; //  0.704mV
export const valueVoltageOutPos736 = 0b00110111; //  0.736mV
export const valueVoltageOutPos768 = 0b00111000; //  0.768mV
export const valueVoltageOutPos800 = 0b00111001; //  0.800mV
export const valueVoltageOutPos832 = 0b00111010; //  0.832mV
export const valueVoltageOutPos864 = 0b00111011; //  0.864mV
export const valueVoltageOutPos896 = 0b00111100; //  0.896mV
export const valueVoltageOutPos928 = 0b00111101; //  0.928mV
export const valueVoltageOutPos960 = 0b00111110; //  0.960mV
export const valueVoltageOutPos992 = 0b00111111; //  0.992mV

export const valueDitherSetHigh = 0b00000000;
export const valueDitherSetLow = 0b00000001;
export const valueDitherOn = 0x00000000;
export const valueDitherOff = 0x00000010;


export const byteOffsetsPXLR = {
  thumbnailByteCapture: 0x00,
  thumbnailByteEdgegains: 0x10,
  thumbnailByteExposureHigh: 0x20,
  thumbnailByteExposureLow: 0x30,
  thumbnailByteEdmovolt: 0xC6,
  thumbnailByteVoutzero: 0xD6,
  thumbnailByteDitherset: 0xE6,
  thumbnailByteContrast: 0xF6,
};


export const byteOffsetsPhoto = {
  thumbnailByteCapture: 0xC8,
  thumbnailByteEdgegains: 0xC9,
  thumbnailByteExposureHigh: 0xCB, // Photo seems to "swap" the bytes only when sending to the sensor
  thumbnailByteExposureLow: 0xCA, // So for metadata just flip them back
  thumbnailByteEdmovolt: 0xCC,
  thumbnailByteVoutzero: 0xCD,
  thumbnailByteDitherset: 0xCE,
  thumbnailByteContrast: 0xCF,
};

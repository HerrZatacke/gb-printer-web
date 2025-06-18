import { ReadResult } from '@/types/ports';

export const appendUint8Arrays = (arrays: (Uint8Array | null | undefined)[]): Uint8Array => {
  const validArrays = arrays.filter(Boolean) as Uint8Array[];
  const totalLength = validArrays.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Uint8Array(totalLength);

  let offset = 0;
  for (const arr of validArrays) {
    result.set(arr, offset);
    offset += arr.length;
  }

  return result;
};

export const mergeReadResults = (results: (ReadResult | null | undefined)[]): ReadResult => {
  const validResults = results.filter(Boolean) as ReadResult[];
  return {
    bytes: appendUint8Arrays(validResults.map(({ bytes }) => bytes)),
    deviceId: validResults[0].deviceId,
    portDeviceType: validResults[0].portDeviceType,
    string: validResults.map(({ string }) => string).join(''),
  };
};

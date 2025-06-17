import { ReadResult } from '@/types/ports';

export const appendUint8Arrays = (arrays: (Uint8Array | null | undefined)[]): Uint8Array => {
  const validArrays = arrays.filter((arr): arr is Uint8Array => arr instanceof Uint8Array && arr.length > 0);
  const totalLength = validArrays.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Uint8Array(totalLength);

  let offset = 0;
  for (const arr of validArrays) {
    result.set(arr, offset);
    offset += arr.length;
  }

  return result;
};

export const mergeReadResults = (first: ReadResult, second: ReadResult): ReadResult => {
  return {
    bytes: appendUint8Arrays([first.bytes, second.bytes]),
    deviceId: first.deviceId || second.deviceId,
    portDeviceType: first.portDeviceType || second.portDeviceType,
    string: `${first.string}${second.string}`,
  };
};

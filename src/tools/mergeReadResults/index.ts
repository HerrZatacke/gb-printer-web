import { ReadResult } from '@/types/ports';

export const appendUint8Arrays = (a: Uint8Array, b: Uint8Array): Uint8Array => {
  const result = new Uint8Array(a.length + b.length);
  result.set(a, 0);
  result.set(b, a.length);
  return result;
};


export const mergeReadResults = (first: ReadResult, second: ReadResult): ReadResult => {
  return {
    bytes: appendUint8Arrays(first.bytes, second.bytes),
    deviceId: first.deviceId || second.deviceId,
    portDeviceType: first.portDeviceType || second.portDeviceType,
    string: `${first.string}${second.string}`,
  };
};

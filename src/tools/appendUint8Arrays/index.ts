export const appendUint8Arrays = (arrays: (Uint8Array | null | undefined)[]): Uint8Array<ArrayBuffer> => {
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

import pako from 'pako';

const bytesStringToArrayBuffer = (stringData: string) => {
  const uint8 = new Uint8Array(stringData.length);
  for (let i = 0; i < stringData.length; i++) {
    // eslint-disable-next-line no-bitwise
    uint8[i] = stringData.charCodeAt(i) & 0xFF;
  }
  return uint8.buffer;
};


const arrayBufferToByteString = (buffer: Uint8Array) => {
  const uint8 = new Uint8Array(buffer);
  let str = '';
  for (let i = 0; i < uint8.length; i++) {
    str += String.fromCharCode(uint8[i]);
  }
  return str;
};

export const inflate = async (data: string): Promise<string> => {
  return pako.inflate(bytesStringToArrayBuffer(data), { to: 'string' });
};

export const deflate = async (data: string): Promise<string> => {
  const compressed = pako.deflate(data, {
    strategy: 1,
    level: 8,
  });

  return arrayBufferToByteString(compressed);
};


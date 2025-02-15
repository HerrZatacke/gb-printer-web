import useImportsStore from '../../app/stores/importsStore';
import readFileAs, { ReadAs } from '../readFileAs';
import { compressAndHash } from '../storage';
import { randomId } from '../randomId';

// check for the header "GB-BIN01"
const isBinType = (buffer: Uint8Array) => (
  buffer[0] === 71 && // G
  buffer[1] === 66 && // B
  buffer[2] === 45 && // -
  buffer[3] === 66 && // B
  buffer[4] === 73 && // I
  buffer[5] === 78 && // N
  buffer[6] === 48 && // 0
  buffer[7] === 49 //    1
);

export const transformBin = async (file: File): Promise<boolean> => {
  const { importQueueAdd } = useImportsStore.getState();
  const data = await readFileAs(file, ReadAs.UINT8_ARRAY);
  //
  if (!isBinType(data)) {
    throw new Error('Not a valid .bin file - is it missing the "GB-BIN01" header?');
  }

  const tiles: string[] = [];
  let currentLine: string[] = [];

  const binOffsetLength = 8;

  for (let i = binOffsetLength; i < data.length; i += 1) {
    const value = data[i];
    currentLine.push(value.toString(16)
      .padStart(2, '0')
      .toUpperCase());

    if (currentLine.length === 16) {
      tiles.push(currentLine.join(' '));
      currentLine = [];
    }
  }

  // only part of a tile?
  // -> fill the rest of it in black
  if (currentLine.length) {
    while (currentLine.length < 16) {
      currentLine.push('FF');
    }

    tiles.push(currentLine.join(' '));
  }

  const { dataHash: imageHash } = await compressAndHash(tiles);

  importQueueAdd([{
    fileName: file.name,
    imageHash,
    tiles,
    lastModified: file.lastModified,
    tempId: randomId(),
  }]);

  return true;
};

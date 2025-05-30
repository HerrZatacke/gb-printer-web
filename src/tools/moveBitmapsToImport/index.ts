import { ditherFilter } from '../applyBitmapFilter';
import { compressAndHash } from '../storage';
import type { QueueImage } from '../../../types/QueueImage';
import { randomId } from '../randomId';
import type { ImportItem } from '../../../types/ImportItem';

export interface DispatchBitmapsToImportOptions {
  bitmapQueue: QueueImage[],
  dither: boolean,
  contrastBaseValues: number[],
  importQueueAdd: (importItems: ImportItem[]) => void,
}

export type DispatchBitmapsToImportFn = (options: DispatchBitmapsToImportOptions) => void;


const sliceTile = (pixelData: number[]) => (tileIndex: number): number[] => {
  const tileX = tileIndex % 20;
  const tileY = Math.floor(tileIndex / 20);

  const offsetX = tileX * 8;
  const offsetY = tileY * 8;

  return (new Array(8))
    .fill(null)
    .map((_, index) => (
      pixelData.slice(offsetX + ((offsetY + index) * 160)).slice(0, 8)
    ))
    .flat(1);
};

const greyTones = [
  0b0000000000000000,
  0b0000000100000000,
  0b0000000000000001,
  0b0000000100000001,
];

const encodeTile = (tileData: number[]): string => {
  const line: string[] = [];
  for (let row = 0; row < 8; row += 1) {
    let rowData = 0;
    for (let col = 0; col < 8; col += 1) {
      const pixel = greyTones[tileData[(row * 8) + col]];
      // eslint-disable-next-line no-bitwise
      rowData += pixel << (7 - col);
    }

    // eslint-disable-next-line no-bitwise
    line.push((rowData >> 8).toString(16).padStart(2, '0'), (rowData & 255).toString(16).padStart(2, '0'));
  }

  return line.join(' ')
    .toUpperCase();
};

export const moveBitmapsToImport: DispatchBitmapsToImportFn = ({
  bitmapQueue,
  dither,
  contrastBaseValues,
  importQueueAdd,
}): void => {
  bitmapQueue.forEach(async ({ imageData, height, fileName, lastModified }: QueueImage): Promise<void> => {
    const { data } = ditherFilter({
      imageData,
      contrastBaseValues,
      dither,
      colors: [
        { r: 0, g: 0, b: 0 },
        { r: 1, g: 0, b: 0 },
        { r: 2, g: 0, b: 0 },
        { r: 3, g: 0, b: 0 },
      ],
    });

    // Use red value only to reduce aray complexity
    const pixelData = Array.from(data).filter((_, index) => !(index % 4));

    const tileCount = Math.ceil(height / 8) * 20;

    const getTileSlice = sliceTile(pixelData);

    const tiles: string[] = (new Array(tileCount))
      .fill(null)
      .map((_, tileIndex) => getTileSlice(tileIndex))
      .map(encodeTile);

    const { dataHash: imageHash } = await compressAndHash(tiles);

    importQueueAdd([{
      fileName,
      imageHash,
      tiles,
      lastModified,
      tempId: randomId(),
    }]);
  });
};


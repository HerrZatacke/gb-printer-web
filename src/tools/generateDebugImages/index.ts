/* eslint-disable no-console, no-await-in-loop */
import dayjs from 'dayjs';
import saveNewImage from '../saveNewImage';
import padToHeight from '../padToHeight';
import { dateFormat } from '../../app/defaults';
import type { MonochromeImage } from '../../../types/Image';
import useItemsStore from '../../app/stores/itemsStore';

const generateRandomTile = (): string => (
  (new Array(20))
    .fill('')
    .map(() => Math.floor(Math.random() * 256).toString(16).padStart(2, '0'))
    .join(' ')
);

const generateRandomImage = (numLines: number): string[] => (
  new Array(20 * numLines)
    .fill('')
    .map(generateRandomTile)
);

interface DebugImport {
  image: MonochromeImage,
  elapsed: number,
}

const generateDebugImage = async (index: number): Promise<DebugImport> => {
  const timestamp = Date.now();
  const tiles = generateRandomImage(18);

  const img = await saveNewImage({
    lines: padToHeight(tiles),
    filename: `${index.toString(10).padStart(6, '0')} - ${timestamp.toString(16)}`,
    palette: 'bw',
    frame: 'int14',
    tags: ['debug', 'dummy'],
    // Adding index to milliseconds to ensure better sorting
    created: dayjs(timestamp).format(dateFormat),
    meta: {},
  });

  const elapsed = Date.now() - timestamp;

  await new Promise((resolve) => {
    console.log(index, elapsed);
    window.requestAnimationFrame(resolve);
  });

  return {
    image: img,
    elapsed,
  };
};

export const generateDebugImages = async (count: number) => {
  const debugs: DebugImport[] = [];

  const generateStart = Date.now();

  for (let i = 0; i < count; i += 1) {
    debugs.push(await generateDebugImage(i));
  }

  console.log(`Generate time: ${Date.now() - generateStart}`);

  const dispatchStart = Date.now();

  const { images, setImages } = useItemsStore.getState();

  setImages([
    ...images,
    ...debugs.map(({ image }) => image),
  ]);

  console.log(`Dispatch time: ${Date.now() - dispatchStart}`);
};

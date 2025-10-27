// Currently unused, but may be added to "window" for debugging purposes
import useItemsStore from '@/stores/itemsStore';
import { delay } from '@/tools/delay';
import padToHeight from '@/tools/padToHeight';
import saveNewImage from '@/tools/saveNewImage';
import { toCreationDate } from '@/tools/toCreationDate';
import type { MonochromeImage } from '@/types/Image';

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
    created: toCreationDate(timestamp),
    meta: {},
  });

  const elapsed = Date.now() - timestamp;

  await delay(0);

  return {
    image: img,
    elapsed,
  };
};

let hasRun = true;

export const generateDebugImages = async (count: number) => {
  if (hasRun) {
    return;
  }

  hasRun = true;

  const debugs: DebugImport[] = [];

  const generateStart = Date.now();
  console.log(`Generating ${count} dummy images...`);

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

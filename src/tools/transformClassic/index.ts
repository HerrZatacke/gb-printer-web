import { terminatorLine } from '@/consts/defaults';
import { HandleLine } from '@/consts/handleLine';
import handleLines from '@/tools/handleLines';
import { ImportLine } from '@/types/handleLine';

const transformClassic = (data: string, filename: string): string[][] => {
  const imagesFromFile = `${data}\n${terminatorLine}`.split('\n')
    .map(handleLines)
    .reduce((acc: string[][], lineAction: ImportLine | null) => {
      switch (lineAction?.type) {
        case HandleLine.NEW_LINES: {
          acc[acc.length - 1].push(...lineAction.payload);
          return acc;
        }

        case HandleLine.IMAGE_COMPLETE: {
          return [...acc, []];
        }

        default:
          return acc;
      }

    }, [[]])
    .filter((image: string[]) => (
      image.length > 0
    ));

  if (!imagesFromFile.length) {
    console.warn(`File ${filename} did not contain images`);
  }

  return imagesFromFile;
};

export default transformClassic;

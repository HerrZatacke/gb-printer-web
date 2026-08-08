import { ImportMethod } from '@/consts/ImportMethod';
import { useImportsStore } from '@/stores/stores';
import { moveBitmapsToImport } from '@/tools/moveBitmapsToImport';
import { ImportResult } from '@/types/ImportItem';
import getImageData from './getImageData';

export const transformBitmaps = async (file: File, fromPrinter = false): Promise<ImportResult> => {
  const image = await getImageData(file);

  if (fromPrinter) {
    moveBitmapsToImport({
      bitmapQueue: [image],
      dither: false,
      contrastBaseValues: [0x00, 0x55, 0xAA, 0xFF],
      importQueueAdd: useImportsStore.getState().importQueueAdd,
    });
  } else {
    useImportsStore.getState().bitmapQueueAdd([image]);
  }

  return {
    imageCount: 1,
    importMethod: ImportMethod.BITMAP,
  };
};


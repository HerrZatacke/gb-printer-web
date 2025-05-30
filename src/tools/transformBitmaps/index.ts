import useImportsStore from '@/stores/importsStore';
import { moveBitmapsToImport } from '@/tools/moveBitmapsToImport';
import getImageData from './getImageData';

export const transformBitmaps = async (file: File, fromPrinter = false): Promise<boolean> => {
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

  return true;
};


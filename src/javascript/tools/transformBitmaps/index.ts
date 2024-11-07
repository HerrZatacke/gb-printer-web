import getImageData from './getImageData';
import useImportsStore from '../../app/stores/importsStore';
import { moveBitmapsToImport } from '../../app/components/Overlays/BitmapQueue/moveBitmapsToImport';

export const transformBitmaps = async (file: File, fromPrinter = false): Promise<boolean> => {
  const image = await getImageData(file);

  if (fromPrinter) {
    moveBitmapsToImport({
      bitmapQueue: [image],
      dither: false,
      contrastBaseValues: [0x00, 0x55, 0xAA, 0xFF],
    });
  } else {
    useImportsStore.getState().bitmapQueueAdd([image]);
  }

  return true;
};

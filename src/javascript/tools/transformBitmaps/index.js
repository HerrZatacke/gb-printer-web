import { Actions } from '../../app/store/actions';
import getImageData from './getImageData';
import moveBitmapsToImport from '../../app/components/Overlays/BitmapQueue/moveBitmapsToImport';

const getTransformBitmaps = ({ dispatch }) => {
  const dispatchBitmapsToImport = moveBitmapsToImport(dispatch);

  return async (file, fromPrinter = false) => {
    const image = await getImageData(file);

    if (fromPrinter) {
      dispatchBitmapsToImport({
        bitmapQueue: [image],
        dither: false,
        contrastBaseValues: [0x00, 0x55, 0xAA, 0xFF],
      });
    } else {
      dispatch({
        type: Actions.BITMAPQUEUE_ADD,
        payload: image,
      });
    }

    return true;
  };
};

export default getTransformBitmaps;

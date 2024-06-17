import { Actions } from '../../app/store/actions';
import getImageData from './getImageData';
import moveBitmapsToImport, {
  DispatchBitmapsToImportFn,
} from '../../app/components/Overlays/BitmapQueue/moveBitmapsToImport';
import { TypedStore } from '../../app/store/State';
import { BitmapQueueAddAction } from '../../../types/actions/QueueActions';

const getTransformBitmaps = ({ dispatch }: TypedStore) => {
  const dispatchBitmapsToImport: DispatchBitmapsToImportFn = moveBitmapsToImport(dispatch);

  return async (file: File, fromPrinter = false): Promise<boolean> => {
    const image = await getImageData(file);

    if (fromPrinter) {
      dispatchBitmapsToImport({
        bitmapQueue: [image],
        dither: false,
        contrastBaseValues: [0x00, 0x55, 0xAA, 0xFF],
      });
    } else {
      dispatch<BitmapQueueAddAction>({
        type: Actions.BITMAPQUEUE_ADD,
        payload: image,
      });
    }

    return true;
  };
};

export default getTransformBitmaps;

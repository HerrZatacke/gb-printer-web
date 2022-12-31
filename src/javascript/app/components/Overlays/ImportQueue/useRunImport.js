import { useDispatch, useSelector } from 'react-redux';
import Queue from 'promise-queue/lib';
import { ADD_IMAGES } from '../../../store/actions';
import saveNewImage from '../../../../tools/saveNewImage';
import padToHeight from '../../../../tools/padToHeight';

const useRunImport = () => {
  const dispatch = useDispatch();
  const queue = new Queue(1, Infinity);
  const importPad = useSelector((state) => (state.importPad));

  const runImport = async ({
    importQueue,
    palette,
    frame,
    tags,
  }) => {

    const savedImages = await Promise.all(importQueue.map((image) => {
      const { tiles, fileName, meta } = image;

      return (
        queue.add(() => (
          saveNewImage({
            lines: importPad ? padToHeight(tiles) : tiles,
            filename: fileName,
            palette,
            frame,
            tags,
            meta,
          })
        ))
      );
    }));

    dispatch({
      type: ADD_IMAGES,
      payload: savedImages,
    });
  };

  return {
    runImport,
  };
};

export default useRunImport;

import useSettingsStore from '../../stores/settingsStore';
import { getPrepareFiles } from '../../../tools/download';
import { loadImageTiles } from '../../../tools/loadImageTiles';
import { Actions } from '../actions';
import type { MiddlewareWithState } from '../../../../types/MiddlewareWithState';
import { loadFrameData } from '../../../tools/applyFrame/frameData';

const batch: MiddlewareWithState = (store) => (next) => async (action) => {
  const { exportScaleFactors, exportFileTypes } = useSettingsStore.getState();

  if (action.type === Actions.SHARE_IMAGE) {
    const state = store.getState();

    const image = state.images.find(({ hash }) => hash === action.payload);
    if (!image) {
      throw new Error('image not found');
    }

    const frame = state.frames.find(({ id }) => id === image.frame);

    const shareScaleFactor = [...exportScaleFactors].pop() || 4;
    const shareFileType = [...exportFileTypes].pop() || 'png';

    const prepareFiles = getPrepareFiles(
      [shareScaleFactor],
      [shareFileType],
      state.handleExportFrame,
      state,
    );

    const tiles = await loadImageTiles(state)(image.hash);

    const frameData = frame ? await loadFrameData(frame?.hash) : null;

    const imageStartLine = frameData ? frameData.upper.length / 20 : 2;

    const downloadInfo = await prepareFiles(image)(tiles || [], imageStartLine);

    const { blob, filename, title } = downloadInfo[0];

    if (window.navigator.share) {
      window.navigator.share({
        files: [new File([blob], filename, { type: 'image/png', lastModified: Date.now() })],
        title,
      })
        .catch(() => ('¯\\_(ツ)_/¯'));
    }
  }

  next(action);
};

export default batch;

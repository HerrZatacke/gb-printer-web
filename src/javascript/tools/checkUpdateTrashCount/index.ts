import { getTrashFrames, getTrashImages } from '../getTrash';
import type { State } from '../../app/store/State';
import type { MonochromeImage } from '../../../types/Image';
import interactionsStore from '../../app/stores/interactionsStore';

export const checkUpdateTrashCount = async (state: State) => {
  const frames = (await getTrashFrames(state.frames)).length;
  const images = (await getTrashImages(state.images as MonochromeImage[])).length;
  interactionsStore.getState().updateTrashCount(frames, images);
};

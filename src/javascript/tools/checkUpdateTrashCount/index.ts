import { getTrashFrames, getTrashImages } from '../getTrash';
import type { Image, MonochromeImage } from '../../../types/Image';
import type { Frame } from '../../../types/Frame';
import interactionsStore from '../../app/stores/interactionsStore';

// ToDo: refactor to load images/frames directly inside this function
export const checkUpdateTrashCount = async (stateImages: Image[], stateFrames: Frame[]) => {
  const frames = (await getTrashFrames(stateFrames)).length;
  const images = (await getTrashImages(stateImages as MonochromeImage[])).length;
  interactionsStore.getState().updateTrashCount(frames, images);
};

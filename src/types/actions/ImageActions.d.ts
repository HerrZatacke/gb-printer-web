import { Actions } from '../../javascript/app/store/actions';
import { CurrentEditBatch, Image } from '../Image';
import { TagUpdates } from '../../javascript/tools/modifyTagChanges';

export interface AddImagesAction {
  type: Actions.ADD_IMAGES,
  payload: Image[],
}

export type ImageUpdates = Pick<Image, 'title' | 'created' | 'palette' | 'invertPalette' | 'frame' | 'lockFrame' | 'rotation'>;

export interface ImagesBatchUpdateAction {
  type: Actions.UPDATE_IMAGES_BATCH_CHANGES,
  payload: {
    shouldUpdate: Record<keyof ImageUpdates | 'tags', boolean>,
    updates: ImageUpdates,
    tagChanges: TagUpdates,
  },
}

export interface ImagesUpdateAction {
  type: Actions.UPDATE_IMAGES,
  payload: Image[],
}

export interface RehashImageAction {
  type: Actions.REHASH_IMAGE,
  payload: {
    oldHash: string,
    image: Image,
  },
}

export interface ImageFavouriteAction {
  type: Actions.IMAGE_FAVOURITE_TAG,
  payload: {
    isFavourite: boolean,
    hash: string,
  },
}

export interface DeleteImageAction {
  type: Actions.DELETE_IMAGE,
  payload: string,
}

export interface DeleteImagesAction {
  type: Actions.DELETE_IMAGES,
  payload: string[],
}

export interface NewRGBNImageAction {
  type: Actions.SAVE_RGBN_IMAGE,
  payload: 'newRGBN',
}

export interface EditImageSelectionAction {
  type: Actions.EDIT_IMAGE_SELECTION,
  payload: CurrentEditBatch,
}

export interface CancelEditImagesAction {
  type: Actions.CANCEL_EDIT_IMAGES,
}

export interface DownloadImageSelectionAction {
  type: Actions.DOWNLOAD_SELECTION,
  payload: string[],
}

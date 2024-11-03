import type { Actions } from '../../javascript/app/store/actions';
import type { CurrentEditBatch, Image, MonochromeImage, RGBNHashes } from '../Image';
import type { TagUpdates } from '../../javascript/tools/modifyTagChanges';
import type { BatchActionType } from '../../javascript/consts/batchActionTypes';

export interface AddImagesAction {
  type: Actions.ADD_IMAGES,
  payload: Image[],
}

export type ImageUpdates =
  Pick<Image, 'title' | 'created' | 'palette' | 'frame' | 'lockFrame' | 'rotation'> &
  Pick<MonochromeImage, 'invertPalette' | 'framePalette' | 'invertFramePalette'>;

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

export interface EditImageSelectionAction {
  type: Actions.EDIT_IMAGE_SELECTION,
  payload: CurrentEditBatch,
}

export interface CancelEditImagesAction {
  type: Actions.CANCEL_EDIT_IMAGES,
}

export interface StartCreateRGBImagesAction {
  type: Actions.START_CREATE_RGB_IMAGES,
  payload: string[],
}

export interface SaveNewRGBImagesAction {
  type: Actions.SAVE_NEW_RGB_IMAGES,
  payload: RGBNHashes[],
}

export interface CancelCreateRGBImagesAction {
  type: Actions.CANCEL_CREATE_RGB_IMAGES,
}


export interface DownloadImageSelectionAction {
  type: Actions.DOWNLOAD_SELECTION,
  payload: string[],
}

export interface DownloadImageStartAction {
  type: Actions.START_DOWNLOAD
  payload: string,
}


export interface ShareImageStartAction {
  type: Actions.SHARE_IMAGE
  payload: string,
}


export interface TryRecoverImageAction {
  type: Actions.TRY_RECOVER_IMAGE_DATA,
  payload: string,
}

export interface BatchTaskAction {
  type: Actions.BATCH_TASK,
  payload: {
    actionType: BatchActionType,
    images: Image[], // list of images which can currently be batched,
    page: number,
  },
}

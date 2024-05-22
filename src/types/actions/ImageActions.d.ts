import { Actions } from '../../javascript/app/store/actions';
import { CurrentEditBatch, Image } from '../Image';

export interface AddImagesAction {
  type: Actions.ADD_IMAGES,
  payload: Image[],
}

export interface UpdateImageAction {
  type: Actions.UPDATE_IMAGE,
  payload: Image,
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

export interface ImagesBatchUpdateAction {
  type: Actions.UPDATE_IMAGES_BATCH,
  payload: Image[],
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

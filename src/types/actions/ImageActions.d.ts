import type { Actions } from '../../javascript/app/store/actions';
import type { Image, MonochromeImage } from '../Image';

export interface AddImagesAction {
  type: Actions.ADD_IMAGES,
  payload: Image[],
}

export type ImageUpdates =
  Pick<Image, 'title' | 'created' | 'palette' | 'frame' | 'lockFrame' | 'rotation'> &
  Pick<MonochromeImage, 'invertPalette' | 'framePalette' | 'invertFramePalette'>;

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

export interface DeleteImagesAction {
  type: Actions.DELETE_IMAGES,
  payload: string[],
}

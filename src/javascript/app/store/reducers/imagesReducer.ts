/* eslint-disable default-param-last */
import { Actions } from '../actions';
import uniqueBy from '../../../tools/unique/by';
import unique from '../../../tools/unique';
import { SpecialTags } from '../../../consts/SpecialTags';
import { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';
import { Image } from '../../../../types/Image';
import {
  AddImagesAction,
  DeleteImageAction,
  DeleteImagesAction,
  ImageFavouriteAction,
  ImagesBatchUpdateAction,
  RehashImageAction,
  UpdateImageAction,
} from '../../../../types/actions/ImageActions';


const imagesReducer = (
  value: Image[] = [],
  action:
    AddImagesAction |
    DeleteImageAction |
    DeleteImagesAction |
    ImageFavouriteAction |
    ImagesBatchUpdateAction |
    RehashImageAction |
    UpdateImageAction |
    GlobalUpdateAction,
): Image[] => {
  switch (action.type) {
    case Actions.ADD_IMAGES:
      return uniqueBy<Image>('hash')([...value, ...action.payload]);
    case Actions.DELETE_IMAGE:
      return [...value.filter(({ hash }) => hash !== action.payload)];
    case Actions.DELETE_IMAGES:
      return [...value.filter(({ hash }) => !action.payload.includes(hash))];
    case Actions.UPDATE_IMAGE:
      return value.map((image) => (
        (image.hash === action.payload.hash) ? {
          ...image,
          ...action.payload,
        } : image
      ));
    case Actions.REHASH_IMAGE:
      return value.map((image) => (
        (image.hash === action.payload.oldHash) ? action.payload.image : image
      ));
    case Actions.IMAGE_FAVOURITE_TAG:
      return value.map((image) => (
        (image.hash === action.payload.hash) ? {
          ...image,
          tags: unique(
            action.payload.isFavourite ?
              [SpecialTags.FILTER_FAVOURITE, ...image.tags] :
              image.tags.filter((tag) => tag !== SpecialTags.FILTER_FAVOURITE),
          ),
        } : image
      ));
    case Actions.UPDATE_IMAGES_BATCH:
      return value.map((image) => (
        // return changed image if existent in payload
        action.payload.find((changedImage) => (changedImage.hash === image.hash)) || image
      ));
    case Actions.GLOBAL_UPDATE:
      return uniqueBy<Image>('hash')(action.payload?.images || []);
    default:
      return value;
  }
};

export default imagesReducer;
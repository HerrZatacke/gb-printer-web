import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { Actions } from '../../store/actions';
import type { State } from '../../store/State';
import type {
  DeleteImageAction,
  DownloadImageStartAction,
  ImageFavouriteAction,
  LightboxImageSetAction,
  NewRGBNImageAction,
  ShareImageStartAction,
} from '../../../../types/actions/ImageActions';
import type { ConfirmAnsweredAction, ConfirmAskAction } from '../../../../types/actions/ConfirmActions';
import type { ImageSelectionAddAction, ImageSelectionRemoveAction } from '../../../../types/actions/ImageSelectionActions';
import type { AddImageGroupAction } from '../../../../types/actions/GroupActions';
import { dateFormat } from '../../defaults';
import { randomId } from '../../../tools/randomId';

interface UseGalleryImageButtons {
  isSelected: boolean,
  canShare: boolean,
  hasPlugins: boolean,
  startDownload: () => void,
  deleteImage: () => void,
  shareImage: () => void,
  saveRGBNImage: () => void,
  updateImageToSelection: (mode: string) => void,
  setLightboxImage: () => void,
  updateFavouriteTag: (isFavourite: boolean) => void,
  createGroup: () => void,
}

export enum ButtonOption {
  DOWNLOAD = 'download',
  DELETE = 'delete',
  SHARE = 'share',
  SAVE_RGBN_IMAGE = 'saveRGBNImage',
  SELECT = 'select',
  VIEW = 'view',
  FAVOURITE = 'favourite',
  PLUGINS = 'plugins',
}

interface UseGalleryImageButtonsParams {
  hash: string,
  imageTitle?: string,
}

export const useGalleryImageButtons = ({ hash, imageTitle }: UseGalleryImageButtonsParams): UseGalleryImageButtons => {
  const {
    selection,
    isSelected,
    canShare,
    hasPlugins,
  } = useSelector((state: State) => ({
    selection: state.imageSelection,
    isSelected: state.imageSelection.includes(hash),
    canShare: state.canShare,
    hasPlugins: !!state.plugins.length,
  }));

  const dispatch = useDispatch();

  return {
    isSelected,
    canShare,
    hasPlugins,
    startDownload: () => {
      dispatch<DownloadImageStartAction>({
        type: Actions.START_DOWNLOAD,
        payload: hash,
      });
    },
    deleteImage: () => {
      dispatch<ConfirmAskAction>({
        type: Actions.CONFIRM_ASK,
        payload: {
          message: imageTitle ? `Delete image "${imageTitle}"?` : 'Delete this image?',
          confirm: async () => {
            dispatch<DeleteImageAction>({
              type: Actions.DELETE_IMAGE,
              payload: hash,
            });
          },
          deny: async () => {
            dispatch<ConfirmAnsweredAction>({
              type: Actions.CONFIRM_ANSWERED,
            });
          },
        },
      });

    },
    shareImage: () => {
      dispatch<ShareImageStartAction>({
        type: Actions.SHARE_IMAGE,
        payload: hash,
      });
    },
    saveRGBNImage: () => {
      dispatch<NewRGBNImageAction>({
        type: Actions.SAVE_RGBN_IMAGE,
        payload: 'newRGBN',
      });
    },
    updateImageToSelection: (mode) => {
      if (mode === 'add') {
        dispatch<ImageSelectionAddAction>({
          type: Actions.IMAGE_SELECTION_ADD,
          payload: hash,
        });
      } else {
        dispatch<ImageSelectionRemoveAction>({
          type: Actions.IMAGE_SELECTION_REMOVE,
          payload: hash,
        });
      }
    },
    setLightboxImage: () => {
      dispatch<LightboxImageSetAction>({
        type: Actions.SET_LIGHTBOX_IMAGE_HASH,
        payload: hash,
      });
    },
    updateFavouriteTag: (isFavourite: boolean) => {
      dispatch<ImageFavouriteAction>({
        type: Actions.IMAGE_FAVOURITE_TAG,
        payload: {
          hash,
          isFavourite,
        },
      });
    },
    createGroup: () => {
      // eslint-disable-next-line no-alert
      const slug = window.prompt('Slug');
      if (!slug) {
        return;
      }

      dispatch<AddImageGroupAction>({
        type: Actions.ADD_IMAGE_GROUP,
        payload: {
          id: randomId(),
          slug,
          title: imageTitle?.trim() ? `Group - ${imageTitle}` : 'New group',
          created: dayjs(Date.now()).format(dateFormat),
          coverImage: hash,
          images: selection,
          groups: [],
        },
      });
    },
  };
};

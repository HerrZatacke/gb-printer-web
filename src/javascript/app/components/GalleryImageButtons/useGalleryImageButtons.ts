import { useDispatch, useSelector } from 'react-redux';
import { Actions } from '../../store/actions';
import type { State } from '../../store/State';
import type {
  DeleteImageAction,
  DownloadImageStartAction, EditImageSelectionAction,
  ImageFavouriteAction,
  LightboxImageSetAction,
  ShareImageStartAction,
} from '../../../../types/actions/ImageActions';
import type { ConfirmAnsweredAction, ConfirmAskAction } from '../../../../types/actions/ConfirmActions';
import type { ImageSelectionAddAction, ImageSelectionRemoveAction } from '../../../../types/actions/ImageSelectionActions';
import { canShare } from '../../../tools/canShare';

interface UseGalleryImageButtons {
  isSelected: boolean,
  canShare: boolean,
  hasPlugins: boolean,
  startDownload: () => void,
  deleteImage: () => void,
  shareImage: () => void,
  updateImageToSelection: (mode: string) => void,
  setLightboxImage: () => void,
  updateFavouriteTag: (isFavourite: boolean) => void,
  editImage: () => void,
}

export enum ButtonOption {
  EDIT = 'edit',
  DOWNLOAD = 'download',
  DELETE = 'delete',
  SHARE = 'share',
  SELECT = 'select',
  VIEW = 'view',
  FAVOURITE = 'favourite',
  PLUGINS = 'plugins',
}

interface UseGalleryImageButtonsParams {
  hash: string,
  tags: string[],
  imageTitle?: string,
}

export const useGalleryImageButtons = (
  { hash, imageTitle, tags }: UseGalleryImageButtonsParams,
): UseGalleryImageButtons => {
  const stateData = useSelector((state: State) => ({
    isSelected: state.imageSelection.includes(hash),
    hasPlugins: !!state.plugins.length,
    hash,
  }));

  const dispatch = useDispatch();

  return {
    ...stateData,
    canShare: canShare(),
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
    editImage: () => {
      dispatch<EditImageSelectionAction>({
        type: Actions.EDIT_IMAGE_SELECTION,
        payload: {
          tags,
          batch: [hash],
        },
      });
    },
  };
};

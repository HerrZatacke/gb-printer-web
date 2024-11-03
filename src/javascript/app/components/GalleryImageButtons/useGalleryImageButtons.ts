import { useDispatch, useSelector } from 'react-redux';
import { Actions } from '../../store/actions';
import useFiltersStore from '../../stores/filtersStore';
import type { ImageSelectionMode } from '../../stores/filtersStore';
import type { State } from '../../store/State';
import type {
  DeleteImageAction,
  DownloadImageStartAction, EditImageSelectionAction,
  ImageFavouriteAction,
  LightboxImageSetAction,
  ShareImageStartAction,
} from '../../../../types/actions/ImageActions';
import type { ConfirmAnsweredAction, ConfirmAskAction } from '../../../../types/actions/ConfirmActions';
import { canShare } from '../../../tools/canShare';

interface UseGalleryImageButtons {
  isSelected: boolean,
  canShare: boolean,
  hasPlugins: boolean,
  startDownload: () => void,
  deleteImage: () => void,
  shareImage: () => void,
  updateImageToSelection: (mode: ImageSelectionMode) => void,
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
  const { imageSelection, updateImageSelection } = useFiltersStore();
  const isSelected = imageSelection.includes(hash);
  const hasPlugins = useSelector((state: State) => !!state.plugins.length);

  const dispatch = useDispatch();

  return {
    hasPlugins,
    isSelected,
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
    updateImageToSelection: (mode: ImageSelectionMode) => {
      updateImageSelection(mode, hash);
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

import { useDispatch, useSelector } from 'react-redux';
import { Actions } from '../../store/actions';
import useDialogsStore from '../../stores/dialogsStore';
import useEditStore from '../../stores/editStore';
import useFiltersStore from '../../stores/filtersStore';
import useInteractionsStore from '../../stores/interactionsStore';
import type { ImageSelectionMode } from '../../stores/filtersStore';
import type { State } from '../../store/State';
import type {
  DeleteImageAction,
  DownloadImageStartAction,
  ImageFavouriteAction,
  ShareImageStartAction,
} from '../../../../types/actions/ImageActions';
import { canShare } from '../../../tools/canShare';
import { getFilteredImages } from '../../../tools/getFilteredImages';

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
  const {
    imageSelection,
    updateImageSelection,
    filtersActiveTags,
    sortBy,
    recentImports,
  } = useFiltersStore();

  const { setLightboxImage } = useInteractionsStore();
  const { setEditImages } = useEditStore();
  const { dismissDialog, setDialog } = useDialogsStore();

  const isSelected = imageSelection.includes(hash);
  const { hasPlugins, stateImages } = useSelector((state: State) => ({
    hasPlugins: !!state.plugins.length,
    stateImages: state.images,
  }));

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
      setDialog({
        message: imageTitle ? `Delete image "${imageTitle}"?` : 'Delete this image?',
        confirm: async () => {
          dispatch<DeleteImageAction>({
            type: Actions.DELETE_IMAGE,
            payload: hash,
          });
        },
        deny: async () => dismissDialog(0),
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
      setLightboxImage(
        getFilteredImages(
          stateImages,
          { filtersActiveTags, sortBy, recentImports },
        )
          .findIndex((image) => hash === image.hash),
      );
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
      setEditImages({
        tags,
        batch: [hash],
      });
    },
  };
};

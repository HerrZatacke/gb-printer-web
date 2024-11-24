import { useDispatch, useSelector } from 'react-redux';
import { Actions } from '../../store/actions';
import useDialogsStore from '../../stores/dialogsStore';
import useEditStore from '../../stores/editStore';
import useFiltersStore from '../../stores/filtersStore';
import useInteractionsStore from '../../stores/interactionsStore';
import useItemsStore from '../../stores/itemsStore';
import useDownload from '../../../hooks/useDownload';
import type { ImageSelectionMode } from '../../stores/filtersStore';
import type { State } from '../../store/State';
import type { DeleteImagesAction, ImageFavouriteAction } from '../../../../types/actions/ImageActions';
import { canShare } from '../../../tools/canShare';
import { getFilteredImages } from '../../../tools/getFilteredImages';
import useShareImage from '../../../hooks/useShareImage';

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
  const { plugins } = useItemsStore();
  const { setEditImages } = useEditStore();
  const { dismissDialog, setDialog } = useDialogsStore();

  const { downloadSingleImage } = useDownload();
  const { shareImage } = useShareImage();

  const isSelected = imageSelection.includes(hash);
  const hasPlugins = !!plugins.length;
  const { stateImages } = useSelector((state: State) => ({
    stateImages: state.images,
  }));

  const dispatch = useDispatch();

  return {
    hasPlugins,
    isSelected,
    canShare: canShare(),
    startDownload: () => downloadSingleImage(hash),
    deleteImage: () => {
      setDialog({
        message: imageTitle ? `Delete image "${imageTitle}"?` : 'Delete this image?',
        confirm: async () => {
          dispatch<DeleteImagesAction>({
            type: Actions.DELETE_IMAGES,
            payload: [hash],
          });
        },
        deny: async () => dismissDialog(0),
      });
    },
    shareImage: () => shareImage(hash),
    updateImageToSelection: (mode: ImageSelectionMode) => {
      updateImageSelection(mode, [hash]);
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

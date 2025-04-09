import useDialogsStore from '../../stores/dialogsStore';
import useEditStore from '../../stores/editStore';
import useFiltersStore from '../../stores/filtersStore';
import useInteractionsStore from '../../stores/interactionsStore';
import useItemsStore from '../../stores/itemsStore';
import { useStores } from '../../../hooks/useStores';
import { useGalleryTreeContext } from '../../contexts/galleryTree';
import type { ImageSelectionMode } from '../../stores/filtersStore';
import useDownload from '../../../hooks/useDownload';
import useShareImage from '../../../hooks/useShareImage';
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
  const { plugins, updateImageFavouriteTag } = useItemsStore();
  const { view, covers } = useGalleryTreeContext();
  const { setEditImages } = useEditStore();
  const { dismissDialog, setDialog } = useDialogsStore();
  const { updateLastSyncLocalNow, deleteImages } = useStores();
  const { downloadSingleImage } = useDownload();
  const { shareImage } = useShareImage();

  const isSelected = imageSelection.includes(hash);
  const hasPlugins = !!plugins.length;

  return {
    hasPlugins,
    isSelected,
    canShare: canShare(),
    startDownload: () => downloadSingleImage(hash),
    deleteImage: () => {
      setDialog({
        message: imageTitle ? `Delete image "${imageTitle}"?` : 'Delete this image?',
        confirm: async () => {
          deleteImages([hash]);
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
          view.images,
          { filtersActiveTags, sortBy, recentImports },
        )
          .filter((image) => !covers.includes(image.hash))
          .findIndex((image) => hash === image.hash),
      );
    },
    updateFavouriteTag: (isFavourite: boolean) => {
      updateImageFavouriteTag(isFavourite, hash);
      updateLastSyncLocalNow();
    },
    editImage: () => {
      setEditImages({
        tags,
        batch: [hash],
      });
    },
  };
};

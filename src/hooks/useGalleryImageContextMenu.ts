import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import { DialoqQuestionType } from '@/consts/dialog';
import { SpecialTags } from '@/consts/SpecialTags';
import { useGalleryTreeContext } from '@/contexts/GalleryTreeContext';
import { useTracking } from '@/contexts/TrackingContext';
import useDownload from '@/hooks/useDownload';
import { useImageByHash } from '@/hooks/useImageByHash';
import { useImages } from '@/hooks/useImages';
import { usePlugins } from '@/hooks/usePlugins';
import useShareImage from '@/hooks/useShareImage';
import { useStores } from '@/hooks/useStores';
import {
  type ImageSelectionMode,
  useDialogsStore,
  useEditStore,
  useFiltersStore,
  useInteractionsStore,
} from '@/stores/stores';
import { canShare } from '@/tools/canShare';
import { getFilteredImages } from '@/tools/getFilteredImages';
import unique from '@/tools/unique';
import { type RGBNImage } from '@/types/Image';

interface UseGalleryImageContextMenu {
  isSelected: boolean;
  canShare: boolean;
  hasPlugins: boolean;
  isFavourite: boolean;
  hasMeta: boolean;
  hasHashes: boolean;
  startDownload: () => void;
  deleteImage: () => void;
  shareImage: () => void;
  showMetadata: () => void;
  updateImageToSelection: (mode: ImageSelectionMode) => void;
  setLightboxImage: () => void;
  updateFavouriteTag: (isFavourite: boolean) => Promise<void>;
  editImage: () => void;
}

export const ButtonOption = {
  EDIT: 'edit',
  DOWNLOAD: 'download',
  DELETE: 'delete',
  SHARE: 'share',
  SELECT: 'select',
  VIEW: 'view',
  FAVOURITE: 'favourite',
  PLUGINS: 'plugins',
} as const;
export type ButtonOption = (typeof ButtonOption)[keyof typeof ButtonOption];

export const useGalleryImageContextMenu = (hash: string): UseGalleryImageContextMenu => {
  const t = useTranslations('useGalleryImageContext');
  const {
    imageSelection,
    updateImageSelection,
    filtersTags,
    filtersFrames,
    filtersPalettes,
    sortBy,
    recentImports,
  } = useFiltersStore();

  const { setLightboxImage } = useInteractionsStore();
  const { image } = useImageByHash(hash);
  const { updateImages } = useImages({});
  const { plugins } = usePlugins({ list: true });
  const { view, covers } = useGalleryTreeContext();
  const { setEditImages } = useEditStore();
  const { dismissDialog, setDialog } = useDialogsStore();
  const { updateLastSyncLocalNow, deleteImages } = useStores();
  const { setDownloadImages } = useDownload();
  const { shareImage } = useShareImage();
  const { sendEvent } = useTracking();

  const isSelected = imageSelection.includes(hash);
  const hasPlugins = !!plugins.length;

  const updateFavouriteTag = useCallback(async (isFavourite: boolean) => {
    if (!image) {
      return;
    }

    const tags = isFavourite ?
      unique([SpecialTags.FILTER_FAVOURITE, ...image.tags]) :
      image.tags.filter((tag) => tag !== SpecialTags.FILTER_FAVOURITE);

    await updateImages([{
      ...image,
      tags,
    }]);

    updateLastSyncLocalNow();
  }, [image, updateImages, updateLastSyncLocalNow]);

  return {
    hasPlugins,
    isSelected,
    hasHashes: Boolean((image as RGBNImage)?.hashes),
    isFavourite: image?.tags.includes(SpecialTags.FILTER_FAVOURITE) || false,
    hasMeta: !!image?.meta,
    canShare: canShare(),
    startDownload: () => setDownloadImages([hash]),
    deleteImage: () => {
      setDialog({
        message: t('deleteImage', { title: image?.title || 'NO_TITLE' }),
        confirm: async () => {
          await deleteImages([hash]);
        },
        deny: async () => dismissDialog(0),
      });
    },
    shareImage: () => shareImage(hash),
    showMetadata: () => {
      setDialog({
        message: t('metaInfo', { title: image?.title || 'NO_TITLE' }),
        questions: () => ([
          {
            key: 'meta',
            type: DialoqQuestionType.META,
            label: '', // not displayed
            meta: {
              hash,
              hashes: (image as RGBNImage)?.hashes || undefined,
              meta: image?.meta || undefined,
            },
          },
        ]),
        confirm: async () => dismissDialog(0),
      });
    },
    updateImageToSelection: (mode: ImageSelectionMode) => {
      updateImageSelection(mode, [hash]);
    },
    setLightboxImage: () => {
      setLightboxImage(
        getFilteredImages(
          view,
          {
            filtersTags,
            filtersFrames,
            filtersPalettes,
            sortBy,
            recentImports,
          },
        )
          .filter((img) => !covers.includes(img.hash))
          .findIndex((img) => hash === img.hash),
      );
    },
    updateFavouriteTag,
    editImage: () => {
      setEditImages({
        tags: image?.tags || [],
        batch: [hash],
      });
      sendEvent('editImages', { imageCount: 1 });
    },
  };
};

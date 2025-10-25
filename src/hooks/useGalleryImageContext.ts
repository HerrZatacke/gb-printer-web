import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { DialoqQuestionType } from '@/consts/dialog';
import { SpecialTags } from '@/consts/SpecialTags';
import { useGalleryTreeContext } from '@/contexts/galleryTree';
import useDownload from '@/hooks/useDownload';
import useShareImage from '@/hooks/useShareImage';
import { useStores } from '@/hooks/useStores';
import useDialogsStore from '@/stores/dialogsStore';
import useEditStore from '@/stores/editStore';
import useFiltersStore from '@/stores/filtersStore';
import type { ImageSelectionMode } from '@/stores/filtersStore';
import useInteractionsStore from '@/stores/interactionsStore';
import useItemsStore from '@/stores/itemsStore';
import { canShare } from '@/tools/canShare';
import { getFilteredImages } from '@/tools/getFilteredImages';
import type { RGBNImage } from '@/types/Image';

interface UseGalleryImageContext {
  isSelected: boolean,
  canShare: boolean,
  hasPlugins: boolean,
  isFavourite: boolean,
  hasMeta: boolean,
  hasHashes: boolean,
  startDownload: () => void,
  deleteImage: () => void,
  shareImage: () => void,
  showMetadata: () => void,
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

export const useGalleryImageContext = (hash: string): UseGalleryImageContext => {
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
  const { plugins, updateImageFavouriteTag } = useItemsStore();
  const { view, covers } = useGalleryTreeContext();
  const { setEditImages } = useEditStore();
  const { dismissDialog, setDialog } = useDialogsStore();
  const { updateLastSyncLocalNow, deleteImages } = useStores();
  const { setDownloadImages } = useDownload();
  const { shareImage } = useShareImage();

  const { images } = useItemsStore();
  const image = useMemo(() => (
    images.find((img) => img.hash === hash)
  ), [hash, images]);

  const isSelected = imageSelection.includes(hash);
  const hasPlugins = !!plugins.length;

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
          deleteImages([hash]);
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
    updateFavouriteTag: (isFavourite: boolean) => {
      updateImageFavouriteTag(isFavourite, hash);
      updateLastSyncLocalNow();
    },
    editImage: () => {
      setEditImages({
        tags: image?.tags || [],
        batch: [hash],
      });
    },
  };
};

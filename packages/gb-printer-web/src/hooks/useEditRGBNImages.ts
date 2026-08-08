import {
  Date,
  toCreationDate,
  type MonochromeImage,
  type RGBNHashes,
} from 'gb-printer-schemas';
import { useTranslations } from 'next-intl';
import objectHash from 'object-hash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useGalleryTreeContext } from '@/contexts/GalleryTreeContext';
import { useNavigationTools } from '@/contexts/NavigationToolsContext';
import { useDateFormat } from '@/hooks/useDateFormat';
import { toSlug } from '@/hooks/useEditImageGroup';
import { useImageGroups } from '@/hooks/useImageGroups';
import { useImages } from '@/hooks/useImages';
import useSaveRGBNImages from '@/hooks/useSaveRGBNImages';
import {
  useEditStore,
  useFiltersStore,
  useSettingsStore,
} from '@/stores/stores';
import { reduceImagesMonochrome } from '@/tools/isRGBNImage';
import { randomId } from '@/tools/randomId';
import { type SerializableImageGroup } from '@/types/ImageGroup';

type ColorKey = 'r' | 'g' | 'b' | 'n' | 's'; // s=separator

type RGBOrder = ColorKey[];

export const RGBGrouping = {
  BY_COLOR: 'BY_COLOR',
  BY_IMAGE: 'BY_IMAGE',
  MANUAL: 'MANUAL',
} as const;
export type RGBGrouping = (typeof RGBGrouping)[keyof typeof RGBGrouping];

interface UseEditRGBNImages {
  order: RGBOrder;
  grouping: RGBGrouping;
  canConfirm: boolean;
  lengthWarning: boolean;
  rgbnHashes: RGBNHashes[];
  sortedImages: MonochromeImage[];
  createGroup: boolean;
  updateOrder: (color: ColorKey, direction: number) => void;
  toggleSingleChannel: (channel: keyof RGBNHashes, hash: string) => void;
  setGrouping: (value: RGBGrouping) => void;
  save: () => Promise<void>;
  setCreateGroup: (value: boolean) => void;
  cancelEditRGBNImages: () => void;
}

export const useEditRGBNImages = (): UseEditRGBNImages => {
  const t = useTranslations('useEditRGBNImages');
  const { navigateToGroup } = useNavigationTools();
  const { view } = useGalleryTreeContext();
  const { saveRGBNImage } = useSaveRGBNImages();

  const {
    createGroup: stateCreateGroup,
    setCreateGroup: stateSetCreateGroup,
  } = useSettingsStore();

  const { sortBy } = useFiltersStore();
  const { editRGBNImages, cancelEditRGBNImages, cancelEditImageGroup } = useEditStore();
  const { updateImageGroup } = useImageGroups({});

  const [createGroup, setCreateGroup] = useState<boolean>(editRGBNImages.length > 5 && stateCreateGroup);

  useEffect(() => {
    stateSetCreateGroup(createGroup);
  }, [createGroup, stateSetCreateGroup]);


  const globalSortDirection = sortBy.split('_')[1];

  const { raw: rawImages } = useImages({ rawCandidateHashes: new Set(editRGBNImages) });

  const sortedImages = useMemo(() => rawImages.reduce(reduceImagesMonochrome, []), [rawImages]);

  const [order, setOrder] = useState<RGBOrder>(['r', 'g', 'b', 's', 'n']);
  const [grouping, setGrouping] = useState<RGBGrouping>(RGBGrouping.MANUAL);
  const [manualHashes, setManualHashes] = useState<RGBNHashes>({
    r: sortedImages[0]?.hash || undefined,
    g: sortedImages[Math.floor(sortedImages.length / 3)]?.hash || undefined,
    b: sortedImages[Math.floor(sortedImages.length / 3) * 2]?.hash || undefined,
  });

  useEffect(() => {
    // intentional: recalculate grouping default when sortedImages changes,
    // while still allowing free user overrides via setGrouping in between
    // https://github.com/react/react/issues/34858
    // https://github.com/react/react/issues/34743
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGrouping(sortedImages.length <= 4 ? RGBGrouping.MANUAL : RGBGrouping.BY_COLOR);
  }, [sortedImages]);

  const toggleSingleChannel = (channel: keyof RGBNHashes, hash: string) => {
    const nextRGBNHashes: RGBNHashes = { ...manualHashes };

    if (nextRGBNHashes[channel] === hash) {
      delete nextRGBNHashes[channel];
    } else {
      nextRGBNHashes[channel] = hash;
    }

    setManualHashes(nextRGBNHashes);
  };

  const updateOrder = (colorKey: ColorKey, newPosition: number) => {
    if (newPosition < 0 || newPosition > order.length) {
      return;
    }

    const tempOrder = order.filter((color) => color !== colorKey);
    tempOrder.splice(newPosition, 0, colorKey).filter(Boolean);
    setOrder(tempOrder);
  };

  const usedColorCount = order.findIndex((v) => v === 's');

  const blockLength = Math.ceil(editRGBNImages.length / usedColorCount);

  const lengthWarning = usedColorCount * blockLength !== editRGBNImages.length;

  const rgbnHashes: RGBNHashes[] = useMemo<RGBNHashes[]>((): RGBNHashes[] => {
    switch (grouping) {
      case RGBGrouping.MANUAL: {
        return Object.keys(manualHashes).length ? [manualHashes] : [];
      }

      case RGBGrouping.BY_COLOR:
      case RGBGrouping.BY_IMAGE:
      default: {

        const usedColors = order.slice(0, usedColorCount);

        const hashes = Array(blockLength)
          .fill('')
          .map((_, imageIndex): RGBNHashes => (
            usedColors.reduce((acc: RGBNHashes, colorKey: ColorKey, colorIndex: number): RGBNHashes => {
              const sourceIndex = grouping === RGBGrouping.BY_COLOR ? (
                imageIndex + (blockLength * colorIndex)
              ) : (
                colorIndex + (usedColorCount * imageIndex)
              );

              const channelHash = sortedImages[sourceIndex]?.hash;

              if (!channelHash) {
                return acc;
              }

              return {
                ...acc,
                [colorKey]: channelHash,
              };
            }, {})
          ));

        if (globalSortDirection === 'desc') {
          hashes.reverse();
        }

        return hashes;
      }
    }
  }, [blockLength, globalSortDirection, grouping, manualHashes, order, sortedImages, usedColorCount]);

  const { formatter } = useDateFormat();

  const save = useCallback(async () => {
    if (!view) {
      return;
    }

    cancelEditRGBNImages();
    await saveRGBNImage(rgbnHashes);

    if (createGroup) {
      const title = t('rgbNewGroupTitle', { date: formatter(new Date()) });
      const slug = toSlug(title);

      const createdImageHashes: string[] = rgbnHashes.map((hashes) => objectHash(hashes));

      cancelEditImageGroup();

      const newImageGroup: SerializableImageGroup = {
        id: randomId(),
        slug,
        title,
        isFavourite: false,
        created: toCreationDate(),
        coverImage: createdImageHashes[0],
        images: createdImageHashes,
        groups: [],
        tags: [],
      };

      await updateImageGroup(newImageGroup, view.id);
      await navigateToGroup(newImageGroup.id, 0, false);
    }

  }, [cancelEditImageGroup, cancelEditRGBNImages, createGroup, formatter, navigateToGroup, rgbnHashes, saveRGBNImage, t, updateImageGroup, view]);

  const singleMode = grouping === RGBGrouping.MANUAL;

  return {
    order,
    grouping,
    canConfirm: singleMode ? rgbnHashes.length > 0 : order.length > 1,
    lengthWarning: singleMode ? false : lengthWarning,
    rgbnHashes,
    sortedImages,
    createGroup,
    updateOrder,
    toggleSingleChannel,
    setGrouping,
    save,
    setCreateGroup,
    cancelEditRGBNImages,
  };
};

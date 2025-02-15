import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import objectHash from 'object-hash';
import useEditStore from '../../../stores/editStore';
import useFiltersStore from '../../../stores/filtersStore';
import useItemsStore from '../../../stores/itemsStore';
import { getFilteredImages } from '../../../../tools/getFilteredImages';
import { reduceImagesMonochrome } from '../../../../tools/isRGBNImage';
import { dateFormat } from '../../../defaults';
import { toSlug } from '../EditImageGroup/useEditImageGroup';
import { randomId } from '../../../../tools/randomId';
import type { MonochromeImage, RGBNHashes } from '../../../../../types/Image';
import { useGalleryTreeContext } from '../../../contexts/galleryTree';
import useSaveRGBNImages from '../../../../hooks/useSaveRGBNImages';

type ColorKey = 'r' | 'g' | 'b' | 'n' | 's'; // s=separator

type RGBOrder = ColorKey[];

export enum RGBGrouping {
  BY_COLOR = 'BY_COLOR',
  BY_IMAGE = 'BY_IMAGE',
  MANUAL = 'MANUAL',
}

interface UseEditRGBNImages {
  order: RGBOrder,
  grouping: RGBGrouping,
  canConfirm: boolean,
  lengthWarning: boolean,
  rgbnHashes: RGBNHashes[],
  sortedImages: MonochromeImage[],
  createGroup: boolean,
  updateOrder: (color: ColorKey, direction: number) => void,
  toggleSingleChannel: (channel: keyof RGBNHashes, hash: string) => void
  setGrouping: (value: RGBGrouping) => void,
  save: () => void,
  setCreateGroup: (value: boolean) => void,
  cancelEditRGBNImages: () => void,
}

export const useEditRGBNImages = (): UseEditRGBNImages => {
  const navigate = useNavigate();
  const { view } = useGalleryTreeContext();
  const { saveRGBNImage } = useSaveRGBNImages();

  const { sortBy } = useFiltersStore();
  const { editRGBNImages, cancelEditRGBNImages, cancelEditImageGroup } = useEditStore();
  const { addImageGroup, images } = useItemsStore();

  const [createGroup, setCreateGroup] = useState<boolean>(editRGBNImages.length > 5);

  const globalSortDirection = sortBy.split('_')[1];

  const sortedImages = useMemo<MonochromeImage[]>(() => {

    const filtered = getFilteredImages(images, {
      filtersActiveTags: [],
      sortBy,
      recentImports: [],
    });

    if (globalSortDirection === 'desc') {
      filtered.reverse();
    }

    return filtered
      .reduce(reduceImagesMonochrome, [])
      .reduce((acc: MonochromeImage[], image: MonochromeImage): MonochromeImage[] => {
        if (!editRGBNImages.includes(image.hash)) {
          return acc;
        }

        return [...acc, image];
      }, []);
  }, [editRGBNImages, globalSortDirection, images, sortBy]);

  const [order, setOrder] = useState<RGBOrder>(['r', 'g', 'b', 's', 'n']);
  const [grouping, setGrouping] = useState<RGBGrouping>(
    sortedImages.length <= 4 ?
      RGBGrouping.MANUAL :
      RGBGrouping.BY_COLOR,
  );
  const [manualHashes, setManualHashes] = useState<RGBNHashes>({
    r: sortedImages[0]?.hash || undefined,
    g: sortedImages[Math.floor(sortedImages.length / 3)]?.hash || undefined,
    b: sortedImages[Math.floor(sortedImages.length / 3) * 2]?.hash || undefined,
  });

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

  const save = () => {
    cancelEditRGBNImages();
    saveRGBNImage(rgbnHashes);

    if (createGroup) {
      const title = `RGB ${dayjs().format(dateFormat)}`;
      const slug = toSlug(title);

      const createdImageHashes: string[] = rgbnHashes.map((hashes) => objectHash(hashes));

      cancelEditImageGroup();

      // ToDo: Handle jumping to wrong folder when creating group in sub-view

      addImageGroup(
        {
          id: randomId(),
          slug,
          title,
          created: dayjs(Date.now()).format(dateFormat),
          coverImage: createdImageHashes[0],
          images: createdImageHashes,
          groups: [],
        },
        view.id,
      );

      navigate(`/gallery/${view.slug}${slug}/page/1`);
    }

  };

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

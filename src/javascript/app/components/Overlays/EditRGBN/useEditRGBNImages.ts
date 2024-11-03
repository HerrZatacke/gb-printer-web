import { useDispatch, useSelector } from 'react-redux';
import { useMemo, useState } from 'react';
import useFiltersStore from '../../../stores/filtersStore';
import { Actions } from '../../../store/actions';
import { getFilteredImages } from '../../../../tools/getFilteredImages';
import { reduceImagesMonochrome } from '../../../../tools/isRGBNImage';
import type { CancelCreateRGBImagesAction, SaveNewRGBImagesAction } from '../../../../../types/actions/ImageActions';
import type { State } from '../../../store/State';
import type { MonochromeImage, RGBNHashes } from '../../../../../types/Image';

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
  updateOrder: (color: ColorKey, direction: number) => void,
  toggleSingleChannel: (channel: keyof RGBNHashes, hash: string) => void
  setGrouping: (value: RGBGrouping) => void,
  save: () => void,
  cancelEditRGBN: () => void,
}

export const useEditRGBNImages = (): UseEditRGBNImages => {
  const dispatch = useDispatch();
  const { sortBy } = useFiltersStore();
  const { editRGBNImages, images } = useSelector((state: State) => ({
    editRGBNImages: state.editRGBNImages,
    images: state.images,
  }));

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
    dispatch<SaveNewRGBImagesAction>({
      type: Actions.SAVE_NEW_RGB_IMAGES,
      payload: rgbnHashes,
    });
  };

  const singleMode = grouping === RGBGrouping.MANUAL;

  return {
    order,
    grouping,
    canConfirm: singleMode ? rgbnHashes.length > 0 : order.length > 1,
    lengthWarning: singleMode ? false : lengthWarning,
    rgbnHashes,
    sortedImages,
    updateOrder,
    toggleSingleChannel,
    setGrouping,
    save,
    cancelEditRGBN: () => {
      dispatch<CancelCreateRGBImagesAction>({
        type: Actions.CANCEL_CREATE_RGB_IMAGES,
      });
    },
  };
};

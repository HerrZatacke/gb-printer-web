import { useMemo } from 'react';
import useFiltersStore from '@/stores/filtersStore';
import useItemsStore from '@/stores/itemsStore';
import type { FilteredImagesState } from '@/tools/getFilteredImages';
import { getFilteredImages } from '@/tools/getFilteredImages';
import { reduceImagesMonochrome } from '@/tools/isRGBNImage';
import { addSortIndex, removeSortIndex, sortImages } from '@/tools/sortImages';
import uniqueBy from '@/tools/unique/by';
import type { Image, MonochromeImage } from '@/types/Image';

const uniqeHash = uniqueBy<Image>('hash');

const usePreviewImages = (): MonochromeImage[] => {
  const { images } = useItemsStore();

  const {
    imageSelection,
    sortBy,
    filtersActiveTags,
    recentImports,
  } = useFiltersStore();

  const filterState: FilteredImagesState = useMemo(() => (
    { sortBy, filtersActiveTags, recentImports }
  ), [filtersActiveTags, recentImports, sortBy]);

  return useMemo<MonochromeImage[]>(() => {
    const selectedImages = imageSelection
      .map((imageHash) => (
        images.find(({ hash }) => hash === imageHash)
      ))
      .reduce(reduceImagesMonochrome, []);

    const filtered = (selectedImages.length > 1) ?
      [] :
      getFilteredImages(images, filterState).reduce(reduceImagesMonochrome, []);

    const allImages = ((selectedImages.length + filtered.length) > 1) ?
      [] :
      [...images]
        .map(addSortIndex)
        .sort(sortImages(filterState.sortBy))
        .map(removeSortIndex)
        .reduce(reduceImagesMonochrome, []);

    const previewImages = uniqeHash([
      selectedImages.shift(),
      filtered.shift(),
      allImages.shift(),
      allImages.pop(),
      filtered.pop(),
      selectedImages.pop(),
    ].reduce(reduceImagesMonochrome, []));

    return [
      previewImages.shift(),
      previewImages.pop(),
    ].reduce(reduceImagesMonochrome, []);
  }, [filterState, imageSelection, images]);
};

export default usePreviewImages;

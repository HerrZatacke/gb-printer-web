import { useMemo } from 'react';
import { useGalleryTreeContext } from '@/contexts/galleryTree';
import useFiltersStore from '@/stores/filtersStore';
import type { FilteredImagesState } from '@/tools/getFilteredImages';
import { getFilteredImages } from '@/tools/getFilteredImages';
import { reduceImagesMonochrome } from '@/tools/isRGBNImage';
import { addSortIndex, removeSortIndex, sortImages } from '@/tools/sortImages';
import uniqueBy from '@/tools/unique/by';
import type { Image, MonochromeImage } from '@/types/Image';

const uniqeHash = uniqueBy<Image>('hash');

const usePreviewImages = (): MonochromeImage[] => {
  const { root } = useGalleryTreeContext();

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
        root.allImages.find(({ hash }) => hash === imageHash)
      ))
      .reduce(reduceImagesMonochrome, []);

    const filtered = (selectedImages.length > 1) ?
      [] :
      getFilteredImages(root, filterState).reduce(reduceImagesMonochrome, []);

    const allImages = ((selectedImages.length + filtered.length) > 1) ?
      [] :
      [...root.allImages]
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
  }, [filterState, imageSelection, root]);
};

export default usePreviewImages;

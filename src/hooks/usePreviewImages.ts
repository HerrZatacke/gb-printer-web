import { useMemo } from 'react';
import { useGalleryTreeContext } from '@/contexts/galleryTree';
import useFiltersStore from '@/stores/filtersStore';
import type { FilteredImagesState } from '@/tools/getFilteredImages';
import { getFilteredImages } from '@/tools/getFilteredImages';
import { reduceImagesMonochrome } from '@/tools/isRGBNImage';
import { addSortIndex, removeSortIndex, sortImages } from '@/tools/sortImages';
import uniqueBy from '@/tools/unique/by';
import { type Image } from '@/types/Image';

const uniqeHash = uniqueBy<Image>('hash');

interface UsePreviewImages {
  previewImages: string[];
}

const usePreviewImages = (): UsePreviewImages => {
  const { root } = useGalleryTreeContext();

  const {
    imageSelection,
    sortBy,
    filtersTags,
    filtersFrames,
    filtersPalettes,
    recentImports,
  } = useFiltersStore();

  const filterState: FilteredImagesState = useMemo(() => (
    { sortBy, filtersTags, filtersPalettes, filtersFrames, recentImports }
  ), [filtersFrames, filtersPalettes, filtersTags, recentImports, sortBy]);

  const previewImages = useMemo<string[]>(() => {
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

    const availableImages = uniqeHash([
      selectedImages.shift(),
      filtered.shift(),
      allImages.shift(),
      allImages.pop(),
      filtered.pop(),
      selectedImages.pop(),
    ].reduce(reduceImagesMonochrome, []));

    return [
      availableImages.shift(),
      availableImages.pop(),
    ]
      .reduce(reduceImagesMonochrome, [])
      .map(({ hash }) => hash);
  }, [filterState, imageSelection, root]);

  return {
    previewImages,
  };
};

export default usePreviewImages;

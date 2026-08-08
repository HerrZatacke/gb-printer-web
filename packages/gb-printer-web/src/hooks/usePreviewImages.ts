import { type Image } from 'gb-printer-schemas';
import { useMemo } from 'react';
import { SpecialTags } from '@/consts/SpecialTags';
import { useImageQueryParams } from '@/hooks/useImageQueryParams';
import { useImages } from '@/hooks/useImages';
import { useFiltersStore } from '@/stores/stores';
import { reduceImagesMonochrome } from '@/tools/isRGBNImage';
import uniqueBy from '@/tools/unique/by';

const uniqeHash = uniqueBy<Image>('hash');

interface UsePreviewImages {
  previewImages: string[];
}

const usePreviewImages = (): UsePreviewImages => {
  const { imageSelection } = useFiltersStore();
  const { byHashes: selected } = useImages({ hashes: imageSelection });
  const imageQueryParams = useImageQueryParams();

  const query = {
    ...imageQueryParams,
    page: 0,
    pageSize: 2,
    filters: {
      ...imageQueryParams.filters,
      tags: [
        ...(imageQueryParams.filters?.tags || []),
        SpecialTags.FILTER_MONOCHROME,
      ],
    },
  };

  const { raw: filtered } = useImages({ raw: query });

  const previewImages = useMemo<string[]>(() => {
    // raw basic sources
    const selectedImages = selected.reduce(reduceImagesMonochrome, []);
    const filteredImages = filtered.reduce(reduceImagesMonochrome, []);

    const availableImages = uniqeHash([
      selectedImages.shift(),
      filteredImages.shift(),
      filteredImages.pop(),
      selectedImages.pop(),
    ].reduce(reduceImagesMonochrome, []));

    return [
      availableImages.shift(),
      availableImages.pop(),
    ]
      .reduce(reduceImagesMonochrome, [])
      .map(({ hash }) => hash);
  }, [filtered, selected]);

  console.log({ filtered, query });

  return {
    previewImages,
  };
};

export default usePreviewImages;

import dayjs from 'dayjs';
import { useCallback } from 'react';
import { dateFormat, defaultRGBNPalette } from '@/consts/defaults';
import { useStores } from '@/hooks/useStores';
import useFiltersStore from '@/stores/filtersStore';
import type { RGBNHashes, RGBNImage } from '@/types/Image';

interface UseSaveRGBNImages {
  saveRGBNImage: (hashes: RGBNHashes[]) => Promise<void>,
}

const useSaveRGBNImages = (): UseSaveRGBNImages => {
  const { setImageSelection } = useFiltersStore();
  const { addImages } = useStores();

  const saveRGBNImage = useCallback(async (hashes: RGBNHashes[]): Promise<void> => {
    const { default: hash } = await import(/* webpackChunkName: "obh" */ 'object-hash');

    const now = dayjs();

    const images = hashes.map((rgbnHashes: RGBNHashes, index: number): RGBNImage => {
      const image: RGBNImage = {
        palette: defaultRGBNPalette,
        hashes: rgbnHashes,
        hash: hash(rgbnHashes),
        created: now.add(index, 'milliseconds').format(dateFormat),
        title: '',
        tags: [],
      };

      return image;
    });

    addImages(images);
    setImageSelection(images.map((i) => i.hash));
  }, [addImages, setImageSelection]);

  return { saveRGBNImage };
};

export default useSaveRGBNImages;

import { useCallback } from 'react';
import { defaultRGBNPalette } from '@/consts/defaults';
import { useStores } from '@/hooks/useStores';
import { useFiltersStore } from '@/stores/stores';
import { toCreationDate } from '@/tools/toCreationDate';
import type { RGBNHashes, RGBNImage } from '@/types/Image';


interface UseSaveRGBNImages {
  saveRGBNImage: (hashes: RGBNHashes[]) => Promise<void>,
}

const useSaveRGBNImages = (): UseSaveRGBNImages => {
  const { setImageSelection } = useFiltersStore();
  const { addImages } = useStores();

  const saveRGBNImage = useCallback(async (hashes: RGBNHashes[]): Promise<void> => {
    const { default: hash } = await import(/* webpackChunkName: "obh" */ 'object-hash');

    const now = Date.now();

    const images = hashes.map((rgbnHashes: RGBNHashes, index: number): RGBNImage => {
      const image: RGBNImage = {
        palette: defaultRGBNPalette,
        hashes: rgbnHashes,
        hash: hash(rgbnHashes),
        created: toCreationDate(now + index),
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

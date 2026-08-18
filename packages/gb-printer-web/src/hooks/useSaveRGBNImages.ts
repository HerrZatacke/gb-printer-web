import { Rotation } from 'gb-image-decoder';
import { type RGBNHashes, type RGBNImage, toCreationDate, Date } from 'gb-printer-schemas';
import { useCallback } from 'react';
import { defaultRGBNPalette } from '@/consts/defaults';
import { useStores } from '@/hooks/useStores';
import { useFiltersStore } from '@/stores/stores';


interface UseSaveRGBNImages {
  saveRGBNImage: (hashes: RGBNHashes[]) => Promise<void>;
}

const useSaveRGBNImages = (): UseSaveRGBNImages => {
  const { setImageSelection } = useFiltersStore();
  const { addImages } = useStores();

  const saveRGBNImage = useCallback(async (hashes: RGBNHashes[]): Promise<void> => {
    const { default: hash } = await import(/* webpackChunkName: "obh" */ 'object-hash');

    const now = Date.now();

    const images = hashes.map((rgbnHashes: RGBNHashes, index: number): RGBNImage => {
      const image: RGBNImage = {
        type: 'rgbn',
        palette: defaultRGBNPalette,
        hashes: rgbnHashes,
        hash: hash(rgbnHashes),
        created: toCreationDate(now + index),
        title: '',
        tags: [],
        lockFrame: false,
        frame: null,
        meta: null,
        rotation: Rotation.DEG_0,
      };

      return image;
    });

    await addImages(images);
    setImageSelection(images.map((i) => i.hash));
  }, [addImages, setImageSelection]);

  return { saveRGBNImage };
};

export default useSaveRGBNImages;

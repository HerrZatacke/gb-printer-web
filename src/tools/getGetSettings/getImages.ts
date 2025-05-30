import { localforageImages } from '../localforageInstance';
import type { Image, RGBNImage } from '../../../types/Image';
import { isRGBNImage } from '../isRGBNImage';
import unique from '../unique';

const getImages = async (exportImages: Image[]): Promise<Record<string, string>> => {

  const exportImageHashes = exportImages.reduce((acc: string[], exportImage: Image): string[] => {
    const exportHashes: string[] = isRGBNImage(exportImage) ?
      unique(Object.values((exportImage as RGBNImage).hashes)) :
      [exportImage.hash];

    return [
      ...acc,
      ...exportHashes,
    ];
  }, []);

  const result = await Promise.all(exportImageHashes.map(async (hash) => {
    const data = await localforageImages.getItem(hash);
    return ({
      hash,
      data,
    });
  }));

  const images: Record<string, string> = {};
  result.forEach(({
    hash,
    data,
  }) => {
    if (data) {
      images[hash] = data;
    }
  });

  return images;
};

export default getImages;

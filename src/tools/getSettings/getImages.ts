import { getQueryClient } from '@/contexts/QueryClient';
import { binaryImagesByHashesQueryOptions } from '@/stores/queries/binaryImages';
import { isRGBNImage } from '@/tools/isRGBNImage';
import unique from '@/tools/unique';
import { type Image, type RGBNImage } from '@/types/Image';

const getImages = async (exportImages: Image[]): Promise<Record<string, string>> => {
  const queryClient = getQueryClient();

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
    const { items: [binaryImage] } = await queryClient.fetchQuery(binaryImagesByHashesQueryOptions([hash]));
    const data = binaryImage.imageData || null;

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

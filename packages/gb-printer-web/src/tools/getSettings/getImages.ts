import { type BinaryStoreItem, type Image, type RGBNImage } from 'gb-printer-schemas';
import { getQueryClient } from '@/contexts/QueryClient';
import { binaryImagesByHashesQueryOptions } from '@/stores/items/queries/binaryImages';
import { isRGBNImage } from '@/tools/isRGBNImage';
import unique from '@/tools/unique';

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

  const { items: result } = await queryClient.fetchQuery(binaryImagesByHashesQueryOptions(exportImageHashes));

  const images: Record<string, string> = {};
  result.forEach(({ hash, data }: BinaryStoreItem) => {
    images[hash] = data;
  });

  return images;
};

export default getImages;

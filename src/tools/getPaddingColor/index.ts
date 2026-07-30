import { getQueryClient } from '@/contexts/QueryClient';
import { imageByHashQueryOptions } from '@/stores/items/queries/images';
import { getImagePalettes } from '@/tools/getImagePalettes';
import { isRGBNImage } from '@/tools/isRGBNImage';

export const getPaddingColor = async (imageHash: string): Promise<string> => {
  const queryClient = getQueryClient();
  const image = await queryClient.fetchQuery(imageByHashQueryOptions(imageHash));
  if (!image) {
    throw new Error('image not found');
  }

  if (isRGBNImage(image)) {
    return '#000';
  }

  const palette = (await getImagePalettes(image)).framePalette;

  if (!palette) {
    return '#000';
  }

  return palette.palette[3];
};

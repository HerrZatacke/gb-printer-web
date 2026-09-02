import { getQueryClient } from '@/contexts/QueryClient';
import { binaryFramesOrphanedHashesQueryOptions } from '@/stores/items/queries/binaryFrames';
import { binaryImagesOrphanedHashesQueryOptions } from '@/stores/items/queries/binaryImages';
import { deleteBinaryFrame, deleteBinaryImage } from '@/tools/storage';

export const getTrashImages = async (): Promise<string[]> => {
  const queryClient = getQueryClient();
  const { items } = await queryClient.fetchQuery(binaryImagesOrphanedHashesQueryOptions());
  return items;
};

export const getTrashFrames = async (): Promise<string[]> => {
  const queryClient = getQueryClient();
  const { items } = await queryClient.fetchQuery(binaryFramesOrphanedHashesQueryOptions());
  return items;
};

export const cleanupStorage = async (): Promise<void> => {
  const trashImages = await getTrashImages();
  const trashFrames = await getTrashFrames();

  await Promise.all([
    ...trashFrames.map((deleteHash) => deleteBinaryFrame(deleteHash)),
    ...trashImages.map((deleteHash) => deleteBinaryImage(deleteHash)),
  ]);
};

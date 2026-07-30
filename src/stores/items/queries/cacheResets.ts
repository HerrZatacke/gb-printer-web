import { QueryClient } from '@tanstack/react-query';
import { imageGroupsKeys, imagesKeys } from '@/stores/items/queries/cacheKeys';

export const resetImageGroupCaches = async (queryClient: QueryClient): Promise<void> => {
  await Promise.all([
    queryClient.resetQueries({ queryKey: imageGroupsKeys.all }),
    queryClient.resetQueries({ queryKey: imagesKeys.imagesByGroupKeys }),
  ]);
};

export const resetImageCaches = async (queryClient: QueryClient, alsoGroups = false): Promise<void> => {
  const resets = [queryClient.resetQueries({ queryKey: imagesKeys.all })];

  if (alsoGroups) {
    resets.push(queryClient.resetQueries({ queryKey: imageGroupsKeys.all }));
  }

  await Promise.all(resets);
};

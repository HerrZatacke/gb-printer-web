import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getItemsSource } from '@/items/client';
import  { type GetImagesParams } from '@/workers/itemsIndexedDbWorker/types';

export function useImages(params: GetImagesParams) {
  return useQuery({
    queryKey: ['items', params],
    queryFn: async () => {
      const source = await getItemsSource();
      return source.getImages(params);
    },
    placeholderData: keepPreviousData,
    retry: false,
  });
}

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { imageByHashQueryOptions } from '@/stores/items/queries/images';
import { Image } from '@/types/Image';

export interface UseImageByHash {
  isLoading: boolean;
  image: Image | null;
}

export const useImageByHash = (hash: string): UseImageByHash => {
  const query = useQuery({
    ...imageByHashQueryOptions(hash),
    placeholderData: keepPreviousData,
    retry: false,
  });

  return {
    image: query.data ?? null,
    isLoading: query.isLoading,
  };
};

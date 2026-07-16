import { useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { getItemsSource } from '@/items/client';
import {
  imagesByHashesQueryOptions,
  imagesListQueryOptions,
  imagesKeys,
  imagesRawQueryOptions, imagesByAnyHashesQueryOptions,
} from '@/stores/queries/images';
import { type Image } from '@/types/Image';
import { type GetImagesParams, ItemsReferenceList } from '@/workers/itemsIndexedDbWorker/types';

export interface UseImagesOptions {
  list?: boolean;
  hashes?: string[];
  anyHashes?: string[];
  raw?: GetImagesParams;
}

export interface UseImages {
  images: Image[];
  totalCount: number;
  isLoadingList: boolean;
  byHashes: Image[];
  isLoadingByHashes: boolean;
  byAnyHashes: ItemsReferenceList<Image>[];
  isLoadingByAnyHashes: boolean;
  raw: Image[];
  isLoadingRaw: boolean;
  updateImages: (images: Image[]) => Promise<void>;
  deleteImagesByHashes: (hashes: string[]) => Promise<void>;
}

export const useImages = ({ list, hashes, anyHashes , raw }: UseImagesOptions): UseImages => {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    ...imagesListQueryOptions(),
    enabled: Boolean(list),
    placeholderData: keepPreviousData,
    retry: false,
  });

  const byHashesQuery = useQuery({
    ...imagesByHashesQueryOptions(hashes || []),
    enabled: Boolean(hashes?.length),
    placeholderData: keepPreviousData,
    retry: false,
  });

  const byAnyHashesQuery = useQuery({
    ...imagesByAnyHashesQueryOptions(anyHashes || []),
    enabled: Boolean(anyHashes?.length),
    placeholderData: keepPreviousData,
    retry: false,
  });

  const rawQuery = useQuery({
    ...imagesRawQueryOptions(
      raw ||
      { page: 0, pageSize: 1, sort: { field: 'created', direction: 'asc' } }, // dummy query
    ),
    enabled: Boolean(raw),
    placeholderData: keepPreviousData,
    retry: false,
  });

  const updateImages = useCallback(async (images: Image[]): Promise<void> => {
    const source = await getItemsSource();
    await source.updateImages(images);
    await queryClient.invalidateQueries({ queryKey: imagesKeys.all });
  }, [queryClient]);

  const deleteImagesByHashes = useCallback(async (deleteHashes: string[]): Promise<void> => {
    const source = await getItemsSource();
    await source.deleteImagesByHashes(deleteHashes);
    await queryClient.invalidateQueries({ queryKey: imagesKeys.all });
  }, [queryClient]);

  return {
    images: listQuery.data?.items ?? [],
    totalCount: listQuery.data?.paging?.total ?? 0,
    isLoadingList: listQuery.isLoading,

    byHashes: byHashesQuery.data?.items ?? [],
    isLoadingByHashes: byHashesQuery.isLoading,

    byAnyHashes: byAnyHashesQuery.data?.items ?? [],
    isLoadingByAnyHashes: byAnyHashesQuery.isLoading,

    raw: rawQuery.data?.items ?? [],
    isLoadingRaw: rawQuery.isLoading,

    updateImages,
    deleteImagesByHashes,
  };
};

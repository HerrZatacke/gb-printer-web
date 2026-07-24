import { useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useImageQueryParams } from '@/hooks/useImageQueryParams';
import { getItemsSource } from '@/items/client';
import {
  imagesAllTagsQueryOptions,
  imagesByAnyHashesQueryOptions,
  imagesByHashesQueryOptions,
  imagesKeys,
  imagesListQueryOptions,
  imagesRawQueryOptions,
  groupItemsByGroupIdQueryOptions,
  hashesByGroupIdQueryOptions,
} from '@/stores/queries/images';
import { type Image } from '@/types/Image';
import {
  type ImageQueryParams,
  type GroupItem,
  type ItemsReferenceList,
  type ItemsSourcePaging,
} from '@/workers/itemsIndexedDbWorker/types';

export interface UseImagesOptions {
  page?: number;
  list?: boolean;
  allTags?: boolean;
  groupId?: string;
  hashesGroupId?: string;
  hashes?: string[];
  anyHashes?: string[];
  raw?: ImageQueryParams;
  rawCandidateHashes?: Set<string>;
  keepPreviousData?: boolean;
}

export interface UseImages {
  images: Image[];
  paging: ItemsSourcePaging | null;
  isLoadingList: boolean;
  byGroupId: GroupItem[];
  byGroupPaging: ItemsSourcePaging | null;
  isLoadingByGroupId: boolean;
  hashesByGroupId: string[];
  hashesByGroupPaging: ItemsSourcePaging | null;
  isLoadingHashesByGroupId: boolean;
  allTags: string[];
  isLoadingAllTags: boolean;
  byHashes: Image[];
  isLoadingByHashes: boolean;
  byAnyHashes: ItemsReferenceList<Image>[];
  isLoadingByAnyHashes: boolean;
  raw: Image[];
  isLoadingRaw: boolean;
  updateImages: (images: Image[], purge?: boolean) => Promise<void>;
  deleteImagesByHashes: (hashes: string[]) => Promise<void>;
}

export const useImages = ({
  page,
  list,
  groupId,
  hashesGroupId,
  allTags,
  hashes,
  anyHashes,
  raw,
  rawCandidateHashes,
  keepPreviousData: shouldKeepPreviousData = true,
}: UseImagesOptions): UseImages => {
  const queryClient = useQueryClient();
  const imageQueryParams = useImageQueryParams(page);

  const placeholderData = shouldKeepPreviousData ? keepPreviousData : undefined;

  const listQuery = useQuery({
    ...imagesListQueryOptions(),
    enabled: Boolean(list),
    placeholderData,
    retry: false,
  });

  const byGroupIdQuery = useQuery({
    // ToDo: make `true` param configurable
    ...groupItemsByGroupIdQueryOptions(groupId || '', true, imageQueryParams),
    enabled: Boolean(typeof groupId === 'string'),
    placeholderData,
    retry: false,
  });

  const hashesByGroupIdQuery = useQuery({
    // ToDo: make `false` param configurable
    ...hashesByGroupIdQueryOptions(hashesGroupId || '', false, imageQueryParams.sort, imageQueryParams.filters),
    enabled: Boolean(typeof hashesGroupId === 'string'),
    placeholderData,
    retry: false,
  });

  const allTagsQuery = useQuery({
    ...imagesAllTagsQueryOptions(),
    enabled: Boolean(allTags),
    placeholderData,
    retry: false,
  });

  const byHashesQuery = useQuery({
    ...imagesByHashesQueryOptions(hashes || []),
    enabled: Boolean(hashes?.length),
    placeholderData,
    retry: false,
  });

  const byAnyHashesQuery = useQuery({
    ...imagesByAnyHashesQueryOptions(anyHashes || []),
    enabled: Boolean(anyHashes?.length),
    placeholderData,
    retry: false,
  });

  const rawQuery = useQuery({
    ...imagesRawQueryOptions(
      raw || imageQueryParams,
      rawCandidateHashes,
    ),
    enabled: Boolean(raw) || Boolean(rawCandidateHashes),
    placeholderData,
    retry: false,
  });

  const updateImages = useCallback(async (images: Image[], purge = false): Promise<void> => {
    const source = await getItemsSource();
    await source.updateImages(images, purge);
    await queryClient.invalidateQueries({ queryKey: imagesKeys.all });
  }, [queryClient]);

  const deleteImagesByHashes = useCallback(async (deleteHashes: string[]): Promise<void> => {
    const source = await getItemsSource();
    await source.deleteImagesByHashes(deleteHashes);
    await queryClient.invalidateQueries({ queryKey: imagesKeys.all });
  }, [queryClient]);

  return {
    images: listQuery.data?.items ?? [],
    paging: listQuery.data?.paging ?? null,
    isLoadingList: listQuery.isLoading,

    byGroupId: byGroupIdQuery.data?.items ?? [],
    byGroupPaging: byGroupIdQuery.data?.paging || null,
    isLoadingByGroupId: byGroupIdQuery.isLoading,

    hashesByGroupId: hashesByGroupIdQuery.data?.items ?? [],
    hashesByGroupPaging: hashesByGroupIdQuery.data?.paging || null,
    isLoadingHashesByGroupId: hashesByGroupIdQuery.isLoading,

    allTags: allTagsQuery.data?.items ?? [],
    isLoadingAllTags: allTagsQuery.isLoading,

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

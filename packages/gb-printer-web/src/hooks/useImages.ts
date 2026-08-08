import { useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query';
import {
  type Image,
  type ImageQueryParams,
  type GroupItem,
  type ItemsReferenceList,
  type ItemsSourcePaging,
} from 'gb-printer-schemas';
import { useCallback } from 'react';
import { useImageQueryParams } from '@/hooks/useImageQueryParams';
import {
  imagesAllTagsQueryOptions,
  imagesByAnyHashesQueryOptions,
  imagesByHashesQueryOptions,
  imagesListQueryOptions,
  imagesRawQueryOptions,
  groupItemsByGroupIdQueryOptions,
  hashesByGroupIdQueryOptions,
  updateImagesAction,
  deleteImagesByHashesAction,
} from '@/stores/items/queries/images';


export interface UseImagesOptions {
  page?: number;
  list?: boolean;
  allTags?: boolean;
  groupId?: string;
  groupIdIncludeGroups?: boolean;
  hashesGroupId?: string;
  hashesGroupIdIncludeGroups?: boolean;
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
  groupIdIncludeGroups,
  hashesGroupId,
  hashesGroupIdIncludeGroups,
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
    ...groupItemsByGroupIdQueryOptions(groupId || '', groupIdIncludeGroups ?? true, imageQueryParams),
    enabled: Boolean(typeof groupId === 'string'),
    placeholderData,
    retry: false,
  });

  const hashesByGroupIdQuery = useQuery({
    ...hashesByGroupIdQueryOptions(hashesGroupId || '', hashesGroupIdIncludeGroups ?? false, imageQueryParams.sort, imageQueryParams.filters),
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
    await updateImagesAction(queryClient, images, purge);
  }, [queryClient]);

  const deleteImagesByHashes = useCallback(async (deleteHashes: string[]): Promise<void> => {
    await deleteImagesByHashesAction(queryClient, deleteHashes);
  }, [queryClient]);

  return {
    images: listQuery.data?.items ?? [],
    paging: listQuery.data?.paging ?? null,
    isLoadingList: listQuery.isLoading,

    byGroupId: byGroupIdQuery.data?.items ?? [],
    byGroupPaging: byGroupIdQuery.data?.paging || null,
    isLoadingByGroupId: byGroupIdQuery.isLoading,

    hashesByGroupId: hashesByGroupIdQuery.data?.items ?? [],
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

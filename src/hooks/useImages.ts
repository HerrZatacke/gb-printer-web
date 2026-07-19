import { useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { getItemsSource } from '@/items/client';
import {
  imagesAllTagsQueryOptions,
  imagesByAnyHashesQueryOptions,
  imagesByHashesQueryOptions,
  imagesKeys,
  imagesListQueryOptions,
  imagesRawQueryOptions,
  groupItemsIdQueryOptions,
} from '@/stores/queries/images';
import { useFiltersStore, useSettingsStore } from '@/stores/stores';
import { type Image } from '@/types/Image';
import {
  type ImageQueryParams,
  type GroupItem,
  type ItemsReferenceList,
  type ImageSortField,
  type SortDirection,
  type ItemsSourcePaging,
} from '@/workers/itemsIndexedDbWorker/types';

export interface UseImagesOptions {
  page?: number;
  list?: boolean;
  allTags?: boolean;
  groupId?: string;
  hashes?: string[];
  anyHashes?: string[];
  raw?: ImageQueryParams;
  keepPreviousData?: boolean;
}

export interface UseImages {
  images: Image[];
  paging: ItemsSourcePaging | null;
  isLoadingList: boolean;
  byGroupId: GroupItem[];
  byGroupPaging: ItemsSourcePaging | null;
  isLoadingByGroupId: boolean;
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
  allTags,
  hashes,
  anyHashes,
  raw,
  keepPreviousData: shouldKeepPreviousData = true,
}: UseImagesOptions): UseImages => {
  const queryClient = useQueryClient();
  const { pageSize } = useSettingsStore();

  const placeholderData = shouldKeepPreviousData ? keepPreviousData : undefined;

  const {
    filtersTags,
    filtersPalettes,
    filtersFrames,
    sortBy,
  } = useFiltersStore();


  const imageQueryParams = useMemo<ImageQueryParams>(() => {
    const [sortField, direction] = sortBy.split('_');
    return {
      page: page || 0,
      pageSize,
      filters: {
        tags: filtersTags,
        palette: filtersPalettes,
        frame: filtersFrames,
      },
      sort: {
        field: sortField as ImageSortField,
        direction: direction as SortDirection,
      },
    };
  }, [filtersFrames, filtersPalettes, filtersTags, page, pageSize, sortBy]);

  const listQuery = useQuery({
    ...imagesListQueryOptions(),
    enabled: Boolean(list),
    placeholderData,
    retry: false,
  });

  const byGroupIdQuery = useQuery({
    ...groupItemsIdQueryOptions(groupId || '', imageQueryParams),
    enabled: Boolean(typeof groupId === 'string'),
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
      raw ||
      { page: 0, pageSize: 1, sort: { field: 'created', direction: 'asc' } }, // dummy query
    ),
    enabled: Boolean(raw),
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

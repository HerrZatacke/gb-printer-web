import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useGalleryTreeContext } from '@/contexts/GalleryTreeContext';
import { collectGroupsByFullSlug, collectGroupsById } from '@/contexts/GalleryTreeContext/reducePaths';
import { useImageQueryParams } from '@/hooks/useImageQueryParams';
import { imageGroupsFullTreeQueryOptions } from '@/stores/items/queries/imageGroups';
import { hashesByGroupIdQueryOptions } from '@/stores/items/queries/images';
import { useSettingsStore } from '@/stores/stores';
import { cleanFullSlug } from '@/tools/cleanSlug';
import { type TreeImageGroup } from '@/types/ImageGroup';
import { ROOT_ID } from '@/workers/itemsIndexedDbWorker/queries/helpers/createTreeRoot';

export interface UseNavigationTools {
  getGroupPath: (groupId: string, pageIndex: number) => Promise<string>;
  getImagePageIndexInGroup: (imageHash: string, parentGroup: TreeImageGroup) => Promise<number>;
  navigateToGroup: (groupId: string, pageIndex: number) => Promise<void>;
  navigateToImage: (hash: string) => Promise<void>;
}

export const useContextHook = (): UseNavigationTools => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { getUrl } = useGalleryTreeContext();
  const { pageSize } = useSettingsStore();
  const imageQueryParams = useImageQueryParams();

  const getImagePageIndexInGroup = useCallback(async (imageHash: string, parentGroup: TreeImageGroup): Promise<number> => {
    const { items: sortedImageHashes } = await queryClient.fetchQuery(hashesByGroupIdQueryOptions(parentGroup.id, true, imageQueryParams.sort, imageQueryParams.filters));
    const imageIndex = sortedImageHashes.findIndex((hash) => hash === imageHash);
    if (imageIndex === -1) {
      return 0;
    }
    return Math.floor(imageIndex / pageSize);
  }, [imageQueryParams.filters, imageQueryParams.sort, pageSize, queryClient]);


  const getGroupPath = useCallback(async (groupId: string, pageIndex: number): Promise<string> => {
    if (groupId === ROOT_ID) {
      return getUrl({ pageIndex, group: '' });
    }

    const { item: root } = await queryClient.fetchQuery({
      ...imageGroupsFullTreeQueryOptions(),
      staleTime: 0,
    });

    const groupsById = root ? collectGroupsById([root]): null;

    if (!groupsById) {
      return '';
    }

    const groupPath = groupsById.get(groupId)?.fullSlug;

    if (!groupPath) {
      return '';
    }

    return getUrl({ pageIndex, group: cleanFullSlug(groupPath) });
  }, [getUrl, queryClient]);

  const getPagedImagePath = useCallback(async (imageHash: string): Promise<string> => {
    const { item: root } = await queryClient.fetchQuery(imageGroupsFullTreeQueryOptions());
    const freshPaths = collectGroupsByFullSlug([root]);

    const group = [...freshPaths.values()].find(({ images }) => images.includes(imageHash));

    if (!group) {
      return '';
    }

    const viewSlug = group.fullSlug;
    const pageIndex = group ? await getImagePageIndexInGroup(imageHash, group) : 0;

    return getUrl({ pageIndex, group: cleanFullSlug(viewSlug) });
  }, [getImagePageIndexInGroup, getUrl, queryClient]);

  const navigateToGroup = useCallback(async (groupId: string, pageIndex: number) => {
    const groupPath = await getGroupPath(groupId, pageIndex);
    console.log({ groupId, groupPath });
    if (groupPath) {
      router.push(groupPath);
    }
  }, [getGroupPath, router]);

  const navigateToImage = useCallback(async (hash: string) => {
    const pagedImagePath = await getPagedImagePath(hash);
    if (pagedImagePath) {
      router.push(pagedImagePath);
    }
  }, [getPagedImagePath, router]);

  return {
    getGroupPath,
    getImagePageIndexInGroup,
    navigateToGroup,
    navigateToImage,
  };
};

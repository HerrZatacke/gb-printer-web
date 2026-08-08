import { useQueryClient } from '@tanstack/react-query';
import { type TreeImageGroup } from 'gb-printer-schemas';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useGalleryTreeContext } from '@/contexts/GalleryTreeContext';
import { collectGroupsByFullSlug, collectGroupsById } from '@/contexts/GalleryTreeContext/reducePaths';
import { useImageQueryParams } from '@/hooks/useImageQueryParams';
import { useUrl } from '@/hooks/useUrl';
import { imageGroupsFullTreeQueryOptions } from '@/stores/items/queries/imageGroups';
import { hashesByGroupIdQueryOptions } from '@/stores/items/queries/images';
import { useSettingsStore } from '@/stores/stores';
import { cleanFullSlug } from '@/tools/cleanSlug';
import { delay } from '@/tools/delay';
import { ROOT_ID } from '@/workers/itemsIndexedDbWorker/queries/helpers/createTreeRoot';

export interface UseNavigationTools {
  isNavigating: boolean;
  getGroupPath: (groupId: string, pageIndex: number) => Promise<string>;
  getItemPageIndexInGroup: (imageHash: string, parentGroup: TreeImageGroup) => Promise<number>;
  navigateToGroup: (groupId: string, pageIndex: number, replaceHistory: boolean) => Promise<void>;
  navigateToImage: (hash: string, replaceHistory: boolean) => Promise<void>;
}

export const useContextHook = (): UseNavigationTools => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { getUrl } = useGalleryTreeContext();
  const { searchParams } = useUrl();
  const { pageSize } = useSettingsStore();
  const imageQueryParams = useImageQueryParams();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    delay(1)
      .then(() => {
        setIsNavigating(false);
      });
  }, [searchParams]);

  const getItemPageIndexInGroup = useCallback(async (imageHash: string, parentGroup: TreeImageGroup): Promise<number> => {
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
    const pageIndex = await getItemPageIndexInGroup(imageHash, group);

    return getUrl({ pageIndex, group: cleanFullSlug(viewSlug) });
  }, [getItemPageIndexInGroup, getUrl, queryClient]);

  const navigateToGroup = useCallback(async (groupId: string, pageIndex: number, replaceHistory: boolean) => {
    setIsNavigating(true);
    const groupPath = await getGroupPath(groupId, pageIndex);
    console.log(`Navigating to group "${groupPath}", replaceHistory:${replaceHistory}`);
    if (groupPath) {
      if (replaceHistory) {
        router.replace(groupPath);
      } else {
        router.push(groupPath);
      }
    } else {
      setIsNavigating(false);
    }
  }, [getGroupPath, router]);

  const navigateToImage = useCallback(async (hash: string, replaceHistory: boolean) => {
    setIsNavigating(true);
    const pagedImagePath = await getPagedImagePath(hash);
    if (pagedImagePath) {
      console.log(`Navigating to image "${pagedImagePath}", replaceHistory:${replaceHistory}`);
      if (replaceHistory) {
        router.replace(pagedImagePath);
      } else {
        router.push(pagedImagePath);
      }
    } else {
      setIsNavigating(false);
    }
  }, [getPagedImagePath, router]);

  return {
    isNavigating,
    getGroupPath,
    getItemPageIndexInGroup,
    navigateToGroup,
    navigateToImage,
  };
};

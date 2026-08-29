import { useQueryClient } from '@tanstack/react-query';
import { EndpointUrls } from 'gb-items-db/src/endpointUrls';
import  {
  type UpdateBinaryItemsParams,
  type UpdateFrameGroupsParams,
  type UpdateFramesParams,
  type UpdateImageGroupsParams,
  type UpdateImagesParams,
  type UpdatePalettesParams,
  type UpdatePluginsParams,
} from 'gb-printer-schemas';
import { $fetch } from 'ofetch';
import { useCallback, useState } from 'react';
import { cleanDoubleSlashes } from 'ufo';
import { binaryFrameHashesQueryOptions, binaryFramesByHashesQueryOptions } from '@/stores/items/queries/binaryFrames';
import { binaryImageHashesQueryOptions, binaryImagesByHashesQueryOptions } from '@/stores/items/queries/binaryImages';
import { frameGroupsListQueryOptions } from '@/stores/items/queries/frameGroups';
import { framesListQueryOptions } from '@/stores/items/queries/frames';
import { imageGroupsListQueryOptions } from '@/stores/items/queries/imageGroups';
import { imagesListQueryOptions } from '@/stores/items/queries/images';
import { palettesListQueryOptions } from '@/stores/items/queries/palettes';
import { pluginsListQueryOptions } from '@/stores/items/queries/plugins';


interface UseCopyToRemote {
  copyToRemote: (remoteStorageUrl: string, purge: boolean) => Promise<void>;
  progress: number;
}

interface CopyChunkOptions<T> {
  remoteStorageUrl: string;
  baseProgress: number;
  endpoint: EndpointUrls;
  getItems: () => Promise<T[]>;
  getBody: (items: T[], purge: boolean) => Record<string, unknown>;
  purge: boolean;
}

export const useCopyToRemote = (): UseCopyToRemote => {
  const [progress, setProgress] = useState<number>(0);
  const queryClient = useQueryClient();

  const copyChunks = useCallback(async <T>({
    remoteStorageUrl,
    baseProgress,
    purge,
    endpoint,
    getItems,
    getBody,
  }: CopyChunkOptions<T>) => {
    const chunkSize = 1000;
    const items = await getItems();
    for (let i = 0; i < items.length; i += chunkSize) {
      const chunk = items.slice(i, i + chunkSize);
      setProgress(baseProgress + ((i / chunkSize) / Math.ceil(items.length / chunkSize)));

      await $fetch(cleanDoubleSlashes(`${remoteStorageUrl}${endpoint}`), {
        method: 'post',
        body: getBody(chunk, i === 0 && purge), // only send purge option with first chunk
      });
    }
  }, []);


  const copyToRemote = useCallback(async (remoteStorageUrl: string, purge: boolean) => {
    if (!remoteStorageUrl) {
      return;
    }

    await copyChunks({
      remoteStorageUrl,
      baseProgress: 0,
      purge,
      endpoint: EndpointUrls.POST_IMAGES_UPDATE,
      getItems: async () => (
        (await queryClient.fetchQuery(imagesListQueryOptions())).items
      ),
      getBody: (images, shouldPurge: boolean): UpdateImagesParams => ({
        images,
        purge: shouldPurge,
      }),
    });

    await copyChunks({
      remoteStorageUrl,
      baseProgress: 1,
      purge,
      endpoint: EndpointUrls.POST_IMAGEGROUPS_UPDATE,
      getItems: async () => (
        (await queryClient.fetchQuery(imageGroupsListQueryOptions())).items
      ),
      getBody: (imageGroups, shouldPurge: boolean): UpdateImageGroupsParams => ({
        imageGroups,
        purge: shouldPurge,
      }),
    });

    await copyChunks({
      remoteStorageUrl,
      baseProgress: 2,
      purge,
      endpoint: EndpointUrls.POST_FRAMES_UPDATE,
      getItems: async () => (
        (await queryClient.fetchQuery(framesListQueryOptions())).items
      ),
      getBody: (frames, shouldPurge: boolean): UpdateFramesParams => ({
        frames,
        purge: shouldPurge,
      }),
    });

    await copyChunks({
      remoteStorageUrl,
      baseProgress: 3,
      purge,
      endpoint: EndpointUrls.POST_FRAMEGROUPS_UPDATE,
      getItems: async () => (
        (await queryClient.fetchQuery(frameGroupsListQueryOptions())).items
      ),
      getBody: (frameGroups, shouldPurge: boolean): UpdateFrameGroupsParams => ({
        frameGroups,
        purge: shouldPurge,
      }),
    });

    await copyChunks({
      remoteStorageUrl,
      baseProgress: 4,
      purge,
      endpoint: EndpointUrls.POST_PLUGINS_UPDATE,
      getItems: async () => (
        (await queryClient.fetchQuery(pluginsListQueryOptions())).items
      ),
      getBody: (plugins, shouldPurge: boolean): UpdatePluginsParams => ({
        plugins,
        purge: shouldPurge,
      }),
    });

    await copyChunks({
      remoteStorageUrl,
      baseProgress: 5,
      purge,
      endpoint: EndpointUrls.POST_PALETTES_UPDATE,
      getItems: async () => (
        (await queryClient.fetchQuery(palettesListQueryOptions())).items
      ),
      getBody: (palettes, shouldPurge: boolean): UpdatePalettesParams => ({
        palettes,
        purge: shouldPurge,
      }),
    });

    await copyChunks({
      remoteStorageUrl,
      baseProgress: 6,
      purge,
      endpoint: EndpointUrls.POST_BINARYFRAMES_UPDATE,
      getItems: async () => {
        const { items: frameHashes } = await queryClient.fetchQuery(binaryFrameHashesQueryOptions());
        const { items } = await queryClient.fetchQuery(binaryFramesByHashesQueryOptions(frameHashes));
        return items;
      },
      getBody: (items): UpdateBinaryItemsParams => ({
        items,
      }),
    });

    await copyChunks({
      remoteStorageUrl,
      baseProgress: 7,
      purge,
      endpoint: EndpointUrls.POST_BINARYIMAGES_UPDATE,
      getItems: async () => {
        const { items: frameHashes } = await queryClient.fetchQuery(binaryImageHashesQueryOptions());
        const { items } = await queryClient.fetchQuery(binaryImagesByHashesQueryOptions(frameHashes));
        return items;
      },
      getBody: (items): UpdateBinaryItemsParams => ({
        items,
      }),
    });

  }, [copyChunks, queryClient]);

  return {
    copyToRemote,
    progress: progress / 8,
  };
};

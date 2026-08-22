import {
  Alert,
  Button,
  ButtonGroup,
  Paper,
  Stack,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { EndpointUrls } from 'gb-items-db/src/endpointUrls';
import {
  type UpdateImagesParams,
  type UpdateImageGroupsParams,
  type UpdateFramesParams,
  type UpdateFrameGroupsParams,
  type UpdatePalettesParams,
  type UpdatePluginsParams,
  type UpdateBinaryItemsParams,
} from 'gb-printer-schemas';
import { $fetch } from 'ofetch';
import { useCallback, useEffect, useState } from 'react';
import { useNavigationTools } from '@/contexts/NavigationToolsContext';
// import { useImages } from '@/hooks/useImages';
import { useImageGroups } from '@/hooks/useImageGroups';
import { binaryFrameHashesQueryOptions, binaryFramesByHashesQueryOptions } from '@/stores/items/queries/binaryFrames';
import { binaryImageHashesQueryOptions, binaryImagesByHashesQueryOptions } from '@/stores/items/queries/binaryImages';
import { resetImageCaches } from '@/stores/items/queries/cacheResets';
import { frameGroupsListQueryOptions } from '@/stores/items/queries/frameGroups';
import { framesListQueryOptions } from '@/stores/items/queries/frames';
import { runMaintenanceAction } from '@/stores/items/queries/global';
import { imageGroupsListQueryOptions } from '@/stores/items/queries/imageGroups';
import { imagesListQueryOptions } from '@/stores/items/queries/images';
import { palettesListQueryOptions } from '@/stores/items/queries/palettes';
import { pluginsListQueryOptions } from '@/stores/items/queries/plugins';
import { useSettingsStore } from '@/stores/stores';
import { delay } from '@/tools/delay';
import { randomId } from '@/tools/randomId';

const apiHost = 'http://localhost:3001';

function Index() {
  const [shouldRender, setShouldRender] = useState(false);
  const { enableDebug } = useSettingsStore();
  const { updateImageGroup } = useImageGroups({ tree: true, list: true });
  // const { updateImageGroup, imageGroupTree, imageGroups } = useImageGroups({ tree: true, list: true });
  const { navigateToImage, navigateToGroup } = useNavigationTools();
  const queryClient = useQueryClient();

  // useEffect(() => {
  //   console.log({ imageGroupTree });
  // }, [imageGroupTree]);
  //
  // useEffect(() => {
  //   console.log({ imageGroups });
  // }, [imageGroups]);


  useEffect(() => {
    if (window.location.hostname === 'localhost') {
      delay(1).then(() => {
        setShouldRender(enableDebug);
      });
    }
  }, [enableDebug]);

  const runMaintenance = useCallback(async () => {
    await runMaintenanceAction();
  }, []);

  const clearCaches = useCallback(async () => {
    await resetImageCaches(queryClient, true);
  }, [queryClient]);


  const createSubGroup = useCallback(async () => {
    console.log('calling updateImageGroup');
    const id = randomId();
    await updateImageGroup(
      {
        id,
        slug: 'new_group',
        title: 'New Group',
        isFavourite: false,
        created: '2026-07-27 20:56:12:175',
        coverImage: 'a8448313542d45c76368054197e44e8074d5d66e',
        images: [
          '58c724d7d652486bb96cd2cffb0595dafe7b0e66',
          '244bae16355c866aaa9bb8e707d2125f123a00b6',
          '244e3126864607093dc4a063e65700c3ec57b762',
          'a8448313542d45c76368054197e44e8074d5d66e',
        ],
        groups: [],
        tags: [],
      },
      '111c3c9d-c464-4f17-b2aa-3e53878e11c5',
    );
    await navigateToGroup(id, 0, false);
    console.log('updateImageGroup done');
  }, [updateImageGroup, navigateToGroup]);

  const copyToLocalhost = useCallback(async () => {
    const start = performance.now();

    const { items: images } = await queryClient.fetchQuery(imagesListQueryOptions());
    const updateImagesParams: UpdateImagesParams = {
      images,
      purge: true,
    };
    console.log('/images/update', JSON.stringify(updateImagesParams).length);
    const resImages = await $fetch(`${apiHost}${EndpointUrls.POST_IMAGES_UPDATE}`, {
      method: 'post',
      body: updateImagesParams,
    });

    const { items: imageGroups } = await queryClient.fetchQuery(imageGroupsListQueryOptions());
    const updateImageGroupsParams: UpdateImageGroupsParams = {
      imageGroups,
      purge: true,
    };
    console.log('/imageGroups/update', JSON.stringify(updateImageGroupsParams).length);
    const resImageGroups = await $fetch(`${apiHost}${EndpointUrls.POST_IMAGEGROUPS_UPDATE}`, {
      method: 'post',
      body: updateImageGroupsParams,
    });

    const { items: frames } = await queryClient.fetchQuery(framesListQueryOptions());
    const updateFramesParams: UpdateFramesParams = {
      frames,
      purge: true,
    };
    console.log('/frames/update', JSON.stringify(updateFramesParams).length);
    const resFrames = await $fetch(`${apiHost}${EndpointUrls.POST_FRAMES_UPDATE}`, {
      method: 'post',
      body: updateFramesParams,
    });

    const { items: frameGroups } = await queryClient.fetchQuery(frameGroupsListQueryOptions());
    const updateFrameGroupsParams: UpdateFrameGroupsParams = {
      frameGroups,
      purge: true,
    };
    console.log('/frameGroups/update', JSON.stringify(updateFrameGroupsParams).length);
    const resFrameGroups = await $fetch(`${apiHost}${EndpointUrls.POST_FRAMEGROUPS_UPDATE}`, {
      method: 'post',
      body: updateFrameGroupsParams,
    });

    const { items: plugins } = await queryClient.fetchQuery(pluginsListQueryOptions());
    const updatePluginsParams: UpdatePluginsParams = {
      plugins,
      purge: true,
    };
    console.log('/plugins/update', JSON.stringify(updatePluginsParams).length);
    const resPlugins = await $fetch(`${apiHost}${EndpointUrls.POST_PLUGINS_UPDATE}`, {
      method: 'post',
      body: updatePluginsParams,
    });

    const { items: palettes } = await queryClient.fetchQuery(palettesListQueryOptions());
    const updatePalettesParams: UpdatePalettesParams = {
      palettes,
      purge: true,
    };
    console.log('/palettes/update', JSON.stringify(updatePalettesParams).length);
    const resPalettes = await $fetch(`${apiHost}${EndpointUrls.POST_PALETTES_UPDATE}`, {
      method: 'post',
      body: updatePalettesParams,
    });

    const chunkSize = 1000;

    const { items: frameHashes } = await queryClient.fetchQuery(binaryFrameHashesQueryOptions());
    const { items: binaryFrames } = await queryClient.fetchQuery(binaryFramesByHashesQueryOptions(frameHashes));
    const resBinaryFrames: string[] = [];
    for (let i = 0; i < binaryFrames.length; i += chunkSize) {
      const chunk = binaryFrames.slice(i, i + chunkSize);
      const updateBinaryFramesParams: UpdateBinaryItemsParams = {
        items: chunk,
      };
      console.log('/binaryFrames/update', JSON.stringify(updateBinaryFramesParams).length);
      resBinaryFrames.push(
        await $fetch(`${apiHost}${EndpointUrls.POST_BINARYFRAMES_UPDATE}`, {
          method: 'post',
          body: updateBinaryFramesParams,
        }),
      );
    }

    const { items: imageHashes } = await queryClient.fetchQuery(binaryImageHashesQueryOptions());
    const { items: binaryImages } = await queryClient.fetchQuery(binaryImagesByHashesQueryOptions(imageHashes));
    const resBinaryImages: string[] = [];
    for (let i = 0; i < binaryImages.length; i += chunkSize) {
      const chunk = binaryImages.slice(i, i + chunkSize);
      const updateBinaryImagesParams: UpdateBinaryItemsParams = {
        items: chunk,
      };
      console.log('/binaryImages/update', JSON.stringify(updateBinaryImagesParams).length);
      resBinaryImages.push(
        await $fetch(`${apiHost}${EndpointUrls.POST_BINARYIMAGES_UPDATE}`, {
          method: 'post',
          body: updateBinaryImagesParams,
        }),
      );
    }

    console.log({
      resImages,
      resImageGroups,
      resFrames,
      resFrameGroups,
      resPalettes,
      resPlugins,
      resBinaryFrames,
      resBinaryImages,
      msg: `updated in ${Math.round(performance.now() - start)}ms`,
    });
  }, [queryClient]);

  // const { images: allImages } = useImages({ list: true }); // All images
  // const { raw: rawImages1 } = useImages({ raw: { filters: { tags: ['testing'] }, sort: { field: 'created', direction: 'asc' }, page: 0, pageSize: 200 } });
  // const { byGroupId: rawImages2 } = useImages({ groupId: 'ROOT' });

  // const { byAnyHashes: blueChannel } = useImages({ anyHashes: ['8ce194178ea421d56f06215c582dbec844566954'] }); // RGB-Bulli b-channel hash
  // const { byAnyHashes: neutralChannel } = useImages({ anyHashes: ['5e20e1ee863a83e9d5a9c762391e58095e7b165e'] }); // RGB-Bulli n-channel hash

  // const { byGroupId: rootGroupItems } = useImages({ groupId: '' });
  // const { byGroupId: randomRgbGroupItems } = useImages({ groupId: '34ee68d9-16e4-46b8-a745-2a510950d858' });

  if (!shouldRender) {
    return null;
  }

  return (
    <Paper sx={(theme) => ({ padding: theme.spacing(2) })}>
      <Stack
        direction="column"
        sx={{
          gap: 2,
        }}
      >
        <Alert severity="warning" variant="filled">
          Debug Stuff
        </Alert>
        {/* <pre style={{ maxHeight: '30vh' }}>{allImages.length || 'no images'}</pre> */}
        {/* <pre style={{ maxHeight: '30vh' }}>{rawImages1.length || 'no images'}</pre> */}
        {/* <pre style={{ maxHeight: '30vh' }}>{rawImages2.length || 'no images'}</pre> */}
        {/* <pre style={{ maxHeight: '30vh' }}>{JSON.stringify(rootGroupItems, null, 2)}</pre> */}
        <ButtonGroup size="small" variant="contained" fullWidth color="secondary">
          <Button onClick={async () => {
            await navigateToGroup('BadId', 0, false);
          }}>
            Bad Id/pageIndex 0
          </Button>
          <Button onClick={async () => {
            await navigateToGroup('ROOT', 0, false);
          }}>
            ROOT/pageIndex 0
          </Button>
          <Button onClick={async () => {
            await navigateToGroup('ROOT', 2, false);
          }}>
            ROOT/pageIndex 2
          </Button>
          <Button onClick={async () => {
            await navigateToGroup('54e8e70e-68ea-400a-ae9d-0cee8e41f965', 0, false);
          }}>
            Drinks / pageIndex 0
          </Button>
          <Button onClick={async () => {
            await navigateToGroup('54e8e70e-68ea-400a-ae9d-0cee8e41f965', 2, false);
          }}>
            Drinks / pageIndex 2
          </Button>
        </ButtonGroup>
        <ButtonGroup size="small" variant="contained" fullWidth color="secondary">
          <Button onClick={async () => {
            await navigateToImage('BadHash', false);
          }}>
            To Image: Bad Hash
          </Button>
          <Button onClick={async () => {
            await navigateToImage('75844f32d28fc7a47ce096b28aaf9114f7fa5582', false);
          }}>
            To Image: *Drinks 2* (Drinks / pageIndex:0)
          </Button>
          <Button onClick={async () => {
            await navigateToImage('4d8c1dd7609c864834c24341990156da8c91a56a', false);
          }}>
            To Image: *Drinks 23* (Drinks / pageIndex:1)
          </Button>
          <Button onClick={async () => {
            await navigateToImage('c89f0f97516aa784c0ccec1d0c9c1cf782b2fba5', false);
          }}>
            To Image: *Isar* (munich/isar / pageIndex:1)
          </Button>
        </ButtonGroup>
        <ButtonGroup size="small" variant="contained" fullWidth color="secondary">
          <Button onClick={createSubGroup}>
            create group with 4 existing images from `Lego Bulli`
          </Button>
        </ButtonGroup>
        <ButtonGroup size="small" variant="contained" fullWidth color="secondary">
          <Button onClick={runMaintenance}>
            runMaintenance
          </Button>
          <Button onClick={clearCaches}>
            clearCaches
          </Button>
          <Button onClick={copyToLocalhost}>
            Copy current items to localhost
          </Button>
        </ButtonGroup>
        {/* <pre style={{ maxHeight: '30vh' }}>{JSON.stringify(randomRgbGroupItems, null, 2)}</pre> */}
        <Stack direction="row">
        </Stack>
      </Stack>
    </Paper>
  );
}

export default Index;

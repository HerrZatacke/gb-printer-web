import {
  Alert,
  Button,
  ButtonGroup,
  Paper,
  Stack,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { useNavigationTools } from '@/contexts/NavigationToolsContext';
// import { useImages } from '@/hooks/useImages';
import { useImageGroups } from '@/hooks/useImageGroups';
import { getItemsSource } from '@/stores/items/client';
import { resetImageCaches } from '@/stores/items/queries/cacheResets';
import { runMaintenanceAction } from '@/stores/items/queries/global';
import { useSettingsStore } from '@/stores/stores';
import { delay } from '@/tools/delay';
import { randomId } from '@/tools/randomId';

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

  const debugReset = useCallback(async () => {
    const source = await getItemsSource();
    await source.debugReset();
    window.location.reload();
  }, []);

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
          <Button onClick={debugReset}>
            debugReset
          </Button>
          <Button onClick={runMaintenance}>
            runMaintenance
          </Button>
          <Button onClick={clearCaches}>
            clearCaches
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

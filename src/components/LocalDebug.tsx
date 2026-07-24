import { Alert, Paper, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigationTools } from '@/contexts/NavigationToolsContext';
import { useImages } from '@/hooks/useImages';
import { delay } from '@/tools/delay';

function LocalDebug() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (window.location.hostname === 'localhost') {
      delay(1).then(() => {
        setShouldRender(true);
      });
    }
  }, []);

  const { images: allImages } = useImages({ list: true }); // All images
  const { raw: rawImages1 } = useImages({ raw: { filters: { tags: ['testing'] }, sort: { field: 'created', direction: 'asc' }, page: 0, pageSize: 200 } });
  // ToDo: See edge-case in resolveGroupItemsByGroupId
  const { raw: rawImages2 } = useImages({ raw: { filters: { tags: ['testing', '__filter:favourite__'] }, sort: { field: 'created', direction: 'asc' }, page: 0, pageSize: 200 } });

  // const { byAnyHashes: blueChannel } = useImages({ anyHashes: ['8ce194178ea421d56f06215c582dbec844566954'] }); // RGB-Bulli b-channel hash
  // const { byAnyHashes: neutralChannel } = useImages({ anyHashes: ['5e20e1ee863a83e9d5a9c762391e58095e7b165e'] }); // RGB-Bulli n-channel hash

  // const { byGroupId: rootGroupItems } = useImages({ groupId: '' });
  // const { byGroupId: randomRgbGroupItems } = useImages({ groupId: '34ee68d9-16e4-46b8-a745-2a510950d858' });

  const { navigateToImage, navigateToGroup } = useNavigationTools();

  if (!shouldRender) {
    return null;
  }

  return (
    <Paper sx={(theme) => ({ padding: theme.spacing(2) })}>
      <Stack
        direction="column"
        gap={2}
      >
        <Alert severity="warning" variant="filled">
          Debug Stuff
        </Alert>
        <pre style={{ maxHeight: '30vh' }}>{allImages.length || 'no images'}</pre>
        <pre style={{ maxHeight: '30vh' }}>{rawImages1.length || 'no images'}</pre>
        <pre style={{ maxHeight: '30vh' }}>{rawImages2.length || 'no images'}</pre>
        {/* <pre style={{ maxHeight: '30vh' }}>{JSON.stringify(rootGroupItems, null, 2)}</pre> */}
        {/* <pre style={{ maxHeight: '30vh' }}>{JSON.stringify(randomRgbGroupItems, null, 2)}</pre> */}
        <Stack direction="row">
          <button onClick={async () => {
            await navigateToGroup('BadId', 0);
          }}>
            Bad Id/pageIndex 0
          </button>
          <button onClick={async () => {
            await navigateToGroup('ROOT', 0);
          }}>
            ROOT/pageIndex 0
          </button>
          <button onClick={async () => {
            await navigateToGroup('ROOT', 2);
          }}>
            ROOT/pageIndex 2
          </button>
          <button onClick={async () => {
            await navigateToGroup('54e8e70e-68ea-400a-ae9d-0cee8e41f965', 0);
          }}>
            Drinks / pageIndex 0
          </button>
          <button onClick={async () => {
            await navigateToGroup('54e8e70e-68ea-400a-ae9d-0cee8e41f965', 2);
          }}>
            Drinks / pageIndex 2
          </button>
          <hr />
          <button onClick={async () => {
            await navigateToImage('BadHash');
          }}>
            To Image: Bad Hash
          </button>
          <button onClick={async () => {
            await navigateToImage('75844f32d28fc7a47ce096b28aaf9114f7fa5582');
          }}>
            To Image: *Drinks 2* (Drinks / pageIndex:0)
          </button>
          <button onClick={async () => {
            await navigateToImage('4d8c1dd7609c864834c24341990156da8c91a56a');
          }}>
            To Image: *Drinks 23* (Drinks / pageIndex:1)
          </button>
          <button onClick={async () => {
            await navigateToImage('c89f0f97516aa784c0ccec1d0c9c1cf782b2fba5');
          }}>
            To Image: *Isar* (munich/isar / pageIndex:1)
          </button>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default LocalDebug;

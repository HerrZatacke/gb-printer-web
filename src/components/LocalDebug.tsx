import { Alert, Paper, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigationTools } from '@/contexts/NavigationToolsContext';
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
        gap={2}
      >
        <Alert severity="warning" variant="filled">
          Debug Stuff
        </Alert>
        {/* <pre style={{ maxHeight: '30vh' }}> */}
        {/*   {JSON.stringify(rootGroupItems, null, 2)} */}
        {/* </pre> */}
        {/* <pre style={{ maxHeight: '30vh' }}> */}
        {/*   {JSON.stringify(randomRgbGroupItems, null, 2)} */}
        {/* </pre> */}
      </Stack>
    </Paper>
  );
}

export default LocalDebug;

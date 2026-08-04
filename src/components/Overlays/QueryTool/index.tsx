import {
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { filesize } from 'filesize';
import React, { useCallback, useState } from 'react';
import Lightbox from '@/components/Lightbox';
import { itemsSourceMethodNames } from '@/components/Overlays/QueryTool/methods';
import { getItemsSource } from '@/stores/items/client';
import { useInteractionsStore } from '@/stores/stores';
import { ItemsSource } from '@/workers/itemsIndexedDbWorker/types';

function QueryTool() {
  const { setShowQueryTool } = useInteractionsStore();

  const [endpoint, setEndpoint] = useState<(keyof ItemsSource) | ''>('');
  const [result, setResult] = useState<string>('');

  const execute = useCallback(async () => {
    const source = await getItemsSource();
    const fn = endpoint ? source[endpoint] : () => {};

    if (typeof fn !== 'function') {
      setResult(`${endpoint} is not a valid endpoint`);
    }

    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const res = await fn();
      setResult(JSON.stringify(res, null , 2));
    } catch (error) {
      setResult((error as Error).message);
    }
  }, [endpoint]);

  return (
    <Lightbox
      header="QueryTool"
      deny={() => setShowQueryTool(false)}
    >
      <Stack
        direction="column"
        gap={2}
      >
        <TextField
          select
          size="small"
          value={endpoint || ''}
          label="Endpoint"
          onChange={(ev) => {
            setResult('');
            setEndpoint(ev.target.value as keyof ItemsSource);
          }}
        >
          <MenuItem value="">Select Endpoint</MenuItem>
          {
            itemsSourceMethodNames.map((ep) => (
              <MenuItem
                value={ep}
                key={ep}
              >
                {ep}
              </MenuItem>
            ))
          }
        </TextField>

        <Button
          variant="contained"
          onClick={execute}
        >
          Run!
        </Button>

        <pre style={{ height: '30vh' }}>{result || 'no response'}</pre>
        <Typography variant="caption">{ result?.length ? filesize(result.length) : '-' }</Typography>

      </Stack>
    </Lightbox>
  );
}

export default QueryTool;

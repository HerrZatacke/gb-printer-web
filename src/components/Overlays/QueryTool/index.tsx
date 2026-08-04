import {
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { filesize } from 'filesize';
import React, { useCallback, useEffect, useState } from 'react';
import Lightbox from '@/components/Lightbox';
import { exampleBodies, itemsSourceMethodNames, MethodName } from '@/components/Overlays/QueryTool/methods';
import { getItemsSource } from '@/stores/items/client';
import { useInteractionsStore } from '@/stores/stores';

function QueryTool() {
  const { setShowQueryTool } = useInteractionsStore();

  const [endpoint, setEndpoint] = useState<MethodName | ''>('');
  const [requestBody, setRequestBody] = useState<string>('{}');
  const [requestError, setRequestError] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [resultIsError, setResultIsError] = useState<boolean>(false);

  const updateBody = useCallback((newBody: string) => {
    if (!newBody) {
      setRequestBody('');
      setRequestError('');
      return;
    }

    try {
      setRequestBody(JSON.stringify(JSON.parse(newBody), null, 2));
      setRequestError('');
    } catch (error) {
      setRequestBody(newBody);
      setRequestError((error as Error).message);
    }
  }, []);

  const execute = useCallback(async () => {
    const source = await getItemsSource();
    const fn = endpoint ? source[endpoint] : () => {};

    if (typeof fn !== 'function') {
      setResult(`${endpoint} is not a valid endpoint`);
    }

    let body: object;

    try {
      body = JSON.parse(requestBody);
      setRequestError('');
    } catch (error) {
      setRequestError((error as Error).message);
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const res = await fn(body);
      setResult(JSON.stringify(res, null , 2));
      setResultIsError(false);
    } catch (error) {
      setResult((error as Error).message);
      setResultIsError(true);
    }
  }, [endpoint, requestBody]);

  useEffect(() => {
    if (endpoint) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      updateBody(exampleBodies[endpoint]);
    }
  }, [endpoint, updateBody]);

  return (
    <Lightbox
      header="QueryTool"
      deny={() => setShowQueryTool(false)}
      contentWidth={1024}
    >
      <Stack
        direction="column"
        gap={4}
      >
        <TextField
          select
          size="small"
          value={endpoint || ''}
          label="Endpoint"
          onChange={(ev) => {
            setResult('');
            setEndpoint(ev.target.value as MethodName | '');
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

        <TextField
          label="Request Body"
          value={requestBody}
          error={Boolean(requestError)}
          helperText={requestError || null}
          multiline
          rows={20}
          onChange={(ev) => setRequestBody(ev.target.value)}
          onBlur={() => setRequestBody((current) => {
            try {
              setRequestError('');
              return JSON.stringify(JSON.parse(current), null, 2);
            } catch (error) {
              setRequestError((error as Error).message);
              return current;
            }
          })}
        />

        <Button
          variant="contained"
          onClick={execute}
          disabled={!Boolean(endpoint)}
        >
          Run!
        </Button>

        <pre style={{
          height: '30vh',
          color: resultIsError ? 'red' : 'inherit',
        }}>
          {result || 'no response'}
        </pre>
        <Typography variant="caption">{ result?.length ? filesize(result.length) : '-' }</Typography>

      </Stack>
    </Lightbox>
  );
}

export default QueryTool;

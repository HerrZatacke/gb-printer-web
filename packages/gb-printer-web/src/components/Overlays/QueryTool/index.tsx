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
import {
  type EndpointSettings,
  endpointSettings,
  itemsSourceMethodNames,
  type MethodName,
} from '@/components/Overlays/QueryTool/methods';
import { getItemsSource } from '@/stores/items/client';
import { useInteractionsStore } from '@/stores/stores';

function QueryTool() {
  const { setShowQueryTool } = useInteractionsStore();

  const [endpoint, setEndpoint] = useState<MethodName | ''>('');
  const [currentSettings, setCurrentSettings] = useState<EndpointSettings | null>(null);
  const [requestBody, setRequestBody] = useState<string>('{}');
  const [requestDuration, setRequestDuration] = useState<number>(0);
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
      setRequestBody(JSON.stringify(newBody ? JSON.parse(newBody) : undefined, null, 2));
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

    let body: unknown;

    try {
      body = currentSettings?.schema.parse(requestBody ? JSON.parse(requestBody) : undefined) || undefined;
      setRequestError('');
    } catch (error) {
      setRequestError((error as Error).message);
      return;
    }

    const start = performance.now();

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

    setRequestDuration(performance.now() - start);
  }, [endpoint, requestBody, currentSettings]);

  useEffect(() => {
    if (endpoint) {
      const newSettings = endpointSettings[endpoint];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      updateBody(newSettings.exampleBody);
      setResult('');
      setRequestDuration(0);
      setCurrentSettings(newSettings);
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
        sx={{
          gap: 4,
        }}
      >
        <TextField
          select
          size="small"
          value={endpoint || ''}
          label="Endpoint"
          onChange={(ev) => {
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

        <Typography
          variant="caption"
          sx={{
            whiteSpace: 'pre',
          }}
        >
          {currentSettings?.description ?? ''}
        </Typography>

        <TextField
          label="Request Body"
          value={requestBody}
          error={Boolean(requestError)}
          helperText={requestError || null}
          multiline
          rows={15}
          onChange={(ev) => setRequestBody(ev.target.value)}
          onBlur={() => setRequestBody((current) => {
            try {
              setRequestError('');
              return JSON.stringify(currentSettings?.schema.parse(current ? JSON.parse(current) : undefined), null, 2);
            } catch (error) {
              setRequestError((error as Error).message);
              return current;
            }
          })}
        />

        <Button
          variant="contained"
          onClick={execute}
          disabled={!endpoint || Boolean(requestError)}
        >
          Run!
        </Button>

        <Typography variant="caption">
          {[
            result?.length ? filesize(result.length) : 'no result',
            requestDuration ? `${Math.round(requestDuration)}ms` : null,
          ].filter(Boolean).join(' / ')}
        </Typography>
        <pre style={{
          height: '30vh',
          color: resultIsError ? 'red' : 'inherit',
        }}>
          {result || 'no response'}
        </pre>

      </Stack>
    </Lightbox>
  );
}

export default QueryTool;

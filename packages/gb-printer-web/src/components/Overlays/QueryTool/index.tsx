import {
  Button,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { filesize } from 'filesize';
import { $fetch, type FetchError } from 'ofetch';
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
  const [requestError, setRequestError] = useState<string>('');
  const [localRequestDuration, setLocalRequestDuration] = useState<number>(0);
  const [localResult, setLocalResult] = useState<string>('');
  const [localResultIsError, setLocalResultIsError] = useState<boolean>(false);
  const [remoteRequestDuration, setRemoteRequestDuration] = useState<number>(0);
  const [remoteResult, setRemoteResult] = useState<string>('');
  const [remoteResultIsError, setRemoteResultIsError] = useState<boolean>(false);

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


  const requestLocal = useCallback(async (endpointName: MethodName, body: unknown) => {
    const source = await getItemsSource();
    const fn = source[endpointName];

    if (typeof fn !== 'function') {
      setLocalResult(`${endpointName} is not a valid endpoint`);
    }

    const start = performance.now();
    setLocalResultIsError(false);
    setLocalResult('');

    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const res = await fn(body);
      setLocalResult(JSON.stringify(res, null, 2));
    } catch (error) {
      setLocalResult((error as Error).message);
      setLocalResultIsError(true);
    }

    setLocalRequestDuration(performance.now() - start);
  }, []);

  const requestRemote = useCallback(async (endpointName: MethodName, body?: Record<string, unknown>) => {
    let endpointPath = endpointSettings[endpointName].remotePath;
    const method = ['/stats', '/health', '/usages', '/maintenance'].includes(endpointPath) ? 'get' : 'post';

    if (!endpointPath) {
      setRemoteResult(`${endpointName} is not a valid endpoint path`);
      return;
    }

    endpointPath = `http://localhost:3001${endpointPath}`;

    const start = performance.now();
    setRemoteResultIsError(false);
    setRemoteResult(`calling "${endpointPath}"`);

    try {
      const res = await $fetch(endpointPath, {
        method,
        body,
      });
      setRemoteResult(JSON.stringify(res, null, 2));
    } catch (error) {
      const message = [
        (error as Error).message || null,
        (error as FetchError).response?._data.message || null,
      ].filter(Boolean).join('\n');
      setRemoteResult(message);
      setRemoteResultIsError(true);
    }

    setRemoteRequestDuration(performance.now() - start);
  }, []);

  const execute = useCallback(async () => {
    if (!endpoint) {
      return;
    }

    let body: Record<string, unknown> | undefined;

    try {
      body = currentSettings?.schema.parse(requestBody ? JSON.parse(requestBody) : undefined) as Record<string, unknown> || undefined;
      setRequestError('');
    } catch (error) {
      setRequestError((error as Error).message);
      return;
    }

    await Promise.all([
      requestLocal(endpoint, body),
      requestRemote(endpoint, body),
    ]);
  }, [currentSettings, endpoint, requestBody, requestLocal, requestRemote]);

  useEffect(() => {
    if (endpoint) {
      const newSettings = endpointSettings[endpoint];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      updateBody(newSettings.exampleBody);
      setLocalResult('');
      setLocalRequestDuration(0);
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
          rows={10}
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

        <Grid container spacing={4}>
          <Grid size={6}>
            <Typography variant="caption">
              {[
                localResult?.length ? filesize(localResult.length) : 'no result',
                localRequestDuration ? `${Math.round(localRequestDuration)}ms` : null,
              ].filter(Boolean).join(' / ')}
            </Typography>
            <Paper
              component="pre"
              elevation={4}
              sx={{
                p: 2,
                height: '30vh',
                color: localResultIsError ? 'red' : 'inherit',
              }}
            >
              {localResult || 'no response'}
            </Paper>
          </Grid>
          <Grid size={6}>
            <Typography variant="caption">
              {[
                remoteResult?.length ? filesize(remoteResult.length) : 'no result',
                remoteRequestDuration ? `${Math.round(remoteRequestDuration)}ms` : null,
              ].filter(Boolean).join(' / ')}
            </Typography>
            <Paper
              component="pre"
              elevation={4}
              sx={{
                p: 2,
                height: '30vh',
                color: remoteResultIsError ? 'red' : 'inherit',
              }}
            >
              {remoteResult || 'no response'}
            </Paper>
          </Grid>
        </Grid>

      </Stack>
    </Lightbox>
  );
}

export default QueryTool;

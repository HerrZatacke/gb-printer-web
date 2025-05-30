'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import NextLink from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';
import { useAddPlugin } from '@/hooks/useAddPlugin';

function AddPlugin() {
  const {
    url,
    source,
    isTrusted,
    pending,
    pluginExists,
    addPlugin,
  } = useAddPlugin();

  if (!url) {
    redirect('/settings/plugins');
    return null;
  }

  if (pending) {
    return null;
  }

  return (
    <Stack
      direction="column"
      gap={4}
    >
      { isTrusted ? null : (
        <Alert severity="error" variant="filled">
          {`The source "${source}" of this plugin is not trusted!!`}
        </Alert>
      ) }
      { pluginExists ? (
        <>
          <Alert severity="warning" variant="filled">
            {`The plugin "${url}" is already installed`}
          </Alert>
          <Link
            component={NextLink}
            href="/settings/plugins"
          >
            Go to plugins
          </Link>
        </>
      ) : (
        <>
          <Alert
            severity={isTrusted ? 'success' : 'warning'}
            variant="filled"
          >
            {`This will add ${url} to your plugins.`}
          </Alert>
          <Box>
            <Button
              color={isTrusted ? 'success' : 'warning'}
              variant="contained"
              sx={{
                fontSize: 20,
                px: 8,
                py: 2,
                mx: 'auto',
                display: 'block',
              }}
              disabled={pluginExists}
              onClick={addPlugin}
            >
              Add
            </Button>
          </Box>
        </>
      ) }
    </Stack>
  );
}

export default AddPlugin;

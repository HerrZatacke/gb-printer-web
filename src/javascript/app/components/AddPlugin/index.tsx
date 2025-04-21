import React from 'react';
import { Link as RouterLink, Navigate } from 'react-router';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { useAddPlugin } from './useAddPlugin';

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
    return <Navigate to="/settings/plugins" replace />;
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
            component={RouterLink}
            to="/settings/plugins"
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

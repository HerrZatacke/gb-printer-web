'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import NextLink from 'next/link';
import { redirect } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useAddPlugin } from '@/hooks/useAddPlugin';

function AddPlugin() {
  const t = useTranslations('AddPlugin');
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
          {t('notTrusted', { source })}
        </Alert>
      ) }
      { pluginExists ? (
        <>
          <Alert severity="warning" variant="filled">
            {t('alreadyInstalled', { url })}
          </Alert>
          <Link
            component={NextLink}
            href="/settings/plugins"
          >
            {t('goToPlugins')}
          </Link>
        </>
      ) : (
        <>
          <Alert
            severity={isTrusted ? 'success' : 'warning'}
            variant="filled"
          >
            {t('willAdd', { url })}
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
              {t('addButton')}
            </Button>
          </Box>
        </>
      ) }
    </Stack>
  );
}

export default AddPlugin;

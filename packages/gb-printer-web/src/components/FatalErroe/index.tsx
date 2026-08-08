'use client';

import {
  Alert,
  AlertTitle,
  Link,
  Button,
  ButtonGroup,
  Container,
  Stack, Typography,
} from '@mui/material';
import { deleteDB } from 'idb';
import { useCallback } from 'react';
import NavigationSkeleton from '@/components/Navigation/Skeleton';
import { useInteractionsStore } from '@/stores/stores';

const databaseNames = [
  'GB Printer Web',
  'gb-printer-web--items',
];

const localStorageKeys = [
  'gbp-z-web-storages',
  'gbp-z-web-analytics-consent',
  'gbp-z-web-filters',
  'i18nextLng',
  'gbp-z-web-items',
  'gbp-z-web-settings',
];

export default function FatalError() {
  const { fatalError } = useInteractionsStore();

  const resetApp = useCallback(async () => {
    for (const name of databaseNames) {
      await deleteDB(name, {
        blocked() {
          console.warn(`Deletion of database "${name}" is blocked by another open connection.`);
        },
      });
    }

    for (const key of localStorageKeys) {
      localStorage.removeItem(key);
    }

    window.location.reload();
  }, []);

  const retry = useCallback(async () => {
    await deleteDB('gb-printer-web--items');
    window.location.reload();
  }, []);

  if (!fatalError) {
    return null;
  }

  return (
    <>
      <NavigationSkeleton />
      <Container
        maxWidth="lg"
        sx={{
          p: 2,
          minHeight: 'calc(100dvh - var(--navigation-height))',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Alert variant="outlined" severity="error">
          <AlertTitle variant="h1" color="textPrimary">
            Oh oh! Something went wrong!
          </AlertTitle>
          <Stack
            sx={{
              gap: 2,
            }}
          >
            <pre>{fatalError.error.message}</pre>
            <Typography variant="body1">Something went wrong while migrating your local data to the new storage format.</Typography>
            <Typography variant="body1">Your existing data has not been modified or lost. It is still stored exactly as it was before the migration attempt.</Typography>
            <Typography variant="body1">You can copy the above output and ask for help in the <code>gallery-web-app</code>-channel in the Game Boy Camera Club Discord</Typography>
            <Typography variant="body1">If you have a backup of your data and would rather start fresh, you can reset the app. This will delete all locally stored data and cannot be undone.</Typography>

            <ButtonGroup variant="contained" color="error" size="large" fullWidth>
              <Button
                onClick={resetApp}
              >
                Reset app and delete local data
              </Button>
              <Button
                onClick={retry}
              >
                Retry
              </Button>
              <Button
                component={Link}
                href="https://gameboycamera.club/"
                target="_blank"
              >
                Visit the Game Boy Camera Club Discord
              </Button>
            </ButtonGroup>

          </Stack>
        </Alert>
      </Container>
    </>
  );
}

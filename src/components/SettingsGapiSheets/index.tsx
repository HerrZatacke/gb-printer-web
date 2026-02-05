'use client';

import {
  Alert,
  Button,
  ButtonGroup,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import React, { useCallback, useEffect, useState } from 'react';
import { useGIS } from '@/hooks/useGIS';
import { useStoragesStore } from '@/stores/stores';
import type { GapiSettings } from '@/types/Sync';

const cleanGapiSheetId = (dirtyId: string): string => {
  const input = dirtyId.trim();

  if (!input) {
    return '';
  }

  // input matches valid ID.
  if (/^[a-zA-Z0-9-_]{24,}$/.test(input)) {
    return input;
  }

  // extract ID from edit-url
  const match = input.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]{24,})\/edit(?:[?#].*)?$/);

  return match ? match[1] : '';
};

function SettingsGapiSheets() {
  const { isSignedIn, handleSignIn, handleSignOut } = useGIS();
  const { gapiStorage, setGapiSettings } = useStoragesStore();
  const [expiryTimeInfo, setExpiryTimeInfo] = useState<string>('');
  const [use, setUse] = useState<boolean>(gapiStorage.use || false);
  const [sheetId, setSheetId] = useState<string>(gapiStorage.sheetId || '');
  const t = useTranslations('SettingsGapiSheets');

  useEffect(() => {
    const handle = setInterval(() => {

      const expiresInMs = (gapiStorage.tokenExpiry || 0) - Date.now();

      const expiryInfo = (new Date(expiresInMs))
        .toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'UTC',
        });

      setExpiryTimeInfo(expiryInfo);
    }, 1000);

    return () => clearInterval(handle);
  }, [gapiStorage.tokenExpiry]);

  const updateGapiSettings = useCallback((partial: Partial<GapiSettings>) => {
    setGapiSettings({
      ...gapiStorage,
      ...partial,
    });
  }, [gapiStorage, setGapiSettings]);

  return (
    <Stack
      direction="column"
      gap={6}
    >
      <Alert severity="warning" variant="filled">
        {t('about')}
      </Alert>

      <FormControlLabel
        label={t('enableStorage')}
        control={(
          <Switch
            checked={use}
            onChange={({ target }) => {
              setUse(target.checked);
              updateGapiSettings({ use: target.checked });
            }}
          />
        )}
      />

      <ButtonGroup
        variant="contained"
        fullWidth
      >
        <Button
          disabled={isSignedIn || !gapiStorage.use}
          onClick={handleSignIn}
        >
          {t('authenticate')}
        </Button>
        <Button
          disabled={!isSignedIn}
          onClick={handleSignOut}
        >
          {t('logout')}
        </Button>
      </ButtonGroup>


      { !use ? null : (
        <>
          <TextField
            label={t('sheetId')}
            helperText={t('sheetIdHelper')}
            type="text"
            value={sheetId}
            onChange={(ev) => {
              setSheetId(ev.target.value);
            }}
            onBlur={(ev) => {
              const cleanId = cleanGapiSheetId(ev.target.value);
              setSheetId(cleanId);
              updateGapiSettings({ sheetId: cleanId });
            }}
          />

          <Typography>
            {t('tokenExpiry', { time: expiryTimeInfo })}
          </Typography>
        </>
      )}
    </Stack>
  );
}

export default SettingsGapiSheets;

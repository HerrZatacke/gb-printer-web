'use client';

import LaunchIcon from '@mui/icons-material/Launch';
import {
  Alert,
  Button,
  ButtonGroup,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  Switch,
  TextField,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import SheetsTable from '@/components/SettingsGapiSheets/SheetsTable';
import TokenTimer from '@/components/SettingsGapiSheets/TokenTimer';
import { textFieldSlotDefaults } from '@/consts/textFieldSlotDefaults';
import useGapiSheetState from '@/contexts/GapiSheetStateContext';
import useGIS from '@/contexts/GisContext';
import { useGapiSheetsStats } from '@/hooks/useGapiSheetsStats';
import { useStoragesStore } from '@/stores/stores';

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
  const { clearGapiLastRemoteUpdates } = useGapiSheetState();
  const { sheetsStats, canEnableAutoSync } = useGapiSheetsStats();
  const [use, setUse] = useState<boolean>(gapiStorage.use || false);
  const [autoSync, setAutoSync] = useState<boolean>(gapiStorage.autoSync || false);
  const [sheetId, setSheetId] = useState<string>(gapiStorage.sheetId || '');
  const t = useTranslations('SettingsGapiSheets');

  useEffect(() => {
    setUse(gapiStorage.use || false);
    setAutoSync(gapiStorage.autoSync || false);
    setSheetId(gapiStorage.sheetId || '');
  }, [gapiStorage]);

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
              setGapiSettings({ use: target.checked });
            }}
          />
        )}
      />

      <FormControlLabel
        label={t('enableAutoSync')}
        disabled={!use || !canEnableAutoSync}
        control={(
          <Switch
            checked={autoSync}
            onChange={({ target }) => {
              setAutoSync(target.checked);
              setGapiSettings({ autoSync: target.checked });
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
            slotProps={{
              ...textFieldSlotDefaults,
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      title={t('openSheetLink')}
                      aria-label={t('openSheetLink')}
                      disabled={!gapiStorage.sheetId}
                      edge="end"
                      component={Link}
                      href={`https://docs.google.com/spreadsheets/d/${gapiStorage.sheetId}/edit`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <LaunchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            onChange={(ev) => {
              setSheetId(ev.target.value);
            }}
            onBlur={(ev) => {
              const cleanId = cleanGapiSheetId(ev.target.value);
              setSheetId(cleanId);
              setGapiSettings({ sheetId: cleanId, autoSync: false });
              clearGapiLastRemoteUpdates();
            }}
          />

          {isSignedIn && <TokenTimer />}

          <SheetsTable sheetsStats={sheetsStats} />
        </>
      )}
    </Stack>
  );
}

export default SettingsGapiSheets;

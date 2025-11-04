'use client';

import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import NextLink from 'next/link';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import DownloadOptionsForm from '@/components/Overlays/DownloadOptions/DownloadOptionsForm';
import EnableWebUSB from '@/components/WebUSBGreeting/EnableWebUSB';
import { GalleryClickAction } from '@/consts/GalleryClickAction';
import { PaletteSortMode } from '@/consts/paletteSortModes';
import { savImportOptions, SavImportOrder } from '@/consts/SavImportOrder';
import { useEnv } from '@/contexts/envContext';
import useTracking, { ConsentState } from '@/contexts/TrackingContext';
import { useDateFormat } from '@/hooks/useDateFormat';
import { useFrameGroups } from '@/hooks/useFrameGroups';
import usePaletteSort from '@/hooks/usePaletteSort';
import { locales } from '@/i18n/locales';
import useSettingsStore from '@/stores/settingsStore';
import cleanUrl from '@/tools/cleanUrl';

interface ClickActionOption {
  translationKey: string,
  value: string,
}

const clickActionMenuOptions: ClickActionOption[] = [
  {
    translationKey: 'galleryClickActions.clickSelectsItem',
    value: GalleryClickAction.SELECT,
  },
  {
    translationKey: 'galleryClickActions.clickOpensEditDialog',
    value: GalleryClickAction.EDIT,
  },
  {
    translationKey: 'galleryClickActions.clickOpensLightbox',
    value: GalleryClickAction.VIEW,
  },
];

function SettingsGeneric() {
  const {
    enableDebug,
    forceMagicCheck,
    galleryClickAction,
    hideDates,
    importDeleted,
    importLastSeen,
    importPad,
    pageSize,
    preferredLocale,
    printerParams,
    printerUrl,
    savFrameTypes,
    savImportOrder,
    setEnableDebug,
    setForceMagicCheck,
    setGalleryClickAction,
    setHideDates,
    setImportDeleted,
    setImportLastSeen,
    setImportPad,
    setPageSize,
    setPreferredLocale,
    setSavFrameTypes,
    setSavImportOrder,
    setPrinterParams,
    setPrinterUrl,
  } = useSettingsStore();

  const env = useEnv();

  const { frameGroups } = useFrameGroups();
  const { setConsent, trackingAvailable, consentState } = useTracking();

  const [pageSizeState, setPageSizeState] = useState<string>(pageSize.toString(10));
  const [printerUrlState, setPrinterUrlState] = useState<string>(printerUrl);
  const [printerParamsState, setPrinterParamsState] = useState<string>(printerParams);
  const [localeExampleText, setLocaleExampleText] = useState<string>('');
  const { formatter } = useDateFormat();
  const t = useTranslations('SettingsGeneric');

  const {
    sortPalettes,
    setSortPalettes,
    paletteSortOptions,
  } = usePaletteSort();

  useEffect(() => {
    setLocaleExampleText(t('exampleDateFormat', { format: formatter(new Date()) }));
  }, [formatter, t]);

  return (
    <Stack
      direction="column"
      gap={6}
    >
      <TextField
        id="settings-pagesize"
        label={t('galleryPageSize')}
        type="text"
        helperText={t('galleryPageSizeHelper')}
        value={pageSizeState}
        onChange={(ev) => setPageSizeState(ev.target.value)}
        onBlur={() => {
          const newValue = Math.abs(parseInt(pageSizeState, 10) || 0);
          setPageSize(newValue);
          setPageSizeState(newValue.toString(10));
        }}
      />

      <TextField
        value={galleryClickAction}
        label={t('galleryClickAction')}
        select
        helperText={t('galleryClickActionHelper')}
        onChange={(ev) => {
          setGalleryClickAction(ev.target.value as GalleryClickAction);
        }}
      >
        {
          clickActionMenuOptions.map(({ value, translationKey }) => (
            <MenuItem
              key={value}
              value={value}
            >
              {t(translationKey)}
            </MenuItem>
          ))
        }
      </TextField>

      <DownloadOptionsForm inDialog={false} />

      <TextField
        id="settings-sav-frames"
        value={frameGroups.length ? savFrameTypes : ''}
        disabled={!frameGroups.length}
        label={t('importSavFrames')}
        select
        slotProps={{
          inputLabel: {
            shrink: true,
          },
          select: {
            renderValue: (selected) => (
              selected === '' ? t('importSavFramesNone') : frameGroups.find(({ id }) => (
                id === selected
              ))?.name || t('importSavFramesUnknown')
            ),
          },
        }}
        onChange={(ev) => {
          setSavFrameTypes(ev.target.value);
        }}
        placeholder={t('importSavFramesNone')}
      >
        <MenuItem value="" selected={!savFrameTypes}>None</MenuItem>
        {
          frameGroups.map(({ id, name }) => (
            <MenuItem
              key={id}
              value={id}
            >
              {name}
            </MenuItem>
          ))
        }
      </TextField>

      <TextField
        id="settings-sav-order"
        value={savImportOrder}
        label={t('importSavOrder')}
        select
        onChange={(ev) => {
          setSavImportOrder(ev.target.value as SavImportOrder);
        }}
      >
        {
          savImportOptions.map(({ value, translationKey }) => (
            <MenuItem
              key={value}
              value={value}
            >
              {t(translationKey)}
            </MenuItem>
          ))
        }
      </TextField>

      <FormControlLabel
        label={t('importLastSeen')}
        control={(
          <Switch
            checked={importLastSeen}
            onChange={({ target }) => {
              setImportLastSeen(target.checked);
            }}
          />
        )}
      />

      <FormControlLabel
        label={t('importDeleted')}
        control={(
          <Switch
            checked={importDeleted}
            onChange={({ target }) => {
              setImportDeleted(target.checked);
            }}
          />
        )}
      />

      <FormControlLabel
        label={t('forceMagicCheck')}
        control={(
          <Switch
            checked={forceMagicCheck}
            onChange={({ target }) => {
              setForceMagicCheck(target.checked);
            }}
          />
        )}
      />

      <FormControlLabel
        label={t('importPad')}
        control={(
          <Switch
            checked={importPad}
            onChange={({ target }) => {
              setImportPad(target.checked);
            }}
          />
        )}
      />

      <FormControlLabel
        label={t('hideDates')}
        control={(
          <Switch
            checked={hideDates}
            onChange={({ target }) => {
              setHideDates(target.checked);
            }}
          />
        )}
      />

      <TextField
        id="settings-filename-style"
        value={sortPalettes}
        label={t('sortPalettes')}
        select
        onChange={(ev) => {
          setSortPalettes(ev.target.value as PaletteSortMode);
        }}
      >
        {
          paletteSortOptions.map(({ value, label }) => (
            <MenuItem
              key={value}
              value={value}
            >
              {label}
            </MenuItem>
          ))
        }
      </TextField>

      <TextField
        id="settings-filename-style"
        value={preferredLocale}
        label={t('preferredLocale')}
        helperText={localeExampleText}
        select
        onChange={(ev) => {
          setPreferredLocale(ev.target.value);
        }}
      >
        {
          locales.map((code) => (
            <MenuItem
              key={code}
              value={code}
            >
              {t(`locales.${code}`)}
            </MenuItem>
          ))
        }
      </TextField>

      <EnableWebUSB />

      {(env?.env === 'esp8266') ? null : (
        <TextField
          id="settings-printer-url"
          label={t('printerUrl')}
          type="text"
          helperText={
            t.rich('printerUrlHelper', {
              link: (chunks) => (
                <Link
                  component={NextLink}
                  href="/import"
                >
                  {chunks}
                </Link>
              ),
            })
          }
          value={printerUrlState}
          onChange={(ev) => setPrinterUrlState(ev.target.value)}
          onBlur={() => {
            const cleanPrinterUrl = cleanUrl(printerUrlState, 'http');
            setPrinterUrlState(cleanPrinterUrl);
            setPrinterUrl(cleanPrinterUrl);
          }}
          onKeyUp={(ev) => {
            switch (ev.key) {
              case 'Enter': {
                const cleanPrinterUrl = cleanUrl(printerUrlState, 'http');
                setPrinterUrlState(cleanPrinterUrl);
                setPrinterUrl(cleanPrinterUrl);
                break;
              }

              case 'Escape':
                setPrinterUrlState(printerUrl);
                break;
              default:
            }
          }}
        />
      )}

      {(env?.env === 'esp8266' || printerUrl) ? (
        <TextField
          id="settings-printer-settings"
          label={t('printerParams')}
          type="text"
          value={printerParamsState}
          onChange={(ev) => setPrinterParamsState(ev.target.value)}
          onBlur={() => {
            setPrinterParams(printerParamsState);
          }}
          onKeyUp={(ev) => {
            switch (ev.key) {
              case 'Enter':
                setPrinterParams(printerParamsState);
                break;
              case 'Escape':
                setPrinterParamsState(printerParams);
                break;
              default:
            }
          }}
        />
      ) : null}

      <FormControlLabel
        label={t('enableDebug')}
        control={(
          <Switch
            checked={enableDebug}
            onChange={({ target }) => {
              setEnableDebug(target.checked);
            }}
          />
        )}
      />

      {trackingAvailable && (
        <Stack
          direction="column"
          gap={2}
          alignItems="flex-start"
        >
          <Button
            variant="outlined"
            onClick={() => setConsent(ConsentState.UNKNOWN)}
            color="secondary"
          >
            {t('resetTrackingConsent', { consentState })}
          </Button>
        </Stack>
      )}
    </Stack>
  );
}

export default SettingsGeneric;

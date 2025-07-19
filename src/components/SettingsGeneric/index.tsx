'use client';

import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import type { ExportFrameMode } from 'gb-image-decoder';
import NextLink from 'next/link';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import EnableWebUSB from '@/components/WebUSBGreeting/EnableWebUSB';
import exportFrameModes from '@/consts/exportFrameModes';
import { fileNameStyleLabels } from '@/consts/fileNameStyles';
import type { FileNameStyle } from '@/consts/fileNameStyles';
import { clickActionMenuOptions } from '@/consts/GalleryClickAction';
import type { GalleryClickAction } from '@/consts/GalleryClickAction';
import type { PaletteSortMode } from '@/consts/paletteSortModes';
import { useEnv } from '@/contexts/envContext';
import { useDateFormat } from '@/hooks/useDateFormat';
import usePaletteSort from '@/hooks/usePaletteSort';
import { locales } from '@/i18n/locales';
import useItemsStore from '@/stores/itemsStore';
import useSettingsStore from '@/stores/settingsStore';
import cleanUrl from '@/tools/cleanUrl';
import getFrameGroups from '@/tools/getFrameGroups';
import supportedCanvasImageFormats from '@/tools/supportedCanvasImageFormats';

function SettingsGeneric() {
  const {
    enableDebug,
    enableImageGroups,
    exportFileTypes,
    exportScaleFactors,
    fileNameStyle,
    forceMagicCheck,
    galleryClickAction,
    handleExportFrame,
    hideDates,
    importDeleted,
    importLastSeen,
    importPad,
    pageSize,
    preferredLocale,
    printerParams,
    printerUrl,
    savFrameTypes,
    setExportFileTypes,
    setExportScaleFactors,
    setEnableDebug,
    setEnableImageGroups,
    setFileNameStyle,
    setForceMagicCheck,
    setGalleryClickAction,
    setHandleExportFrame,
    setHideDates,
    setImportDeleted,
    setImportLastSeen,
    setImportPad,
    setPageSize,
    setPreferredLocale,
    setSavFrameTypes,
    setPrinterParams,
    setPrinterUrl,
  } = useSettingsStore();

  const env = useEnv();

  const { frames, frameGroups, imageGroups } = useItemsStore();

  const savFrameGroups = getFrameGroups(frames, frameGroups);

  const [pageSizeState, setPageSizeState] = useState<string>(pageSize.toString(10));
  const [printerUrlState, setPrinterUrlState] = useState<string>(printerUrl);
  const [printerParamsState, setPrinterParamsState] = useState<string>(printerParams);
  const [supportedExportFileTypes, setSupportedExportFileTypes] = useState<string[]>(['txt', 'pgm']);
  const [localeExampleText, setLocaleExampleText] = useState<string>('');
  const { formatter } = useDateFormat();
  const t = useTranslations('SettingsGeneric');

  const {
    sortPalettes,
    setSortPalettes,
    paletteSortOptions,
  } = usePaletteSort();

  useEffect(() => {
    setSupportedExportFileTypes([
      ...supportedCanvasImageFormats(),
      'txt',
      'pgm',
    ]);
  }, []);

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
          clickActionMenuOptions.map(({ value, label }) => (
            <MenuItem
              key={value}
              value={value}
            >
              {label}
            </MenuItem>
          ))
        }
      </TextField>

      <FormControl>
        <InputLabel shrink>
          {t('exportDimensions')}
        </InputLabel>
        <ToggleButtonGroup
          fullWidth
          value={exportScaleFactors}
          onChange={(_, value) => {
            setExportScaleFactors(value);
          }}
        >
          {[1, 2, 3, 4, 5, 6, 8, 10].map((factor) => (
            <ToggleButton
              key={factor}
              value={factor}
              title={`${factor * 160}×${factor * 144}`}
            >
              {`${factor}×`}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </FormControl>

      <FormControl>
        <InputLabel shrink>
          {t('exportFiletypes')}
        </InputLabel>
        <ToggleButtonGroup
          fullWidth
          value={exportFileTypes}
          onChange={(_, value) => {
            setExportFileTypes(value);
          }}
        >
          {supportedExportFileTypes.map((fileType) => (
            <ToggleButton
              key={fileType}
              value={fileType}
              title={fileType}
            >
              { fileType }
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </FormControl>

      <TextField
        id="settings-handle-export-frames"
        value={handleExportFrame}
        label={t('exportHandleFrame')}
        select
        onChange={(ev) => {
          setHandleExportFrame(ev.target.value as ExportFrameMode);
        }}
      >
        {
          exportFrameModes.map(({ id, name }) => (
            <MenuItem
              key={id}
              value={id}
            >
              {t(name)}
            </MenuItem>
          ))
        }
      </TextField>

      <TextField
        id="settings-filename-style"
        value={fileNameStyle}
        label={t('filenameStyle')}
        select
        onChange={(ev) => {
          setFileNameStyle(ev.target.value as FileNameStyle);
        }}
      >
        {
          fileNameStyleLabels.map(({ id, name }) => (
            <MenuItem
              key={id}
              value={id}
            >
              {t(name)}
            </MenuItem>
          ))
        }
      </TextField>

      <TextField
        id="settings-sav-frames"
        value={savFrameGroups.length ? savFrameTypes : ''}
        disabled={!savFrameGroups.length}
        label={t('importSavFrames')}
        select
        slotProps={{
          inputLabel: {
            shrink: true,
          },
          select: {
            renderValue: (selected) => (
              selected === '' ? t('importSavFramesNone') : savFrameGroups.find(({ id }) => (
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
          savFrameGroups.map(({ id, name }) => (
            <MenuItem
              key={id}
              value={id}
            >
              {name}
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
                  🔗
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

      <FormControlLabel
        label={t('enableImageGroups', { groupCount: imageGroups.length })}
        control={(
          <Switch
            checked={enableImageGroups}
            onChange={({ target }) => {
              setEnableImageGroups(target.checked);
            }}
          />
        )}
      />
    </Stack>
  );
}

export default SettingsGeneric;

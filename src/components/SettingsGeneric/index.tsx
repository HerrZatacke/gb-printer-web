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
import type { ILocale } from 'locale-codes';
import NextLink from 'next/link';
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

function GenericSettings() {
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
  const [localeExampleText, setLocaleExampleText] = useState<string>('Example date format:');
  const [localeCodes, setLocaleCodes] = useState<ILocale[]>([]);
  const [now] = useState(new Date());
  const { formatter } = useDateFormat();

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

    const setLocales = async () => {
      const { default: locale } = await import('locale-codes');
      const filteredLocales: ILocale[] = locale.all
        .filter(({ tag }) => (
          locales.includes(tag)
        ));

      setLocaleCodes(filteredLocales);
    };

    setLocales();

  }, []);

  useEffect(() => {
    // setLocaleExampleText(`Example date format: ${dateFormatLocale(now, preferredLocale)}`);
    setLocaleExampleText(`Example date format: ${formatter(now)}`);
  }, [formatter, now, preferredLocale]);

  return (
    <Stack
      direction="column"
      gap={6}
    >
      <TextField
        id="settings-pagesize"
        label="Gallery page size"
        type="text"
        helperText="Set to 0 to disable pagination - might cause performance issues on large sets of images"
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
        label="Click behaviour for gallery images"
        select
        helperText="Ctrl+Click and Shift+Click will always select/range-select"
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
          Image export dimensions
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
          Image export filetypes
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
        label="How to handle frames when exporting images"
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
              {name}
            </MenuItem>
          ))
        }
      </TextField>

      <TextField
        id="settings-filename-style"
        value={fileNameStyle}
        label="Filename style"
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
              {name}
            </MenuItem>
          ))
        }
      </TextField>

      <TextField
        id="settings-sav-frames"
        value={savFrameGroups.length ? savFrameTypes : ''}
        disabled={!savFrameGroups.length}
        label="Frames to be applied when importing Cartridge dumps"
        select
        slotProps={{
          inputLabel: {
            shrink: true,
          },
          select: {
            renderValue: (selected) => (
              selected === '' ? 'None' : savFrameGroups.find(({ id }) => (
                id === selected
              ))?.name || 'Unknown'
            ),
          },
        }}
        onChange={(ev) => {
          setSavFrameTypes(ev.target.value);
        }}
        placeholder="None"
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
        label="Import ‘last seen’ image when importing Cartridge dumps"
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
        label="Import deleted images when importing Cartridge dumps"
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
        label="Force valid .sav file when importing"
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
        label="Pad images up to 144px height on import"
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
        label="Hide dates in gallery"
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
        label="Sort Palettes"
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
        value={localeCodes.length ? preferredLocale : ''}
        label="Preferred locale"
        helperText={localeExampleText}
        select
        onChange={(ev) => {
          setPreferredLocale(ev.target.value);
        }}
      >
        {
          localeCodes.map(({ name, local, location, tag }) => (
            <MenuItem
              key={tag}
              value={tag}
            >
              {`${local || name}${location ? ` - ${location}` : ''} (${tag})`}
            </MenuItem>
          ))
        }
      </TextField>

      <EnableWebUSB />

      {(env?.env === 'esp8266') ? null : (
        <TextField
          id="settings-printer-url"
          label="Printer URL"
          type="text"
          helperText={(
            <>
              {'If you own a physical wifi-printer, you can add it\'s URL here and check the '}
              <Link
                component={NextLink}
                href="/import"
              >
                Import-tab
              </Link>
            </>
          )}
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
          label="Additional printer settings"
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
        label="Show debug info"
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
        label={`Enable Image Groups ${imageGroups.length ? `(${imageGroups.length} groups)` : ''}`}
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

export default GenericSettings;

import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Stack from '@mui/material/Stack';
import MuiCleanThemeProvider from '../MuiCleanThemeProvider';
import { dateFormat } from '../../defaults';
import { Rotation } from '../../../tools/applyRotation';
import type { ImageMetadata, RGBNHashes } from '../../../../types/Image';
import useSettingsStore from '../../stores/settingsStore';
import MetaTable from '../MetaTable';

interface Props {
  hash: string,
  updateCreated: (value: string) => void,
  updateRotation: (value: Rotation) => void,
  created?: string,
  hashes?: RGBNHashes,
  meta?: ImageMetadata,
  rotation?: Rotation,
}

const rotations: number[] = [
  Rotation.DEG_0,
  Rotation.DEG_90,
  Rotation.DEG_180,
  Rotation.DEG_270,
];

function ImageMeta({
  created,
  hash,
  hashes,
  updateCreated,
  meta,
  rotation,
  updateRotation,
}: Props) {
  const { preferredLocale } = useSettingsStore();

  const [locale, setLocale] = useState<string | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const localeImport = preferredLocale.toLowerCase();
      try {
        await import((`dayjs/locale/${localeImport}.js`));
        setLocale(localeImport);
      } catch {
        try {
          const fallbackLocaleImport = localeImport.split('-')[0];
          await import((`dayjs/locale/${fallbackLocaleImport}.js`));
          setLocale(fallbackLocaleImport);
        } catch {
          setLocale(undefined);
        }
      }
    })();
  }, [preferredLocale]);

  return (
    <Stack
      direction="column"
      gap={4}
    >
      <MuiCleanThemeProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
          <DateTimePicker
            label="Date / Time"
            closeOnSelect={false}
            views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
            value={dayjs(created)}
            onAccept={(newDate: Dayjs | null) => {
              if (newDate) {
                updateCreated(newDate.format(dateFormat));
              }
            }}
          />
        </LocalizationProvider>
      </MuiCleanThemeProvider>

      <FormControl>
        <InputLabel shrink>
          Edit Rotation
        </InputLabel>
        <ToggleButtonGroup
          exclusive
          fullWidth
          value={rotation || Rotation.DEG_0}
          onChange={(_, value) => {
            updateRotation(value as Rotation);
          }}
        >
          {
            rotations.map((value) => (
              <ToggleButton
                key={value}
                value={value}
              >
                { `${value * 90}°` }
              </ToggleButton>
            ))
          }
        </ToggleButtonGroup>
      </FormControl>
      <MetaTable
        meta={meta}
        hash={hash}
        hashes={hashes}
      />
    </Stack>
  );
}

export default ImageMeta;

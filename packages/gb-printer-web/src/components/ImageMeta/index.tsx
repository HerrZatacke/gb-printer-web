import CropDinIcon from '@mui/icons-material/CropDin';
import FlipIcon from '@mui/icons-material/Flip';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { type Dayjs } from 'dayjs';
import { Mirror, Rotation } from 'gb-image-decoder';
import { fromCreationDate, toCreationDate, type ImageMetadata, type RGBNHashes } from 'gb-printer-schemas';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { useSettingsStore } from '@/stores/stores';
import MetaTable from '../MetaTable';
import MuiCleanThemeProvider from '../MuiCleanThemeProvider';

interface Props {
  hash: string;
  updateCreated: (value: string) => void;
  updateRotation: (value: Rotation) => void;
  updateMirror: (value: Mirror) => void;
  created?: string;
  hashes?: RGBNHashes;
  meta?: ImageMetadata;
  rotation?: Rotation;
  mirror?: Mirror;
}

const rotations: number[] = [
  Rotation.DEG_0,
  Rotation.DEG_90,
  Rotation.DEG_180,
  Rotation.DEG_270,
];

const mirrors: number[] = [
  Mirror.NO_FLIP,
  Mirror.FLIP_V,
  Mirror.FLIP_H,
];

function ImageMeta({
  created,
  hash,
  hashes,
  updateCreated,
  meta,
  rotation,
  mirror,
  updateRotation,
  updateMirror,
}: Props) {
  const { preferredLocale } = useSettingsStore();
  const t = useTranslations('ImageMeta');

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
      sx={{
        gap: 4,
      }}
    >
      <MuiCleanThemeProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
          <DateTimePicker
            label={t('dateTime')}
            closeOnSelect={false}
            views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
            value={created ? dayjs(fromCreationDate(created)) : undefined}
            onChange={(newDate: Dayjs | null) => {
              if (newDate) {
                updateCreated(toCreationDate(newDate.toDate()));
              }
            }}
          />
        </LocalizationProvider>
      </MuiCleanThemeProvider>

      <FormControl>
        <InputLabel shrink>
          {t('editRotation')}
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

      <FormControl>
        <InputLabel shrink>
          {t('editMirror')}
        </InputLabel>
        <ToggleButtonGroup
          exclusive
          fullWidth
          value={mirror || Mirror.NO_FLIP}
          onChange={(_, value) => {
            updateMirror(value as Mirror);
          }}
        >
          {
            mirrors.map((value) => (
              <ToggleButton
                key={value}
                value={value}
                title={t('mirrorOption', { option: value })}
              >
                {value === 0 && <CropDinIcon />}
                {value === 1 && <FlipIcon sx={{ transform: 'rotate(90deg)' }} />}
                {value === 2 && <FlipIcon />}
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

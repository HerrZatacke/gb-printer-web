import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { useTranslations } from 'next-intl';
import React, { useMemo } from 'react';
import ImportPreviewImage from '@/components/ImportPreviewImage';
import Lightbox from '@/components/Lightbox';
import type { ImportContrastValue } from '@/consts/bitmapQueueSettings';
import { contrastSettings } from '@/consts/bitmapQueueSettings';
import useImportsStore from '@/stores/importsStore';
import useSettingsStore from '@/stores/settingsStore';
import { moveBitmapsToImport } from '@/tools/moveBitmapsToImport';

function BitmapQueue() {
  const t = useTranslations('BitmapQueue');
  const { bitmapQueue, bitmapQueueCancel, importQueueAdd } = useImportsStore();
  const {
    bitmapQueueDither,
    bitmapQueueSetting,
    setBitmapQueueDither,
    setBitmapQueueSetting,
  } = useSettingsStore();

  const contrastBaseValues = useMemo(() => {
    const selectedSetting = contrastSettings.find(({ value }) => (value === bitmapQueueSetting)) || contrastSettings[0];
    return selectedSetting.baseValues;
  }, [bitmapQueueSetting]);

  return (
    <Lightbox
      header={t('dialogHeader')}
      confirm={() => {
        moveBitmapsToImport({
          bitmapQueue,
          dither: bitmapQueueDither,
          contrastBaseValues,
          importQueueAdd,
        });
      }}
      deny={bitmapQueueCancel}
    >
      <Stack
        direction="column"
        gap={4}
      >
        {
          bitmapQueue.map((image, index) => (
            <ImportPreviewImage
              key={index}
              imageData={image.imageData}
              scaleFactor={image.scaleFactor}
              width={image.width}
              height={image.height}
              fileName={image.fileName}
              dither={bitmapQueueDither}
              contrastBaseValues={contrastBaseValues}
              palette={['#ffffff', '#aaaaaa', '#555555', '#000000']}
            />
          ))
        }
        <FormControlLabel
          label={t('enableDither')}
          control={(
            <Switch
              checked={bitmapQueueDither}
              onChange={({ target }) => {
                setBitmapQueueDither(target.checked);
              }}
            />
          )}
        />
        <TextField
          value={bitmapQueueSetting}
          label={t('contrastPreset')}
          select
          size="small"
          onChange={(ev) => {
            setBitmapQueueSetting(ev.target.value as ImportContrastValue);
          }}
        >
          {
            contrastSettings.map(({ value, translationKey }) => (
              <MenuItem
                key={value}
                value={value}
              >
                {t(translationKey)}
              </MenuItem>
            ))
          }
        </TextField>
      </Stack>
    </Lightbox>
  );
}

export default BitmapQueue;

import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import React, { useMemo } from 'react';
import ImportPreviewImage from '@/components/ImportPreviewImage';
import Lightbox from '@/components/Lightbox';
import type { ImportContrastValue } from '@/consts/bitmapQueueSettings';
import { contrastSettings } from '@/consts/bitmapQueueSettings';
import useImportsStore from '@/stores/importsStore';
import useSettingsStore from '@/stores/settingsStore';
import { moveBitmapsToImport } from '@/tools/moveBitmapsToImport';

function BitmapQueue() {
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
      header="Prepare Bitmaps for import"
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
          label="Enable Dither"
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
          label="Contrast preset"
          select
          size="small"
          onChange={(ev) => {
            setBitmapQueueSetting(ev.target.value as ImportContrastValue);
          }}
        >
          {
            contrastSettings.map(({ value, name }) => (
              <MenuItem
                key={value}
                value={value}
              >
                {name}
              </MenuItem>
            ))
          }
        </TextField>
      </Stack>
    </Lightbox>
  );
}

export default BitmapQueue;

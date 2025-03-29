import React, { useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Lightbox from '../../Lightbox';
import ImportPreviewImage from '../../ImportPreviewImage';
import { moveBitmapsToImport } from './moveBitmapsToImport';
import useImportsStore from '../../../stores/importsStore';

interface ImportContrast {
  name: string,
  baseValues: number[],
  value: string,
}

const contrasts: ImportContrast[] = [
  {
    name: 'Wider',
    baseValues: [0x00, 0x44, 0xBB, 0xFF],
    value: 'wider',
  },
  {
    name: 'Wide',
    baseValues: [0x00, 0x55, 0xAA, 0xFF],
    value: 'wide',
  },
  {
    name: 'Normal',
    baseValues: [0x33, 0x66, 0x99, 0xCC],
    value: 'normal',
  },
  {
    name: 'Narrow',
    baseValues: [0x45, 0x73, 0xA2, 0xD0],
    value: 'narrow',
  },
  {
    name: 'Narrower',
    baseValues: [0x55, 0x71, 0x8D, 0xAA],
    value: 'narrower',
  },
  {
    // Using src/assets/images/greys.png for reference
    name: 'From Emulator',
    baseValues: [0x40, 0x90, 0xE0, 0xFF],
    value: 'emulator',
  },
];

function BitmapQueue() {
  const { bitmapQueue, bitmapQueueCancel } = useImportsStore();
  const [dither, setDither] = useState(true);
  const [contrast, setContrast] = useState('wide'); // 'wide' covers the complete greyscale range from 00 tro FF. The thresholds are optimal for already dithered imports

  const contrastBaseValues = (contrasts.find(({ value }) => (value === contrast)) || contrasts[1]).baseValues;

  return (
    <Lightbox
      header="Prepare Bitmaps for import"
      confirm={() => {
        moveBitmapsToImport({
          bitmapQueue,
          dither,
          contrastBaseValues,
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
              dither={dither}
              contrastBaseValues={contrastBaseValues}
              palette={['#ffffff', '#aaaaaa', '#555555', '#000000']}
            />
          ))
        }
        <FormControlLabel
          label="Enable Dither"
          control={(
            <Switch
              checked={dither}
              onChange={({ target }) => {
                setDither(target.checked);
              }}
            />
          )}
        />
        <TextField
          value={contrast}
          label="Contrast preset"
          select
          size="small"
          onChange={(ev) => {
            setContrast(ev.target.value);
          }}
        >
          {
            contrasts.map(({ value, name }) => (
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

import RestoreIcon from '@mui/icons-material/Restore';
import IconButton from '@mui/material/IconButton';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import { type RGBNHashes } from 'gb-printer-schemas';
import React, { useMemo } from 'react';

interface Props {
  color: keyof RGBNHashes;
  onChange: (values: readonly number[]) => void;
  values: number[];
}

function ColorSlider({ color, onChange, values }: Props) {
  const colorCode = useMemo(() => {
    switch (color) {
      case 'r':
        return '#ff0000';
      case 'g':
        return '#00dd00';
      case 'b':
        return '#0000ff';
      case 'n':
      default:
        return '#888888';
    }
  }, [color]);

  return (
    <Stack
      direction="row"
      sx={{
        gap: 2,
        alignItems: 'center',
        pr: 2,
      }}
    >
      <IconButton
        title="Reset"
        onClick={() => {
          onChange([0x00, 0x55, 0xaa, 0xff]);
        }}
      >
        <RestoreIcon />
      </IconButton>
      <Slider
        min={0x00}
        max={0xFF}
        value={values}
        sx={{
          color: colorCode,
        }}
        defaultValue={[0x00, 0x55, 0xaa, 0xff]}
        onChange={(_, value) => {
          onChange(value as number[]);
        }}
        disableSwap
      />
    </Stack>
  );
}

export default ColorSlider;

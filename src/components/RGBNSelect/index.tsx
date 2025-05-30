import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import React, { useMemo } from 'react';
import { getChannelColor } from '@/tools/getChannelColor';
import type { RGBNHashes } from '@/types/Image';

interface RGBNCheckbox {
  value: boolean,
  updateKey: keyof RGBNHashes,
}

interface Props {
  isR: boolean,
  isG: boolean,
  isB: boolean,
  isN: boolean,
  toggleChannel: (channel: keyof RGBNHashes) => void
}

function RGBNSelect({ isR, isG, isB, isN, toggleChannel }: Props) {

  const BOXES: RGBNCheckbox[] = useMemo<RGBNCheckbox[]>(() => ([
    {
      value: isR,
      updateKey: 'r',
    },
    {
      value: isG,
      updateKey: 'g',
    },
    {
      value: isB,
      updateKey: 'b',
    },
    {
      value: isN,
      updateKey: 'n',
    },
  ]), [isB, isG, isN, isR]);

  return (
    <ToggleButtonGroup
      onChange={(_, value: keyof RGBNHashes) => toggleChannel(value)}
      fullWidth
      sx={{
        '.MuiToggleButton-root': {
          padding: '1px',
          border: 'none',
        },
      }}
    >
      {
        BOXES.map(({
          value,
          updateKey,
        }) => (
          <ToggleButton
            value={updateKey}
            key={updateKey}
            sx={{
              '& svg': {
                color: getChannelColor(updateKey),
              },
            }}
          >
            {value ? <RadioButtonCheckedIcon /> : <RadioButtonUncheckedIcon />}
          </ToggleButton>
        ))
      }
    </ToggleButtonGroup>
  );
}

export default RGBNSelect;

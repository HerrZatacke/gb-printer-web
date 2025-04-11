import React, { useState } from 'react';
import type { Theme } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import PaletteIcon from '../PaletteIcon';
import usePaletteSort from '../../../hooks/usePaletteSort';
import useItemsStore from '../../stores/itemsStore';

interface Props {
  value: string,
  invertPalette?: boolean,
  noFancy?: boolean,
  allowEmpty?: boolean,
  // `confirm` param is required for direct preview of hovered palettes in edit form
  onChange: (value: string, confirm?: boolean) => void,
  updateInvertPalette?: (invert: boolean) => void,
}

function PaletteSelect({
  value,
  allowEmpty,
  invertPalette,
  noFancy,
  onChange,
  updateInvertPalette,
}: Props) {
  const [initiallySelected, setInitiallySelected] = useState<string>(value);

  const { palettes: palettesUnsorted } = useItemsStore();
  const theme: Theme = useTheme();

  const { sortFn } = usePaletteSort();

  const palettes = [...palettesUnsorted].sort(sortFn);

  // this option is used for assigning a single palette to an animation
  if (allowEmpty) {
    palettes.unshift({
      shortName: '',
      name: 'As selected per image',
      palette: [],
      isPredefined: false,
      origin: '',
    });
  }

  return (
    <Stack
      direction="column"
      gap={2}
    >
      <TextField
        value={value}
        label="Palette"
        size="small"
        select
        onChange={(ev) => {
          onChange(ev.target.value, true);
          setInitiallySelected(ev.target.value);
        }}
      >
        {
          palettes.map(({ shortName, name, palette }) => (
            <MenuItem
              key={shortName}
              value={shortName}
            >
              <ListItemIcon>
                <PaletteIcon palette={palette} />
              </ListItemIcon>
              <ListItemText>
                {name}
              </ListItemText>
            </MenuItem>
          ))
        }
      </TextField>
      {
        updateInvertPalette ? (
          <FormControlLabel
            label="Invert Palette"
            control={(
              <Switch
                checked={invertPalette}
                onChange={({ target }) => {
                  updateInvertPalette(target.checked);
                }}
              />
            )}
          />
        ) : null
      }
      { noFancy ? null : (
        <Stack
          component="ul"
          direction="row"
          gap={0}
          flexWrap="wrap"
          justifyContent="space-between"
          sx={{
            button: {
              padding: 0,
              width: '40px',
              height: '40px',
              border: 'none',
              borderRadius: '50%',

              '.palette-icon': {
                width: '34px',
                height: '34px',
              },

              '&:hover .palette-icon': {
                animation: 'spin 800ms infinite linear',
              },

              '@keyframes spin': {
                from: {
                  transform: 'rotate(0deg)',
                },
                to: {
                  transform: 'rotate(360deg)',
                },
              },
            },
          }}
        >
          {
            palettes.map(({ shortName, name, palette }) => (
              <Box
                component="li"
                key={shortName}
              >
                <button
                  type="button"
                  title={name}
                  style={{
                    background: shortName === initiallySelected ? theme.palette.tertiary.main : 'transparent',
                  }}
                  onMouseEnter={() => {
                    onChange(shortName, false);
                  }}
                  onMouseLeave={() => {
                    onChange(initiallySelected, false);
                  }}
                  onClick={() => {
                    onChange(shortName, true);
                    setInitiallySelected(shortName);
                  }}
                >
                  <PaletteIcon palette={palette} />
                </button>
              </Box>
            ))
          }
        </Stack>
      )}
    </Stack>
  );
}

export default PaletteSelect;

import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import type { Theme } from '@mui/system';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import PaletteIcon from '@/components/PaletteIcon';
import usePaletteSort from '@/hooks/usePaletteSort';
import { useItemsStore } from '@/stores/stores';

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
  const t = useTranslations('PaletteSelect');
  const [initiallySelected, setInitiallySelected] = useState<string>(value);

  const { palettes: palettesUnsorted } = useItemsStore();
  const theme: Theme = useTheme();

  const { sortFn } = usePaletteSort();

  const palettes = [...palettesUnsorted].sort(sortFn);

  // this option is used for assigning a single palette to an animation
  if (allowEmpty) {
    palettes.unshift({
      shortName: '',
      name: t('asSelectedPerImage'),
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
        label={t('palette')}
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
                <PaletteIcon palette={palette} fontSize="1.5rem" />
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
            label={t('invertPalette')}
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
        <Box
          component="ul"
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, 2.5rem)',
            justifyContent: 'center',
            gap: 0.25,

            button: {
              padding: 0,
              cursor: 'pointer',
              width: '2.5rem',
              height: '2.5rem',
              border: 'none',
              borderRadius: '50%',
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
        </Box>
      )}
    </Stack>
  );
}

export default PaletteSelect;

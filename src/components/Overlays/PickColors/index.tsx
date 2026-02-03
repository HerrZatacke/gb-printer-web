import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircleIcon from '@mui/icons-material/Circle';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useTranslations } from 'next-intl';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Lightbox from '@/components/Lightbox';
import PalettePreview from '@/components/PalettePreview';
import { NEW_PALETTE_SHORT } from '@/consts/SpecialTags';
import { toHexColor } from '@/hooks/usePaletteFromFile';
import { useEditStore } from '@/stores/stores';

function PickColors() {
  const t = useTranslations('PickColors');
  const { pickColors, setEditPalette, cancelEditPalette, cancelPickColors } = useEditStore();

  const [selected, setSelected] = useState<number[]>([0, 3, 6, 9]);

  const palette = useMemo<string[]>((): string[] => {
    if (!pickColors) {
      return [];
    }

    return Array(4)
      .fill(null)
      .map((_, index): string => {
        const selectedIndex = selected[index];
        const color = pickColors.colors[selectedIndex];
        return color ? toHexColor(color) : '#000000';
      });
  }, [pickColors, selected]);

  const deny = useCallback(() => {
    cancelPickColors();
    cancelEditPalette();
  }, [cancelEditPalette, cancelPickColors]);

  useEffect(() => {
    const lastIndex = (pickColors?.colors.length || 1) - 1;
    if (lastIndex < 3) {
      deny();
      return;
    }

    setSelected([
      0,
      Math.round(lastIndex * 0.33),
      Math.round(lastIndex * 0.66),
      lastIndex,
    ]);
  }, [deny, pickColors]);

  if (!pickColors) {
    return null;
  }

  return (
    <Lightbox
      confirm={() => {
        setEditPalette({
          name: t('newPaletteNameFromFile', { fileName: pickColors.fileName }),
          shortName: NEW_PALETTE_SHORT,
          palette,
          origin: 'generated from file',
          isPredefined: false,
        });
      }}
      canConfirm={selected.length === 4}
      deny={deny}
      header={t('dialogHeader', { fileName: pickColors.fileName })}
      contentWidth="auto"
    >
      <Stack
        direction="column"
        gap={4}
      >
        <PalettePreview palette={palette} />

        <ToggleButtonGroup
          value={selected}
          onChange={(_, value) => setSelected([...value].sort())}
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            gap: 0,
          }}
        >
          {
            pickColors.colors.map((rgb, colorIndex) => (
              <ToggleButton
                key={colorIndex}
                value={colorIndex}
                sx={{
                  '--palette-color': `rgb(${rgb.join(',')})`,
                  color: 'var(--palette-color)',
                  borderRadius: 0,
                  width: 48,
                  height: 48,
                  padding: 0,
                  border: 'none',

                  '&&.Mui-selected': {
                    border: 'none',
                    background: 'none',
                    color: 'var(--palette-color)',
                  },

                  '& > svg': {
                    width: 'inherit',
                    height: 'inherit',
                  },
                }}
              >
                {selected.includes(colorIndex) ? <CheckCircleIcon /> : <CircleIcon />}
              </ToggleButton>
            ))
          }
        </ToggleButtonGroup>

        <Stack
          direction="row"
          gap={0}
          sx={{
            '& > .MuiBox-root': {
              height: '32px',
              flexGrow: 1,
            },
          }}
        >
          { palette.map((color, index) => (
            <Box
              key={index}
              title={color}
              sx={{ backgroundColor: color }}
            />
          ))}
        </Stack>
      </Stack>
    </Lightbox>
  );
}

export default PickColors;

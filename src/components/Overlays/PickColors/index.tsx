import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircleIcon from '@mui/icons-material/Circle';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useTranslations } from 'next-intl';
import React, { useMemo, useState } from 'react';
import ImageRender from '@/components/ImageRender';
import Lightbox from '@/components/Lightbox';
import { NEW_PALETTE_SHORT } from '@/consts/SpecialTags';
import { toHexColor } from '@/hooks/usePaletteFromFile';
import usePreviewImages from '@/hooks/usePreviewImages';
import useEditStore from '@/stores/editStore';

function PickColors() {
  const t = useTranslations('PickColors');
  const { pickColors, setEditPalette, cancelEditPalette, cancelPickColors } = useEditStore();

  const [selected, setSelected] = useState<number[]>([0, 3, 6, 9]);
  const previewImages = usePreviewImages();

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
      deny={() => {
        cancelPickColors();
        cancelEditPalette();
      }}
      header={t('dialogHeader', { fileName: pickColors.fileName })}
      contentWidth="auto"
    >
      <Stack
        direction="column"
        gap={4}
      >
        <Stack
          direction="row"
          gap={2}
          component="ul"
          justifyContent="space-around"
        >
          {
            previewImages.map((image) => (
              <Box
                key={image.hash}
                component="li"
              >
                <ImageRender
                  hash={image.hash}
                  invertPalette={false}
                  invertFramePalette={false}
                  lockFrame={false}
                  palette={palette}
                  framePalette={palette}
                />
              </Box>
            ))
          }
        </Stack>

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

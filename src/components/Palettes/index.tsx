'use client';

import AddBoxIcon from '@mui/icons-material/AddBox';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslations } from 'next-intl';
import React, { useMemo, useState } from 'react';
import GalleryGrid from '@/components/GalleryGrid';
import Palette from '@/components/Palette';
import { GalleryViews } from '@/consts/GalleryViews';
import { NEW_PALETTE_SHORT } from '@/consts/SpecialTags';
import usePaletteFromFile from '@/hooks/usePaletteFromFile';
import usePaletteSort from '@/hooks/usePaletteSort';
import useEditPalette from '@/hooks/useSetEditPalette';
import { useItemsStore } from '@/stores/stores';
import { type Palette as PaletteT } from '@/types/Palette';

interface Props {
  filter: (palette: PaletteT) => boolean;
  showEditButtons?: boolean;
}

function Palettes({ filter, showEditButtons }: Props) {
  const { palettes: palettesUnsorted } = useItemsStore();
  const { onInputChange, busy } = usePaletteFromFile();
  const { editPalette } = useEditPalette();
  const [sortMenuAnchor, setSortMenuAnchor] = useState<HTMLElement | null>(null);
  const theme = useTheme();
  const t = useTranslations('Palettes');

  const aboveSm = useMediaQuery(theme.breakpoints.up('sm'));

  const {
    sortFn,
    sortPalettes,
    setSortPalettes,
    paletteSortOptions,
    paletteUsages,
  } = usePaletteSort();

  const palettes = useMemo<PaletteT[]>(() => (
    [...palettesUnsorted].filter(filter).sort(sortFn)
  ), [filter, palettesUnsorted, sortFn]);

  return (
    <>
      <Stack
        direction="row"
        justifyContent="end"
      >
        <ButtonGroup
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          color="tertiary"
          variant="contained"
          size="small"
          orientation={aboveSm ? 'horizontal' : 'vertical'}
          fullWidth={!aboveSm}
          disableElevation
        >
          {showEditButtons && (
            <>
              <Button
                disabled={busy}
                title={t('newPalette')}
                onClick={() => editPalette(NEW_PALETTE_SHORT)}
                startIcon={<AddBoxIcon />}
              >
                {t('newPalette')}
              </Button>
              <Button
                component="label"
                disabled={busy}
                startIcon={<AddPhotoAlternateIcon />}
                title={t('newPaletteFromImage')}
              >
                {t('newPaletteFromImage')}
                <input
                  disabled={busy}
                  type="file"
                  hidden
                  onChange={onInputChange}
                />
              </Button>
            </>
          )}
          <Button
            title={t('sortPalettes')}
            onClick={(ev) => setSortMenuAnchor(ev.target as HTMLElement)}
            endIcon={<ArrowDropDownIcon />}
          >
            {t('sortPalettes')}
          </Button>
        </ButtonGroup>
      </Stack>

      <Menu
        open={!!sortMenuAnchor}
        anchorEl={sortMenuAnchor}
        onClose={() => setSortMenuAnchor(null)}
        onClick={(ev) => {
          ev.stopPropagation();
          setSortMenuAnchor(null);
        }}
      >
        {
          paletteSortOptions.map(({ label, value }) => (
            <MenuItem
              key={value}
              selected={sortPalettes === value}
              onClick={() => setSortPalettes(value)}
            >
              {label}
            </MenuItem>
          ))
        }
      </Menu>

      <GalleryGrid fixedView={GalleryViews.PALETTE_VIEW}>
        {
          palettes.map((palette) => (
            <Palette
              key={palette.shortName}
              name={palette.name}
              isPredefined={palette.isPredefined || false}
              shortName={palette.shortName}
              palette={palette.palette}
              usage={paletteUsages[palette.shortName] || 0}
            />
          ))
        }
      </GalleryGrid>

    </>
  );
}

export default Palettes;

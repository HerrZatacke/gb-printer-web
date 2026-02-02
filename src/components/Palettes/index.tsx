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
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslations } from 'next-intl';
import React, { useMemo, useState } from 'react';
import GalleryGrid from '@/components/GalleryGrid';
import { useImport } from '@/components/Import/useImport';
import Palette from '@/components/Palette';
import { ExportTypes } from '@/consts/exportTypes';
import { GalleryViews } from '@/consts/GalleryViews';
import { NEW_PALETTE_SHORT } from '@/consts/SpecialTags';
import usePaletteFromFile from '@/hooks/usePaletteFromFile';
import usePaletteSort from '@/hooks/usePaletteSort';
import useEditPalette from '@/hooks/useSetEditPalette';
import { useItemsStore } from '@/stores/stores';
import type { Palette as PaletteT } from '@/types/Palette';

interface Tab {
  id: string,
  translationKey: string,
  filter: (palette: PaletteT) => boolean,
}

const tabs: Tab[] = [
  {
    id: 'own',
    translationKey: 'ownPalettes',
    filter: ({ isPredefined }) => !isPredefined,
  },
  {
    id: 'predefined',
    translationKey: 'predefinedPalettes',
    filter: ({ isPredefined }) => isPredefined,
  },
  {
    id: 'all',
    translationKey: 'allPalettes',
    filter: Boolean,
  },
];

function Palettes() {
  const { palettes: palettesUnsorted } = useItemsStore();
  const { onInputChange, busy } = usePaletteFromFile();
  const { editPalette } = useEditPalette();
  const { exportJson } = useImport();
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
  const [sortMenuAnchor, setSortMenuAnchor] = useState<HTMLElement | null>(null);
  const theme = useTheme();
  const t = useTranslations('Palettes');

  const aboveSm = useMediaQuery(theme.breakpoints.up('sm'));

  const currentTab = useMemo(() => (
    tabs[selectedTabIndex]
  ), [selectedTabIndex]);

  const {
    sortFn,
    sortPalettes,
    setSortPalettes,
    paletteSortOptions,
    paletteUsages,
  } = usePaletteSort();

  const palettes = useMemo<PaletteT[]>(() => (
    [...palettesUnsorted].filter(currentTab.filter).sort(sortFn)
  ), [currentTab, palettesUnsorted, sortFn]);

  return (
    <Stack
      direction="column"
      gap={4}
    >
      <Tabs value={selectedTabIndex}>
        {
          tabs.map(({ id, translationKey }, index) => (
            <Tab
              label={t(translationKey)}
              key={id}
              onClick={() => setSelectedTabIndex(index)}
              value={index}
            />
          ))
        }
      </Tabs>

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
          {currentTab.id === 'own' && (
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
      <ButtonGroup
        variant="contained"
        fullWidth
      >
        <Button
          onClick={() => exportJson(ExportTypes.PALETTES)}
        >
          {t('exportPalettes')}
        </Button>
      </ButtonGroup>
    </Stack>
  );
}

export default Palettes;

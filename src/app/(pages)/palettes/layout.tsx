'use client';

import {
  Button,
  ButtonGroup,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { type PropsWithChildren } from 'react';
import { useImport } from '@/components/Import/useImport';
import PalettesTabs from '@/components/PalettesTabs';
import { ExportTypes } from '@/consts/exportTypes';

export default function PalettesLayout({ children }: Readonly<PropsWithChildren>) {
  const tNavigation = useTranslations('Navigation');
  const tPalettes = useTranslations('Palettes');
  const { exportJson } = useImport();

  return (
    <Stack
      direction="column"
      gap={4}
    >
      <Typography
        component="h1"
        variant="h1"
      >
        {tNavigation('palettes')}
      </Typography>
      <PalettesTabs />
      {children}
      <ButtonGroup
        variant="contained"
        fullWidth
      >
        <Button
          onClick={() => exportJson(ExportTypes.PALETTES)}
        >
          {tPalettes('exportPalettes')}
        </Button>
      </ButtonGroup>
    </Stack>
  );
};

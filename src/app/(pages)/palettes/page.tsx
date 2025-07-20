'use client';

import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import Palettes from '@/components/Palettes';

export default function PalettesPage() {
  const t = useTranslations('Navigation');

  return (
    <>
      <Typography
        component="h1"
        variant="h1"
      >
        {t('palettes')}
      </Typography>
      <Palettes />
    </>
  );
}

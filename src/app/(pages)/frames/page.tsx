'use client';

import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import Frames from '@/components/Frames';

export default function FramesPage() {
  const t = useTranslations('Navigation');

  return (
    <>
      <Typography
        component="h1"
        variant="h1"
      >
        {t('frames')}
      </Typography>
      <Frames />
    </>
  );
}

'use client';

import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import Gallery from '@/components/Gallery';

export default function GalleryPage() {
  const t = useTranslations('Navigation');

  return (
    <>
      <Typography
        component="h1"
        variant="h1"
      >
        {t('gallery')}
      </Typography>
      <Gallery />
    </>
  );
}

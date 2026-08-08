'use client';

import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import Import from '@/components/Import';

export default function ImportPage() {
  const t = useTranslations('Navigation');

  return (
    <>
      <Typography
        component="h1"
        variant="h1"
      >
        {t('import')}
      </Typography>
      <Import />
    </>
  );
}

'use client';

import Typography from '@mui/material/Typography';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

const AddPlugin = dynamic(() => import('@/components/AddPlugin'), {
  ssr: false,
});

export default function AddPluginPage() {
  const t = useTranslations('Navigation');

  return (
    <>
      <Typography
        component="h1"
        variant="h1"
      >
        {t('addPlugin')}
      </Typography>
      <AddPlugin />
    </>
  );
}

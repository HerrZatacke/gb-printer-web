'use client';

import Typography from '@mui/material/Typography';
import dynamic from 'next/dynamic';

const AddPlugin = dynamic(() => import('@/components/AddPlugin'), {
  ssr: false,
});

export default function AddPluginPage() {
  return (
    <>
      <Typography
        component="h1"
        variant="h1"
      >
        Add Plugin
      </Typography>
      <AddPlugin />
    </>
  );
}

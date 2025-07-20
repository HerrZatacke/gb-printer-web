import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import React from 'react';

interface Props {
  imageCount: number,
  selectedCount: number,
  filteredCount: number,
}

function GalleryNumbers(props: Props) {
  const t = useTranslations('GalleryNumbers');

  const textParts = [
    t('imageCount', { count: props.imageCount }),
  ];

  if (props.filteredCount) {
    textParts.push(t('filteredCount', { count: props.filteredCount }));
  }

  if (props.selectedCount) {
    textParts.push(t('selectedCount', { count: props.selectedCount }));
  }

  return (
    <Typography component="h2" variant="caption">
      {textParts.join(t('separator'))}
    </Typography>
  );
}

export default GalleryNumbers;

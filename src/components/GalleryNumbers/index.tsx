import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useFiltersStore } from '@/stores/stores';

interface Props {
  imageCount: number;
  filteredCount: number;
}

function GalleryNumbers(props: Props) {
  const t = useTranslations('GalleryNumbers');
  const { imageSelection } = useFiltersStore();
  const selectedCount = imageSelection.length;

  const textParts = [
    t('imageCount', { count: props.imageCount }),
  ];

  if (props.filteredCount) {
    textParts.push(t('filteredCount', { count: props.filteredCount }));
  }

  if (selectedCount) {
    textParts.push(t('selectedCount', { count: selectedCount }));
  }

  return (
    <Typography component="h2" variant="caption">
      {textParts.join(t('separator'))}
    </Typography>
  );
}

export default GalleryNumbers;

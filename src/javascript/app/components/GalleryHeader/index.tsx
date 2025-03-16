import React from 'react';
import Stack from '@mui/material/Stack';
import GalleryViewSelect from '../GalleryViewSelect';
import BatchButtons from '../BatchButtons';

interface Props {
  page: number,
  isBottom?: boolean,
  isSticky?: boolean,
}

function GalleryHeader({ isBottom, page, isSticky }: Props) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      gap={2}
      justifyContent="space-between"
      sx={(theme) => ({
        zIndex: 1100,
        backgroundColor: theme.palette.background.default,
        ...(isSticky ? {
          position: 'sticky',
          top: 'var(--navigation-min-height)',
          py: 2,
        } : {}),
        ...(isBottom ? {
          '@media (max-height: 900px)': {
            display: 'none',
          },
        } : {}),
      })}
    >
      <GalleryViewSelect />
      <BatchButtons page={page} />
    </Stack>
  );
}

export default GalleryHeader;

'use client';

import Stack from '@mui/material/Stack';
import React from 'react';
import FolderBreadcrumb from '@/components/FolderBreadcrumb';
import GalleryGrid from '@/components/GalleryGrid';
import GalleryGroup from '@/components/GalleryGroup';
import GalleryHeader from '@/components/GalleryHeader';
import GalleryImage from '@/components/GalleryImage';
import GalleryNumbers from '@/components/GalleryNumbers';
import Pagination from '@/components/Pagination';
import StorageWarning from '@/components/StorageWarning';
import { useGallery } from '@/hooks/useGallery';
import useSettingsStore from '@/stores/settingsStore';

function Gallery() {
  const {
    totalImageCount,
    selectedCount,
    filteredCount,
    page,
    maxPageIndex,
    images,
    covers,
  } = useGallery();

  const { enableImageGroups } = useSettingsStore();

  return (
    <Stack
      direction="column"
      gap={2}
    >
      <StorageWarning />
      <GalleryNumbers
        imageCount={totalImageCount}
        selectedCount={selectedCount}
        filteredCount={filteredCount}
      />
      { enableImageGroups ? (
        <FolderBreadcrumb />
      ) : null }

      <GalleryHeader page={page} isSticky />
      { maxPageIndex > 0 && <Pagination page={page} maxPageIndex={maxPageIndex} /> }

      <GalleryGrid>
        { images.map((image) => (
          covers.includes(image.hash) ? (
            <GalleryGroup
              key={image.hash}
              hash={image.hash}
            />
          ) : (
            <GalleryImage
              key={image.hash}
              hash={image.hash}
              page={page}
            />
          )
        )) }
      </GalleryGrid>
      { images.length >= 3 && (
        <>
          <Pagination page={page} maxPageIndex={maxPageIndex} />
          <GalleryHeader page={page} isBottom />
        </>
      ) }
    </Stack>
  );
}

export default Gallery;

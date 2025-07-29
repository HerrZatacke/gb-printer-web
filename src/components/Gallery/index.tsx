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

function Gallery() {
  const {
    totalImageCount,
    selectedCount,
    filteredCount,
    page,
    maxPageIndex,
    images,
    covers,
    isWorking,
  } = useGallery();

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
      <FolderBreadcrumb />
      <GalleryHeader page={page} isSticky />
      { maxPageIndex > 0 && <Pagination page={page} maxPageIndex={maxPageIndex} /> }

      <GalleryGrid showLoader={isWorking}>
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

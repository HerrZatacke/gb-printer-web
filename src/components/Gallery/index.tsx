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
import { useGalleryTreeContext } from '@/contexts/GalleryTreeContext';
import { useGalleryNavigationGuards } from '@/tools/useGalleryNavigationGuards';

function Gallery() {
  useGalleryNavigationGuards();
  const { viewItems, paging, isWorking } = useGalleryTreeContext();

  const totalImageCount = paging?.total || 0;
  const filteredCount = paging?.filtered || 0;
  const page = paging?.page || 0;
  const maxPageIndex = paging?.maxPageIndex || 0;

  return (
    <Stack
      direction="column"
      gap={2}
    >
      <StorageWarning />
      <GalleryNumbers
        imageCount={totalImageCount}
        filteredCount={filteredCount}
      />
      <FolderBreadcrumb />
      <GalleryHeader isSticky />
      { maxPageIndex > 0 && <Pagination page={page} maxPageIndex={maxPageIndex} /> }

      <GalleryGrid showLoader={isWorking}>
        { viewItems.map(({ image, group }) => (
          group ? (
            <GalleryGroup
              key={group.id}
              id={group.id}
            />
          ) : (
            <GalleryImage
              key={image.hash}
              hash={image.hash}
            />
          )
        )) }
      </GalleryGrid>

      { viewItems.length >= 3 && (
        <>
          <Pagination page={page} maxPageIndex={maxPageIndex} />
          <GalleryHeader isBottom />
        </>
      ) }
    </Stack>
  );
}

export default Gallery;

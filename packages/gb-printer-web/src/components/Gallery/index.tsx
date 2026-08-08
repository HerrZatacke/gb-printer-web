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
import { GroupItem } from '@/workers/itemsIndexedDbWorker/types';

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
      sx={{
        gap: 2,
      }}
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
        { viewItems.map((groupItem: GroupItem) => {
          switch (groupItem.type) {
            case 'group':
              return (
                <GalleryGroup
                  key={groupItem.group.id}
                  id={groupItem.group.id}
                />
              );

            case 'image':
              return (
                <GalleryImage
                  key={groupItem.image.hash}
                  hash={groupItem.image.hash}
                />
              );

            default:
              return null;
          }
        }) }
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

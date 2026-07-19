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

function Gallery() {
  const { images, paging, covers, isWorking } = useGalleryTreeContext();

  // ToDo: Navigation Effects
  // if (
  //   byGroupPaging &&
  //   !isLoadingByGroupId &&
  //   maxPageIndex > 0 &&
  //   byGroupPaging.page !== currentPageIndex
  // ) {
  //   redirect(getUrl({ currentPageIndex: page }));
  // }

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
            />
          )
        )) }
      </GalleryGrid>

      { images.length >= 3 && (
        <>
          <Pagination page={page} maxPageIndex={maxPageIndex} />
          <GalleryHeader isBottom />
        </>
      ) }
    </Stack>
  );
}

export default Gallery;

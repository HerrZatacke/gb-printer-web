import React from 'react';
import Stack from '@mui/material/Stack';
import useSettingsStore from '../../stores/settingsStore';
import FolderBreadcrumb from '../FolderBreadcrumb';
import GalleryGrid from '../GalleryGrid';
import GalleryGroup from '../GalleryGroup';
import GalleryHeader from '../GalleryHeader';
import GalleryImage from '../GalleryImage';
import GalleryNumbers from '../GalleryNumbers';
import StorageWarning from '../StorageWarning';
import Pagination from '../Pagination';
import { useGallery } from './useGallery';

function Gallery() {
  const {
    imageCount,
    selectedCount,
    filteredCount,
    page,
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
        imageCount={imageCount}
        selectedCount={selectedCount}
        filteredCount={filteredCount}
      />
      { enableImageGroups ? (
        <FolderBreadcrumb />
      ) : null }

      <GalleryHeader page={page} isSticky />
      <Pagination page={page} />
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
      {
        images.length < 3 ? null : (
          <>
            <Pagination page={page} />
            <GalleryHeader page={page} isBottom />
          </>
        )
      }
    </Stack>
  );
}

export default Gallery;

import React, { useMemo } from 'react';
import type { CSSPropertiesVars } from 'react';
import Stack from '@mui/material/Stack';
import classnames from 'classnames';
import useSettingsStore from '../../stores/settingsStore';
import GalleryImage from '../GalleryImage';
import GalleryHeader from '../GalleryHeader';
import GalleryIntro from '../GalleryIntro';
import GalleryGroup from '../GalleryGroup';
import FolderBreadcrumb from '../FolderBreadcrumb';
import Pagination from '../Pagination';
import { useGallery } from './useGallery';
import { GalleryViews } from '../../../consts/GalleryViews';
import { useScreenDimensions } from '../../../hooks/useScreenDimensions';
import type { ScreenDimensions } from '../../../hooks/useScreenDimensions';

import './index.scss';

const getStyleVars = (galleryView: GalleryViews, screenDimensions: ScreenDimensions): CSSPropertiesVars => {
  let imageSize = '';
  let gap = '';
  let columns = '';

  switch (galleryView) {
    case GalleryViews.GALLERY_VIEW_SMALL: {
      const gapNumber = 16 / screenDimensions.ddpx;
      const imageSizeNumber = 160 / screenDimensions.ddpx;
      imageSize = `${imageSizeNumber}px`;
      gap = `${gapNumber}px`;
      columns = Math.floor((screenDimensions.layoutWidth + gapNumber) / (imageSizeNumber + gapNumber)).toString(10);
      break;
    }

    case GalleryViews.GALLERY_VIEW_1X: {
      imageSize = '160px';
      gap = 'var(--1x-gap)';
      columns = 'var(--1x-columns)';
      break;
    }

    case GalleryViews.GALLERY_VIEW_2X: {
      imageSize = '320px';
      gap = 'var(--2x-gap)';
      columns = 'var(--2x-columns)';
      break;
    }

    case GalleryViews.GALLERY_VIEW_MAX: {
      imageSize = '100%';
      gap = 'var(--max-gap)';
      columns = 'var(--max-columns)';
      break;
    }

    default:
      break;
  }

  return {
    '--image-size': imageSize,
    '--gap': gap,
    '--columns': columns,
    '--layout-width': `${screenDimensions.layoutWidth}px`,
  };
};

function Gallery() {
  const {
    imageCount,
    selectedCount,
    filteredCount,
    page,
    images,
    covers,
    galleryView,
  } = useGallery();

  const screenDimensions = useScreenDimensions();

  const { enableImageGroups } = useSettingsStore();

  const styleVariables = useMemo(() => (
    getStyleVars(galleryView, screenDimensions)
  ), [galleryView, screenDimensions]);

  return (
    <Stack
      direction="column"
      gap={2}
    >
      <GalleryIntro
        imageCount={imageCount}
        selectedCount={selectedCount}
        filteredCount={filteredCount}
      />
      { enableImageGroups ? (
        <FolderBreadcrumb />
      ) : null }
      <GalleryHeader page={page} isSticky />
      <Pagination page={page} />
      <ul
        className={
          classnames('gallery', {
            [`gallery--${galleryView}`]: true,
          })
        }
        style={styleVariables}
      >
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
      </ul>
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

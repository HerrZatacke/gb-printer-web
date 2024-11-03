import React from 'react';
import type { CSSPropertiesVars } from 'react';
import { Navigate } from 'react-router-dom';
import classnames from 'classnames';
import GalleryImage from '../GalleryImage';
import GalleryHeader from '../GalleryHeader';
import GalleryIntro from '../GalleryIntro';
import { useGallery } from './useGallery';
import { GalleryViews } from '../../../consts/GalleryViews';
import { useScreenDimensions } from '../../../hooks/useScreenDimensions';
import type { ScreenDimensions } from '../../../hooks/useScreenDimensions';

import './index.scss';
import Pagination from '../Pagination';

const getSmallStyleVars = (screenDimensions: ScreenDimensions): CSSPropertiesVars => {
  const smallTilePadding = 10;
  const smallGap = 10 / screenDimensions.ddpx; // keep "10" aligned with '--1x-gap' in 'Layout/index.scss'
  const smallImageSize = 160 / screenDimensions.ddpx;
  const colSize = (2 * smallTilePadding) + smallImageSize;
  const columns = Math.floor((screenDimensions.layoutWidth + smallGap) / (colSize + smallGap));

  return {
    '--tile-padding': `${smallTilePadding}px`,
    '--image-size': `${smallImageSize}px`,
    '--gap': `${smallGap}px`,
    '--columns': columns.toString(10),
    '--col-size': `${colSize}px`,
    '--layout-width': `${screenDimensions.layoutWidth}px`,
  };
};

function Gallery() {
  const {
    imageCount,
    selectedCount,
    filteredCount,
    valid,
    page,
    images,
    galleryView,
  } = useGallery();

  const screenDimensions = useScreenDimensions();

  if (!valid) {
    return <Navigate to={`/gallery/page/${page + 1}`} replace />;
  }

  return (
    <>
      <GalleryIntro
        imageCount={imageCount}
        selectedCount={selectedCount}
        filteredCount={filteredCount}
      />
      <GalleryHeader page={page} isSticky />
      <Pagination page={page} />
      <ul
        className={
          classnames('gallery', {
            [`gallery--${galleryView}`]: true,
          })
        }
        style={galleryView === GalleryViews.GALLERY_VIEW_SMALL ? getSmallStyleVars(screenDimensions) : undefined}
      >
        { images.map((image) => (
          <GalleryImage
            key={image.hash}
            hash={image.hash}
            page={page}
          />
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
    </>
  );
}

export default Gallery;

import React from 'react';
import type { CSSPropertiesVars } from 'react';
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
import './gallery-item.scss';

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
    page,
    images,
    covers,
    galleryView,
  } = useGallery();

  const screenDimensions = useScreenDimensions();

  const { enableImageGroups } = useSettingsStore();

  return (
    <>
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
        style={galleryView === GalleryViews.GALLERY_VIEW_SMALL ? getSmallStyleVars(screenDimensions) : undefined}
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
    </>
  );
}

export default Gallery;

import React from 'react';
import classnames from 'classnames';
import GalleryImage from '../GalleryImage';
import GalleryHeader from '../GalleryHeader';
import GalleryIntro from '../GalleryIntro';
import { useGallery } from './useGallery';
import { GalleryViews } from '../../../consts/GalleryViews';
import GalleryGroup from '../GalleryGroup';

import './index.scss';
import './gallery-item.scss';
import FolderNavi from '../FolderNavi';

function Gallery() {
  const {
    imageCount,
    selectedCount,
    filteredCount,
    page,
    images,
    currentView,
    covers,
  } = useGallery();

  const content = images.map((image) => (
    covers.includes(image.hash) ? (
      <GalleryGroup
        key={image.hash}
        hash={image.hash}
      />
    ) : (
      <GalleryImage
        type={currentView === GalleryViews.GALLERY_VIEW_LIST ? 'list' : 'default'}
        key={image.hash}
        hash={image.hash}
        page={page}
      />
    )
  ));

  if (currentView !== 'list') {
    content.push(
      <li className="gallery-image gallery-item gallery-image--dummy" key="dummy1" />,
      <li className="gallery-image gallery-item gallery-image--dummy" key="dummy2" />,
      <li className="gallery-image gallery-item gallery-image--dummy" key="dummy3" />,
      <li className="gallery-image gallery-item gallery-image--dummy" key="dummy4" />,
      <li className="gallery-image gallery-item gallery-image--dummy" key="dummy5" />,
    );
  }

  return (
    <>
      <GalleryIntro
        imageCount={imageCount}
        selectedCount={selectedCount}
        filteredCount={filteredCount}
      />
      <FolderNavi />
      <GalleryHeader page={page} isSticky />
      {
        (currentView === 'list') ? (
          <ul className="gallery gallery--list">
            {content}
          </ul>
        ) : (
          <ul
            className={
              classnames('gallery', {
                [`gallery--${currentView}`]: true,
              })
            }
          >
            {content}
          </ul>
        )
      }
      {
        images.length < 3 ? null : (
          <GalleryHeader page={page} isBottom />
        )
      }
    </>
  );
}

export default Gallery;

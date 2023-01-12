import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import GalleryImage from '../GalleryImage';
import GalleryHeader from '../GalleryHeader';
import GalleryIntro from '../GalleryIntro';
import getFilteredImagesCount from '../../../tools/getFilteredImages/count';
import useGetValidPageIndex from '../../../tools/useGetValidPageIndex';

import './index.scss';
import usePageImages from './usePageImages';

const Gallery = () => {
  const {
    imageCount,
    selectedCount,
    filteredCount,
    pageSize,
  } = useSelector((state) => ({
    imageCount: state.images.length,
    pageSize: state.pageSize,
    selectedCount: state.imageSelection.length,
    filteredCount: getFilteredImagesCount(state),
  }));

  const { valid, page } = useGetValidPageIndex({
    pageSize,
    imageCount: filteredCount,
  });

  const {
    images,
    currentView,
  } = usePageImages(page);

  if (!valid) {
    return <Navigate to={`/gallery/page/${page + 1}`} replace />;
  }

  const content = images.map((image) => (
    <GalleryImage
      type={currentView === 'list' ? 'list' : 'default'}
      key={image.hash}
      hash={image.hash}
      page={page}
    />
  ));

  if (currentView !== 'list') {
    content.push(
      <li className="gallery-image gallery-image--dummy" key="dummy1" />,
      <li className="gallery-image gallery-image--dummy" key="dummy2" />,
      <li className="gallery-image gallery-image--dummy" key="dummy3" />,
      <li className="gallery-image gallery-image--dummy" key="dummy4" />,
      <li className="gallery-image gallery-image--dummy" key="dummy5" />,
    );
  }


  return (
    <>
      <GalleryIntro
        imageCount={imageCount}
        selectedCount={selectedCount}
        filteredCount={filteredCount}
      />
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
};

export default Gallery;

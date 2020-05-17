import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import GalleryImage from '../GalleryImage';

const GALLERY_VIEWS = [
  // 'list',
  '1x',
  '2x',
  '3x',
  '4x',
];

const Gallery = (props) => (
  <>
    <ul className="gallery__views">
      {
        GALLERY_VIEWS.map((view) => (
          <li
            key={view}
            className={
              classnames('gallery__view', {
                'gallery__view--selected': props.currentView === view,
              })
            }
          >
            <button
              type="button"
              onClick={() => {
                props.updateView(view);
              }}
            >
              {view}
            </button>
          </li>
        ))
      }
    </ul>
    <ul
      className={
        classnames('gallery', {
          [`gallery-${props.currentView}`]: true,
        })
      }
    >
      {
        props.images.map((image) => (
          <GalleryImage
            key={image.hash}
            hash={image.hash}
            palette={image.palette}
            title={image.title}
            created={image.created}
          />
        ))
      }
      <li className="gallery-image gallery-image--dummy" />
      <li className="gallery-image gallery-image--dummy" />
      <li className="gallery-image gallery-image--dummy" />
      <li className="gallery-image gallery-image--dummy" />
      <li className="gallery-image gallery-image--dummy" />
    </ul>
  </>
);

Gallery.propTypes = {
  images: PropTypes.array.isRequired,
  currentView: PropTypes.string.isRequired,
  updateView: PropTypes.func.isRequired,
};

Gallery.defaultProps = {
};

export default Gallery;

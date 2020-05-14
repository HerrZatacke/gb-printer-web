import React from 'react';
import PropTypes from 'prop-types';
import GalleryImage from '../GalleryImage';

const Gallery = (props) => (
  <ul className="gallery">
    {
      props.images.map((image) => (
        <GalleryImage
          key={image.hash}
          hash={image.hash}
          palette={image.palette}
          title={image.title}
        />
      ))
    }
    <li className="gallery-image--dummy" />
    <li className="gallery-image--dummy" />
    <li className="gallery-image--dummy" />
    <li className="gallery-image--dummy" />
    <li className="gallery-image--dummy" />
  </ul>
);

Gallery.propTypes = {
  images: PropTypes.array.isRequired,
};

Gallery.defaultProps = {
};

export default Gallery;

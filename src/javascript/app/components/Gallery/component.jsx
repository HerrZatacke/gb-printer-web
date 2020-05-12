import React from 'react';
import PropTypes from 'prop-types';

const Gallery = (props) => (
  <ul className="gallery">
    {
      props.images.map((image) => (
        image.title
      ))
    }
  </ul>
);

Gallery.propTypes = {
  images: PropTypes.array.isRequired,
};

Gallery.defaultProps = {
};

export default Gallery;

import React from 'react';
import PropTypes from 'prop-types';
import GameBoyImage from '../GameBoyImage';

const GalleryImage = (props) => (
  <li className="gallery-image">
    <GameBoyImage tiles={props.tiles} palette={props.palette} />
    <span>{props.title}</span>
  </li>
);

GalleryImage.propTypes = {
  title: PropTypes.string.isRequired,
  tiles: PropTypes.string.isRequired,
  palette: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};

GalleryImage.defaultProps = {
};

export default GalleryImage;

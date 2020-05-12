import React from 'react';
import PropTypes from 'prop-types';
import GameBoyImage from '../GameBoyImage';
import { load } from '../../../tools/storage';

class GalleryImage extends React.Component {

  constructor(props) {
    super(props);

    // the content of the image should never change...
    this.tiles = load(props.hash);
  }

  render() {
    return (
      <li className="gallery-image">
        <GameBoyImage tiles={this.tiles} palette={this.props.palette} />
        <span>{this.props.title}</span>
      </li>
    );
  }
}

GalleryImage.propTypes = {
  title: PropTypes.string.isRequired,
  hash: PropTypes.string.isRequired,
  palette: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};

GalleryImage.defaultProps = {
};

export default GalleryImage;

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
        <div className="gallery-image__buttons">
          <button
            type="button"
            className="gallery-image__button"
            onClick={this.props.startDownload}
          >
            ⇩
          </button>
          <button
            type="button"
            className="gallery-image__button"
            onClick={this.props.deleteImage}
          >
            ×
          </button>
          <button
            type="button"
            className="gallery-image__button"
            onClick={this.props.editImage}
          >
            ✎
          </button>
        </div>
      </li>
    );
  }
}

GalleryImage.propTypes = {
  deleteImage: PropTypes.func.isRequired,
  editImage: PropTypes.func.isRequired,
  hash: PropTypes.string.isRequired,
  palette: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  startDownload: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

GalleryImage.defaultProps = {
};

export default GalleryImage;

import React from 'react';
import PropTypes from 'prop-types';
import GameBoyImage from '../GameBoyImage';
import { load } from '../../../tools/storage';

class GalleryImage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      tiles: null,
    };
  }

  componentDidMount() {
    load(this.props.hash)
      .then((tiles) => {
        this.setState({ tiles });
      });
  }

  render() {
    return (
      <li className="gallery-image">
        <span className="gallery-image__image">
          { this.state.tiles ? (
            <GameBoyImage tiles={this.state.tiles} palette={this.props.palette} />
          ) : null }
        </span>
        {this.props.title ? (
          <span
            className="gallery-image__title"
          >
            {this.props.title}
          </span>
        ) : null}
        <span
          className="gallery-image__created"
        >
          {this.props.created}
        </span>
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
  created: PropTypes.string.isRequired,
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

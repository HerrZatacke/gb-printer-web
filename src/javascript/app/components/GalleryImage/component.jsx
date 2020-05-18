import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { dateFormat, dateFormatReadable } from '../../../tools/values';
import GameBoyImage from '../GameBoyImage';
import { load } from '../../../tools/storage';
import SVG from '../SVG';

dayjs.extend(customParseFormat);

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
          {dayjs(this.props.created, dateFormat).format(dateFormatReadable)}
        </span>
        <div className="gallery-image__buttons">
          <button
            type="button"
            className="gallery-image__button"
            onClick={this.props.startDownload}
          >
            <SVG name="download" />
          </button>
          <button
            type="button"
            className="gallery-image__button"
            onClick={this.props.deleteImage}
          >
            <SVG name="delete" />
          </button>
          <button
            type="button"
            className="gallery-image__button"
            onClick={this.props.editImage}
          >
            <SVG name="edit" />
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

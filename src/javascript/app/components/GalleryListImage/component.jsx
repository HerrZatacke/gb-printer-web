import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { dateFormat, dateFormatReadable } from '../../../tools/values';
import GameBoyImage from '../GameBoyImage';
import { load } from '../../../tools/storage';
import SVG from '../SVG';

dayjs.extend(customParseFormat);

class GalleryListImage extends React.Component {

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
      <tr className="gallery-list-image">
        <td className="gallery-list-image__image">
          { this.state.tiles ? (
            <GameBoyImage tiles={this.state.tiles} palette={this.props.palette} />
          ) : null }
        </td>

        <td className="gallery-list-image__description">
          <span className="gallery-list-image__title">
            {this.props.title}
          </span>
          <span className="gallery-list-image__created">
            {dayjs(this.props.created, dateFormat).format(dateFormatReadable)}
          </span>
        </td>

        <td className="gallery-list-image__buttons">
          <button
            type="button"
            className="gallery-list-image__button"
            onClick={this.props.startDownload}
          >
            <SVG name="download" />
          </button>
          <button
            type="button"
            className="gallery-list-image__button"
            onClick={this.props.deleteImage}
          >
            <SVG name="delete" />
          </button>
          <button
            type="button"
            className="gallery-list-image__button"
            onClick={this.props.editImage}
          >
            <SVG name="edit" />
          </button>
        </td>
      </tr>
    );
  }
}

GalleryListImage.propTypes = {
  created: PropTypes.string.isRequired,
  deleteImage: PropTypes.func.isRequired,
  editImage: PropTypes.func.isRequired,
  hash: PropTypes.string.isRequired,
  palette: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  startDownload: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

GalleryListImage.defaultProps = {
};

export default GalleryListImage;
